import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'
import {viewports} from '../test-helpers/viewports'

const stories: Array<{title: string; id: string; viewports?: Array<keyof typeof viewports>}> = [
  /**
   * @see ../../packages/react/src/Banner/SPEC.md#default
   * @see ../../packages/react/src/Banner/SPEC.md#actions
   * @see ../../packages/react/src/Banner/SPEC.md#dismissal
   * @see ../../packages/react/src/Banner/SPEC.md#layout
   */
  {
    title: 'Default',
    id: 'components-banner--default',
    viewports: ['primer.breakpoint.xs', 'primer.breakpoint.sm'],
  },
  /**
   * @see ../../packages/react/src/Banner/SPEC.md#variants-and-leading-visuals
   */
  {
    title: 'Critical',
    id: 'components-banner-features--critical',
  },
  /**
   * @see ../../packages/react/src/Banner/SPEC.md#dismissal
   */
  {
    title: 'Dismiss',
    id: 'components-banner-features--dismiss',
  },
  /**
   * @see ../../packages/react/src/Banner/SPEC.md#actions
   * @see ../../packages/react/src/Banner/SPEC.md#dismissal
   */
  {
    title: 'Dismiss With Actions',
    id: 'components-banner-features--dismiss-with-actions',
  },
  /**
   * @see ../../packages/react/src/Banner/SPEC.md#variants-and-leading-visuals
   * @see ../../packages/react/src/Banner/SPEC.md#dismissal
   */
  {
    title: 'Info',
    id: 'components-banner-features--info',
  },
  /**
   * @see ../../packages/react/src/Banner/SPEC.md#variants-and-leading-visuals
   * @see ../../packages/react/src/Banner/SPEC.md#dismissal
   */
  {
    title: 'Success',
    id: 'components-banner-features--success',
  },
  /**
   * @see ../../packages/react/src/Banner/SPEC.md#variants-and-leading-visuals
   * @see ../../packages/react/src/Banner/SPEC.md#dismissal
   */
  {
    title: 'Upsell',
    id: 'components-banner-features--upsell',
  },
  /**
   * @see ../../packages/react/src/Banner/SPEC.md#variants-and-leading-visuals
   * @see ../../packages/react/src/Banner/SPEC.md#dismissal
   */
  {
    title: 'Warning',
    id: 'components-banner-features--warning',
  },
  /**
   * @see ../../packages/react/src/Banner/SPEC.md#variants-and-leading-visuals
   * @see ../../packages/react/src/Banner/SPEC.md#actions
   * @see ../../packages/react/src/Banner/SPEC.md#layout
   */
  {
    title: 'WithActions',
    id: 'components-banner-features--with-actions',
    viewports: ['primer.breakpoint.xs', 'primer.breakpoint.sm'],
  },
  /**
   * @see ../../packages/react/src/Banner/SPEC.md#default
   */
  {
    title: 'WithHiddenTitle',
    id: 'components-banner-features--with-hidden-title',
  },
  /**
   * @see ../../packages/react/src/Banner/SPEC.md#default
   * @see ../../packages/react/src/Banner/SPEC.md#actions
   * @see ../../packages/react/src/Banner/SPEC.md#layout
   */
  {
    title: 'WithHiddenTitleAndActions',
    id: 'components-banner-features--with-hidden-title-and-actions',
    viewports: ['primer.breakpoint.xs', 'primer.breakpoint.sm'],
  },
  /**
   * @see ../../packages/react/src/Banner/SPEC.md#default
   * @see ../../packages/react/src/Banner/SPEC.md#actions
   * @see ../../packages/react/src/Banner/SPEC.md#dismissal
   * @see ../../packages/react/src/Banner/SPEC.md#layout
   */
  {
    title: 'DismissibleWithHiddenTitleAndActions',
    id: 'components-banner-features--dismissible-with-hidden-title-and-actions',
    viewports: ['primer.breakpoint.xs', 'primer.breakpoint.sm'],
  },
  /**
   * @see ../../packages/react/src/Banner/SPEC.md#default
   * @see ../../packages/react/src/Banner/SPEC.md#actions
   * @see ../../packages/react/src/Banner/SPEC.md#dismissal
   * @see ../../packages/react/src/Banner/SPEC.md#layout
   */
  {
    title: 'DismissibleWithHiddenTitleAndSecondaryAction',
    id: 'components-banner-features--dismissible-with-hidden-title-and-secondary-action',
    viewports: ['primer.breakpoint.xs', 'primer.breakpoint.sm'],
  },
  /**
   * @see ../../packages/react/src/Banner/SPEC.md#default
   * @see ../../packages/react/src/Banner/SPEC.md#layout
   */
  {
    title: 'InSidebar',
    id: 'components-banner-examples--in-sidebar',
  },
  /**
   * @see ../../packages/react/src/Banner/SPEC.md#actions
   * @see ../../packages/react/src/Banner/SPEC.md#dismissal
   * @see ../../packages/react/src/Banner/SPEC.md#layout
   */
  {
    title: 'Multiline',
    id: 'components-banner-examples--multiline',
    viewports: ['primer.breakpoint.xs', 'primer.breakpoint.sm'],
  },
  /**
   * @see ../../packages/react/src/Banner/SPEC.md#actions
   * @see ../../packages/react/src/Banner/SPEC.md#layout
   */
  {
    title: 'ActionsInline',
    id: 'components-banner-features--actions-layout-inline',
    viewports: ['primer.breakpoint.xs'],
  },
  /**
   * @see ../../packages/react/src/Banner/SPEC.md#actions
   * @see ../../packages/react/src/Banner/SPEC.md#layout
   */
  {
    title: 'ActionsStacked',
    id: 'components-banner-features--actions-layout-stacked',
  },
  /**
   * @see ../../packages/react/src/Banner/SPEC.md#actions
   * @see ../../packages/react/src/Banner/SPEC.md#layout
   */
  {
    title: 'FlushInsideDialog',
    id: 'components-banner-features--flush-inside-dialog',
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
            await expect(page).toHaveScreenshot(`Banner.${story.title}.${theme}.png`)
          })
        })
      }

      if (story.viewports) {
        for (const name of story.viewports) {
          test(`${name} @vrt`, async ({page}) => {
            await visit(page, {
              id: story.id,
            })
            const width = viewports[name]

            await page.setViewportSize({
              width,
              height: 667,
            })
            await expect(page).toHaveScreenshot(`Banner.${story.title}.${name}.png`)
          })
        }
      }
    })
  }

  test.describe('Banner accessibility behavior', () => {
    /**
     * @see ../../packages/react/src/Banner/SPEC.md#accessibility
     */
    test('moves focus to essential feedback after a user action @avt', async ({page}) => {
      await visit(page, {
        id: 'components-banner-examples--with-user-action',
      })

      await page.getByRole('button', {name: 'Update profile'}).click()

      await expect(page.getByRole('region', {name: 'Error'})).toBeFocused()
    })

    /**
     * @see ../../packages/react/src/Banner/SPEC.md#accessibility
     * @see ../../packages/react/src/Banner/SPEC.md#actions
     */
    test('moves focus to dynamic feedback with a required action @avt', async ({page}) => {
      await visit(page, {
        id: 'components-banner-examples--with-required-action-after-user-action',
      })

      await page.getByRole('button', {name: 'Submit changes'}).click()

      await expect(page.getByRole('region', {name: 'Changes not saved'})).toBeFocused()
      await expect(page.getByRole('button', {name: 'Review errors'})).toBeVisible()
    })

    /**
     * @see ../../packages/react/src/Banner/SPEC.md#accessibility
     */
    test('updates content within a persistent live region @avt', async ({page}) => {
      await visit(page, {
        id: 'components-banner-examples--with-announcement',
      })

      const announcement = page.getByTestId('announcement')
      const initialAnnouncement = await announcement.elementHandle()
      if (!initialAnnouncement) {
        throw new Error('Expected the Banner announcement source to be present')
      }

      await page.getByRole('radio', {name: 'Choice two'}).check()
      await expect(announcement).toHaveText('This is a message for choice two')

      const updatedAnnouncement = await announcement.elementHandle()
      if (!updatedAnnouncement) {
        throw new Error('Expected the Banner announcement source to remain present')
      }
      expect(await initialAnnouncement.evaluate((node, current) => node === current, updatedAnnouncement)).toBe(true)

      await expect(page.locator('live-region')).toHaveCount(1)
      await expect(page.locator('live-region #polite')).toContainText('This is a message for choice two')
    })

    /**
     * @see ../../packages/react/src/Banner/SPEC.md#accessibility
     * @see ../../packages/react/src/Banner/SPEC.md#dismissal
     */
    test('moves focus after a dismissed Banner is removed @avt', async ({page}) => {
      await visit(page, {
        id: 'components-banner-examples--dismiss-banner',
      })

      await page.getByRole('button', {name: 'Dismiss banner'}).click()

      await expect(page.getByRole('heading', {name: 'Example page title'})).toBeFocused()
    })

    /**
     * @see ../../packages/react/src/Banner/SPEC.md#accessibility
     * @see ../../packages/react/src/Banner/SPEC.md#actions
     * @see ../../packages/react/src/Banner/SPEC.md#dismissal
     */
    test('provides minimum target sizes for interactive controls @avt', async ({page}) => {
      await visit(page, {
        id: 'components-banner--default',
      })

      const controls = page.getByRole('button')
      for (let index = 0; index < (await controls.count()); index++) {
        const control = controls.nth(index)
        const box = await control.boundingBox()
        if (!box) {
          throw new Error(`Expected Banner control ${index + 1} to be visible`)
        }

        expect(box.width).toBeGreaterThanOrEqual(24)
        expect(box.height).toBeGreaterThanOrEqual(24)
      }
    })

    /**
     * @see ../../packages/react/src/Banner/SPEC.md#accessibility
     * @see ../../packages/react/src/Banner/SPEC.md#layout
     */
    test('reflows without horizontal scrolling at narrow widths and 200% zoom @avt', async ({page}) => {
      const hasHorizontalOverflow = () =>
        page.evaluate(() => {
          const documentWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth)
          return documentWidth > document.documentElement.clientWidth
        })

      await page.setViewportSize({width: 320, height: 256})
      await visit(page, {
        id: 'components-banner-examples--multiline',
      })
      expect(await hasHorizontalOverflow()).toBe(false)

      await page.setViewportSize({width: 640, height: 512})
      await visit(page, {
        id: 'components-banner-examples--multiline',
      })
      await page.evaluate(() => {
        document.documentElement.style.zoom = '2'
      })
      expect(await hasHorizontalOverflow()).toBe(false)
    })
  })

  test.describe('Banner layout behavior', () => {
    /**
     * @see ../../packages/react/src/Banner/SPEC.md#layout
     */
    test('uses reduced padding for the compact layout', async ({page}) => {
      const getPadding = () =>
        page.getByRole('region').evaluate(element => Number.parseFloat(getComputedStyle(element).paddingBlockStart))

      await visit(page, {
        id: 'components-banner--default',
      })
      const defaultPadding = await getPadding()

      await visit(page, {
        id: 'components-banner-features--compact',
      })
      const compactPadding = await getPadding()

      expect(compactPadding).toBeLessThan(defaultPadding)
    })
  })
})
