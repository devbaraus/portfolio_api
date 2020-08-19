import { Request, Response } from 'express'
import { devtoAPI } from '../services/api'

devtoAPI.defaults.headers['api-key'] = process.env.DEVTO_TOKEN

export default class MediumController {
  async indexAllArticles(req: Request, res: Response) {
    const { page, per_page } = req.query
    try {
      const data = (
        await devtoAPI.get('articles/me/published', {
          params: {
            page,
            per_page,
          },
        })
      ).data
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

      return res.json(articles)
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
  // async listAllArticles(req: Request, res: Response) {
  //   const q = req.query
  //   try {
  //     const data = (await trelloAPI.get(`lists/${blogID}/cards`)).data.splice(
  //       Number(q.page) * 10,
  //       10,
  //     )
  //
  //     res.json(data.map((side: ProjectInterface) => side.id))
  //   } catch (e) {
  //     console.log(e)
  //     return res.status(400).json({ error: e.message })
  //   }
  // }
}
