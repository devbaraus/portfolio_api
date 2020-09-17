import showdown from 'showdown'
import cheerio from 'cheerio'

function markdown() {
  return new showdown.Converter()
}

export function getTextFromMarkdown(input: string) {
  const html = markdown().makeHtml(input)
  const $ = cheerio.load(html)
  return $.text()
}
