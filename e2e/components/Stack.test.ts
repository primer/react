import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'
import {matrix, serialize} from '../test-helpers/matrix'

const scenarios = matrix({
  orientation: ['horizontal', 'vertical'],
  align: ['stretch', 'start', 'center', 'end', 'baseline'],
  wrap: ['wrap', 'nowrap'],
  spread: ['start', 'center', 'end', 'distribute', 'distributeEvently'],
  padding: ['none', 'condensed', 'normal', 'spacious'],
  gap: ['none', 'condensed', 'normal', 'spacious'],
})

const stories = [
  {
    title: 'Default',
    id: 'drafts-components-stack--default',
  },
]

test.describe('Stack', () => {
  for (const story of stories) {
    test.describe(story.title, () => {
      for (const theme of themes) {
        test.describe(theme, () => {
          test('default @vrt', async ({page}) => {
            await visit(page, {
              id: story.id,
              globals: {
                colorScheme: theme,
              },
            })

            // Default state
            expect(await page.screenshot()).toMatchSnapshot(`Stack.${story.title}.${theme}.png`)
          })

          test('axe @aat', async ({page}) => {
            await visit(page, {
              id: story.id,
              globals: {
                colorScheme: theme,
              },
            })
            await expect(page).toHaveNoViolations()
          })
        })
      }
    })
  }

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
