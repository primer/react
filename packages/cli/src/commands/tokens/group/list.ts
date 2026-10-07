import {defineCommand} from 'citty'
import {log} from '../../../console'
import {paginate} from '../../../pagination'
import {getGroupTokens, groupHints, resolveGroup} from '../../../token-metadata'
import {formatTokens, listArgs} from '../output'

export const list = defineCommand({
  meta: {name: 'list', description: 'Get tokens for one or more groups, including usage guidance'},
  args: {
    ...listArgs,
    groups: {type: 'positional', description: 'One or more group names or aliases', required: true},
  },
  run({args}) {
    const groups = Array.from(new Set(args._.map(resolveGroup)))
    const matches = getGroupTokens(groups)
    const hints = groups
      .map(name => {
        return groupHints.get(name)
      })
      .filter(Boolean)
    if (args.json) {
      const {results, pagination} = paginate(matches, args)
      log(JSON.stringify({tokens: results, groups, hints, ...(pagination ? {pagination} : {})}, null, 2))
      return
    }
    const output = formatTokens(matches, args, true)
    log([output, ...(hints.length > 0 ? ['\n## Usage Guidance\n', ...hints] : [])].join('\n'))
  },
})
