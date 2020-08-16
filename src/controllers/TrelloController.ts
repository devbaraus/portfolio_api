import { Request, Response } from 'express'
import { trelloAPI } from '../services/api'

interface ProjectInterface {
  id: string
  name: string
  url: string
  labels: string
  cover: string
}

const [blogID, projectsID, sideID] = [
  '5f36d228f32d450cbf3cbaf9',
  '5f38107078c1558e6e2decc2',
  '5f38107732299f746fe544e7',
]

class TrelloController {
  static async getList(arr: Array<any>) {
    let projects: ProjectInterface[] = []

    for (let index in arr) {
      let { id, name, shortUrl, labels, cover } = arr[index]

      labels = labels.map((label: { name: string }) => label.name)

      let k = { w: 10000, url: 'dawdw' }
      let attachment = (
        await trelloAPI.get(`cards/${id}/attachments/${cover.idAttachment}`)
      ).data

      attachment.previews.map((i: { width: number; url: string }) => {
        if (i.width < k.w && i.width > 300) k = { w: i.width, url: i.url }
        return i
      })

      projects.push({
        id,
        name,
        url: shortUrl,
        labels,
        cover: k.url,
      })
    }
    return projects
  }
  async listAllArticles(req: Request, res: Response) {
    const q = req.query
    try {
      const data = (await trelloAPI.get(`lists/${blogID}/cards`)).data.splice(
        Number(q.page) * 10,
        10,
      )

      res.json(data.map((side: ProjectInterface) => side.id))
    } catch (e) {
      console.log(e)
      return res.sendStatus(400)
    }
  }
  async indexAllArticles(req: Request, res: Response) {
    const q = req.query

    try {
      const data = (await trelloAPI.get(`lists/${blogID}/cards`)).data.splice(
        Number(q.page) * 10,
        10,
      )

      const articles = await TrelloController.getList(data)

      res.json(articles)
    } catch (e) {
      console.log(e)
      res.sendStatus(400)
    }
  }
  async indexArticle(req: Request, res: Response) {
    try {
    } catch (e) {
      console.log(e)
      res.sendStatus(400)
    }
  }
  async listAllProjects(req: Request, res: Response) {
    const q = req.query
    try {
      const data = (
        await trelloAPI.get(`lists/${projectsID}/cards`)
      ).data.splice(Number(q.page) * 10, 10)

      res.json(data.map((side: ProjectInterface) => side.id))
    } catch (e) {
      console.log(e)
      return res.sendStatus(400)
    }
  }
  async indexAllProjects(req: Request, res: Response) {
    const q = req.query
    try {
      const data = (
        await trelloAPI.get(`lists/${projectsID}/cards`)
      ).data.splice(Number(q.page) * 10, 10)

      const projects = await TrelloController.getList(data)

      res.json(projects)
    } catch (e) {
      console.log(e)
      return res.sendStatus(400)
    }
  }
  async indexProject(req: Request, res: Response) {
    const { id } = req.params
    try {
    } catch (e) {
      return res.sendStatus(400)
    }
  }
  async listAllSides(req: Request, res: Response) {
    const q = req.query
    try {
      const data = (await trelloAPI.get(`lists/${sideID}/cards`)).data.splice(
        Number(q.page) * 10,
        10,
      )

      res.json(data.map((side: ProjectInterface) => side.id))
    } catch (e) {
      console.log(e)
      return res.sendStatus(400)
    }
  }
  async indexAllSides(req: Request, res: Response) {
    const q = req.query
    try {
      const data = (await trelloAPI.get(`lists/${sideID}/cards`)).data.splice(
        Number(q.page) * 10,
        10,
      )

      const sides = await TrelloController.getList(data)

      res.json(sides)
    } catch (e) {
      console.log(e)
      return res.sendStatus(400)
    }
  }
  async indexSide(req: Request, res: Response) {
    const { id } = req.params
    try {
    } catch (e) {
      return res.sendStatus(400)
    }
  }
}

export default TrelloController
