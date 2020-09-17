import showdown from 'showdown'
import { JSDOM } from 'jsdom'

const markdown = new showdown.Converter()

export function getTextFromMarkdown(str: any) {
  const html = markdown.makeHtml(str)
  return JSDOM.fragment(html).textContent as string
}
