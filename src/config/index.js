/**
 * 应用配置
 * 
 * 配置项可通过环境变量覆盖
 */

export const config = {
  // ServiceNow 配置
  servicenow: {
    instance: import.meta.env.VITE_SERVICENOW_INSTANCE || 'https://your-instance.service-now.com',
    username: import.meta.env.VITE_SERVICENOW_USERNAME || '',
    password: import.meta.env.VITE_SERVICENOW_PASSWORD || ''
  },

  // AI 服务配置
  ai: {
    apiKey: import.meta.env.VITE_AI_API_KEY || '',
    endpoint: import.meta.env.VITE_AI_API_ENDPOINT || 'https://api.openai.com/v1/chat/completions',
    model: import.meta.env.VITE_AI_MODEL || 'gpt-4-vision-preview'
  },

  // 文件上传配置
  upload: {
    maxFiles: 10,
    maxSize: 10 * 1024 * 1024, // 10MB
    acceptedTypes: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp'],
      'application/pdf': ['.pdf'],
      'text/*': ['.txt', '.log', '.csv'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    }
  },

  // 工单分类
  categories: [
    { value: 'inquiry', label: '咨询' },
    { value: 'software', label: '软件问题' },
    { value: 'hardware', label: '硬件问题' },
    { value: 'network', label: '网络问题' },
    { value: 'database', label: '数据库问题' },
    { value: 'security', label: '安全问题' },
    { value: 'other', label: '其他' }
  ],

  // 紧急程度选项
  urgencyOptions: [
    { value: '1', label: '高 - 紧急', color: '#ef4444' },
    { value: '2', label: '中 - 一般', color: '#f59e0b' },
    { value: '3', label: '低 - 不紧急', color: '#10b981' }
  ],

  // 影响范围选项
  impactOptions: [
    { value: '1', label: '高 - 影响大量用户', color: '#ef4444' },
    { value: '2', label: '中 - 影响部分用户', color: '#f59e0b' },
    { value: '3', label: '低 - 仅影响个人', color: '#10b981' }
  ]
}

export default config


