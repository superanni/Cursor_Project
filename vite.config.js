import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api/servicenow': {
        target: 'https://your-instance.service-now.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/servicenow/, '/api/now')
      }
    }
  }
})

