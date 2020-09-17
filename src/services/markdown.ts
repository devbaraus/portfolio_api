import showdown from 'showdown'
import textversionjs from 'textversionjs'

// const showdown = require('showdown')
// const textversionjs = require('textversionjs')

function markdown() {
  return new showdown.Converter({
    omitExtraWLInCodeBlocks: true,
    ghCompatibleHeaderId: true,
    simplifiedAutoLink: true,
    strikethrough: true,
    tables: true,
    ghCodeBlocks: true,
    smartIndentationFix: true,
    simpleLineBreaks: true,
    ghMentions: true,
    encodeEmails: true,
    openLinksInNewWindow: true,
    emoji: true,
    literalMidWordUnderscores: true,
  })
}

export function getTextFromMarkdown(input: string) {
  const html = markdown().makeHtml(input)
  return textversionjs(html)
}
