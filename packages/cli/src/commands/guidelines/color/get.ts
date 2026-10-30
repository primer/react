import {defineCommand} from 'citty'
import {log} from '../../../console'
import {fetchMarkdown} from '../../../documentation'

export const get = defineCommand({
  meta: {
    name: 'get',
    description: 'Get guidelines for applying color to a user interface',
  },
  async run() {
    const url = new URL('/product/getting-started/foundations/color-usage', 'https://primer.style')
    const documentation = await fetchMarkdown(url, 'color usage')

    log(`Here is the documentation for color usage in Primer:\n\n${documentation}`)
  },
})
