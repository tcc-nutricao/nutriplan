import express, { Router } from 'express'
import cors from 'cors'
import 'dotenv/config'

import UserRoute from './routes/UserRoute.js'
import AuthRoute from './routes/AuthRoute.js'

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cors({ credentials: true, origin: process.env.CORS }))

const router = Router() 
app.use(router)

UserRoute(router) 
AuthRoute(router)

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`)
})
