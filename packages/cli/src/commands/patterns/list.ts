import {defineCommand} from 'citty'
import {tablemark} from 'tablemark'
import {log} from '../../console'
import {paginate} from '../../pagination'
import {patterns} from '../../pattern-metadata'

export const list = defineCommand({
  meta: {
    name: 'list',
    description: 'List generic Primer UI patterns',
  },
  args: {
    json: {
      type: 'boolean',
      description: 'Output JSON instead of a Markdown table',
    },
    paginate: {
      type: 'boolean',
      description: 'Paginate results (default: 10 patterns per page, starting at page 1)',
    },
    limit: {
      type: 'string',
      description: 'Patterns per page (enables pagination)',
      valueHint: 'number',
    },
    page: {
      type: 'string',
      description: 'Page number, starting at 1 (enables pagination)',
      valueHint: 'number',
    },
  },
  run({args}) {
    const {results, pagination} = paginate(patterns, args)
    const output = args.json
      ? JSON.stringify(pagination ? {patterns: results, pagination} : results, null, 2)
      : [
          results.length > 0
            ? tablemark(
                results.map(pattern => {
                  return {id: pattern.id, name: pattern.name}
                }),
                {columns: ['ID', 'Name']},
              ).trimEnd()
            : '| ID | Name |\n| --- | --- |',
          ...(pagination
            ? ['', `Page ${pagination.page} of ${pagination.totalPages} (${pagination.total} patterns)`]
            : []),
        ].join('\n')

    log(output)
  },
})
