import {defineCommand} from 'citty'
import {log} from '../../console'
import {getTokenSpecs} from './guidelines'

export const specs = defineCommand({
  meta: {name: 'specs', description: 'Get the token logic matrix, available groups, and design token specifications'},
  run() {
    log(getTokenSpecs())
  },
})
