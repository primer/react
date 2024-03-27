import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories = [
  {
    title: 'Default',
    id: 'drafts-components-inlinemessage--default',
  },
  {
    title: 'Info',
    id: 'drafts-components-inlinemessage-features--info',
  },
  {
    title: 'Warning',
    id: 'drafts-components-inlinemessage-features--info',
  },
  {
    title: 'Critical',
    id: 'drafts-components-inlinemessage-features--critical',
  },
  {
    title: 'Success',
    id: 'drafts-components-inlinemessage-features--success',
  },
  {
    title: 'Unavailable',
    id: 'drafts-components-inlinemessage-features--unavailable',
  },
]

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
})
