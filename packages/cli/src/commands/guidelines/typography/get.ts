import {defineCommand} from 'citty'
import {log} from '../../../console'
import {fetchMarkdown} from '../../../documentation'

export const get = defineCommand({
  meta: {
    name: 'get',
    description: 'Get guidelines for applying typography to a user interface',
  },
  async run() {
    const url = new URL('/product/getting-started/foundations/typography', 'https://primer.style')
    const documentation = await fetchMarkdown(url, 'typography usage')

    log(`Here is the documentation for typography usage in Primer:\n\n${documentation}`)
  },
})
