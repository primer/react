export const comment = (text: string) => `<!-- ${text.replaceAll('--', '\\-\\-')} -->`

export const link = (text: string, url: string) =>
  `[${text.replaceAll('[', '\\[').replaceAll(']', '\\]')}](${url.replaceAll('(', '\\(').replaceAll(')', '\\)')})`

export const image = (altText: string, url: string) => `!${link(altText, url)}`
