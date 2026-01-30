import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { 
  Home, 
  PlusCircle, 
  List, 
  Sparkles,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'
import ThemeSwitcher from './ThemeSwitcher'

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  const navItems = [
    { to: '/', icon: Home, label: '首页', exact: true },
    { to: '/create', icon: PlusCircle, label: '创建工单', highlight: true },
    { to: '/tickets', icon: List, label: '工单列表' }
  ]

  const isActive = (path, exact = false) => {
    if (exact) return location.pathname === path
    return location.pathname.startsWith(path)
  }

  return (
    <div className="app-layout">
      {/* 移动端菜单按钮 */}
      <button 
        className="mobile-menu-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* 主题切换按钮 */}
      <ThemeSwitcher />

      {/* 侧边栏 */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon-wrap">
              <Sparkles size={20} />
            </div>
            <span className="logo-text">工单系统</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            {navItems.map(({ to, icon: Icon, label, highlight, exact }) => (
              <NavLink
                key={to}
                to={to}
                end={exact}
                className={({ isActive }) => 
                  `nav-item ${isActive ? 'active' : ''} ${highlight ? 'highlight' : ''}`
                }
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={20} />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="ai-badge">
            <Sparkles size={14} />
            <span>AI 智能分析</span>
          </div>
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
