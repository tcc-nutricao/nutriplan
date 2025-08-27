import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import cookieParser from 'cookie-parser'

const app = express()
const port = process.env.PORT || 4000

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(cors({ credentials: true, origin: process.env.CORS }))

const routesPath = path.join(process.cwd(), 'src', 'routes')

fs.readdirSync(routesPath).forEach(async (file) => {
  if (file.endsWith('Route.js')) {
    const routeModule = await import(`./routes/${file}`)
    const route = routeModule.default || routeModule
    if (typeof route === 'function') {
      route(app)
    } else {
      console.warn(`O módulo ${file} não exporta uma função padrão`)
    }
  }
})

app.get('/', (req, res) => res.send('API rodando!'))

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`)
})
