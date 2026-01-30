import { createContext, useContext, useState, useEffect } from 'react'

// 主题配置
export const themes = {
  light: {
    name: '清新白',
    icon: '☀️',
    colors: {
      '--color-bg-primary': '#f8fafc',
      '--color-bg-secondary': '#ffffff',
      '--color-bg-tertiary': '#f1f5f9',
      '--color-bg-card': '#ffffff',
      '--color-bg-hover': '#e2e8f0',
      '--color-text-primary': '#1e293b',
      '--color-text-secondary': '#475569',
      '--color-text-muted': '#94a3b8',
      '--color-border': '#e2e8f0',
      '--color-border-light': '#cbd5e1',
      '--color-primary': '#6366f1',
      '--color-primary-hover': '#4f46e5',
      '--gradient-primary': 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      '--shadow-sm': '0 2px 8px rgba(0, 0, 0, 0.08)',
      '--shadow-md': '0 4px 16px rgba(0, 0, 0, 0.1)',
      '--shadow-lg': '0 8px 32px rgba(0, 0, 0, 0.12)',
      '--shadow-glow': '0 0 20px rgba(99, 102, 241, 0.2)'
    }
  },
  dark: {
    name: '深邃黑',
    icon: '🌙',
    colors: {
      '--color-bg-primary': '#0a0a0f',
      '--color-bg-secondary': '#12121a',
      '--color-bg-tertiary': '#1a1a28',
      '--color-bg-card': '#16161f',
      '--color-bg-hover': '#1e1e2d',
      '--color-text-primary': '#f0f0f5',
      '--color-text-secondary': '#a0a0b0',
      '--color-text-muted': '#6b6b7b',
      '--color-border': '#2a2a3a',
      '--color-border-light': '#3a3a4a',
      '--color-primary': '#6366f1',
      '--color-primary-hover': '#818cf8',
      '--gradient-primary': 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
      '--shadow-sm': '0 2px 8px rgba(0, 0, 0, 0.3)',
      '--shadow-md': '0 4px 16px rgba(0, 0, 0, 0.4)',
      '--shadow-lg': '0 8px 32px rgba(0, 0, 0, 0.5)',
      '--shadow-glow': '0 0 20px rgba(99, 102, 241, 0.3)'
    }
  },
  ocean: {
    name: '海洋蓝',
    icon: '🌊',
    colors: {
      '--color-bg-primary': '#0c1929',
      '--color-bg-secondary': '#0f2942',
      '--color-bg-tertiary': '#163a5c',
      '--color-bg-card': '#133352',
      '--color-bg-hover': '#1a4568',
      '--color-text-primary': '#e8f4fc',
      '--color-text-secondary': '#a8d0ea',
      '--color-text-muted': '#6ba3c9',
      '--color-border': '#1e4d6e',
      '--color-border-light': '#2a6188',
      '--color-primary': '#38bdf8',
      '--color-primary-hover': '#7dd3fc',
      '--gradient-primary': 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 50%, #7dd3fc 100%)',
      '--shadow-sm': '0 2px 8px rgba(0, 0, 0, 0.3)',
      '--shadow-md': '0 4px 16px rgba(0, 0, 0, 0.4)',
      '--shadow-lg': '0 8px 32px rgba(0, 0, 0, 0.5)',
      '--shadow-glow': '0 0 20px rgba(56, 189, 248, 0.3)'
    }
  },
  forest: {
    name: '森林绿',
    icon: '🌲',
    colors: {
      '--color-bg-primary': '#0f1f14',
      '--color-bg-secondary': '#152e1b',
      '--color-bg-tertiary': '#1c3d24',
      '--color-bg-card': '#193621',
      '--color-bg-hover': '#22482c',
      '--color-text-primary': '#e8f5ec',
      '--color-text-secondary': '#a8d5b5',
      '--color-text-muted': '#6bb381',
      '--color-border': '#2a5235',
      '--color-border-light': '#3a6845',
      '--color-primary': '#34d399',
      '--color-primary-hover': '#6ee7b7',
      '--gradient-primary': 'linear-gradient(135deg, #10b981 0%, #34d399 50%, #6ee7b7 100%)',
      '--shadow-sm': '0 2px 8px rgba(0, 0, 0, 0.3)',
      '--shadow-md': '0 4px 16px rgba(0, 0, 0, 0.4)',
      '--shadow-lg': '0 8px 32px rgba(0, 0, 0, 0.5)',
      '--shadow-glow': '0 0 20px rgba(52, 211, 153, 0.3)'
    }
  },
  sunset: {
    name: '日落橙',
    icon: '🌅',
    colors: {
      '--color-bg-primary': '#1a0f0a',
      '--color-bg-secondary': '#2d1810',
      '--color-bg-tertiary': '#3d2218',
      '--color-bg-card': '#351c14',
      '--color-bg-hover': '#4a2a1e',
      '--color-text-primary': '#fef3e8',
      '--color-text-secondary': '#f5c9a8',
      '--color-text-muted': '#c99a6b',
      '--color-border': '#5c3525',
      '--color-border-light': '#7a4835',
      '--color-primary': '#fb923c',
      '--color-primary-hover': '#fdba74',
      '--gradient-primary': 'linear-gradient(135deg, #f97316 0%, #fb923c 50%, #fdba74 100%)',
      '--shadow-sm': '0 2px 8px rgba(0, 0, 0, 0.3)',
      '--shadow-md': '0 4px 16px rgba(0, 0, 0, 0.4)',
      '--shadow-lg': '0 8px 32px rgba(0, 0, 0, 0.5)',
      '--shadow-glow': '0 0 20px rgba(251, 146, 60, 0.3)'
    }
  },
  rose: {
    name: '玫瑰粉',
    icon: '🌸',
    colors: {
      '--color-bg-primary': '#fdf2f8',
      '--color-bg-secondary': '#ffffff',
      '--color-bg-tertiary': '#fce7f3',
      '--color-bg-card': '#ffffff',
      '--color-bg-hover': '#fbcfe8',
      '--color-text-primary': '#4a1d34',
      '--color-text-secondary': '#831843',
      '--color-text-muted': '#be185d',
      '--color-border': '#f9a8d4',
      '--color-border-light': '#f472b6',
      '--color-primary': '#ec4899',
      '--color-primary-hover': '#db2777',
      '--gradient-primary': 'linear-gradient(135deg, #ec4899 0%, #f472b6 50%, #f9a8d4 100%)',
      '--shadow-sm': '0 2px 8px rgba(236, 72, 153, 0.1)',
      '--shadow-md': '0 4px 16px rgba(236, 72, 153, 0.15)',
      '--shadow-lg': '0 8px 32px rgba(236, 72, 153, 0.2)',
      '--shadow-glow': '0 0 20px rgba(236, 72, 153, 0.25)'
    }
  },
  lavender: {
    name: '薰衣草',
    icon: '💜',
    colors: {
      '--color-bg-primary': '#faf5ff',
      '--color-bg-secondary': '#ffffff',
      '--color-bg-tertiary': '#f3e8ff',
      '--color-bg-card': '#ffffff',
      '--color-bg-hover': '#e9d5ff',
      '--color-text-primary': '#3b0764',
      '--color-text-secondary': '#6b21a8',
      '--color-text-muted': '#9333ea',
      '--color-border': '#d8b4fe',
      '--color-border-light': '#c084fc',
      '--color-primary': '#a855f7',
      '--color-primary-hover': '#9333ea',
      '--gradient-primary': 'linear-gradient(135deg, #9333ea 0%, #a855f7 50%, #c084fc 100%)',
      '--shadow-sm': '0 2px 8px rgba(168, 85, 247, 0.1)',
      '--shadow-md': '0 4px 16px rgba(168, 85, 247, 0.15)',
      '--shadow-lg': '0 8px 32px rgba(168, 85, 247, 0.2)',
      '--shadow-glow': '0 0 20px rgba(168, 85, 247, 0.25)'
    }
  },
  mint: {
    name: '薄荷青',
    icon: '🍃',
    colors: {
      '--color-bg-primary': '#f0fdfa',
      '--color-bg-secondary': '#ffffff',
      '--color-bg-tertiary': '#ccfbf1',
      '--color-bg-card': '#ffffff',
      '--color-bg-hover': '#99f6e4',
      '--color-text-primary': '#134e4a',
      '--color-text-secondary': '#0f766e',
      '--color-text-muted': '#14b8a6',
      '--color-border': '#5eead4',
      '--color-border-light': '#2dd4bf',
      '--color-primary': '#14b8a6',
      '--color-primary-hover': '#0d9488',
      '--gradient-primary': 'linear-gradient(135deg, #0d9488 0%, #14b8a6 50%, #2dd4bf 100%)',
      '--shadow-sm': '0 2px 8px rgba(20, 184, 166, 0.1)',
      '--shadow-md': '0 4px 16px rgba(20, 184, 166, 0.15)',
      '--shadow-lg': '0 8px 32px rgba(20, 184, 166, 0.2)',
      '--shadow-glow': '0 0 20px rgba(20, 184, 166, 0.25)'
    }
  }
}

const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    // 从 localStorage 读取保存的主题，默认使用浅色主题
    const saved = localStorage.getItem('app-theme')
    return saved && themes[saved] ? saved : 'mint'
  })

  // 应用主题
  useEffect(() => {
    const theme = themes[currentTheme]
    if (theme) {
      Object.entries(theme.colors).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value)
      })
      // 保存到 localStorage
      localStorage.setItem('app-theme', currentTheme)
      
      // 更新 meta theme-color
      const metaThemeColor = document.querySelector('meta[name="theme-color"]')
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', theme.colors['--color-bg-primary'])
      }
    }
  }, [currentTheme])

  const changeTheme = (themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName)
    }
  }

  return (
    <ThemeContext.Provider value={{ 
      currentTheme, 
      changeTheme, 
      themes,
      themeConfig: themes[currentTheme]
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export default ThemeContext

