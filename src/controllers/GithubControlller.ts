import { Request, Response } from 'express'
import { gitAPI } from '../services/api'
import axios from 'axios'
// @ts-ignore
import _ from 'lodash'

const { GITHUB_USERNAME } = process.env

interface RepositoryInterface {
  name: string
  description: string
  stargazers: number
  url: string
  clone_url: string
  languages?: []
  size?: number
  read_me?: string
}

class GithubControlller {
  async suggestRepos(req: Request, res: Response) {
    const q = req.query
    try {
      const data = (
        await gitAPI.get(`users/${GITHUB_USERNAME}/repos`, {
          params: {
            sort: q.sort || 'updated',
            page: q.page || 1,
            per_page: q.per_page || 6,
          },
        })
      ).data

      const filter = data.filter((item: any) => item.name !== q.name)

      const shuffle = _.shuffle(filter).slice(0, Number(q.suggestions) || 2)

      let repos: RepositoryInterface[] = []

      for (let index in shuffle) {
        let { name, html_url, description, clone_url } = shuffle[index]
        repos.push({
          name,
          description,
          url: html_url,
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
      return res.status(400).json({ error: e.message })
    }
  }

  async indexAllRepos(req: Request, res: Response) {
    const q = req.query
    try {
      let data = (
        await gitAPI.get(`users/${GITHUB_USERNAME}/repos`, {
          params: {
            sort: q.sort || 'updated',
          },
        })
      ).data

      const total = data.length

      data = data.splice(Number(q.page), Number(q.per_page) || 6)

      let repos: RepositoryInterface[] = []

      for (let index in data) {
        let { name, html_url, description, clone_url } = data[index]
        repos.push({
          name,
          description,
          url: html_url,
          clone_url,
          languages: Object.keys(
            (await gitAPI.get(`repos/${GITHUB_USERNAME}/${name}/languages`))
              .data,
          ),
        } as RepositoryInterface)
      }
      res.json({ total, repos })
    } catch (e) {
      return res.status(400).json({ error: e.message })
    }
  }

  async indexRepo(req: Request, res: Response) {
    const { name } = req.params

    try {
      const { html_url, description, clone_url, stargazers_count, size } = (
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
            url: html_url,
            stargazers: stargazers_count,
            description,
            clone_url,
            languages,
            size,
            read_me: response.data,
          } as RepositoryInterface)
        })
    } catch (e) {
      console.log(e)
      return res.status(400).json({ error: e.message })
    }
  }
}

export default GithubControlller
