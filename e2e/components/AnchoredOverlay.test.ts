import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'
import {viewports} from '../test-helpers/viewports'

const stories: Array<{
  title: string
  id: string
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
  // Dev
  {
    title: 'Reposition After Content Grows',
    id: 'components-anchoredoverlay-dev--reposition-after-content-grows',
  },
  {
    title: 'Reposition After Content Grows Within Dialog',
    id: 'components-anchoredoverlay-dev--reposition-after-content-grows-within-dialog',
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

              // Open the overlay
              await page.locator('button', {hasText: 'Button'}).waitFor()
              await page.getByRole('button', {name: 'Button'}).click()

              expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
                `AnchoredOverlay.${story.title}.${theme}${namePostfix}.png`,
              )
            })
          }
        })
      }
    })
  }

  test.describe('Fullscreen Variant', () => {
    const story = {
      title: 'Fullscreen Variant',
      id: 'components-anchoredoverlay-features--fullscreen-variant',
    }

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

            // Open the overlay
            await page.getByRole('button', {name: 'Open Fullscreen on Narrow'}).waitFor()
            await page.getByRole('button', {name: 'Open Fullscreen on Narrow'}).click()

            expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
              `AnchoredOverlay.${story.title}.${theme}${namePostfix}.png`,
            )
          })

          test(`narrow viewport @vrt${namePostfix ? ` ${namePostfix}` : ''}`, async ({page}) => {
            // Set narrow viewport (<768px) to trigger fullscreen behavior
            await page.setViewportSize({width: viewports['primer.breakpoint.xs'], height: 768})

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

            // Open the overlay
            await page.getByRole('button', {name: 'Open Fullscreen on Narrow'}).waitFor()
            await page.getByRole('button', {name: 'Open Fullscreen on Narrow'}).click()

            expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
              `AnchoredOverlay.${story.title}.${theme}.narrow${namePostfix}.png`,
            )
          })
        }
      })
    }
  })
})
