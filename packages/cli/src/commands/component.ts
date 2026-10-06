import {defineCommand} from 'citty'
import {tablemark} from 'tablemark'
import componentsMetadata from '@primer/react/generated/components.json' with {type: 'json'}
import {log} from '../console'
import {paginate} from '../pagination'

function idToSlug(id: string): string {
  if (id === 'actionbar') {
    return 'action-bar'
  }

  return id.replaceAll('_', '-')
}

const get = defineCommand({
  meta: {
    name: 'get',
    description: 'Get official documentation for a Primer React component by ID or name',
  },
  args: {
    component: {
      type: 'positional',
      description: 'Component ID or name',
      required: true,
    },
  },
  async run({args}) {
    const identifier = args.component.toLowerCase()
    const match = Object.values(componentsMetadata.components).find(component => {
      return component.id.toLowerCase() === identifier || component.name.toLowerCase() === identifier
    })
    if (!match) {
      throw new Error(
        `No component found for "${args.component}". Use "primer component list" to see available components.`,
      )
    }

    const docsId = 'docsId' in match ? match.docsId : match.id
    const url = new URL(`/product/components/${idToSlug(docsId)}/llms.txt`, 'https://primer.style')
    const response = await fetch(url, {signal: AbortSignal.timeout(10_000)})
    if (!response.ok) {
      throw new Error(`Failed to fetch documentation for ${match.name}: HTTP ${response.status} ${response.statusText}`)
    }

    const documentation = (await response.text()).trimEnd()
    if (!documentation) {
      throw new Error(`Documentation for ${match.name} is empty`)
    }

    log(documentation)
  },
})

const list = defineCommand({
  meta: {
    name: 'list',
    description: 'List the components available from Primer React',
  },
  args: {
    json: {
      type: 'boolean',
      description: 'Output JSON instead of a Markdown table',
    },
    paginate: {
      type: 'boolean',
      description: 'Paginate results (default: 10 components per page, starting at page 1)',
    },
    limit: {
      type: 'string',
      description: 'Components per page (enables pagination)',
      valueHint: 'number',
    },
    page: {
      type: 'string',
      description: 'Page number, starting at 1 (enables pagination)',
      valueHint: 'number',
    },
  },
  run({args}) {
    const components = Object.values(componentsMetadata.components)
      .map(component => {
        return {
          id: component.id,
          name: component.name,
        }
      })
      .toSorted((a, b) => {
        return a.name.localeCompare(b.name)
      })
    const {results, pagination} = paginate(components, args)
    const output = args.json
      ? JSON.stringify(pagination ? {components: results, pagination} : results, null, 2)
      : [
          results.length > 0 ? tablemark(results, {columns: ['ID', 'Name']}).trimEnd() : '| ID | Name |\n| --- | --- |',
          ...(pagination
            ? ['', `Page ${pagination.page} of ${pagination.totalPages} (${pagination.total} components)`]
            : []),
        ].join('\n')

    log(output)
  },
})

export const component = defineCommand({
  meta: {
    name: 'component',
    description: 'Explore Primer React components',
  },
  subCommands: {
    get,
    list,
  },
})
