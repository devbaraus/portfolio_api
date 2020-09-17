import { Request, Response } from 'express'
import { trelloAPI } from '../services/api'
// @ts-ignore
import _ from 'lodash'
import GithubControlller from './GithubControlller'
import Singleton from '../database/TempDatabase'
import StorageController from './StorageController'
import { getTextFromMarkdown } from '../services/markdown'

export interface ProjectInterface {
  id: string
  name: string
  url: string
  labels: string
  cover: string
  logo: string
  images?: Array<any>
  contents?: Array<any>
  content: string
  description: string
}

const [projectsID, sideID] = [
  '5f38107078c1558e6e2decc2',
  '5f38107732299f746fe544e7',
]

class TrelloController {
  static async init() {
    if (
      new Singleton().getInstance().projects.length == 0 ||
      new Singleton().getInstance().sides.length == 0
    ) {
      console.log('----- SEARCHING PROJECTS -----')
      await StorageController.storeProjects()
      console.log('----- FINISHED PROJECTS -----')
      console.log('----- SEARCHING SIDES -----')
      await StorageController.storeSides()
      console.log('----- FINISHED SIDES -----')
    }
    return new TrelloController()
  }

  static async getOneProject(id: string): Promise<ProjectInterface> {
    let { name, labels, desc } = await (await trelloAPI.get(`cards/${id}`)).data

    labels = labels.map((label: { name: string }) => label.name)

    let attachments = (await trelloAPI.get(`cards/${id}/attachments`)).data

    let cover = ''

    let url = ''

    let logo = ''

    let images: Array<any> = []

    let contents: Array<any> = []

    let description = _.truncate(getTextFromMarkdown(desc), { length: 120 })

    attachments.map((attach: { previews: []; name: string; url: string }) => {
      if (attach.name === 'url') {
        url = attach.url
        return
      }

      if (attach.name.startsWith('content:')) {
        contents.push({
          name: attach.name.replace('content:', ''),
          url: attach.url,
        })
        return
      }
      if (attach.name === 'logo') {
        logo = attach.url
        return
      }

      if (attach.name === 'cover') {
        cover = attach.url
        return
      }

      images.push({
        name: attach.name,
        url: attach.url,
      })

      return
    })

    return {
      id,
      name,
      cover,
      labels,
      logo,
      images,
      url,
      contents,
      content: desc,
      description,
    }
  }

  async indexAllProjects(req: Request, res: Response) {
    try {
      res.json(new Singleton().getInstance().getAllProjects())
    } catch (e) {
      console.log(e)
      return res.status(400).json({ error: e.message })
    }
  }

  async indexAllSides(req: Request, res: Response) {
    try {
      res.json(new Singleton().getInstance().getAllSides())
    } catch (e) {
      console.log(e)
      return res.status(400).json({ error: e.message })
    }
  }

  async indexProject(req: Request, res: Response) {
    const { id } = req.params
    try {
      res.json(new Singleton().getInstance().getProject(id))
    } catch (e) {
      console.log(e)
      return res.status(400).json({ error: e.message })
    }
  }

  async indexSide(req: Request, res: Response) {
    const { id } = req.params
    try {
      res.json(new Singleton().getInstance().getSide(id))
    } catch (e) {
      console.log(e)
      return res.status(400).json({ error: e.message })
    }
  }

  async suggestProjects(req: Request, res: Response) {
    const q = req.query
    try {
      const data = new Singleton().getInstance().getAllProjects()

      const filter = data.filter((item: any) => item.id !== q.id)

      const shuffle = _.shuffle(filter).slice(0, Number(q.suggestions) || 2)

      res.json(shuffle)
    } catch (e) {
      console.log(e)
      return res.status(400).json({ error: e.message })
    }
  }

  async suggestSides(req: Request, res: Response) {
    const q = req.query
    try {
      const data = new Singleton().getInstance().getAllSides()

      const filter = data.filter((item: any) => item.id !== q.id)

      const shuffle = _.shuffle(filter).slice(0, Number(q.suggestions) || 2)

      res.json(shuffle)
    } catch (e) {
      console.log(e)
      return res.status(400).json({ error: e.message })
    }
  }
}

export default TrelloController
