import showdown from 'showdown'
import textversionjs from 'textversionjs'

function markdown() {
  return new showdown.Converter()
}

export function getTextFromMarkdown(input: string) {
  const html = markdown().makeHtml(input)
  return textversionjs(html)
}
