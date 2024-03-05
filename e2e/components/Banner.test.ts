import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories = [
  {
    title: 'Default',
    id: 'drafts-components-banner--default',
  },
  {
    title: 'Critical',
    id: 'drafts-components-banner-features--critical',
  },
  {
    title: 'Info',
    id: 'drafts-components-banner-features--info',
  },
  {
    title: 'Success',
    id: 'drafts-components-banner-features--success',
  },
  {
    title: 'Upsell',
    id: 'drafts-components-banner-features--upsell',
  },
  {
    title: 'Warning',
    id: 'drafts-components-banner-features--warning',
  },
  {
    title: 'Dismiss',
    id: 'drafts-components-banner-features--dismiss',
  },
  {
    title: 'WithNoTitle',
    id: 'drafts-components-banner-features--with-no-title',
  },
  {
    title: 'WithActions',
    id: 'drafts-components-banner-features--with-actions',
  },
]

test.describe('Banner', () => {
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
            expect(await page.screenshot()).toMatchSnapshot(`Banner.${story.title}.${theme}.png`)
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

  // Responsive
  test('Responsive behavior', async ({page}) => {
    await visit(page, {
      id: 'drafts-components-banner--default',
    })

    // Small
    // await page.setViewportSize({width: 375, height: 667})
    // expect(await page.screenshot()).toMatchSnapshot('Banner.Responsive.Small.png')

    // Medium
    // await page.setViewportSize({width: 1024, height: 768})
    // expect(await page.screenshot()).toMatchSnapshot('Banner.Responsive.Medium.png')

    // Large
    // await page.setViewportSize({width: 1024, height: 768})
    // expect(await page.screenshot()).toMatchSnapshot('Banner.Responsive.Large.png')
  })
})
