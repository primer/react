import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

test.describe('Link', () => {
  for (const featureFlagEnabled of [true, false]) {
    test.describe('Default', () => {
      for (const theme of themes) {
        test.describe(theme, () => {
          test(`default @vrt #{featureFlagEnabled ? '(css modules)':'(styled-components)'}`, async ({page}) => {
            await visit(page, {
              id: 'components-link--default',
              globals: {
                colorScheme: theme,
                featureFlags: {
                  primer_react_css_modules: featureFlagEnabled,
                },
              },
            })

            // Default state
            expect(await page.screenshot()).toMatchSnapshot(`Link.Default.${theme}.png`)

            // Hover state
            await page.getByRole('link').hover()
            expect(await page.screenshot()).toMatchSnapshot(`Link.Default.${theme}.hover.png`)

            // Focus state
            await page.keyboard.press('Tab')
            expect(await page.screenshot()).toMatchSnapshot(`Link.Default.${theme}.focus.png`)
          })

          test(`axe @aat #{featureFlagEnabled ? '(css modules)':'(styled-components)'}`, async ({page}) => {
            await visit(page, {
              id: 'components-link--default',
              globals: {
                colorScheme: theme,
                featureFlags: {
                  primer_react_css_modules: featureFlagEnabled,
                },
              },
            })
            await expect(page).toHaveNoViolations({
              rules: {
                'color-contrast': {
                  enabled: theme !== 'dark_dimmed',
                },
              },
            })
          })
        })
      }
    })

    test.describe('Muted', () => {
      for (const theme of themes) {
        test.describe(theme, () => {
          test(`default @vrt #{featureFlagEnabled ? '(css modules)':'(styled-components)'}`, async ({page}) => {
            await visit(page, {
              id: 'components-link-features--muted',
              globals: {
                colorScheme: theme,
                featureFlags: {
                  primer_react_css_modules: featureFlagEnabled,
                },
              },
            })

            // Default state
            expect(await page.screenshot()).toMatchSnapshot(`Link.Muted.${theme}.png`)

            // Hover state
            await page.getByRole('link').hover()
            expect(await page.screenshot()).toMatchSnapshot(`Link.Muted.${theme}.hover.png`)

            // Focus state
            await page.keyboard.press('Tab')
            expect(await page.screenshot()).toMatchSnapshot(`Link.Muted.${theme}.focus.png`)
          })

          test(`axe @aat #{featureFlagEnabled ? '(css modules)':'(styled-components)'}`, async ({page}) => {
            await visit(page, {
              id: 'components-link-features--muted',
              globals: {
                colorScheme: theme,
                featureFlags: {
                  primer_react_css_modules: featureFlagEnabled,
                },
              },
            })
            await expect(page).toHaveNoViolations({
              rules: {
                'color-contrast': {
                  enabled: theme !== 'dark_dimmed',
                },
              },
            })
          })
        })
      }
    })

    test.describe('Underline', () => {
      for (const theme of themes) {
        test.describe(theme, () => {
          test(`default @vrt #{featureFlagEnabled ? '(css modules)':'(styled-components)'}`, async ({page}) => {
            await visit(page, {
              id: 'components-link-features--underline',
              globals: {
                colorScheme: theme,
                featureFlags: {
                  primer_react_css_modules: featureFlagEnabled,
                },
              },
            })

            // Default state
            expect(await page.screenshot()).toMatchSnapshot(`Link.Underline.${theme}.png`)

            // Hover state
            await page.getByRole('link').hover()
            expect(await page.screenshot()).toMatchSnapshot(`Link.Underline.${theme}.hover.png`)

            // Focus state
            await page.keyboard.press('Tab')
            expect(await page.screenshot()).toMatchSnapshot(`Link.Underline.${theme}.focus.png`)
          })

          test(`axe @aat #{featureFlagEnabled ? '(css modules)':'(styled-components)'}`, async ({page}) => {
            await visit(page, {
              id: 'components-link-features--underline',
              globals: {
                colorScheme: theme,
                featureFlags: {
                  primer_react_css_modules: featureFlagEnabled,
                },
              },
            })
            await expect(page).toHaveNoViolations({
              rules: {
                'color-contrast': {
                  enabled: theme !== 'dark_dimmed',
                },
              },
            })
          })
        })
      }
    })

    test.describe('Dev: Inline', () => {
      for (const theme of themes) {
        test.describe(theme, () => {
          test(`default @vrt #{featureFlagEnabled ? '(css modules)':'(styled-components)'}`, async ({page}) => {
            await visit(page, {
              id: 'components-link-devonly--inline',
              globals: {
                colorScheme: theme,
                featureFlags: {
                  primer_react_css_modules: featureFlagEnabled,
                },
              },
            })

            // Default state
            expect(await page.screenshot()).toMatchSnapshot(`Link.Inline.${theme}.png`)
          })

          test(`axe @aat #{featureFlagEnabled ? '(css modules)':'(styled-components)'}`, async ({page}) => {
            await visit(page, {
              id: 'components-link-devonly--inline',
              globals: {
                colorScheme: theme,
                featureFlags: {
                  primer_react_css_modules: featureFlagEnabled,
                },
              },
            })
            await expect(page).toHaveNoViolations({
              rules: {
                'color-contrast': {
                  enabled: theme !== 'dark_dimmed',
                },
              },
            })
          })
        })
      }
    })
  }
})
