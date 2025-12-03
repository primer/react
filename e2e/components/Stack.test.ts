import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {matrix, serialize} from '../test-helpers/matrix'

const scenarios = matrix({
  align: ['stretch', 'start', 'center', 'end', 'baseline'],
  direction: ['horizontal', 'vertical'],
  gap: ['none', 'normal'],
  justify: ['start', 'center', 'end', 'space-around', 'space-evenly'],
  padding: ['none', 'normal'],
  wrap: ['wrap', 'nowrap'],
})

test.describe('Stack', () => {
  for (const scenario of scenarios) {
    const id = serialize(scenario)

    test(`${id} @vrt`, async ({page}) => {
      await visit(page, {
        id: 'components-stack--playground',
        args: scenario,
      })
      await expect(page).toHaveScreenshot(`Stack.${id}.png`)
    })
  }
})
