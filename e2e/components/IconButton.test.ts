import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

test.describe('IconButton', () => {
  for (const featureFlagOn of [true, false]) {
    test.describe(`Feature flag: ${featureFlagOn ? 'on' : 'off'}`, () => {
      test.describe('Playground', () => {
        for (const theme of themes) {
          test.describe(theme, () => {
            test('default @vrt', async ({page}) => {
              await visit(page, {
                id: 'components-iconbutton--playground',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_team: featureFlagOn,
                  },
                },
              })

              // Default state
              expect(await page.screenshot()).toMatchSnapshot(`IconButton.Playground.${theme}.png`)
            })

            test('axe @aat', async ({page}) => {
              await visit(page, {
                id: 'components-iconbutton--playground',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_team: featureFlagOn,
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

      test.describe('Danger', () => {
        for (const theme of themes) {
          test.describe(theme, () => {
            test('default @vrt', async ({page}) => {
              await visit(page, {
                id: 'components-iconbutton-features--danger',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_team: featureFlagOn,
                  },
                },
              })

              // Default state
              expect(await page.screenshot()).toMatchSnapshot(`IconButton.Danger.${theme}.png`)
            })

            test('axe @aat', async ({page}) => {
              await visit(page, {
                id: 'components-iconbutton-features--danger',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_team: featureFlagOn,
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

      test.describe('Default', () => {
        for (const theme of themes) {
          test.describe(theme, () => {
            test('default @vrt', async ({page}) => {
              await visit(page, {
                id: 'components-iconbutton--default',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_team: featureFlagOn,
                  },
                },
              })

              // Default state
              expect(await page.screenshot()).toMatchSnapshot(`IconButton.Default.${theme}.png`)
            })

            test('axe @aat', async ({page}) => {
              await visit(page, {
                id: 'components-iconbutton--default',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_team: featureFlagOn,
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

      test.describe('Disabled', () => {
        for (const theme of themes) {
          test.describe(theme, () => {
            test('default @vrt', async ({page}) => {
              await visit(page, {
                id: 'components-iconbutton-features--disabled',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_team: featureFlagOn,
                  },
                },
              })

              // Default state
              expect(await page.screenshot()).toMatchSnapshot(`IconButton.Disabled.${theme}.png`)
            })

            test('axe @aat', async ({page}) => {
              await visit(page, {
                id: 'components-iconbutton-features--disabled',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_team: featureFlagOn,
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

      test.describe('Invisible', () => {
        for (const theme of themes) {
          test.describe(theme, () => {
            test('default @vrt', async ({page}) => {
              await visit(page, {
                id: 'components-iconbutton-features--invisible',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_team: featureFlagOn,
                  },
                },
              })

              // Default state
              expect(await page.screenshot()).toMatchSnapshot(`IconButton.Invisible.${theme}.png`)
            })

            test('axe @aat', async ({page}) => {
              await visit(page, {
                id: 'components-iconbutton-features--invisible',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_team: featureFlagOn,
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

      test.describe('Large', () => {
        for (const theme of themes) {
          test.describe(theme, () => {
            test('default @vrt', async ({page}) => {
              await visit(page, {
                id: 'components-iconbutton-features--large',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_team: featureFlagOn,
                  },
                },
              })

              // Default state
              expect(await page.screenshot()).toMatchSnapshot(`IconButton.Large.${theme}.png`)
            })

            test('axe @aat', async ({page}) => {
              await visit(page, {
                id: 'components-iconbutton-features--large',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_team: featureFlagOn,
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

      test.describe('Medium', () => {
        for (const theme of themes) {
          test.describe(theme, () => {
            test('default @vrt', async ({page}) => {
              await visit(page, {
                id: 'components-iconbutton-features--medium',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_team: featureFlagOn,
                  },
                },
              })

              // Default state
              expect(await page.screenshot()).toMatchSnapshot(`IconButton.Medium.${theme}.png`)
            })

            test('axe @aat', async ({page}) => {
              await visit(page, {
                id: 'components-iconbutton-features--medium',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_team: featureFlagOn,
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

      test.describe('Primary', () => {
        for (const theme of themes) {
          test.describe(theme, () => {
            test('default @vrt', async ({page}) => {
              await visit(page, {
                id: 'components-iconbutton-features--primary',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_team: featureFlagOn,
                  },
                },
              })

              // Default state
              expect(await page.screenshot()).toMatchSnapshot(`IconButton.Primary.${theme}.png`)
            })

            test('axe @aat', async ({page}) => {
              await visit(page, {
                id: 'components-iconbutton-features--primary',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_team: featureFlagOn,
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

      test.describe('Small', () => {
        for (const theme of themes) {
          test.describe(theme, () => {
            test('default @vrt', async ({page}) => {
              await visit(page, {
                id: 'components-iconbutton-features--small',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_team: featureFlagOn,
                  },
                },
              })

              // Default state
              expect(await page.screenshot()).toMatchSnapshot(`IconButton.Small.${theme}.png`)
            })

            test('axe @aat', async ({page}) => {
              await visit(page, {
                id: 'components-iconbutton-features--small',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_team: featureFlagOn,
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
      test.describe('Keyshortcuts', () => {
        for (const theme of themes) {
          test.describe(theme, () => {
            test('default @vrt', async ({page}) => {
              await visit(page, {
                id: 'components-iconbutton-features--keyshortcuts',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_team: featureFlagOn,
                  },
                },
              })

              // Default state
              await page.keyboard.press('Tab') // focus on icon button
              expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
                `IconButton.Keyshortcuts.${theme}.png`,
              )
            })

            test('axe @aat', async ({page}) => {
              await visit(page, {
                id: 'components-iconbutton-features--keyshortcuts',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_team: featureFlagOn,
                  },
                },
              })
              await page.keyboard.press('Tab') // focus on icon button
              await expect(page).toHaveNoViolations()
            })
          })
        }
      })

      test.describe('Keyshortcuts on Description', () => {
        for (const theme of themes) {
          test.describe(theme, () => {
            test('default @vrt', async ({page}) => {
              await visit(page, {
                id: 'components-iconbutton-features--keyshortcuts-on-description',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_team: featureFlagOn,
                  },
                },
              })

              // Default state
              await page.keyboard.press('Tab') // focus on icon button
              expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
                `IconButton.Keyshortcuts on Description.${theme}.png`,
              )
            })

            test('axe @aat', async ({page}) => {
              await visit(page, {
                id: 'components-iconbutton-features--keyshortcuts-on-description',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_team: featureFlagOn,
                  },
                },
              })
              await page.keyboard.press('Tab') // focus on icon button
              await expect(page).toHaveNoViolations()
            })
          })
        }
      })
    })
  }
})
