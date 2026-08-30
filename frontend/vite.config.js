import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'
import { spawn } from 'child_process'

function cronApiPlugin() {
  return {
    name: 'agente-p-cron-api',
    configureServer(server) {
      server.middlewares.use('/api/update-cron-schedule', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        let body = ''
        req.on('data', (chunk) => { body += chunk })
        req.on('end', () => {
          try {
            const { jobId, schedule, scheduleLabel } = JSON.parse(body || '{}')
            if (!jobId || !schedule) {
              res.statusCode = 400
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'jobId and schedule are required' }))
              return
            }

            const cronStatusPath = path.resolve(__dirname, '../agents/workspace/cron_status.json')
            let cronData = {}
            if (fs.existsSync(cronStatusPath)) {
              cronData = JSON.parse(fs.readFileSync(cronStatusPath, 'utf-8'))
            }

            if (!cronData[jobId]) {
              res.statusCode = 404
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: `Job ${jobId} not found` }))
              return
            }

            cronData[jobId].schedule = schedule
            if (scheduleLabel) {
              cronData[jobId].schedule_label = scheduleLabel
            }

            fs.writeFileSync(cronStatusPath, JSON.stringify(cronData, null, 2), 'utf-8')

            // Trigger python cron_manager to sync macOS crontab
            const managerScript = path.resolve(__dirname, '../agents/core/cron_manager.py')
            const pyProcess = spawn('python3', [
              managerScript,
              'update',
              '--id', jobId,
              '--schedule', schedule,
              '--label', scheduleLabel || ''
            ])

            pyProcess.on('close', (code) => {
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({
                success: true,
                job: cronData[jobId],
                osSynced: code === 0
              }))
            })

            pyProcess.on('error', () => {
              // If python fails to spawn, still respond with success for file update
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({
                success: true,
                job: cronData[jobId],
                osSynced: false
              }))
            })
          } catch (err) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: err.message }))
          }
        })
      })
    }
  }
}

export default defineConfig(({ mode }) => {
  // Load env variables from backend/.env
  const env = loadEnv(mode, path.resolve(__dirname, '../backend'), '')
  const supabaseUrl = env.SUPABASE_URL || ''
  const supabaseKey = env.SUPABASE_KEY || ''

  return {
    plugins: [react(), cronApiPlugin()],
    server: {
      fs: {
        allow: ['..']
      },
      watch: {
        ignored: ['!**/agents/workspace/**']
      },
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
