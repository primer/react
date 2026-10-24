// eslint-disable-next-line import/no-namespace
import * as cheerio from 'cheerio'
import TurndownService from 'turndown'

export class DocumentationFetchError extends Error {
  readonly status: number

  constructor(status: number, name: string, statusText: string) {
    super(`Failed to fetch documentation for ${name}: HTTP ${status} ${statusText}`)
    this.name = 'DocumentationFetchError'
    this.status = status
  }
}

export async function fetchPreferredMarkdown(url: URL, name: string): Promise<string> {
  const llmsUrl = new URL(url)
  llmsUrl.pathname = `${url.pathname.replace(/\/$/, '')}/llms.txt`
  const response = await fetch(llmsUrl, {signal: AbortSignal.timeout(10_000)})
  if (response.status === 404) {
    return fetchMarkdown(url, name)
  }
  if (!response.ok) {
    throw new DocumentationFetchError(response.status, name, response.statusText)
  }

  const documentation = (await response.text()).trimEnd()
  if (!documentation) {
    throw new Error(`Documentation for ${name} is empty`)
  }

  return documentation
}

export async function fetchMarkdown(url: URL, name: string): Promise<string> {
  const response = await fetch(url, {signal: AbortSignal.timeout(10_000)})
  if (!response.ok) {
    throw new DocumentationFetchError(response.status, name, response.statusText)
  }

  const html = await response.text()
  const $ = cheerio.load(html)
  const source = $('main').html()
  if (!source) {
    throw new Error(`Documentation for ${name} is missing its main content`)
  }

  const documentation = new TurndownService().turndown(source).trimEnd()
  if (!documentation) {
    throw new Error(`Documentation for ${name} is empty`)
  }

  return documentation
}
