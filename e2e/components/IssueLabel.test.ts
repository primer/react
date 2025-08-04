import {test, expect, type Page} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories = [
  {
    title: 'Default',
    id: 'experimental-components-issuelabel--default',
  },
  {
    title: 'Auburn',
    id: 'experimental-components-issuelabel-features--variant-auburn',
  },
  {
    title: 'Blue',
    id: 'experimental-components-issuelabel-features--variant-blue',
  },
  {
    title: 'Brown',
    id: 'experimental-components-issuelabel-features--variant-brown',
  },
  {
    title: 'Coral',
    id: 'experimental-components-issuelabel-features--variant-coral',
  },
  {
    title: 'Cyan',
    id: 'experimental-components-issuelabel-features--variant-cyan',
  },
  {
    title: 'Gray',
    id: 'experimental-components-issuelabel-features--variant-gray',
  },
  {
    title: 'Green',
    id: 'experimental-components-issuelabel-features--variant-green',
  },
  {
    title: 'Indigo',
    id: 'experimental-components-issuelabel-features--variant-indigo',
  },
  {
    title: 'Lemon',
    id: 'experimental-components-issuelabel-features--variant-lemon',
  },
  {
    title: 'Lime',
    id: 'experimental-components-issuelabel-features--variant-lime',
  },
  {
    title: 'Olive',
    id: 'experimental-components-issuelabel-features--variant-olive',
  },
  {
    title: 'Orange',
    id: 'experimental-components-issuelabel-features--variant-orange',
  },
  {
    title: 'Pine',
    id: 'experimental-components-issuelabel-features--variant-pine',
  },
  {
    title: 'Pink',
    id: 'experimental-components-issuelabel-features--variant-pink',
  },
  {
    title: 'Plum',
    id: 'experimental-components-issuelabel-features--variant-plum',
  },
  {
    title: 'Purple',
    id: 'experimental-components-issuelabel-features--variant-purple',
  },
  {
    title: 'Red',
    id: 'experimental-components-issuelabel-features--variant-red',
  },
  {
    title: 'Teal',
    id: 'experimental-components-issuelabel-features--variant-teal',
  },
  {
    title: 'Yellow',
    id: 'experimental-components-issuelabel-features--variant-yellow',
  },
  {
    title: 'Button',
    id: 'experimental-components-issuelabel-features--as-button',
    async interact(page: Page) {
      await page.getByRole('button', {name: 'Issue label'}).hover()
    },
  },
  {
    title: 'Link',
    id: 'experimental-components-issuelabel-features--as-link',
    async interact(page: Page) {
      await page.getByRole('link', {name: 'Issue label'}).hover()
    },
  },
  {
    title: 'Group Of Labels',
    id: 'experimental-components-issuelabel-features--group-of-labels',
  },
  {
    title: 'Hex',
    id: 'experimental-components-issuelabel-features--hex-color',
  },
] as const

test.describe('IssueLabel', () => {
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

            await page.setViewportSize({
              width: 320,
              height: 320,
            })

            // Default state
            await expect(page.locator('body')).toHaveScreenshot(`IssueLabel.${story.title}.${theme}.png`)

            if ('interact' in story) {
              await story.interact(page)
              await expect(page.locator('body')).toHaveScreenshot(`IssueLabel.interactions.${story.title}.${theme}.png`)
            }
          })
        })
      }
    })
  }
})
