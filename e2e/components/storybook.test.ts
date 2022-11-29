import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const components = new Map([
  [
    'ActionList',
    {
      stories: [
        {
          id: 'components-actionlist--default',
          name: 'Default'
        },
        {
          id: 'components-actionlist-features--block-description',
          name: 'Block Description'
        },
        {
          id: 'components-actionlist-features--disabled-item',
          name: 'Disabled Item'
        },
        {
          id: 'components-actionlist-features--inline-description',
          name: 'Inline Description'
        },
        {
          id: 'components-actionlist-features--inside-overlay',
          name: 'Inside Overlay'
        },
        {
          id: 'components-actionlist-features--item-dividers',
          name: 'Item Dividers'
        },
        {
          id: 'components-actionlist-features--links',
          name: 'Links'
        },
        {
          id: 'components-actionlist-features--multi-select',
          name: 'Multi Select'
        },
        {
          id: 'components-actionlist-features--simple-list',
          name: 'Simple List'
        },
        {
          id: 'components-actionlist-features--single-divider',
          name: 'Single Divider'
        },
        {
          id: 'components-actionlist-features--single-select',
          name: 'Single Select'
        },
        {
          id: 'components-actionlist-features--text-wrap-and-truncation',
          name: 'Text Wrap And Truncation'
        },
        {
          id: 'components-actionlist-features--with-avatars',
          name: 'With Avatars'
        },
        {
          id: 'components-actionlist-features--with-icons',
          name: 'With Icons'
        }
      ]
    }
  ]
])

test.describe('Storybook', () => {
  for (const [key, component] of components) {
    test.describe(key, () => {
      for (const story of component.stories) {
        test.describe(story.name, () => {
          for (const theme of themes) {
            test.describe(theme, () => {
              test('default @vrt', async ({page}) => {
                await visit(page, {
                  id: story.id,
                  globals: {
                    colorScheme: theme
                  }
                })

                // Default state
                expect(await page.screenshot()).toMatchSnapshot(`${key}.${story.name}.${theme}.png`)
              })

              test('axe @aat', async ({page}) => {
                await visit(page, {
                  id: story.id,
                  globals: {
                    colorScheme: theme
                  }
                })
                await expect(page).toHaveNoViolations()
              })
            })
          }
        })
      }
    })
  }
})
