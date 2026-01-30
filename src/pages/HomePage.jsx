import { Link } from 'react-router-dom'
import { 
  PlusCircle, 
  Sparkles, 
  Upload,
  Clock,
  CheckCircle,
  RotateCcw,
  FileText,
  ArrowRight,
  TrendingUp
} from 'lucide-react'

const HomePage = () => {
  // 模拟工单统计数据
  const stats = [
    { 
      label: '进行中', 
      value: 5, 
      icon: Clock, 
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.1)',
      link: '/tickets?status=in_progress'
    },
    { 
      label: '已解决', 
      value: 23, 
      icon: CheckCircle, 
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.1)',
      link: '/tickets?status=resolved'
    },
    { 
      label: '重新打开', 
      value: 2, 
      icon: RotateCcw, 
      color: '#ef4444',
      bgColor: 'rgba(239, 68, 68, 0.1)',
      link: '/tickets?status=reopen'
    }
  ]

  const quickActions = [
    {
      title: '创建工单',
      description: '提交新的IT服务请求',
      icon: PlusCircle,
      link: '/create',
      primary: true
    },
    {
      title: 'AI 智能分析',
      description: '上传截图，AI自动识别问题',
      icon: Sparkles,
      link: '/create',
      highlight: true
    },
    {
      title: '历史工单',
      description: '查看所有提交的工单',
      icon: FileText,
      link: '/tickets'
    }
  ]

  return (
    <div className="home-page-new">
      {/* 欢迎区域 */}
      <section className="welcome-section">
        <div className="welcome-content">
          <h1>IT 服务工单</h1>
          <p>快速提交问题，AI 智能分析，高效解决</p>
        </div>
        <Link to="/create" className="quick-create-btn">
          <PlusCircle size={20} />
          立即提单
        </Link>
      </section>

      {/* 工单状态统计 */}
      <section className="stats-section">
        <h2 className="section-title-small">我的工单</h2>
        <div className="stats-cards">
          {stats.map((stat, index) => (
            <Link 
              key={index} 
              to={stat.link}
              className="stat-card"
              style={{ '--stat-color': stat.color, '--stat-bg': stat.bgColor }}
            >
              <div className="stat-icon">
                <stat.icon size={24} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
              <ArrowRight size={16} className="stat-arrow" />
            </Link>
          ))}
        </div>
      </section>

      {/* 快捷操作 */}
      <section className="actions-section">
        <h2 className="section-title-small">快捷操作</h2>
        <div className="action-cards">
          {quickActions.map((action, index) => (
            <Link 
              key={index}
              to={action.link}
              className={`action-card ${action.primary ? 'primary' : ''} ${action.highlight ? 'highlight' : ''}`}
            >
              <div className="action-icon">
                <action.icon size={28} />
              </div>
              <div className="action-content">
                <h3>{action.title}</h3>
                <p>{action.description}</p>
              </div>
              <ArrowRight size={18} className="action-arrow" />
            </Link>
          ))}
        </div>
      </section>

      {/* AI 功能亮点 */}
      <section className="ai-feature-section">
        <div className="ai-feature-card">
          <div className="ai-feature-icon">
            <Sparkles size={32} />
          </div>
          <div className="ai-feature-content">
            <h3>AI 智能分析</h3>
            <p>上传错误截图或日志，AI 将自动：</p>
            <ul>
              <li>
                <CheckCircle size={14} />
                识别错误类型和原因
              </li>
              <li>
                <CheckCircle size={14} />
                提供解决方案建议
              </li>
              <li>
                <CheckCircle size={14} />
                自动设置工单优先级
              </li>
            </ul>
          </div>
          <Link to="/create" className="ai-try-btn">
            <Upload size={16} />
            上传截图试试
          </Link>
        </div>
      </section>

      {/* 最近工单 */}
      <section className="recent-section">
        <div className="section-header">
          <h2 className="section-title-small">最近工单</h2>
          <Link to="/tickets" className="view-all-link">
            查看全部
            <ArrowRight size={14} />
          </Link>
        </div>
        <div className="recent-tickets">
          <RecentTicketItem 
            number="INC0010005"
            title="VPN 连接失败"
            status="in_progress"
            time="2小时前"
          />
          <RecentTicketItem 
            number="INC0010004"
            title="邮箱无法登录"
            status="resolved"
            time="1天前"
          />
          <RecentTicketItem 
            number="INC0010003"
            title="打印机驱动问题"
            status="resolved"
            time="3天前"
          />
        </div>
      </section>
    </div>
  )
}

// 最近工单项组件
const RecentTicketItem = ({ number, title, status, time }) => {
  const statusConfig = {
    in_progress: { label: '进行中', color: '#f59e0b', icon: Clock },
    resolved: { label: '已解决', color: '#10b981', icon: CheckCircle },
    reopen: { label: '重新打开', color: '#ef4444', icon: RotateCcw }
  }
  
  const config = statusConfig[status] || statusConfig.in_progress
  const StatusIcon = config.icon

  return (
    <Link to={`/tickets/${number}`} className="recent-ticket-item">
      <div className="ticket-main-info">
        <span className="ticket-number">{number}</span>
        <span className="ticket-title">{title}</span>
      </div>
      <div className="ticket-meta-info">
        <span 
          className="ticket-status"
          style={{ color: config.color, backgroundColor: `${config.color}15` }}
        >
          <StatusIcon size={12} />
          {config.label}
        </span>
        <span className="ticket-time">{time}</span>
      </div>
    </Link>
  )
}

export default HomePage
