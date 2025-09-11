import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories = [
  {
    title: 'Default',
    id: 'components-buttongroup--default',
  },
  {
    title: 'Playground',
    id: 'components-buttongroup--playground',
  },
  {
    title: 'Icon Buttons',
    id: 'components-buttongroup-features--icon-buttons',
  },
  {
    title: 'As Toolbar',
    id: 'components-buttongroup-features--as-toolbar',
  },
  {
    title: 'Overrides',
    id: 'components-buttongroup-dev--link-button-with-icon-buttons',
  },
] as const

test.describe('ButtonGroup', () => {
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
            await expect(page).toHaveScreenshot(`ButtonGroup.${story.title}.${theme}.png`)
          })
        })
      }
    })
  }
})
