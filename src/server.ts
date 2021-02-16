import fastify, { FastifyInstance, RouteShorthandOptions } from 'fastify'
import { IncomingMessage, Server, ServerResponse } from 'http'

import GithubControlller, { pingParamsGitHub, pingQueryGitHub } from './controllers/GithubControlller'
import DevtoController, { pingParamsDevto, pingQueryDevto } from './controllers/DevtoController'
import TrelloController, { pingParamsTrello, pingQueryTrello } from './controllers/TrelloController'

(async () => {
  const githubControlller = await GithubControlller.init()
  const devtoController = await DevtoController.init()
  const trelloController = await TrelloController.init()

  const server: FastifyInstance<Server, IncomingMessage, ServerResponse> = fastify({ logger: process.env['NODE_ENV'] != 'production' })

  const optsArray: RouteShorthandOptions = {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
            },
            status: {
              type: 'number',
            },
          },
        },
        400: {
          type: 'object',
          properties: {
            status: {
              type: 'number',
            },
            error: {
              type: 'string',
            },
          },
        },
      },
    },
  }

  const optsObject: RouteShorthandOptions = {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              additionalProperties: true,
            },
            status: {
              type: 'number',
            },
          },
        },
        400: {
          type: 'object',
          properties: {
            status: {
              type: 'number',
            },
            error: {
              type: 'string',
            },
          },
        },
      },
    },
  }


  server
    // ALL
    .get<{
      Query: pingQueryGitHub,
      Params: pingParamsGitHub
    }>('/repos', optsArray, githubControlller.indexAllRepos)
    .get<{
      Query: pingQueryTrello,
      Params: pingParamsTrello
    }>('/sides', optsArray, trelloController.indexAllSides)
    .get<{
      Query: pingQueryTrello,
      Params: pingParamsTrello
    }>('/projects', optsArray, trelloController.indexAllProjects)
    .get<{
      Query: pingQueryDevto,
      Params: pingParamsDevto
    }>('/articles', optsArray, devtoController.indexAllArticles)

    // ONE
    .get<{
      Query: pingQueryGitHub,
      Params: pingParamsGitHub
    }>('/repos/:name', optsObject, githubControlller.indexRepo)
    .get<{
      Query: pingQueryTrello,
      Params: pingParamsTrello
    }>('/sides/:id', optsObject, trelloController.indexSide)
    .get<{
      Query: pingQueryTrello,
      Params: pingParamsTrello
    }>('/projects/:id', optsObject, trelloController.indexProject)
    .get<{
      Query: pingQueryDevto,
      Params: pingParamsDevto
    }>('/articles/:id', optsObject, devtoController.indexArticle)

    // SUGGESTIONS
    .get<{
      Query: pingQueryDevto,
      Params: pingParamsDevto
    }>('/suggest/articles', devtoController.suggestArticles)
    .get<{
      Query: pingQueryTrello,
      Params: pingParamsTrello
    }>('/suggest/projects', trelloController.suggestProjects)
    .get<{
      Query: pingQueryTrello,
      Params: pingParamsTrello
    }>('/suggest/sides', trelloController.suggestSides)
    .get<{
      Query: pingQueryGitHub,
      Params: pingParamsGitHub
    }>('/suggest/repos', optsArray, githubControlller.suggestRepos)

  server.listen(process.env.PORT || 3333, (err, address) => {
    if (err) {
      console.error(err)
      process.exit(0)
    }
    console.log(`Server listening at ${address}`)
  })
})()
