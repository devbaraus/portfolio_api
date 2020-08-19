import { Request, Response } from 'express'
import { trelloAPI } from '../services/api'
// @ts-ignore
import _ from 'lodash'

const baseCloudinary = 'https://res.cloudinary.com/dmzu6cgre/image/upload/'

interface ProjectInterface {
  id: string
  name: string
  url: string
  labels: string
  cover: string
}

const [projectsID, sideID] = [
  '5f38107078c1558e6e2decc2',
  '5f38107732299f746fe544e7',
]

class TrelloController {
  static async getList(arr: Array<any>) {
    let projects: ProjectInterface[] = []

    for (let index in arr) {
      let { id, name, shortUrl, labels, cover } = arr[index]

      labels = labels.map((label: { name: string }) => label.name)

      let k = { w: 10000, url: '' }
      let attachments = (await trelloAPI.get(`cards/${id}/attachments/`)).data

      attachments.map((attach: { previews: []; name: string }) => {
        if (attach.name === 'cover')
          return attach.previews.map((i: { width: number; url: string }) => {
            if (i.width < k.w && i.width > 300) k = { w: i.width, url: i.url }
            return i
          })
        return
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
      return res.status(400).json({ error: e.message })
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
      return res.status(400).json({ error: e.message })
    }
  }
  async indexProject(req: Request, res: Response) {
    const { id } = req.params
    try {
      let { name, labels, cover, desc } = await (
        await trelloAPI.get(`cards/${id}`)
      ).data

      labels = labels.map((label: { name: string }) => label.name)

      let k = { w: 10000, url: '' }

      cover.scaled.map((i: { width: number; url: string }) => {
        if (i.width < k.w && i.width > 900) k = { w: i.width, url: i.url }
        return i
      })

      let attachments = (await trelloAPI.get(`cards/${id}/attachments`)).data

      let url = ''

      let images: Array<any> = []

      let contents: Array<any> = []

      attachments.map((attach: { previews: []; name: string; url: string }) => {
        if (attach.name === 'url') {
          url = attach.url
          return null
        }

        if (attach.name.startsWith('content:')) {
          contents.push({
            name: attach.name.replace('content:', ''),
            url: attach.url,
          })
          return null
        }

        if (['logo', 'cover'].includes(attach.name)) {
          return null
        }

        if (attach.previews.length > 0) {
          let k = { w: 10000, url: '' }

          attach.previews.map((i: { width: number; url: string }) => {
            if (i.width < k.w && i.width > 300) k = { w: i.width, url: i.url }
            return i
          })

          images.push({
            name: attach.name,
            url: k.url,
          })
        } else {
          images.push({
            name: attach.name,
            url: baseCloudinary + attach.url.replace('http://', ''),
          })
        }
      })

      res.json({
        id,
        name,
        cover: k.url,
        labels,
        images,
        url,
        contents,
        description: desc,
      })
    } catch (e) {
      console.log(e)
      return res.status(400).json({ error: e.message })
    }
  }
  async indexSide(req: Request, res: Response) {
    const { id } = req.params
    try {
      let { name, labels, cover, desc } = await (
        await trelloAPI.get(`cards/${id}`)
      ).data

      labels = labels.map((label: { name: string }) => label.name)

      let k = { w: 10000, url: '' }

      cover.scaled.map((i: { width: number; url: string }) => {
        if (i.width < k.w && i.width > 900) k = { w: i.width, url: i.url }
        return i
      })

      let attachments = (await trelloAPI.get(`cards/${id}/attachments`)).data

      let url = ''

      let images: Array<any> = []

      let contents: Array<any> = []

      attachments.map((attach: { previews: []; name: string; url: string }) => {
        if (attach.name === 'url') {
          url = attach.url
          return null
        }

        if (attach.name.startsWith('content:')) {
          contents.push({
            name: attach.name.replace('content:', ''),
            url: attach.url,
          })
          return null
        }

        if (['logo', 'cover'].includes(attach.name)) {
          return null
        }

        if (attach.previews.length > 0) {
          let k = { w: 10000, url: '' }

          attach.previews.map((i: { width: number; url: string }) => {
            if (i.width < k.w && i.width > 300) k = { w: i.width, url: i.url }
            return i
          })

          images.push({
            name: attach.name,
            url: k.url,
          })
        } else {
          images.push({
            name: attach.name,
            url: baseCloudinary + attach.url.replace('http://', ''),
          })
        }
      })

      res.json({
        id,
        name,
        cover: k.url,
        labels,
        images,
        url,
        contents,
        description: desc,
      })
    } catch (e) {
      console.log(e)
      return res.status(400).json({ error: e.message })
    }
  }
  async suggestProjects(req: Request, res: Response) {
    const q = req.query
    try {
      const data = (await trelloAPI.get(`lists/${projectsID}/cards`)).data

      const filter = data.filter((item: any) => item.id !== q.id)

      const shuffle = _.shuffle(filter).slice(0, Number(q.suggestions) || 2)

      const sides = await TrelloController.getList(shuffle)

      res.json(sides)
    } catch (e) {
      console.log(e)
      return res.status(400).json({ error: e.message })
    }
  }
  async suggestSides(req: Request, res: Response) {
    const q = req.query
    try {
      const data = (await trelloAPI.get(`lists/${sideID}/cards`)).data

      const filter = data.filter((item: any) => item.id !== q.id)

      // console.log(data, filter)

      const shuffle = _.shuffle(filter).slice(0, Number(q.suggestions) || 2)

      const sides = await TrelloController.getList(shuffle)

      res.json(sides)
    } catch (e) {
      console.log(e)
      return res.status(400).json({ error: e.message })
    }
  }
}

export default TrelloController
