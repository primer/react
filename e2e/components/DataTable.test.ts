import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories = [
  {
    title: 'Default',
    id: 'experimental-components-datatable--default',
  },
  {
    title: 'With Title',
    id: 'experimental-components-datatable-features--with-title',
  },
  {
    title: 'With Title and Subtitle',
    id: 'experimental-components-datatable-features--with-title-and-subtitle',
  },
  {
    title: 'With Sorting',
    id: 'experimental-components-datatable-features--with-sorting',
  },
  {
    title: 'With Actions',
    id: 'experimental-components-datatable-features--with-actions',
  },
  {
    title: 'With Action',
    id: 'experimental-components-datatable-features--with-action',
  },
  {
    title: 'With Row Action',
    id: 'experimental-components-datatable-features--with-row-action',
  },
  {
    title: 'With Row Actions',
    id: 'experimental-components-datatable-features--with-row-actions',
  },
  {
    title: 'With Row Action Menu',
    id: 'experimental-components-datatable-features--with-row-action-menu',
  },
  {
    title: 'With Custom Heading',
    id: 'experimental-components-datatable-features--with-custom-heading',
  },
  {
    title: 'With Overflow',
    id: 'experimental-components-datatable-features--with-overflow',
  },
] as const

test.describe('DataTable', () => {
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
            expect(
              await page.screenshot({
                mask: await page
                  .locator('td', {
                    has: page.locator('relative-time'),
                  })
                  .all(),
              }),
            ).toMatchSnapshot(`DataTable.${story.title}.${theme}.png`)
          })
        })
      }
    })
  }
})
