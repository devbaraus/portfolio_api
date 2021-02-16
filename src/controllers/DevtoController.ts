import { FastifyReply, FastifyRequest } from 'fastify'
import { devtoAPI } from '../services/api'
// @ts-ignore
import _ from 'lodash'
import Singleton from '../database/TempDatabase'
import StorageController from './StorageController'

devtoAPI.defaults.headers['api-key'] = process.env.DEVTO_TOKEN

export default class DevtoController {
  static async init() {
    if (new Singleton().getInstance().articles.length == 0) {
      console.log('----- SEARCHING ARTICLES -----')
      await StorageController.storeArticles()
      console.log('----- FINISHED ARTICLES -----')
    }

    return new DevtoController()
  }

  static async getOneArticle(id: string): Promise<ArticleInterface> {
    const {
      title,
      description,
      published_at,
      cover_image,
      tags,
      url,
      public_reactions_count,
      edited_at,
      body_markdown,
    } = (await devtoAPI.get(`articles/${id}`)).data

    return {
      id,
      title,
      description,
      published_at,
      reactions: public_reactions_count,
      cover: cover_image,
      tags,
      url,
      edited_at,
      content: body_markdown,
    } as ArticleInterface
  }

  async indexAllArticles(req: FastifyRequest, res: FastifyReply) {
    try {
      let data = (await devtoAPI.get('articles/me/published')).data

      let articles = data.map((article: any) => {
        const {
          title,
          id,
          description,
          published_at,
          cover_image,
          tag_list,
          url,
        } = article
        return {
          id,
          title,
          description,
          published_at,
          cover: cover_image,
          tags: tag_list,
          url,
        }
      })

      return res.code(200).send({ data: articles, status: 200 })
    } catch (e) {
      return res.code(400).send({ error: e.message, status: 400 })
    }
  }

  async indexArticle(req: FastifyRequest, res: FastifyReply) {
    const { id } = req.params as pingParamsDevto
    try {
      return res.code(200).send({ data: await DevtoController.getOneArticle(id), status: 200 })
    } catch (e) {
      return res.code(400).send({ error: e.message, status: 400 })
    }
  }

  async suggestArticles(req: FastifyRequest, res: FastifyReply) {
    const q = req.query as pingQueryDevto
    try {
      const data = (await devtoAPI.get('articles/me/published')).data

      const filter = data.filter(
        (item: any) => Number(item.id) !== Number(q.id),
      )

      const shuffle = _.shuffle(filter).slice(0, Number(q.suggestions) || 2)

      let articles = shuffle.map((article: any) => {
        const {
          title,
          id,
          description,
          published_at,
          cover_image,
          tag_list,
          url,
        } = article
        return {
          id,
          title,
          description,
          published_at,
          cover: cover_image,
          tags: tag_list,
          url,
        }
      })

      return res.code(200).send({ data: articles, status: 200 })
    } catch (e) {
      return res.code(400).send({ error: e.message, status: 400 })
    }
  }
}

export interface ArticleInterface {
  title: string
  description: string
  published_at: string
  tags: Array<any>
  url: string
  edited_at: string
  id: string
  reactions: number
  cover: string
  content: string
}

export interface pingParamsDevto {
  id: string
}

export interface pingQueryDevto {
  suggestions?: number
  id?: string
}