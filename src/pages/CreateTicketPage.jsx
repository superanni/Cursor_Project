import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Sparkles } from 'lucide-react'
import TicketForm from '../components/TicketForm'

const CreateTicketPage = () => {
  const navigate = useNavigate()

  const handleSuccess = (incident) => {
    // 可选：跳转到工单详情页
    // navigate(`/tickets/${incident.sys_id}`)
  }

  return (
    <div className="create-ticket-page-new">
      <div className="page-title-bar">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <h1>创建工单</h1>
      </div>

      <div className="create-content">
        {/* AI 提示横幅 */}
        <div className="ai-tip-banner">
          <Sparkles size={18} />
          <span>上传错误截图，AI 将自动分析问题并提供建议</span>
        </div>

        {/* 工单表单 */}
        <div className="form-wrapper">
          <TicketForm onSuccess={handleSuccess} />
        </div>
      </div>
    </div>
  )
}

export default CreateTicketPage
