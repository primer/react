import {defineCommand} from 'citty'
import {tablemark} from 'tablemark'
import {log} from '../../console'
import {paginate} from '../../pagination'
import {components} from './metadata'

export const list = defineCommand({
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
    const items = components
      .map(component => {
        return {
          id: component.id,
          name: component.name,
        }
      })
      .toSorted((a, b) => {
        return a.name.localeCompare(b.name)
      })
    const {results, pagination} = paginate(items, args)
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
