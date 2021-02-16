import TempDatabase from '../database/TempDatabase'
import { devtoAPI, gitAPI, trelloAPI } from '../services/api'
import TrelloController from './TrelloController'
import DevtoController from './DevtoController'
import GithubControlller from './GithubControlller'

const singleton = new TempDatabase().getInstance()

const { GITHUB_USERNAME } = process.env

const [projectsID, sideID] = [
  '5f38107078c1558e6e2decc2',
  '5f38107732299f746fe544e7',
]

class StorageController {
  static async storeProjects() {
    const projects = await (await trelloAPI.get(`lists/${projectsID}/cards`))
      .data

    for (let index in projects) {
      let { id } = projects[index]
      singleton.projects.push(await TrelloController.getOneProject(id))
    }
  }

  static async storeSides() {
    const sides = await (await trelloAPI.get(`lists/${sideID}/cards`)).data

    for (let index in sides) {
      let { id } = sides[index]
      singleton.sides.push(await TrelloController.getOneProject(id))
    }
  }

  static async storeArticles() {
    const data = (await devtoAPI.get('articles/me/published')).data

    for (let index in data) {
      let { id } = data[index]
      singleton.articles.push(await DevtoController.getOneArticle(id))
    }
  }

  static async storeRepos() {
    const data = (
      await gitAPI.get(`users/${GITHUB_USERNAME}/repos`, {
        params: {
          sort: 'updated',
        },
      })
    ).data

    for (let index in data) {
      let { name } = data[index]
      singleton.repos.push(await GithubControlller.getOneRepo(name))
    }
  }
}

export default StorageController
