// @ts-ignore
import webp from 'webp-converter'
import fs from 'fs'
import path from 'path'

const rootPath = path.resolve(__dirname, '../screenshots/png/')
const outPath = path.resolve(__dirname, '../screenshots/webp/')

fs.readdirSync(rootPath).map((folder) => {
  fs.readdirSync(path.resolve(rootPath, folder)).map(async (file) => {
    await webp.cwebp(
      path.resolve(rootPath, folder, file),
      path.resolve(outPath, folder, file.replace(/\.(png|jpeg|jpg)/, '.webp')),
      '-q 80',
    )
  })
})
