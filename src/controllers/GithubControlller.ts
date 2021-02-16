import { FastifyReply, FastifyRequest } from 'fastify'
import { gitAPI } from '../services/api'
import Singleton from '../database/TempDatabase'
import StorageController from './StorageController'
import axios from 'axios'
// @ts-ignore
import _ from 'lodash'


const { GITHUB_USERNAME } = process.env


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
    const { html_url, description, clone_url, stargazers_count, size, updated_at } = (
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
      updated_at,
    } as RepositoryInterface
  }

  async suggestRepos(req: FastifyRequest, res: FastifyReply) {
    const q = req.query as pingQueryGitHub
    try {
      const data = new Singleton().getInstance().getAllRepos()

      const filter = data.filter((item: any) => item.name != q.name)

      const shuffle = _.shuffle(filter).slice(
        0,
        Number(q.suggestions) || 2,
      ) as RepositoryInterface[]

      return res.code(200).send({ data: shuffle, status: 200 })
    } catch (e) {
      return res.code(400).send({ error: e.message, status: 400 })
    }
  }

  async indexAllRepos(req: FastifyRequest, res: FastifyReply) {
    try {
      const repos = new Singleton().getInstance().getAllRepos()

      // @ts-ignore
      const sortedRepos = repos.sort((a: RepositoryInterface, b: RepositoryInterface) => {
        if (a['updated_at'] > b['updated_at']) {
          return -1
        }
        if (a['updated_at'] < b['updated_at']) {
          return 1
        }
        return 0
      })

      return res.code(200).send({ data: sortedRepos, status: 200 })
    } catch (e) {
      return res.code(400).send({ error: e.message, status: 400 })
    }
  }

  async indexRepo(req: FastifyRequest, res: FastifyReply) {
    const { name } = req.params as pingParamsGitHub
    try {
      let repo = new Singleton().getInstance().getRepo(name)

      return res.code(200).send({ data: repo, status: 200 })
    } catch (e) {
      return res.status(400).send({ error: e.message, status: 400 })
    }
  }
}

export default GithubControlller

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
  updated_at: string
}

export interface pingParamsGitHub {
  name: string
}

export interface pingQueryGitHub {
  suggestions?: number
  name?: string
}