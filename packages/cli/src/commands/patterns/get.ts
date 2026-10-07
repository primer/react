import {defineCommand} from 'citty'
import {log} from '../../console'
import {fetchPreferredMarkdown} from '../../documentation'
import {getPattern} from '../../pattern-metadata'

export const get = defineCommand({
  meta: {
    name: 'get',
    description: 'Get a Primer UI pattern by ID or name',
  },
  args: {
    pattern: {
      type: 'positional',
      description: 'UI pattern ID or name',
      required: true,
    },
  },
  async run({args}) {
    const match = getPattern(args.pattern, 'patterns')
    const url = new URL(`/product/ui-patterns/${match.id}`, 'https://primer.style')
    const documentation = await fetchPreferredMarkdown(url, match.name)

    log(`Here are the guidelines for the \`${match.name}\` pattern for Primer:\n\n${documentation}`)
  },
})
