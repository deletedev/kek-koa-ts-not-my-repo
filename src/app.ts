// env
import * as dotenv from 'dotenv'
dotenv.config({ path: `${__dirname}/../.env` })

// Global
global.rootPath = __dirname

// Dependencies
import 'reflect-metadata' // types features
import './models' // mongo
import * as Koa from 'koa'
import * as Router from 'koa-router'
import * as cors from '@koa/cors'
import { loadControllers } from 'koa-router-ts'
import bodyParser from 'koa-bodyparser-ts'

const app = new Koa()

app.use(cors({ origin: '*' }))
app.use(bodyParser())

// API route
const api = new Router()
const apiRoutes = loadControllers(`${__dirname}/controllers`, {
  recurse: true,
})
api.use('/api', apiRoutes.routes(), apiRoutes.allowedMethods())
app.use(api.routes())
app.use(api.allowedMethods())

// Start server
app.listen(Number(process.env.PORT))
