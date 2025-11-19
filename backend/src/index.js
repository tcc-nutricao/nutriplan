import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import cookieParser from 'cookie-parser'

const app = express()
const port = process.env.PORT || 4000

app.use(express.json({ limit: '3mb' }))
app.use(cookieParser())
app.use(express.urlencoded({ limit: '3mb', extended: true }))
app.use(cors({ 
  credentials: true, 
  origin: [
    process.env.CORS, 
    'http://localhost:3000', 
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001'
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}))

const routesPath = path.join(process.cwd(), 'src', 'routes')

fs.readdirSync(routesPath).forEach(async (file) => {
  if (file.endsWith('Route.js') && file !== 'Route.js') {
    try {
      const routeModule = await import(`./routes/${file}`)
      const route = routeModule.default || routeModule
      if (typeof route === 'function') {
        route(app)
        console.log(`✓ Rota ${file} carregada com sucesso`)
      } else {
        console.warn(`⚠ O módulo ${file} não exporta uma função padrão`)
      }
    } catch (error) {
      console.error(`✗ Erro ao carregar a rota ${file}:`, error.message)
    }
  }
})

app.get('/', (req, res) => res.send('API rodando!'))

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`)
})

// Error handling global
process.on('uncaughtException', (error) => {
  console.error('Erro não capturado:', error)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('Promise rejeitada não tratada:', reason)
})
