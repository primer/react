import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {matrix, serialize} from '../test-helpers/matrix'

const scenarios = matrix({
  align: ['stretch', 'start', 'center', 'end', 'baseline'],
  spread: ['start', 'center', 'end', 'space-around', 'space-evenly'],
  direction: ['horizontal', 'vertical'],
  wrap: ['wrap', 'nowrap'],
  padding: ['none', 'normal'],
  gap: ['none', 'normal'],
})

test.describe('Stack', () => {
  for (const scenario of scenarios) {
    const id = serialize(scenario)

    test(`${id} @vrt`, async ({page}) => {
      await visit(page, {
        id: 'drafts-components-stack--playground',
        args: scenario,
      })
      expect(await page.screenshot()).toMatchSnapshot(`Stack.${id}.png`)
    })
  }
})
