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
    title: 'SX Prop',
    id: 'components-buttongroup-dev--sx-prop',
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
          test('@vrt', async ({page}) => {
            await visit(page, {
              id: story.id,
              globals: {
                colorScheme: theme,
              },
            })

            // Default state
            expect(await page.screenshot()).toMatchSnapshot(`ButtonGroup.${story.title}.${theme}.png`)
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
