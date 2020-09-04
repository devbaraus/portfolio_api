import { Request, Response } from 'express'
import { gitAPI } from '../services/api'
import axios from 'axios'
// @ts-ignore
import _ from 'lodash'
import Singleton from '../database/TempDatabase'
import StorageController from './StorageController'

const { GITHUB_USERNAME } = process.env

export interface RepositoryInterface {
  name: string
  description: string
  stargazers: number
  url: string
  clone_url: string
  languages?: []
  topics?: []
  size?: number
  read_me?: string
}

class GithubControlller {
  static async init() {
    if (new Singleton().getInstance().repos.length == 0) {
      console.log('----- SEARCHING REPOS -----')
      await StorageController.storeRepos()
      console.log('----- FINISHED REPOS -----')
    }

    return new GithubControlller()
  }

  static async getOneRepo(name: string) {
    const { html_url, description, clone_url, stargazers_count, size } = (
      await gitAPI.get(`repos/${GITHUB_USERNAME}/${name}`)
    ).data

    const languages = Object.keys(
      (await gitAPI.get(`repos/${GITHUB_USERNAME}/${name}/languages`)).data,
    )

    const topics = (
      await gitAPI.get(`repos/${GITHUB_USERNAME}/${name}/topics`, {
        headers: {
          Accept: 'application/vnd.github.mercy-preview+json',
        },
      })
    ).data.names

    const read_me = (
      await axios.get(
        `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${name}/master/README.md`,
      )
    ).data

    return {
      name,
      url: html_url,
      stargazers: stargazers_count,
      description,
      clone_url,
      languages,
      topics,
      size,
      read_me,
    } as RepositoryInterface
  }

  async suggestRepos(req: Request, res: Response) {
    const q = req.query
    try {
      const data = new Singleton().getInstance().getAllRepos()

      const filter = data.filter((item: any) => item.name != q.name)

      const shuffle = _.shuffle(filter).slice(
        0,
        Number(q.suggestions) || 2,
      ) as RepositoryInterface[]

      return res.json(shuffle)
    } catch (e) {
      console.log(e)
      return res.status(400).json({ error: e.message })
    }
  }

  async indexAllRepos(req: Request, res: Response) {
    try {
      const repos = new Singleton().getInstance().getAllRepos()
      res.json(repos)
    } catch (e) {
      return res.status(400).json({ error: e.message })
    }
  }

  async indexRepo(req: Request, res: Response) {
    const { name } = req.params
    try {
      return res.json(new Singleton().getInstance().getRepo(name))
    } catch (e) {
      console.log(e)
      return res.status(400).json({ error: e.message })
    }
  }
}

export default GithubControlller
