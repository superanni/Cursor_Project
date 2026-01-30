import { useNavigate } from 'react-router-dom'
import { ArrowLeft, FileText, Sparkles } from 'lucide-react'
import TicketForm from '../components/TicketForm'

const CreateTicketPage = () => {
  const navigate = useNavigate()

  const handleSuccess = (incident) => {
    // 可选：跳转到工单详情页
    // navigate(`/tickets/${incident.sys_id}`)
  }

  return (
    <div className="create-ticket-page">
      <div className="page-header">
        <button 
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={20} />
          返回
        </button>
        
        <div className="header-content">
          <div className="header-icon">
            <FileText size={28} />
          </div>
          <div>
            <h1>创建工单</h1>
            <p className="header-subtitle">
              <Sparkles size={14} />
              支持 AI 智能分析错误截图
            </p>
          </div>
        </div>
      </div>

      <div className="page-content">
        <div className="form-container">
          <TicketForm onSuccess={handleSuccess} />
        </div>

        <aside className="sidebar-tips">
          <div className="tips-card">
            <h3>💡 提单小贴士</h3>
            <ul>
              <li>
                <strong>标题要简洁明了</strong>
                <p>概括问题的核心，便于快速理解</p>
              </li>
              <li>
                <strong>描述要详细具体</strong>
                <p>包含错误信息、发生时间、影响范围</p>
              </li>
              <li>
                <strong>上传错误截图</strong>
                <p>AI 会自动分析并给出建议</p>
              </li>
              <li>
                <strong>正确设置优先级</strong>
                <p>帮助技术团队合理安排处理顺序</p>
              </li>
            </ul>
          </div>

          <div className="tips-card ai-tips">
            <h3>🤖 AI 分析功能</h3>
            <p>
              上传错误截图后，点击"AI 分析图片"按钮，
              系统将自动识别图片中的错误信息，并提供：
            </p>
            <ul>
              <li>错误类型识别</li>
              <li>可能的原因分析</li>
              <li>解决方案建议</li>
              <li>优先级和分类建议</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default CreateTicketPage


