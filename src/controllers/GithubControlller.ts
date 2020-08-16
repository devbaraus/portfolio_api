import { Response, Request, response } from 'express'
import { gitAPI } from '../services/api'
import axios from 'axios'

const { GITHUB_USERNAME } = process.env

interface RepositoryInterface {
  name: string
  description: string
  html_url: string
  clone_url: string
  languages?: []
  read_me?: string
}

class GithubControlller {
  async listAll(req: Request, res: Response) {
    const { per_page = 10, page = 1, sort = 'updated' } = req.query
    try {
      const data = (
        await gitAPI.get(`users/${GITHUB_USERNAME}/repos`, {
          params: {
            per_page,
            sort,
            page,
          },
        })
      ).data

      res.json(data.map((repo: RepositoryInterface) => repo.name))
    } catch (e) {
      console.log(e)
      return res.sendStatus(400)
    }
  }
  async indexAll(req: Request, res: Response) {
    const { per_page = 10, page = 1, sort = 'updated' } = req.query
    try {
      const data = (
        await gitAPI.get(`users/${GITHUB_USERNAME}/repos`, {
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
            (await gitAPI.get(`repos/${GITHUB_USERNAME}/${name}/languages`))
              .data,
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
        await gitAPI.get(`repos/${GITHUB_USERNAME}/${name}`)
      ).data

      const languages = Object.keys(
        (await gitAPI.get(`repos/${GITHUB_USERNAME}/${name}/languages`)).data,
      )

      axios
        .get(
          `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${name}/master/README.md`,
        )
        .then((response) => {
          return res.json({
            name,
            html_url,
            description,
            clone_url,
            languages,
            read_me: response.data,
          } as RepositoryInterface)
        })
        .catch((e) => {
          return res.json({
            name,
            html_url,
            description,
            clone_url,
            languages,
            read_me: '',
          } as RepositoryInterface)
        })
    } catch (e) {
      console.log(e)
      return res.sendStatus(400)
    }
  }
}

export default GithubControlller
