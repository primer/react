import {defineCommand} from 'citty'
import {log} from '../../console'
import {fetchPreferredMarkdown} from '../../documentation'
import {getPattern} from '../../pattern-metadata'

export const get = defineCommand({
  meta: {
    name: 'get',
    description: 'Get a Primer scenario pattern by ID or name',
  },
  args: {
    scenario: {
      type: 'positional',
      description: 'Scenario ID or name',
      required: true,
    },
  },
  async run({args}) {
    const match = getPattern(args.scenario, 'scenarios')
    const url = new URL(`/product/scenario-patterns/${match.id}`, 'https://primer.style')
    const documentation = await fetchPreferredMarkdown(url, match.name)

    log(`Here are the guidelines for the \`${match.name}\` scenario for Primer:\n\n${documentation}`)
  },
})
