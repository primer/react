import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories = [
  {
    title: 'Default',
    id: 'components-radio--default',
  },
  {
    title: 'Disabled',
    id: 'components-radio-features--disabled',
  },
  {
    title: 'With Caption',
    id: 'components-radio-features--with-caption',
  },
  {
    title: 'With Leading Visual',
    id: 'components-radio-features--with-leading-visual',
  },
] as const

test.describe('Radio', () => {
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
            await expect(page).toHaveScreenshot(`Radio.${story.title}.${theme}.png`)
          })
        })
      }
    })
  }

  test.describe('Checked', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-radio--playground',
            globals: {
              colorScheme: theme,
            },
            args: {
              checked: true,
            },
          })

          // Default state
          await expect(page).toHaveScreenshot(`Radio.Checked.${theme}.png`)
        })
      })
    }
  })
})
