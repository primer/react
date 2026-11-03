import {defineCommand} from 'citty'
import {log} from '../../../console'
import {fetchMarkdown} from '../../../documentation'
import {getComponent} from '../metadata'

export const get = defineCommand({
  meta: {
    name: 'get',
    description: 'Get usage examples for a Primer React component by ID or name',
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
    const url = new URL(`/product/components/${match.slug}`, 'https://primer.style')
    const documentation = await fetchMarkdown(url, match.name)

    log(
      `Here are some examples of how to use the \`${match.name}\` component from the @primer/react package:\n\n${documentation}`,
    )
  },
})
