import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { 
  Search, 
  RefreshCw, 
  ExternalLink,
  Clock,
  CheckCircle,
  RotateCcw,
  Loader2,
  Inbox,
  Filter,
  X
} from 'lucide-react'
import ServiceNowAPI from '../services/servicenowApi'

const TicketListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all')

  // 状态选项
  const statusOptions = [
    { value: 'all', label: '全部', icon: null, color: null },
    { value: 'in_progress', label: '进行中', icon: Clock, color: '#f59e0b' },
    { value: 'resolved', label: '已解决', icon: CheckCircle, color: '#10b981' },
    { value: 'reopen', label: '重新打开', icon: RotateCcw, color: '#ef4444' }
  ]

  // 加载工单列表
  const loadTickets = async () => {
    setLoading(true)
    try {
      const data = await ServiceNowAPI.getIncidents({ limit: 50 })
      setTickets(data)
    } catch (error) {
      console.error('Failed to load tickets:', error)
      setTickets(getMockTickets())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTickets()
  }, [])

  // 更新URL参数
  useEffect(() => {
    if (statusFilter === 'all') {
      searchParams.delete('status')
    } else {
      searchParams.set('status', statusFilter)
    }
    setSearchParams(searchParams)
  }, [statusFilter])

  // 映射状态
  const mapStatus = (state) => {
    const stateMap = {
      'New': 'in_progress',
      'In Progress': 'in_progress',
      'On Hold': 'in_progress',
      'Resolved': 'resolved',
      'Closed': 'resolved',
      'Reopen': 'reopen'
    }
    return stateMap[state] || 'in_progress'
  }

  // 过滤工单
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.short_description?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const ticketStatus = mapStatus(ticket.state)
    const matchesStatus = statusFilter === 'all' || ticketStatus === statusFilter

    return matchesSearch && matchesStatus
  })

  // 统计数量
  const getStatusCount = (status) => {
    if (status === 'all') return tickets.length
    return tickets.filter(t => mapStatus(t.state) === status).length
  }

  return (
    <div className="ticket-list-page-new">
      {/* 页面标题 */}
      <div className="page-title-bar">
        <h1>工单列表</h1>
        <button 
          className="refresh-btn"
          onClick={loadTickets}
          disabled={loading}
        >
          <RefreshCw size={18} className={loading ? 'spinning' : ''} />
          刷新
        </button>
      </div>

      {/* 状态筛选标签 */}
      <div className="status-tabs">
        {statusOptions.map(option => {
          const count = getStatusCount(option.value)
          const isActive = statusFilter === option.value
          return (
            <button
              key={option.value}
              className={`status-tab ${isActive ? 'active' : ''}`}
              onClick={() => setStatusFilter(option.value)}
              style={isActive && option.color ? { 
                '--tab-color': option.color,
                '--tab-bg': `${option.color}15`
              } : {}}
            >
              {option.icon && <option.icon size={16} />}
              <span>{option.label}</span>
              <span className="tab-count">{count}</span>
            </button>
          )
        })}
      </div>

      {/* 搜索框 */}
      <div className="search-bar">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="搜索工单号或标题..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button className="clear-search" onClick={() => setSearchTerm('')}>
            <X size={16} />
          </button>
        )}
      </div>

      {/* 工单列表 */}
      <div className="tickets-list">
        {loading ? (
          <div className="loading-state">
            <Loader2 size={32} className="spinning" />
            <p>加载中...</p>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="empty-state">
            <Inbox size={48} />
            <h3>暂无工单</h3>
            <p>
              {searchTerm || statusFilter !== 'all' 
                ? '没有匹配的工单，请调整筛选条件'
                : '您还没有提交过工单'
              }
            </p>
            <Link to="/create" className="btn btn-primary">
              创建工单
            </Link>
          </div>
        ) : (
          filteredTickets.map(ticket => (
            <TicketCard key={ticket.sys_id} ticket={ticket} />
          ))
        )}
      </div>
    </div>
  )
}

