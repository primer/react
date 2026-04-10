import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {viewports} from '../test-helpers/viewports'
import {waitForImages} from '../test-helpers/waitForImages'

const stories: Array<{
  title: string
  id: string
  viewport?: keyof typeof viewports
  waitForText?: string
  buttonName?: string
  buttonNames?: string[]
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
    title: 'Anchor Position Grid',
    id: 'components-anchoredoverlay-features--anchor-position-grid',
    buttonName: 'Anchor',
  },
  {
    title: 'Scroll With Anchor',
    id: 'components-anchoredoverlay-features--scroll-with-anchor',
    buttonName: 'Open Overlay',
  },
  // {
  //   title: 'Within Dialog',
  //   id: 'components-anchoredoverlay-features--within-dialog',
  //   buttonName: 'Open Overlay',
  //   openDialog: true,
  // },
  // {
  //   title: 'Within Nested Dialog',
  //   id: 'components-anchoredoverlay-features--within-nested-dialog',
  //   buttonName: 'Open Overlay',
  //   openDialog: true,
  //   openNestedDialog: true,
  // },
  // {
  //   title: 'Within Dialog Overflowing',
  //   id: 'components-anchoredoverlay-features--within-dialog-overflowing',
  //   buttonName: 'Open Overlay',
  //   openDialog: true,
  // },
  {
    title: 'Multiple Overlays',
    id: 'components-anchoredoverlay-features--multiple-overlays',
    buttonNames: ['renderAnchor 1', 'External anchor 1', 'renderAnchor 2', 'External anchor 2'],
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
    waitForText: 'content with 300px height',
  },
  {
    title: 'Reposition After Content Grows Within Dialog',
    id: 'components-anchoredoverlay-dev--reposition-after-content-grows-within-dialog',
    waitForText: 'content with 300px height',
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

          // If the story has multiple overlays, screenshot each one individually
          if (story.buttonNames) {
            for (const name of story.buttonNames) {
              await page.locator('button', {hasText: name}).first().waitFor()
              const btn = page.getByRole('button', {name}).first()
              await btn.click()
              await waitForImages(page)

              expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
                `AnchoredOverlay.${story.title}.${name}.${theme}${namePostfix}.png`,
              )

              // Close the overlay before opening the next one
              await btn.click()
            }
          } else {
            // Open the overlay
            const buttonName = story.buttonName ?? 'Button'
            await page.locator('button', {hasText: buttonName}).first().waitFor()
            const overlayButton = page.getByRole('button', {name: buttonName}).first()
            await overlayButton.click()

            // for the dev stories, we intentionally change the content after the overlay is open to test that it repositions correctly
            if (story.waitForText) await page.getByText(story.waitForText).waitFor()
            await waitForImages(page)

            expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
              `AnchoredOverlay.${story.title}.${theme}${namePostfix}.png`,
            )
          }
        })
      }
    })
  }
})
