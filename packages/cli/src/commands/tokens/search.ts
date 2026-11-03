import {defineCommand} from 'citty'
import {log} from '../../console'
import {paginate} from '../../pagination'
import {searchTokens} from '../../token-metadata'
import {formatTokens, listArgs} from './output'

export const search = defineCommand({
  meta: {name: 'search', description: 'Find design tokens by keywords, group, or both'},
  args: {
    ...listArgs,
    query: {type: 'positional', description: 'Search keywords (all must match)', required: false, default: ''},
    group: {type: 'string', description: 'Token group or alias (for example bgColor, background, or spacing)'},
    limit: {type: 'string', description: 'Results per page (default: 15, maximum: 100)', valueHint: 'number'},
    paginate: {type: 'boolean', description: 'Search results are always paginated (default: 15 per page)'},
  },
  run({args}) {
    const outputArgs = {...args, limit: args.limit ?? '15'}
    const {pagination} = paginate([], outputArgs)
    if (pagination && pagination.limit > 100) {
      throw new Error('--limit must be between 1 and 100 for token searches')
    }
    const matches = searchTokens(args._.join(' '), args.group)
    log(formatTokens(matches, outputArgs, true))
  },
})
