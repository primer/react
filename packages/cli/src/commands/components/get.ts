import {defineCommand} from 'citty'
import {log} from '../../console'
import {getComponent} from './metadata'

export const get = defineCommand({
  meta: {
    name: 'get',
    description: 'Get official documentation for a Primer React component by ID or name',
  },
  args: {
    component: {
      type: 'positional',
      description: 'Component ID or name',
      required: true,
    },
  },
  async run({args}) {
    const match = getComponent(args.component)
    const url = new URL(`/product/components/${match.slug}/llms.txt`, 'https://primer.style')
    const response = await fetch(url, {signal: AbortSignal.timeout(10_000)})
    if (!response.ok) {
      throw new Error(`Failed to fetch documentation for ${match.name}: HTTP ${response.status} ${response.statusText}`)
    }

    const documentation = (await response.text()).trimEnd()
    if (!documentation) {
      throw new Error(`Documentation for ${match.name} is empty`)
    }

    log(documentation)
  },
})
