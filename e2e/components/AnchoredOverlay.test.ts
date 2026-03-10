import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {viewports} from '../test-helpers/viewports'
import {waitForImages} from '../test-helpers/waitForImages'

const stories: Array<{
  title: string
  id: string
  viewport?: keyof typeof viewports
  delay?: number
  buttonName?: string
  openDialog?: boolean
  openNestedDialog?: boolean
}> = [
  // Default
  {
    title: 'Default',
    id: 'components-anchoredoverlay--default',
  },
  // Features
  {
    title: 'Portal Inside Scrolling Element',
    id: 'components-anchoredoverlay-features--portal-inside-scrolling-element',
  },
  {
    title: 'Custom Anchor Id',
    id: 'components-anchoredoverlay-features--custom-anchor-id',
  },
  {
    title: 'Height',
    id: 'components-anchoredoverlay-features--height',
  },
  {
    title: 'Width',
    id: 'components-anchoredoverlay-features--width',
  },
  {
    title: 'Anchor Alignment',
    id: 'components-anchoredoverlay-features--anchor-alignment',
  },
  {
    title: 'Anchor Side',
    id: 'components-anchoredoverlay-features--anchor-side',
  },
  {
    title: 'Offset Position From Anchor',
    id: 'components-anchoredoverlay-features--offset-position-from-anchor',
  },
  {
    title: 'Offset Alignment From Anchor',
    id: 'components-anchoredoverlay-features--offset-alignment-from-anchor',
  },
  {
    title: 'Focus Trap Overrides',
    id: 'components-anchoredoverlay-features--focus-trap-overrides',
  },
  {
    title: 'Focus Zone Overrides',
    id: 'components-anchoredoverlay-features--focus-zone-overrides',
  },
  {
    title: 'Overlay Props Overrides',
    id: 'components-anchoredoverlay-features--overlay-props-overrides',
  },
  {
    title: 'Fullscreen Variant',
    id: 'components-anchoredoverlay-features--fullscreen-variant',
    viewport: 'primer.breakpoint.xs',
    buttonName: 'Open Fullscreen on Narrow',
  },
  {
    title: 'Centered On Page',
    id: 'components-anchoredoverlay-features--centered-on-page',
    buttonName: 'Open Overlay',
  },
  {
    title: 'Anchor Position Grid',
    id: 'components-anchoredoverlay-features--anchor-position-grid',
    buttonName: 'Anchor',
  },
  {
    title: 'Scroll With Anchor',
    id: 'components-anchoredoverlay-features--scroll-with-anchor',
    buttonName: 'Open Overlay',
  },
  {
    title: 'Within Dialog',
    id: 'components-anchoredoverlay-features--within-dialog',
    buttonName: 'Open Overlay',
    openDialog: true,
  },
  {
    title: 'Within Nested Dialog',
    id: 'components-anchoredoverlay-features--within-nested-dialog',
    buttonName: 'Open Overlay',
    openDialog: true,
    openNestedDialog: true,
  },
  {
    title: 'Within Dialog Overflowing',
    id: 'components-anchoredoverlay-features--within-dialog-overflowing',
    buttonName: 'Open Overlay',
    openDialog: true,
  },
  {
    title: 'Within Sticky Element',
    id: 'components-anchoredoverlay-features--within-sticky-element',
    buttonName: 'Open Overlay',
  },
  // Dev
  {
    title: 'Reposition After Content Grows',
    id: 'components-anchoredoverlay-dev--reposition-after-content-grows',
    delay: 2500,
  },
  {
    title: 'Reposition After Content Grows Within Dialog',
    id: 'components-anchoredoverlay-dev--reposition-after-content-grows-within-dialog',
    delay: 2500,
  },
] as const

const theme = 'light'

test.describe('AnchoredOverlay', () => {
  for (const story of stories) {
    test.describe(story.title, () => {
      for (const withCSSAnchorPositioning of [false, true]) {
        const namePostfix = withCSSAnchorPositioning ? '.css-anchor-positioning' : ''

        test(`default @vrt${namePostfix ? ` ${namePostfix}` : ''}`, async ({page}) => {
          await visit(page, {
            id: story.id,
            globals: {
              colorScheme: theme,
              ...(withCSSAnchorPositioning && {
                featureFlags: {
                  primer_react_css_anchor_positioning: true,
                },
              }),
            },
          })

          if (story.viewport) {
            await page.setViewportSize({
              width: viewports[story.viewport],
              height: 667,
            })
          }

          // Open dialog if needed
          if (story.openDialog) {
            await page.getByRole('button', {name: 'Open Dialog'}).click()
          }

          // Open nested dialog if needed
          if (story.openNestedDialog) {
            await page.getByRole('button', {name: 'Open Inner Dialog'}).click()
          }

          // Scroll dialogs to top to ensure consistent positioning
          await page.evaluate(() => {
            // eslint-disable-next-line github/array-foreach
            document.querySelectorAll('[class*="DialogOverflowWrapper"]').forEach(el => {
              el.scrollTop = 0
            })
          })

          // Open the overlay
          const buttonName = story.buttonName ?? 'Button'
          await page.locator('button', {hasText: buttonName}).first().waitFor()
          await page.getByRole('button', {name: buttonName}).first().click()

          if (story.delay) {
            // eslint-disable-next-line playwright/no-wait-for-timeout
            await page.waitForTimeout(story.delay)
          }

          await waitForImages(page)

          // Force scrollbars to always be visible for consistent screenshots
          await page.addStyleTag({
            content: `
              [class*="DialogOverflowWrapper"] { overflow-y: scroll !important; }
              ::-webkit-scrollbar { -webkit-appearance: none !important; width: 8px !important; }
              ::-webkit-scrollbar-thumb { background-color: rgba(0, 0, 0, 0.3) !important; border-radius: 4px !important; }
            `,
          })

          // Display scroll positions in dialog headers for debugging
          await page.evaluate(() => {
            const elements = document.querySelectorAll('[class*="DialogOverflowWrapper"]')
            // eslint-disable-next-line github/array-foreach
            elements.forEach(el => {
              const dialog = el.closest('[role="dialog"]')
              const header = dialog?.querySelector('[class*="DialogHeader"] h1, [class*="Dialog_title"]')
              if (header) {
                const scrollInfo = `[scroll: ${el.scrollTop}/${el.scrollHeight - el.clientHeight}]`
                header.textContent = `${header.textContent} ${scrollInfo}`
              }
            })
          })

          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `AnchoredOverlay.${story.title}.${theme}${namePostfix}.png`,
          )
        })
      }
    })
  }
})
