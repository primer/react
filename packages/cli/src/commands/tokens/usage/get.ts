import {defineCommand} from 'citty'
import {log} from '../../../console'
import {getTokenUsage} from '../guidelines'

export const get = defineCommand({
  meta: {name: 'get', description: 'Get reference Button and Stack CSS patterns and implementation rules'},
  run() {
    log(getTokenUsage())
  },
})
