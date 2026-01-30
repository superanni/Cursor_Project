import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Clock,
  User,
  Tag,
  AlertCircle,
  CheckCircle,
  Loader2,
  Paperclip,
  MessageSquare,
  Calendar
} from 'lucide-react'
import ServiceNowAPI from '../services/servicenowApi'

const TicketDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [ticket, setTicket] = useState(null)
  const [attachments, setAttachments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTicket = async () => {
      setLoading(true)
      try {
        const [ticketData, attachmentsData] = await Promise.all([
          ServiceNowAPI.getIncidentById(id),
          ServiceNowAPI.getAttachments(id)
        ])
        setTicket(ticketData)
        setAttachments(attachmentsData)
      } catch (error) {
        console.error('Failed to load ticket:', error)
        // 显示模拟数据
        setTicket(getMockTicket(id))
        setAttachments([])
      } finally {
        setLoading(false)
      }
    }

    loadTicket()
  }, [id])

  const getStatusInfo = (state) => {
    const stateMap = {
      'New': { color: '#3b82f6', icon: Clock, label: '新建' },
      'In Progress': { color: '#f59e0b', icon: Loader2, label: '处理中' },
      'On Hold': { color: '#8b5cf6', icon: AlertCircle, label: '挂起' },
      'Resolved': { color: '#10b981', icon: CheckCircle, label: '已解决' },
      'Closed': { color: '#6b7280', icon: CheckCircle, label: '已关闭' }
    }
    return stateMap[state] || stateMap['New']
  }

  const getPriorityInfo = (priority) => {
    const priorityMap = {
      '1': { color: '#ef4444', label: '紧急' },
      '2': { color: '#f59e0b', label: '高' },
      '3': { color: '#3b82f6', label: '中' },
      '4': { color: '#10b981', label: '低' },
      '5': { color: '#6b7280', label: '计划' }
    }
    return priorityMap[priority] || priorityMap['3']
  }

  if (loading) {
    return (
      <div className="ticket-detail-page loading">
        <Loader2 size={32} className="spinning" />
        <p>加载中...</p>
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="ticket-detail-page error">
        <AlertCircle size={48} />
        <h2>工单不存在</h2>
        <button className="btn btn-primary" onClick={() => navigate('/tickets')}>
          返回工单列表
        </button>
      </div>
    )
  }

  const statusInfo = getStatusInfo(ticket.state)
  const priorityInfo = getPriorityInfo(ticket.priority)
  const StatusIcon = statusInfo.icon

  return (
    <div className="ticket-detail-page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          返回
        </button>
      </div>

      <div className="ticket-detail-content">
        {/* 主要信息 */}
        <div className="ticket-main">
          <div className="ticket-header">
            <div className="ticket-number-badge">{ticket.number}</div>
            <span
              className="status-badge"
              style={{ backgroundColor: `${statusInfo.color}20`, color: statusInfo.color }}
            >
              <StatusIcon size={14} />
              {statusInfo.label}
            </span>
          </div>

          <h1 className="ticket-title">{ticket.short_description}</h1>

          <div className="ticket-meta">
            <div className="meta-item">
              <Calendar size={16} />
              <span>创建时间: {formatDate(ticket.sys_created_on)}</span>
            </div>
            <div className="meta-item">
              <Tag size={16} />
              <span>分类: {ticket.category || '未分类'}</span>
            </div>
            <div
              className="meta-item priority"
              style={{ color: priorityInfo.color }}
            >
              <AlertCircle size={16} />
              <span>优先级: {priorityInfo.label}</span>
            </div>
          </div>

          <div className="ticket-description">
            <h3>
              <MessageSquare size={18} />
              问题描述
            </h3>
            <div className="description-content">
              {ticket.description || '无描述'}
            </div>
          </div>

          {ticket.work_notes && (
            <div className="ticket-notes">
              <h3>处理记录</h3>
              <div className="notes-content">
                {ticket.work_notes}
              </div>
            </div>
          )}

          {attachments.length > 0 && (
            <div className="ticket-attachments">
              <h3>
                <Paperclip size={18} />
                附件 ({attachments.length})
              </h3>
              <div className="attachments-list">
                {attachments.map(att => (
                  <a
                    key={att.sys_id}
                    href={att.download_link}
                    className="attachment-item"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Paperclip size={16} />
                    <span>{att.file_name}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 侧边信息 */}
        <aside className="ticket-sidebar">
          <div className="info-card">
            <h3>工单详情</h3>
            <dl className="info-list">
              <div className="info-item">
                <dt>工单号</dt>
                <dd>{ticket.number}</dd>
              </div>
              <div className="info-item">
                <dt>状态</dt>
                <dd>
                  <span
                    className="status-dot"
                    style={{ backgroundColor: statusInfo.color }}
                  />
                  {statusInfo.label}
                </dd>
              </div>
              <div className="info-item">
                <dt>优先级</dt>
                <dd style={{ color: priorityInfo.color }}>{priorityInfo.label}</dd>
              </div>
              <div className="info-item">
                <dt>紧急程度</dt>
                <dd>{getUrgencyLabel(ticket.urgency)}</dd>
              </div>
              <div className="info-item">
                <dt>影响范围</dt>
                <dd>{getImpactLabel(ticket.impact)}</dd>
              </div>
              <div className="info-item">
                <dt>分类</dt>
                <dd>{ticket.category || '-'}</dd>
              </div>
            </dl>
          </div>

          <div className="info-card">
            <h3>时间线</h3>
            <dl className="info-list">
              <div className="info-item">
                <dt>创建时间</dt>
                <dd>{formatDate(ticket.sys_created_on)}</dd>
              </div>
              <div className="info-item">
                <dt>更新时间</dt>
                <dd>{formatDate(ticket.sys_updated_on)}</dd>
              </div>
              {ticket.resolved_at && (
                <div className="info-item">
                  <dt>解决时间</dt>
                  <dd>{formatDate(ticket.resolved_at)}</dd>
                </div>
              )}
            </dl>
          </div>

          {ticket.assigned_to && (
            <div className="info-card">
              <h3>处理人</h3>
              <div className="assignee">
                <div className="assignee-avatar">
                  <User size={20} />
                </div>
                <div className="assignee-info">
                  <span className="assignee-name">{ticket.assigned_to}</span>
                  <span className="assignee-group">{ticket.assignment_group || '-'}</span>
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function getUrgencyLabel(urgency) {
  const map = { '1': '高', '2': '中', '3': '低' }
  return map[urgency] || '-'
}

function getImpactLabel(impact) {
  const map = { '1': '高', '2': '中', '3': '低' }
  return map[impact] || '-'
}

function getMockTicket(id) {
  return {
    sys_id: id,
    number: 'INC0010001',
    short_description: '邮箱无法登录，提示密码错误',
    description: '今天早上尝试登录公司邮箱时，系统提示"密码错误"。我确认密码是正确的，之前一直可以正常登录。\n\n已尝试：\n1. 清除浏览器缓存\n2. 使用其他浏览器\n3. 重启电脑\n\n问题依然存在，请协助处理。',
    state: 'In Progress',
    priority: '2',
    urgency: '2',
    impact: '3',
    category: 'software',
    sys_created_on: new Date(Date.now() - 86400000).toISOString(),
    sys_updated_on: new Date().toISOString(),
    assigned_to: '技术支持团队',
    assignment_group: 'IT Help Desk',
    work_notes: '[AI分析结果]\n检测到登录认证问题，可能原因：\n1. 账户被锁定\n2. 密码过期\n3. 认证服务异常\n\n建议检查 AD 账户状态。'
  }
}

export default TicketDetailPage


