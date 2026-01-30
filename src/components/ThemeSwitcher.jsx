import { useState } from 'react'
import { Palette, Check, X } from 'lucide-react'
import { useTheme, themes } from '../contexts/ThemeContext'

const ThemeSwitcher = () => {
  const { currentTheme, changeTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="theme-switcher">
      <button 
        className="theme-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="切换主题"
      >
        <Palette size={20} />
      </button>

      {isOpen && (
        <>
          <div className="theme-overlay" onClick={() => setIsOpen(false)} />
          <div className="theme-panel">
            <div className="theme-panel-header">
              <h3>
                <Palette size={18} />
                选择主题
              </h3>
              <button className="close-btn" onClick={() => setIsOpen(false)}>
                <X size={18} />
              </button>
            </div>
            
            <div className="theme-grid">
              {Object.entries(themes).map(([key, theme]) => (
                <button
                  key={key}
                  className={`theme-option ${currentTheme === key ? 'active' : ''}`}
                  onClick={() => {
                    changeTheme(key)
                    setIsOpen(false)
                  }}
                  style={{
                    '--preview-bg': theme.colors['--color-bg-primary'],
                    '--preview-card': theme.colors['--color-bg-card'],
                    '--preview-primary': theme.colors['--color-primary'],
                    '--preview-text': theme.colors['--color-text-primary']
                  }}
                >
                  <div className="theme-preview">
                    <div className="preview-sidebar"></div>
                    <div className="preview-content">
                      <div className="preview-card"></div>
                      <div className="preview-card small"></div>
                    </div>
                  </div>
                  <div className="theme-info">
                    <span className="theme-icon">{theme.icon}</span>
                    <span className="theme-name">{theme.name}</span>
                    {currentTheme === key && <Check size={14} className="check-icon" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ThemeSwitcher

