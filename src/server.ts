import express, { Request, Response } from 'express'
import morgan from 'morgan'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'
import GithubControlller from './controllers/GithubControlller'
import TrellosController from './controllers/TrelloController'

const githubControlller = new GithubControlller()
const trelloController = new TrellosController()

dotenv.config()

const app = express()

app.use(cors())
app.use(morgan('tiny'))
app.use(helmet())

app
  .get('/repos/', githubControlller.indexAll)
  .get('/repos/:name', githubControlller.index)
  .get('/articles/', trelloController.indexAllArticles)
  .get('/articles/:id', trelloController.indexArticle)
  .get('/projects/', trelloController.indexAllProject)
  .get('/projects/:id', trelloController.indexProject)
  .get('/sides/', trelloController.indexAllSide)
  .get('/sides/:id', trelloController.indeSide)

app.listen(process.env.PORT, () => {
  console.log(`Server running at ${process.env.PORT}`)
})
