import {defineCommand} from 'citty'
import {log} from '../../console'
import {getToken} from '../../token-metadata'
import {formatToken} from './output'

export const get = defineCommand({
  meta: {name: 'get', description: 'Get a token value and usage guidelines by name'},
  args: {
    name: {
      type: 'positional',
      description: 'Token name, CSS custom property, or var() reference',
      required: true,
    },
    json: {type: 'boolean', description: 'Output JSON instead of Markdown'},
  },
  run({args}) {
    const token = getToken(args.name)
    log(args.json ? JSON.stringify(token, null, 2) : formatToken(token))
  },
})
