import express, { Request, Response } from 'express'
import morgan from 'morgan'
import cors from 'cors'
import helmet from 'helmet'
import GithubControlller from './controllers/GithubControlller'
import TrellosController from './controllers/TrelloController'

const githubControlller = new GithubControlller()
const trelloController = new TrellosController()

const app = express()

app.use(cors())
app.use(morgan('tiny'))
app.use(helmet())

app
  .get('/repos/', githubControlller.indexAll)
  .get('/list/repos', githubControlller.listAll)
  .get('/repos/:name', githubControlller.index)
  .get('/articles/', trelloController.indexAllArticles)
  .get('/list/articles', trelloController.listAllArticles)
  .get('/articles/:id', trelloController.indexArticle)
  .get('/projects/', trelloController.indexAllProjects)
  .get('/list/projects', trelloController.listAllProjects)
  .get('/projects/:id', trelloController.indexProject)
  .get('/sides/', trelloController.indexAllSides)
  .get('/list/sides', trelloController.indexAllSides)
  .get('/sides/:id', trelloController.indexSide)

app.listen(process.env.PORT || 3333, () => {
  console.log(`Server running at ${process.env.PORT || 3333}`)
})
