import { FastifyReply, FastifyRequest } from 'fastify'
import { trelloAPI } from '../services/api'
// @ts-ignore
import _ from 'lodash'
import Singleton from '../database/TempDatabase'
import StorageController from './StorageController'
import { getTextFromMarkdown } from '../services/markdown'

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

  async indexAllProjects(req: FastifyRequest, res: FastifyReply) {
    try {
      return res.code(200).send({ data: new Singleton().getInstance().getAllProjects(), status: 200 })
    } catch (e) {
      return res.code(400).send({ error: e.message, status: 400 })
    }
  }

  async indexAllSides(req: FastifyRequest, res: FastifyReply) {
    try {
      return res.code(200).send({ data: new Singleton().getInstance().getAllSides(), status: 200 })
    } catch (e) {
      return res.code(400).send({ error: e.message, status: 400 })
    }
  }

  async indexProject(req: FastifyRequest, res: FastifyReply) {
    const { id } = req.params as pingParamsTrello
    try {
      return res.code(200).send({ data: new Singleton().getInstance().getProject(id), status: 200 })
    } catch (e) {
      return res.code(400).send({ error: e.message, status: 400 })
    }
  }

  async indexSide(req: FastifyRequest, res: FastifyReply) {
    const { id } = req.params as pingParamsTrello
    try {
      return res.code(200).send({ data: new Singleton().getInstance().getSide(id), status: 200 })
    } catch (e) {
      return res.code(400).send({ error: e.message, status: 400 })
    }
  }

  async suggestProjects(req: FastifyRequest, res: FastifyReply) {
    const q = req.query as pingQueryTrello
    try {
      const data = new Singleton().getInstance().getAllProjects()

      const filter = data.filter((item: any) => item.id !== q.id)

      const shuffle = _.shuffle(filter).slice(0, Number(q.suggestions) || 2)

      return res.code(200).send({ data: shuffle, status: 200 })
    } catch (e) {
      return res.code(400).send({ error: e.message, status: 400 })
    }
  }

  async suggestSides(req: FastifyRequest, res: FastifyReply) {
    const q = req.query as pingQueryTrello
    try {
      const data = new Singleton().getInstance().getAllSides()

      const filter = data.filter((item: any) => item.id !== q.id)

      const shuffle = _.shuffle(filter).slice(0, Number(q.suggestions) || 2)

      return res.code(200).send({ data: shuffle, status: 200 })
    } catch (e) {
      return res.code(400).send({ error: e.message, status: 400 })
    }
  }
}

export default TrelloController

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

export interface pingParamsTrello {
  id: string
}

export interface pingQueryTrello {
  suggestions?: number
  id?: string
}


