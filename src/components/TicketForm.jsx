import { useState, useEffect } from 'react'
import { 
  Send, 
  Loader2, 
  AlertTriangle,
  Info,
  Sparkles
} from 'lucide-react'
import toast from 'react-hot-toast'
import FileUploader from './FileUploader'
import ServiceNowAPI from '../services/servicenowApi'

const TicketForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'inquiry',
    urgency: '3',
    impact: '3'
  })
  
  const [files, setFiles] = useState([])
  const [categories, setCategories] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [aiAnalysis, setAiAnalysis] = useState(null)

  // 加载分类选项
  useEffect(() => {
    const loadCategories = async () => {
      const cats = await ServiceNowAPI.getCategories()
      setCategories(cats)
    }
    loadCategories()
  }, [])

  // 处理表单变更
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // AI 分析回调
  const handleAIAnalysis = (result) => {
    setAiAnalysis(result)
    
    // 自动填充建议值
    if (result.success && result.analysis) {
      setFormData(prev => ({
        ...prev,
        urgency: result.analysis.suggestedPriority,
        category: result.analysis.suggestedCategory
      }))
      
      toast.success('AI 分析完成，已自动填充建议值', {
        icon: '✨'
      })
    }
  }

  // 提交表单
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // 验证
    if (!formData.title.trim()) {
      toast.error('请输入工单标题')
      return
    }
    if (!formData.description.trim()) {
      toast.error('请输入问题描述')
      return
    }

    setSubmitting(true)

    try {
      // 构建工单数据
      const ticketData = {
        ...formData,
        aiAnalysis: aiAnalysis?.analysis?.fullText || ''
      }

      // 创建工单
      const incident = await ServiceNowAPI.createIncident(ticketData)
      
      // 上传附件
      if (files.length > 0 && incident.sys_id) {
        await ServiceNowAPI.uploadMultipleAttachments(
          'incident',
          incident.sys_id,
          files
        )
      }

      toast.success(`工单创建成功！单号: ${incident.number || incident.sys_id}`)
      
      // 重置表单
      setFormData({
        title: '',
        description: '',
        category: 'inquiry',
        urgency: '3',
        impact: '3'
      })
      setFiles([])
      setAiAnalysis(null)

      if (onSuccess) {
        onSuccess(incident)
      }

    } catch (error) {
      console.error('Submit error:', error)
      toast.error(error.response?.data?.error?.message || '提交失败，请稍后重试')
    } finally {
      setSubmitting(false)
    }
  }

  const urgencyOptions = [
    { value: '1', label: '高 - 紧急', color: '#ef4444' },
    { value: '2', label: '中 - 一般', color: '#f59e0b' },
    { value: '3', label: '低 - 不紧急', color: '#10b981' }
  ]

  const impactOptions = [
    { value: '1', label: '高 - 影响大量用户', color: '#ef4444' },
    { value: '2', label: '中 - 影响部分用户', color: '#f59e0b' },
    { value: '3', label: '低 - 仅影响个人', color: '#10b981' }
  ]

  return (
    <form className="ticket-form" onSubmit={handleSubmit}>
      {/* AI 分析提示 */}
      {aiAnalysis?.success && (
        <div className="ai-suggestion-banner">
          <Sparkles size={18} />
          <span>AI 已分析您上传的图片并提供了建议，您可以根据需要调整</span>
        </div>
      )}

      {/* 标题 */}
      <div className="form-group">
        <label htmlFor="title">
          工单标题 <span className="required">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="简要描述您遇到的问题"
          maxLength={200}
        />
        <span className="char-count">{formData.title.length}/200</span>
      </div>

      {/* 分类 */}
      <div className="form-group">
        <label htmlFor="category">问题分类</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
        >
          {categories.map(cat => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* 紧急程度和影响范围 */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="urgency">
            紧急程度
            <Info size={14} className="info-icon" title="问题需要多快被处理" />
          </label>
          <select
            id="urgency"
            name="urgency"
            value={formData.urgency}
            onChange={handleChange}
            style={{ 
              borderLeftColor: urgencyOptions.find(o => o.value === formData.urgency)?.color 
            }}
          >
            {urgencyOptions.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="impact">
            影响范围
            <Info size={14} className="info-icon" title="问题影响多少用户" />
          </label>
          <select
            id="impact"
            name="impact"
            value={formData.impact}
            onChange={handleChange}
            style={{ 
              borderLeftColor: impactOptions.find(o => o.value === formData.impact)?.color 
            }}
          >
            {impactOptions.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 问题描述 */}
      <div className="form-group">
        <label htmlFor="description">
          问题描述 <span className="required">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="请详细描述您遇到的问题，包括：&#10;1. 问题发生的时间&#10;2. 具体的错误信息&#10;3. 已尝试的解决方法&#10;4. 期望的结果"
          rows={6}
          maxLength={4000}
        />
        <span className="char-count">{formData.description.length}/4000</span>
      </div>

      {/* 文件上传 */}
      <div className="form-group">
        <label>
          附件上传
          <span className="optional">（可上传截图、日志等）</span>
        </label>
        <FileUploader 
          files={files}
          setFiles={setFiles}
          onAIAnalysis={handleAIAnalysis}
        />
      </div>

      {/* 提交按钮 */}
      <div className="form-actions">
        <div className="form-tips">
          <AlertTriangle size={14} />
          <span>提交后工单将发送至 ServiceNow 系统</span>
        </div>
        <button 
          type="submit" 
          className="submit-btn"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <Loader2 size={18} className="spinning" />
              提交中...
            </>
          ) : (
            <>
              <Send size={18} />
              提交工单
            </>
          )}
        </button>
      </div>
    </form>
  )
}

export default TicketForm


