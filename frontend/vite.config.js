import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  // Load env variables from backend/.env
  const env = loadEnv(mode, path.resolve(__dirname, '../backend'), '')
  const supabaseUrl = env.SUPABASE_URL || 'https://pomojglyrqffqjknemup.supabase.co'
  const supabaseKey = env.SUPABASE_KEY || 'sb_secret_js0ebPHNZrdI6m1sLp3K0w_63w9u08R'

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/supabase': {
          target: `${supabaseUrl}/rest/v1`,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/supabase/, ''),
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          },
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              // Override browser headers so Supabase Cloud handles it as a clean server-to-server API request
              proxyReq.setHeader('user-agent', 'AgenteP-Server/1.0')
              proxyReq.removeHeader('origin')
              proxyReq.removeHeader('referer')
              proxyReq.removeHeader('sec-fetch-site')
              proxyReq.removeHeader('sec-fetch-mode')
              proxyReq.removeHeader('sec-fetch-dest')
            })
          }
        }
      }
    }
  }
})
