import { Outlet, NavLink } from 'react-router-dom'
import { 
  Home, 
  PlusCircle, 
  List, 
  Sparkles,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navItems = [
    { to: '/', icon: Home, label: '首页' },
    { to: '/create', icon: PlusCircle, label: '创建工单' },
    { to: '/tickets', icon: List, label: '工单列表' }
  ]

  return (
    <div className="app-layout">
      {/* 移动端菜单按钮 */}
      <button 
        className="mobile-menu-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* 侧边栏 */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <Sparkles className="logo-icon" />
            <span className="logo-text">智能工单</span>
          </div>
          <span className="logo-subtitle">ServiceNow</span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => 
                `nav-item ${isActive ? 'active' : ''}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <Icon size={20} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="ai-badge">
            <Sparkles size={14} />
            <span>AI 智能分析</span>
          </div>
          <p className="version">v1.0.0</p>
        </div>
      </aside>

      {/* 遮罩层 */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 主内容区 */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout


