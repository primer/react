import {test, expect, type Page} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories: Array<{title: string; id: string; setup: (page: Page) => Promise<void>}> = [
  {
    title: 'Default',
    id: 'components-autocomplete--default',
    setup: async page => {
      await page.keyboard.press('Tab')
      await page.keyboard.press('D')
    },
  },
  {
    title: 'Add New Item',
    id: 'components-autocomplete-features--add-new-item',
    setup: async page => {
      await page.keyboard.press('Tab')
      await page.keyboard.press('D')
    },
  },
  {
    title: 'Async Loading Of Items',
    id: 'components-autocomplete-features--async-loading-of-items',
    setup: async page => {
      await page.keyboard.press('Tab')
      await page.keyboard.press('D')
    },
  },
  {
    title: 'Custom Overlay Menu Anchor',
    id: 'components-autocomplete-features--custom-overlay-menu-anchor',
    setup: async page => {
      await page.keyboard.press('Tab')
      await page.keyboard.press('D')
    },
  },
  {
    title: 'Custom Search Filter Fn',
    id: 'components-autocomplete-features--custom-search-filter-fn',
    setup: async page => {
      await page.keyboard.press('Tab')
      await page.keyboard.press('D')
    },
  },
  {
    title: 'Custom Sort After Menu Close',
    id: 'components-autocomplete-features--custom-sort-after-menu-close',
    setup: async page => {
      await page.keyboard.press('Tab')
      await page.keyboard.press('D')
    },
  },
  {
    title: 'In A Dialog',
    id: 'components-autocomplete-features--in-a-dialog',
    setup: async page => {
      await page.keyboard.press('Tab')
      await page.keyboard.press('Enter')
      await expect(page.getByRole('dialog')).toBeVisible()
      await page.getByText('Default label').waitFor()
      await page.keyboard.press('Tab')
      await page.keyboard.press('D')
    },
  },
  {
    title: 'In Overlay With Custom Scroll Container Ref',
    id: 'components-autocomplete-features--in-overlay-with-custom-scroll-container-ref',
    setup: async page => {
      await page.keyboard.press('Tab')
      await page.keyboard.press('Enter')
      await page.keyboard.press('D')
    },
  },
  {
    title: 'Rendering The Menu Outside An Overlay',
    id: 'components-autocomplete-features--rendering-the-menu-outside-an-overlay',
    setup: async page => {
      await page.keyboard.press('Tab')
      await page.keyboard.press('D')
    },
  },
  {
    title: 'With Callback When Overlay Open State Changes',
    id: 'components-autocomplete-features--with-callback-when-overlay-open-state-changes',
    setup: async page => {
      await page.keyboard.press('Tab')
      await page.keyboard.press('D')
    },
  },
  {
    title: 'With Token Input',
    id: 'components-autocomplete-features--with-token-input',
    setup: async page => {
      await page.keyboard.press('Tab')
      await page.keyboard.press('D')
    },
  },
]

test.describe('Autocomplete', () => {
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

            await story.setup(page)

            await expect(page).toHaveScreenshot(`Autocomplete.${story.title}.${theme}.png`, {animations: 'disabled'})
          })

          test('@aat', async ({page}) => {
            await visit(page, {
              id: story.id,
              globals: {
                colorScheme: theme,
              },
            })

            await story.setup(page)

            await expect(page).toHaveNoViolations({
              rules: {
                'color-contrast': {
                  enabled:
                    theme !== 'dark_colorblind' &&
                    theme !== 'dark_dimmed' &&
                    theme !== 'light' &&
                    theme !== 'light_colorblind' &&
                    theme !== 'light_tritanopia',
                },
                'aria-valid-attr-value': {enabled: false},
              },
            })
          })
        })
      }
    })
  }
})
