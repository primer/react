import {defineCommand} from 'citty'
// eslint-disable-next-line import/no-namespace
import * as cheerio from 'cheerio'
import {tablemark} from 'tablemark'
import TurndownService from 'turndown'
import octicons from '@primer/octicons/build/data.json' with {type: 'json'}
import {log} from './console'
import {paginate} from './pagination'

const icons = Object.values(octicons)
  .map(icon => {
    return {
      name: icon.name,
      keywords: icon.keywords,
      heights: Object.keys(icon.heights),
    }
  })
  .toSorted((a, b) => {
    return a.name.localeCompare(b.name)
  })

const get = defineCommand({
  meta: {
    name: 'get',
    description: 'Get official documentation for a Primer Octicon by name',
  },
  args: {
    name: {
      type: 'positional',
      description: 'Icon name',
      required: true,
    },
    size: {
      type: 'string',
      description: 'Icon size (default: 16)',
      default: '16',
      valueHint: 'number',
    },
  },
  async run({args}) {
    const match = icons.find(icon => {
      return icon.name.toLowerCase() === args.name.toLowerCase()
    })
    if (!match) {
      throw new Error(`No icon found for "${args.name}". Use "primer icon list" to see available icons.`)
    }
    if (!match.heights.includes(args.size)) {
      throw new Error(
        `Size "${args.size}" is not available for ${match.name}. Available sizes: ${match.heights.join(', ')}`,
      )
    }

    const url = new URL(`/octicons/icon/${match.name}-${args.size}`, 'https://primer.style')
    const response = await fetch(url, {signal: AbortSignal.timeout(10_000)})
    if (!response.ok) {
      throw new Error(`Failed to fetch documentation for ${match.name}: HTTP ${response.status} ${response.statusText}`)
    }

    const html = await response.text()
    const $ = cheerio.load(html)
    const source = $('main').html()
    if (!source) {
      throw new Error(`Documentation for ${match.name} is missing its main content`)
    }

    const documentation = new TurndownService().turndown(source).trimEnd()
    if (!documentation) {
      throw new Error(`Documentation for ${match.name} is empty`)
    }

    log(`Here is the documentation for the \`${match.name}\` icon at size: \`${args.size}\`:\n${documentation}`)
  },
})

const list = defineCommand({
  meta: {
    name: 'list',
    description: 'List the icons available from Primer Octicons React',
  },
  args: {
    json: {
      type: 'boolean',
      description: 'Output JSON instead of a Markdown table',
    },
    paginate: {
      type: 'boolean',
      description: 'Paginate results (default: 10 icons per page, starting at page 1)',
    },
    limit: {
      type: 'string',
      description: 'Icons per page (enables pagination)',
      valueHint: 'number',
    },
    page: {
      type: 'string',
      description: 'Page number, starting at 1 (enables pagination)',
      valueHint: 'number',
    },
  },
  run({args}) {
    const {results, pagination} = paginate(icons, args)
    const output = args.json
      ? JSON.stringify(pagination ? {icons: results, pagination} : results, null, 2)
      : [
          results.length > 0
            ? tablemark(
                results.map(icon => {
                  return {name: icon.name, keywords: icon.keywords.join(', '), sizes: icon.heights.join(', ')}
                }),
                {columns: ['Name', 'Keywords', 'Sizes']},
              ).trimEnd()
            : '| Name | Keywords | Sizes |\n| --- | --- | --- |',
          ...(pagination
            ? ['', `Page ${pagination.page} of ${pagination.totalPages} (${pagination.total} icons)`]
            : []),
        ].join('\n')

    log(output)
  },
})

export const icon = defineCommand({
  meta: {
    name: 'icon',
    description: 'Explore Primer Octicons',
  },
  subCommands: {
    get,
    list,
  },
})
