import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'
import {matrix, serialize} from '../test-helpers/matrix'

const stories = [
  {
    title: 'Default',
    id: 'drafts-components-inlinemessage--default',
  },
  {
    title: 'Multiline',
    id: 'drafts-components-inlinemessage-features--multiline',
  },
]

const scenarios = matrix({
  size: ['small', 'medium'],
  variant: ['critical', 'success', 'unavailable', 'warning'],
})

test.describe('InlineMessage', () => {
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
            expect(await page.screenshot()).toMatchSnapshot(`InlineMessage.${story.title}.${theme}.png`)
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

    test.describe(id, () => {
      for (const theme of themes) {
        test.describe(theme, () => {
          test('default @vrt', async ({page}) => {
            await visit(page, {
              id: 'drafts-components-inlinemessage--playground',
              globals: {
                colorScheme: theme,
              },
              args: scenario,
            })
            await page.setViewportSize({width: 400, height: 200})

            // Default state
            expect(await page.screenshot()).toMatchSnapshot(`InlineMessage.${id}.${theme}.png`)
          })

          test('axe @aat', async ({page}) => {
            await visit(page, {
              id: 'drafts-components-inlinemessage--playground',
              globals: {
                colorScheme: theme,
              },
              args: scenario,
            })
            await expect(page).toHaveNoViolations()
          })
        })
      }
    })
  }
})
