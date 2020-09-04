import express, { Request, Response } from 'express'
import morgan from 'morgan'
import cors from 'cors'
import helmet from 'helmet'
import GithubControlller from './controllers/GithubControlller'
import TrellosController from './controllers/TrelloController'
import DevtoController from './controllers/DevtoController'
import StorageController from './controllers/StorageController'
;(async () => {
  const githubControlller = await GithubControlller.init()
  const devtoController = await DevtoController.init()
  const trelloController = await TrellosController.init()

  const app = express()

  app.use(cors())
  app.use(morgan('tiny'))
  app.use(helmet())

  // TrellosController.getBoardList().then((r) => {})

  app
    .get('/repos/', githubControlller.indexAllRepos)
    .get('/sides/', trelloController.indexAllSides)
    .get('/projects/', trelloController.indexAllProjects)
    .get('/articles/', devtoController.indexAllArticles)

    .get('/repos/:name', githubControlller.indexRepo)
    .get('/sides/:id', trelloController.indexSide)
    .get('/projects/:id', trelloController.indexProject)
    .get('/articles/:id', devtoController.indexArticle)

    .get('/suggest/articles', devtoController.suggestArticles)
    .get('/suggest/projects', trelloController.suggestProjects)
    .get('/suggest/sides', trelloController.suggestSides)
    .get('/suggest/repos', githubControlller.suggestRepos)

  app.listen(process.env.PORT || 3333, () => {
    console.log(`Server running at ${process.env.PORT || 3333}`)
  })
})()
