import { Response, Request } from 'express'
import { gitAPI } from '../services/api'
import axios from 'axios'

interface RepositoryInterface {
  name: string
  description: string
  html_url: string
  clone_url: string
  languages?: []
  read_me?: string
}

class GithubControlller {
  async indexAll(req: Request, res: Response) {
    const { per_page = 10, page = 1, sort = 'updated' } = req.query
    try {
      const data = (
        await gitAPI.get('users/devbaraus/repos', {
          params: {
            per_page,
            sort,
            page,
          },
        })
      ).data

      let repos: RepositoryInterface[] = []

      for (let index in data) {
        let { name, html_url, description, clone_url } = data[index]
        repos.push({
          name,
          description,
          html_url,
          clone_url,
          languages: Object.keys(
            (await gitAPI.get(`repos/devbaraus/${name}/languages`)).data,
          ),
        } as RepositoryInterface)
      }
      res.json(repos)
    } catch (e) {
      console.log(e)
      return res.sendStatus(400)
    }
  }
  async index(req: Request, res: Response) {
    const { name } = req.params
    try {
      const { html_url, description, clone_url } = (
        await gitAPI.get(`repos/devbaraus/${name}`)
      ).data

      const languages = Object.keys(
        (await gitAPI.get(`repos/devbaraus/${name}/languages`)).data,
      )

      const read_me = (
        await axios.get(
          `https://raw.githubusercontent.com/devbaraus/${name}/master/README.md`,
        )
      ).data

      res.json({
        name,
        html_url,
        description,
        clone_url,
        languages,
        read_me,
      } as RepositoryInterface)
    } catch (e) {
      return res.sendStatus(400)
    }
  }
}

export default GithubControlller
