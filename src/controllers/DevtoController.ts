import { Request, Response } from 'express'
import { devtoAPI } from '../services/api'
// @ts-ignore
import _ from 'lodash'

devtoAPI.defaults.headers['api-key'] = process.env.DEVTO_TOKEN

export default class MediumController {
  async indexAllArticles(req: Request, res: Response) {
    const q = req.query
    try {
      let data = (await devtoAPI.get('articles/me/published')).data

      const total = data.length

      data = data.splice(Number(q.page), Number(q.per_page) || 6)

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

      return res.json({ total, articles })
    } catch (e) {
      console.log(e)
      return res.status(400).json({ error: e.message })
    }
  }

  async indexArticle(req: Request, res: Response) {
    const { id } = req.params
    try {
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

      res.json({
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
      })
    } catch (e) {
      console.log(e)
      return res.status(400).json({ error: e.message })
    }
  }

  async suggestArticles(req: Request, res: Response) {
    const q = req.query
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

      return res.json(articles)
    } catch (e) {
      console.log(e)
      return res.status(400).json({ error: e.message })
    }
  }
}
