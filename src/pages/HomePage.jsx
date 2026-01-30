import { Link } from 'react-router-dom'
import { 
  PlusCircle, 
  List, 
  Sparkles, 
  Upload,
  Zap,
  Shield,
  Clock
} from 'lucide-react'

const HomePage = () => {
  const features = [
    {
      icon: Sparkles,
      title: 'AI 智能分析',
      description: '上传错误截图，AI 自动识别问题并给出解决建议'
    },
    {
      icon: Upload,
      title: '便捷附件上传',
      description: '支持拖拽上传多种格式文件，包括图片、日志、文档'
    },
    {
      icon: Zap,
      title: '快速提单',
      description: '简洁的表单设计，几步即可完成工单提交'
    },
    {
      icon: Shield,
      title: 'ServiceNow 集成',
      description: '直接对接 ServiceNow API，工单实时同步'
    }
  ]

  const stats = [
    { value: '24/7', label: '全天候服务' },
    { value: '<5s', label: 'AI 分析响应' },
    { value: '99.9%', label: '系统可用性' }
  ]

  return (
    <div className="home-page">
      {/* Hero 区域 */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={14} />
            <span>AI 驱动的智能工单系统</span>
          </div>
          
          <h1 className="hero-title">
            遇到问题？
            <span className="gradient-text">一键提单</span>
          </h1>
          
          <p className="hero-description">
            智能工单系统帮助您快速提交 IT 服务请求。
            上传错误截图，AI 将自动分析问题并提供解决建议，
            让问题处理更高效。
          </p>

          <div className="hero-actions">
            <Link to="/create" className="btn btn-primary">
              <PlusCircle size={20} />
              创建工单
            </Link>
            <Link to="/tickets" className="btn btn-secondary">
              <List size={20} />
              查看工单
            </Link>
          </div>

          {/* 统计数据 */}
          <div className="hero-stats">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 装饰图形 */}
        <div className="hero-decoration">
          <div className="decoration-card">
            <div className="card-header">
              <div className="status-dot"></div>
              <span>新工单</span>
            </div>
            <div className="card-content">
              <div className="skeleton-line long"></div>
              <div className="skeleton-line medium"></div>
              <div className="card-ai-badge">
                <Sparkles size={12} />
                AI 分析中...
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 功能特性 */}
      <section className="features">
        <h2 className="section-title">核心功能</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">
                <feature.icon size={24} />
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 使用流程 */}
      <section className="workflow">
        <h2 className="section-title">简单三步，完成提单</h2>
        <div className="workflow-steps">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>描述问题</h3>
              <p>填写问题标题和详细描述</p>
            </div>
          </div>
          <div className="step-connector"></div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>上传截图</h3>
              <p>添加错误截图，AI 自动分析</p>
            </div>
          </div>
          <div className="step-connector"></div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>提交工单</h3>
              <p>一键提交至 ServiceNow</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="cta-content">
          <Clock size={32} className="cta-icon" />
          <h2>节省时间，提高效率</h2>
          <p>立即开始使用智能工单系统</p>
          <Link to="/create" className="btn btn-primary btn-lg">
            立即创建工单
          </Link>
        </div>
      </section>
    </div>
  )
}

export default HomePage


