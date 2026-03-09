import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'
import {viewports} from '../test-helpers/viewports'

const stories: Array<{
  title: string
  id: string
  viewport?: keyof typeof viewports
  delay?: number
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

const featureFlagVariants = [false, true]

test.describe('AnchoredOverlay', () => {
  for (const story of stories) {
    test.describe(story.title, () => {
      for (const theme of themes) {
        test.describe(theme, () => {
          for (const withCSSAnchorPositioning of featureFlagVariants) {
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

              // Open the overlay
              await page.locator('button', {hasText: 'Button'}).first().waitFor()
              await page.getByRole('button', {name: 'Button'}).first().click()

              if (story.delay) {
                await page.waitForTimeout(story.delay)
              }

              expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
                `AnchoredOverlay.${story.title}.${theme}${namePostfix}.png`,
              )
            })
          }
        })
      }
    })
  }
})
