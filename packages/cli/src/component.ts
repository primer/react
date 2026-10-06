import {defineCommand} from 'citty'
import {tablemark} from 'tablemark'
import componentsMetadata from '@primer/react/generated/components.json' with {type: 'json'}
import {log} from './console'

function parsePositiveInteger(value: string | undefined, name: string, fallback: number): number {
  if (value === undefined) {
    return fallback
  }

  const number = Number(value)
  if (!/^[0-9]+$/.test(value) || !Number.isSafeInteger(number) || number < 1) {
    throw new Error(`--${name} must be a positive safe integer`)
  }

  return number
}

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
    const limit = parsePositiveInteger(args.limit, 'limit', 10)
    const page = parsePositiveInteger(args.page, 'page', 1)
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
    const paginate = args.paginate || args.limit !== undefined || args.page !== undefined
    const start = (page - 1) * limit
    const results = paginate ? components.slice(start, start + limit) : components
    const pagination = {
      page,
      limit,
      total: components.length,
      totalPages: Math.ceil(components.length / limit),
    }
    const output = args.json
      ? JSON.stringify(paginate ? {components: results, pagination} : results, null, 2)
      : [
          results.length > 0 ? tablemark(results, {columns: ['ID', 'Name']}).trimEnd() : '| ID | Name |\n| --- | --- |',
          ...(paginate ? ['', `Page ${page} of ${pagination.totalPages} (${pagination.total} components)`] : []),
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
    list,
  },
})
