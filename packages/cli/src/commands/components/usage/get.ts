import {defineCommand} from 'citty'
import {log} from '../../../console'
import {getGuidelines} from '../guidelines'

export const get = defineCommand({
  meta: {
    name: 'get',
    description: 'Get usage guidelines for a Primer React component by ID or name',
  },
  args: {
    component: {
      type: 'positional',
      description: 'Component ID or name',
      required: true,
    },
  },
  async run({args}) {
    log(await getGuidelines(args.component, 'usage'))
  },
})
