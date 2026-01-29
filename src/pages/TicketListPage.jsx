import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Search, 
  Filter, 
  RefreshCw, 
  ExternalLink,
  Clock,
  AlertCircle,
  CheckCircle,
  Loader2,
  Inbox
} from 'lucide-react'
import ServiceNowAPI from '../services/servicenowApi'

const TicketListPage = () => {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // 加载工单列表
  const loadTickets = async () => {
    setLoading(true)
    try {
      const data = await ServiceNowAPI.getIncidents({
        limit: 50
      })
      setTickets(data)
    } catch (error) {
      console.error('Failed to load tickets:', error)
      // 如果 API 失败，显示模拟数据
      setTickets(getMockTickets())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTickets()
  }, [])

  // 获取状态样式
  const getStatusStyle = (state) => {
    const stateMap = {
      'New': { color: '#3b82f6', icon: Clock, label: '新建' },
      'In Progress': { color: '#f59e0b', icon: Loader2, label: '处理中' },
      'On Hold': { color: '#8b5cf6', icon: AlertCircle, label: '挂起' },
      'Resolved': { color: '#10b981', icon: CheckCircle, label: '已解决' },
      'Closed': { color: '#6b7280', icon: CheckCircle, label: '已关闭' }
    }
    return stateMap[state] || stateMap['New']
  }

  // 获取优先级样式
  const getPriorityStyle = (priority) => {
    const priorityMap = {
      '1': { color: '#ef4444', label: '紧急' },
      '2': { color: '#f59e0b', label: '高' },
      '3': { color: '#3b82f6', label: '中' },
      '4': { color: '#10b981', label: '低' },
      '5': { color: '#6b7280', label: '计划' }
    }
    return priorityMap[priority] || priorityMap['3']
  }

  // 过滤工单
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.short_description?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || ticket.state === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="ticket-list-page">
      <div className="page-header">
        <h1>工单列表</h1>
        <button 
          className="btn btn-secondary"
          onClick={loadTickets}
          disabled={loading}
        >
          <RefreshCw size={18} className={loading ? 'spinning' : ''} />
          刷新
        </button>
      </div>

      {/* 筛选栏 */}
      <div className="filter-bar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="搜索工单号或标题..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <Filter size={18} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">全部状态</option>
            <option value="New">新建</option>
            <option value="In Progress">处理中</option>
            <option value="On Hold">挂起</option>
            <option value="Resolved">已解决</option>
            <option value="Closed">已关闭</option>
          </select>
        </div>
      </div>

      {/* 工单列表 */}
      <div className="tickets-container">
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
                ? '没有匹配的工单，请尝试调整筛选条件'
                : '您还没有提交过工单'
              }
            </p>
            <Link to="/create" className="btn btn-primary">
              创建工单
            </Link>
          </div>
        ) : (
          <div className="ticket-table">
            <div className="table-header">
              <div className="col-number">工单号</div>
              <div className="col-title">标题</div>
              <div className="col-status">状态</div>
              <div className="col-priority">优先级</div>
              <div className="col-date">创建时间</div>
              <div className="col-action">操作</div>
            </div>
            
            {filteredTickets.map(ticket => {
              const statusStyle = getStatusStyle(ticket.state)
              const priorityStyle = getPriorityStyle(ticket.priority)
              const StatusIcon = statusStyle.icon

              return (
                <div key={ticket.sys_id} className="table-row">
                  <div className="col-number">
                    <span className="ticket-number">{ticket.number}</span>
                  </div>
                  <div className="col-title">
                    <span className="ticket-title">{ticket.short_description}</span>
                  </div>
                  <div className="col-status">
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: `${statusStyle.color}20`, color: statusStyle.color }}
                    >
                      <StatusIcon size={14} />
                      {statusStyle.label}
                    </span>
                  </div>
                  <div className="col-priority">
                    <span 
                      className="priority-badge"
                      style={{ color: priorityStyle.color }}
                    >
                      {priorityStyle.label}
                    </span>
                  </div>
                  <div className="col-date">
                    {formatDate(ticket.sys_created_on)}
                  </div>
                  <div className="col-action">
                    <Link 
                      to={`/tickets/${ticket.sys_id}`}
                      className="action-btn"
                    >
                      <ExternalLink size={16} />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

// 格式化日期
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

// 模拟数据（用于演示）
function getMockTickets() {
  return [
    {
      sys_id: 'mock-1',
      number: 'INC0010001',
      short_description: '邮箱无法登录，提示密码错误',
      state: 'New',
      priority: '2',
      sys_created_on: new Date().toISOString()
    },
    {
      sys_id: 'mock-2',
      number: 'INC0010002',
      short_description: 'VPN 连接断开，无法访问内网资源',
      state: 'In Progress',
      priority: '1',
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
      state: 'On Hold',
      priority: '4',
      sys_created_on: new Date(Date.now() - 259200000).toISOString()
    }
  ]
}

export default TicketListPage

