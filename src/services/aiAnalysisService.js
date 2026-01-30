import axios from 'axios'

// AI 服务配置
const AI_CONFIG = {
  apiKey: import.meta.env.VITE_AI_API_KEY || '',
  endpoint: import.meta.env.VITE_AI_API_ENDPOINT || 'https://api.openai.com/v1/chat/completions',
  model: 'gpt-4-vision-preview'
}

/**
 * AI 图片分析服务
 * 支持分析错误截图、日志图片等，识别问题并给出建议
 */
export const AIAnalysisService = {
  /**
   * 将文件转换为 Base64
   * @param {File} file - 图片文件
   * @returns {Promise<string>} Base64 字符串
   */
  async fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const base64 = reader.result.split(',')[1]
        resolve(base64)
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  },

  /**
   * 分析图片中的错误信息
   * @param {File|File[]} images - 图片文件或文件数组
   * @param {string} additionalContext - 用户提供的额外上下文
   * @returns {Promise<Object>} 分析结果
   */
  async analyzeError(images, additionalContext = '') {
    const imageFiles = Array.isArray(images) ? images : [images]
    
    // 过滤出图片文件
    const validImages = imageFiles.filter(file => 
      file.type.startsWith('image/')
    )

    if (validImages.length === 0) {
      return {
        success: false,
        error: '没有找到有效的图片文件',
        analysis: null
      }
    }

    try {
      // 转换所有图片为 Base64
      const imageContents = await Promise.all(
        validImages.map(async (file) => ({
          type: 'image_url',
          image_url: {
            url: `data:${file.type};base64,${await this.fileToBase64(file)}`,
            detail: 'high'
          }
        }))
      )

      // 构建请求消息
      const messages = [
        {
          role: 'system',
          content: `你是一个专业的IT技术支持专家，擅长分析错误截图、日志和技术问题。
请仔细分析用户提供的图片，识别其中的错误信息，并提供：

1. **错误识别**: 准确识别图片中显示的错误类型和错误信息
2. **问题分类**: 判断这是什么类型的问题（软件/硬件/网络/配置/权限等）
3. **可能原因**: 分析可能导致此错误的原因
4. **解决建议**: 提供具体的解决步骤或建议
5. **优先级建议**: 根据问题严重程度建议工单优先级（高/中/低）

请用清晰、专业的中文回复，格式化输出便于阅读。`
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: additionalContext 
                ? `请分析以下截图中的问题。用户描述：${additionalContext}`
                : '请分析以下截图中的问题，识别错误并给出解决建议。'
            },
            ...imageContents
          ]
        }
      ]

      // 调用 AI API
      const response = await axios.post(
        AI_CONFIG.endpoint,
        {
          model: AI_CONFIG.model,
          messages,
          max_tokens: 2000,
          temperature: 0.3
        },
        {
          headers: {
            'Authorization': `Bearer ${AI_CONFIG.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      )

      const analysisText = response.data.choices[0].message.content

      // 解析分析结果
      const result = this.parseAnalysisResult(analysisText)

      return {
        success: true,
        error: null,
        analysis: result,
        rawText: analysisText
      }

    } catch (error) {
      console.error('AI Analysis Error:', error)
      
      // 如果 API 调用失败，返回模拟分析（用于演示）
      if (!AI_CONFIG.apiKey) {
        return this.getMockAnalysis(additionalContext)
      }

      return {
        success: false,
        error: error.response?.data?.error?.message || error.message || 'AI 分析失败',
        analysis: null
      }
    }
  },

  /**
   * 解析 AI 返回的分析结果
   * @param {string} text - AI 返回的文本
   * @returns {Object} 结构化的分析结果
   */
  parseAnalysisResult(text) {
    // 提取优先级建议
    let suggestedPriority = '3' // 默认低优先级
    if (text.includes('高') && (text.includes('优先级') || text.includes('紧急'))) {
      suggestedPriority = '1'
    } else if (text.includes('中') && text.includes('优先级')) {
      suggestedPriority = '2'
    }

    // 提取问题分类
    let category = 'other'
    const categoryKeywords = {
      software: ['软件', '应用', '程序', '系统'],
      hardware: ['硬件', '设备', '显示器', '键盘', '鼠标'],
      network: ['网络', '连接', 'DNS', 'IP', '超时'],
      database: ['数据库', 'SQL', '查询', '连接池'],
      security: ['安全', '权限', '认证', '密码', '防火墙']
    }

    for (const [cat, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(kw => text.includes(kw))) {
        category = cat
        break
      }
    }

    return {
      fullText: text,
      suggestedPriority,
      suggestedCategory: category,
      timestamp: new Date().toISOString()
    }
  },

  /**
   * 获取模拟分析结果（用于演示，无 API Key 时使用）
   * @param {string} context - 用户上下文
   * @returns {Object} 模拟的分析结果
   */
  getMockAnalysis(context = '') {
    const mockText = `## 🔍 错误识别

检测到图片中包含系统错误信息。

## 📋 问题分类

**类型**: 软件/系统问题

## 💡 可能原因

1. 应用程序配置错误
2. 依赖服务未启动
3. 权限设置不正确

## 🛠️ 解决建议

1. 检查相关服务是否正常运行
2. 查看应用日志获取详细错误信息
3. 确认配置文件设置正确
4. 如问题持续，请联系技术支持

## ⚡ 优先级建议

**中等优先级** - 建议在工作时间内处理

---
*此为 AI 自动分析结果，仅供参考。如需更准确的分析，请配置 AI API Key。*`

    return {
      success: true,
      error: null,
      analysis: {
        fullText: mockText,
        suggestedPriority: '2',
        suggestedCategory: 'software',
        timestamp: new Date().toISOString()
      },
      rawText: mockText,
      isMock: true
    }
  },

  /**
   * 检查 AI 服务是否可用
   * @returns {boolean} 是否配置了 AI API
   */
  isAvailable() {
    return !!AI_CONFIG.apiKey
  }
}

export default AIAnalysisService


