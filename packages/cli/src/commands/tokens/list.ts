import {defineCommand} from 'citty'
import {log} from '../../console'
import {tokens} from '../../token-metadata'
import {formatTokens, listArgs} from './output'

export const list = defineCommand({
  meta: {name: 'list', description: 'List all Primer design tokens'},
  args: listArgs,
  run({args}) {
    const sorted = tokens.toSorted((a, b) => {
      return a.name.localeCompare(b.name)
    })
    log(formatTokens(sorted, args))
  },
})
