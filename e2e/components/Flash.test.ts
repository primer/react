import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories = [
  {
    title: 'Default',
    id: 'components-flash--default',
  },
  {
    title: 'Danger',
    id: 'components-flash-features--danger',
  },
  {
    title: 'Full',
    id: 'components-flash-features--full',
  },
  {
    title: 'Success',
    id: 'components-flash-features--success',
  },
  {
    title: 'Warning',
    id: 'components-flash-features--warning',
  },
] as const

test.describe('Flash', () => {
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
            await expect(page).toHaveScreenshot(`Flash.${story.title}.${theme}.png`)
          })
        })
      }
    })
  }
})