// 工单卡片组件
const TicketCard = ({ ticket }) => {
  const getStatusConfig = (state) => {
    const configs = {
      'New': { label: '新建', color: '#3b82f6', icon: Clock },
      'In Progress': { label: '进行中', color: '#f59e0b', icon: Clock },
      'On Hold': { label: '挂起', color: '#8b5cf6', icon: Clock },
      'Resolved': { label: '已解决', color: '#10b981', icon: CheckCircle },
      'Closed': { label: '已关闭', color: '#6b7280', icon: CheckCircle },
      'Reopen': { label: '重新打开', color: '#ef4444', icon: RotateCcw }
    }
    return configs[state] || configs['New']
  }

  const getPriorityConfig = (priority) => {
    const configs = {
      '1': { label: '紧急', color: '#ef4444' },
      '2': { label: '高', color: '#f59e0b' },
      '3': { label: '中', color: '#3b82f6' },
      '4': { label: '低', color: '#10b981' },
      '5': { label: '计划', color: '#6b7280' }
    }
    return configs[priority] || configs['3']
  }

  const status = getStatusConfig(ticket.state)
  const priority = getPriorityConfig(ticket.priority)
  const StatusIcon = status.icon

  return (
    <Link to={`/tickets/${ticket.sys_id}`} className="ticket-card">
      <div className="ticket-card-header">
        <span className="ticket-number">{ticket.number}</span>
        <span 
          className="ticket-status-badge"
          style={{ 
            color: status.color, 
            backgroundColor: `${status.color}15`,
            borderColor: `${status.color}30`
          }}
        >
          <StatusIcon size={12} />
          {status.label}
        </span>
      </div>
      
      <h3 className="ticket-card-title">{ticket.short_description}</h3>
      
      <div className="ticket-card-footer">
        <div className="ticket-card-meta">
          <span 
            className="priority-dot"
            style={{ backgroundColor: priority.color }}
            title={`优先级: ${priority.label}`}
          />
          <span className="ticket-date">{formatDate(ticket.sys_created_on)}</span>
        </div>
        <ExternalLink size={16} className="view-icon" />
      </div>
    </Link>
  )
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now - date
  
  // 小于1小时
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000)
    return `${minutes}分钟前`
  }
  // 小于24小时
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000)
    return `${hours}小时前`
  }
  // 小于7天
  if (diff < 604800000) {
    const days = Math.floor(diff / 86400000)
    return `${days}天前`
  }
  
  return date.toLocaleDateString('zh-CN', {
    month: '2-digit',
    day: '2-digit'
  })
}

function getMockTickets() {
  return [
    {
      sys_id: 'mock-1',
      number: 'INC0010001',
      short_description: 'VPN 连接断开，无法访问内网',
      state: 'In Progress',
      priority: '1',
      sys_created_on: new Date(Date.now() - 7200000).toISOString()
    },
    {
      sys_id: 'mock-2',
      number: 'INC0010002',
      short_description: '邮箱无法登录，提示密码错误',
      state: 'In Progress',
      priority: '2',
      sys_created_on: new Date(Date.now() - 86400000).toISOString()
    },
    {
      sys_id: 'mock-3',
      number: 'INC0010003',
      short_description: '打印机驱动安装失败',
      state: 'Resolved',
      priority: '3',
      sys_created_on: new Date(Date.now() - 172800000).toISOString()
    },
    {
      sys_id: 'mock-4',
      number: 'INC0010004',
      short_description: '系统运行缓慢，需要优化',
      state: 'Resolved',
      priority: '4',
      sys_created_on: new Date(Date.now() - 259200000).toISOString()
    },
    {
      sys_id: 'mock-5',
      number: 'INC0010005',
      short_description: '软件授权过期需要续期',
      state: 'Reopen',
      priority: '2',
      sys_created_on: new Date(Date.now() - 432000000).toISOString()
    }
  ]
}

export default TicketListPage
