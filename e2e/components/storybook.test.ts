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
          title: 'Components/ActionList',
          name: 'Default',
          importPath: './src/ActionList/ActionList.stories.tsx'
        },
        {
          id: 'components-actionlist-features--block-description',
          title: 'Components/ActionList/Features',
          name: 'Block Description',
          importPath: './src/ActionList/ActionList.features.stories.tsx'
        },
        {
          id: 'components-actionlist-features--disabled-item',
          title: 'Components/ActionList/Features',
          name: 'Disabled Item',
          importPath: './src/ActionList/ActionList.features.stories.tsx'
        },
        {
          id: 'components-actionlist-features--inline-description',
          title: 'Components/ActionList/Features',
          name: 'Inline Description',
          importPath: './src/ActionList/ActionList.features.stories.tsx'
        },
        {
          id: 'components-actionlist-features--inside-overlay',
          title: 'Components/ActionList/Features',
          name: 'Inside Overlay',
          importPath: './src/ActionList/ActionList.features.stories.tsx'
        },
        {
          id: 'components-actionlist-features--item-dividers',
          title: 'Components/ActionList/Features',
          name: 'Item Dividers',
          importPath: './src/ActionList/ActionList.features.stories.tsx'
        },
        {
          id: 'components-actionlist-features--links',
          title: 'Components/ActionList/Features',
          name: 'Links',
          importPath: './src/ActionList/ActionList.features.stories.tsx'
        },
        {
          id: 'components-actionlist-features--multi-select',
          title: 'Components/ActionList/Features',
          name: 'Multi Select',
          importPath: './src/ActionList/ActionList.features.stories.tsx'
        },
        {
          id: 'components-actionlist-features--simple-list',
          title: 'Components/ActionList/Features',
          name: 'Simple List',
          importPath: './src/ActionList/ActionList.features.stories.tsx'
        },
        {
          id: 'components-actionlist-features--single-divider',
          title: 'Components/ActionList/Features',
          name: 'Single Divider',
          importPath: './src/ActionList/ActionList.features.stories.tsx'
        },
        {
          id: 'components-actionlist-features--single-select',
          title: 'Components/ActionList/Features',
          name: 'Single Select',
          importPath: './src/ActionList/ActionList.features.stories.tsx'
        },
        {
          id: 'components-actionlist-features--text-wrap-and-truncation',
          title: 'Components/ActionList/Features',
          name: 'Text Wrap And Truncation',
          importPath: './src/ActionList/ActionList.features.stories.tsx'
        },
        {
          id: 'components-actionlist-features--with-avatars',
          title: 'Components/ActionList/Features',
          name: 'With Avatars',
          importPath: './src/ActionList/ActionList.features.stories.tsx'
        },
        {
          id: 'components-actionlist-features--with-icons',
          title: 'Components/ActionList/Features',
          name: 'With Icons',
          importPath: './src/ActionList/ActionList.features.stories.tsx'
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
            test(`${theme} @vrt`, async ({page}) => {
              await visit(page, {
                id: story.id,
                globals: {
                  colorScheme: theme
                }
              })

              // Default state
              expect(await page.screenshot()).toMatchSnapshot(`${key} ${story.name}.${theme}.png`)
            })
          }

          test('axe @aat', async ({page}) => {
            await visit(page, {
              id: story.id
            })
            await expect(page).toHaveNoViolations()
          })
        })
      }
    })
  }
})
