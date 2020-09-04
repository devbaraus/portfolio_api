import { ProjectInterface } from '../controllers/TrelloController'
import { ArticleInterface } from '../controllers/DevtoController'
import { RepositoryInterface } from '../controllers/GithubControlller'

class TempDatabase {
  repos: RepositoryInterface[] = []
  sides: ProjectInterface[] = []
  articles: ArticleInterface[] = []
  projects: ProjectInterface[] = []

  getSide(id: string) {
    for (let item in this.sides) {
      if (this.sides[item].id === id) {
        return this.sides[item]
      }
    }
  }

  getAllSides() {
    return this.sides.map((item) => {
      let { id, name, url, cover, labels } = item
      return {
        id,
        name,
        url,
        labels,
        cover,
      }
    })
  }

  getProject(id: string) {
    for (let item in this.projects) {
      if (this.projects[item].id === id) {
        return this.projects[item]
      }
    }
  }

  getAllProjects() {
    return this.projects.map((item) => {
      let { id, name, url, cover, labels } = item
      return {
        id,
        name,
        url,
        labels,
        cover,
      }
    })
  }

  getRepo(name: string) {
    for (let item in this.repos) {
      if (this.repos[item].name == name) {
        return this.repos[item]
      }
    }
  }

  getAllRepos() {
    return this.repos.map((item) => {
      let { name, description, url, clone_url, languages, topics } = item
      return {
        name,
        description,
        url,
        clone_url,
        languages,
        topics,
      }
    })
  }
}

class Singleton {
  private static instance: TempDatabase

  constructor() {
    if (!Singleton.instance) {
      Singleton.instance = new TempDatabase()
    }
  }

  getInstance() {
    return Singleton.instance
  }
}

export default Singleton
