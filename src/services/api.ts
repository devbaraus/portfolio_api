import axios, { AxiosBasicCredentials } from 'axios'
// import dotenv from 'dotenv'
//
// dotenv.config()

export const trelloAPI = axios.create({
  baseURL: 'https://api.trello.com/1/',
  params: {
    key: process.env.TRELLO_KEY,
    token: process.env.TRELLO_TOKEN,
  },
})

export const gitAPI = axios.create({
  baseURL: 'https://api.github.com/',
  auth: {
    username: process.env.GITHUB_USERNAME,
    password: process.env.GITHUB_TOKEN,
  } as AxiosBasicCredentials,
})
