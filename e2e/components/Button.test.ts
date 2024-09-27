import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

test.describe('Button', () => {
  for (const featureFlagOn of [true, false]) {
    test.describe(`Feature flag: ${featureFlagOn ? 'on' : 'off'}`, () => {
      test.describe('Danger', () => {
        for (const theme of themes) {
          test.describe(theme, () => {
            test('default @vrt', async ({page}) => {
              await visit(page, {
                id: 'components-button-features--danger',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_staff: featureFlagOn,
                  },
                },
              })

              // Default state
              expect(await page.screenshot()).toMatchSnapshot(`Button.Danger.${theme}.png`)
            })

            test('axe @aat', async ({page}) => {
              await visit(page, {
                id: 'components-button-features--danger',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_staff: featureFlagOn,
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
                id: 'components-button--default',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_staff: featureFlagOn,
                  },
                },
              })

              // Default state
              expect(await page.screenshot()).toMatchSnapshot(`Button.Default.${theme}.png`)
            })

            test('axe @aat', async ({page}) => {
              await visit(page, {
                id: 'components-button--default',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_staff: featureFlagOn,
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
                id: 'components-button-features--disabled',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_staff: featureFlagOn,
                  },
                },
              })

              // Default state
              expect(await page.screenshot()).toMatchSnapshot(`Button.Disabled.${theme}.png`)
            })

            test('axe @aat', async ({page}) => {
              await visit(page, {
                id: 'components-button-features--disabled',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_staff: featureFlagOn,
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
                id: 'components-button-features--invisible',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_staff: featureFlagOn,
                  },
                },
              })

              // Default state
              expect(await page.screenshot()).toMatchSnapshot(`Button.Invisible.${theme}.png`)
            })

            test('axe @aat', async ({page}) => {
              await visit(page, {
                id: 'components-button-features--invisible',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_staff: featureFlagOn,
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

      test.describe('Link', () => {
        for (const theme of themes) {
          test.describe(theme, () => {
            test('default @vrt', async ({page}) => {
              await visit(page, {
                id: 'components-button-features--link',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_staff: featureFlagOn,
                  },
                },
              })

              // Default state
              expect(await page.screenshot()).toMatchSnapshot(`Button.Link.${theme}.png`)
            })

            test('axe @aat', async ({page}) => {
              await visit(page, {
                id: 'components-button-features--link',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_staff: featureFlagOn,
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
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-button-features--large',
            globals: {
              featureFlags: {
                primer_react_css_modules_staff: featureFlagOn,
              },
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`Button.Large.png`)
        })
      })

      test.describe('Leading Visual', () => {
        for (const theme of themes) {
          test.describe(theme, () => {
            test('default @vrt', async ({page}) => {
              await visit(page, {
                id: 'components-button-features--leading-visual',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_staff: featureFlagOn,
                  },
                },
              })

              // Default state
              expect(await page.screenshot()).toMatchSnapshot(`Button.Leading Visual.${theme}.png`)
            })

            test('axe @aat', async ({page}) => {
              await visit(page, {
                id: 'components-button-features--leading-visual',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_staff: featureFlagOn,
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
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-button-features--medium',
            globals: {
              featureFlags: {
                primer_react_css_modules_staff: featureFlagOn,
              },
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`Button.Medium.png`)
        })
      })

      test.describe('Primary', () => {
        for (const theme of themes) {
          test.describe(theme, () => {
            test('default @vrt', async ({page}) => {
              await visit(page, {
                id: 'components-button-features--primary',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_staff: featureFlagOn,
                  },
                },
              })

              // Default state
              expect(await page.screenshot()).toMatchSnapshot(`Button.Primary.${theme}.png`)
            })

            test.fixme('axe @aat', async ({page}) => {
              await visit(page, {
                id: 'components-button-features--primary',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_staff: featureFlagOn,
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
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-button-features--small',
            globals: {
              featureFlags: {
                primer_react_css_modules_staff: featureFlagOn,
              },
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`Button.Small.png`)
        })
      })

      test.describe('Trailing Action', () => {
        for (const theme of themes) {
          test.describe(theme, () => {
            test('default @vrt', async ({page}) => {
              await visit(page, {
                id: 'components-button-features--trailing-action',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_staff: featureFlagOn,
                  },
                },
              })

              // Default state
              expect(await page.screenshot()).toMatchSnapshot(`Button.Trailing Action.${theme}.png`)
            })

            test('axe @aat', async ({page}) => {
              await visit(page, {
                id: 'components-button-features--trailing-action',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_staff: featureFlagOn,
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

      test.describe('Trailing Counter', () => {
        for (const theme of themes) {
          test.describe(theme, () => {
            test('default @vrt', async ({page}) => {
              await visit(page, {
                id: 'components-button-features--trailing-counter',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_staff: featureFlagOn,
                  },
                },
              })

              // Default state
              expect(await page.screenshot()).toMatchSnapshot(`Button.Trailing Counter.${theme}.png`)
            })

            test('axe @aat', async ({page}) => {
              await visit(page, {
                id: 'components-button-features--trailing-counter',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_staff: featureFlagOn,
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

      test.describe('Trailing Visual', () => {
        for (const theme of themes) {
          test.describe(theme, () => {
            test('default @vrt', async ({page}) => {
              await visit(page, {
                id: 'components-button-features--trailing-visual',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_staff: featureFlagOn,
                  },
                },
              })

              // Default state
              expect(await page.screenshot()).toMatchSnapshot(`Button.Trailing Visual.${theme}.png`)
            })

            test('axe @aat', async ({page}) => {
              await visit(page, {
                id: 'components-button-features--trailing-visual',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_staff: featureFlagOn,
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

      test.describe('Inactive', () => {
        for (const theme of themes) {
          test.describe(theme, () => {
            test('default @vrt', async ({page}) => {
              await visit(page, {
                id: 'components-button-features--inactive',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_staff: featureFlagOn,
                  },
                },
              })

              // Default state
              expect(await page.screenshot()).toMatchSnapshot(`Button.Inactive.${theme}.png`)
            })

            test('axe @aat', async ({page}) => {
              await visit(page, {
                id: 'components-button-features--inactive',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_staff: featureFlagOn,
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

      test.describe('Loading', () => {
        for (const theme of themes) {
          test.describe(theme, () => {
            test('default @vrt', async ({page}) => {
              await visit(page, {
                id: 'components-button-features--loading',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_staff: featureFlagOn,
                  },
                },
              })

              // Default state
              expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(`Button.Loading.${theme}.png`)
            })

            test('axe @aat', async ({page}) => {
              await visit(page, {
                id: 'components-button-features--loading',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_staff: featureFlagOn,
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

      test.describe('Loading With Leading Visual', () => {
        for (const theme of themes) {
          test.describe(theme, () => {
            test('default @vrt', async ({page}) => {
              await visit(page, {
                id: 'components-button-features--loading-with-leading-visual',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_staff: featureFlagOn,
                  },
                },
              })

              // Default state
              expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
                `Button.Loading With Leading Visual.${theme}.png`,
              )
            })

            test('axe @aat', async ({page}) => {
              await visit(page, {
                id: 'components-button-features--loading-with-leading-visual',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_staff: featureFlagOn,
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

      test.describe('Loading With Trailing Visual', () => {
        for (const theme of themes) {
          test.describe(theme, () => {
            test('default @vrt', async ({page}) => {
              await visit(page, {
                id: 'components-button-features--loading-with-trailing-visual',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_staff: featureFlagOn,
                  },
                },
              })

              // Default state
              expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
                `Button.Loading With Trailing Visual.${theme}.png`,
              )
            })

            test('axe @aat', async ({page}) => {
              await visit(page, {
                id: 'components-button-features--loading-with-trailing-visual',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_staff: featureFlagOn,
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

      test.describe('Loading With Trailing Action', () => {
        for (const theme of themes) {
          test.describe(theme, () => {
            test('default @vrt', async ({page}) => {
              await visit(page, {
                id: 'components-button-features--loading-with-trailing-action',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_staff: featureFlagOn,
                  },
                },
              })

              // Default state
              expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
                `Button.Loading With Trailing Action.${theme}.png`,
              )
            })

            test('axe @aat', async ({page}) => {
              await visit(page, {
                id: 'components-button-features--loading-with-trailing-action',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_staff: featureFlagOn,
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

      test.describe('Dev: Invisible Variants', () => {
        for (const theme of themes) {
          test.describe(theme, () => {
            test('default @vrt', async ({page}) => {
              await visit(page, {
                id: 'components-button-devonly--invisible-variants',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_staff: featureFlagOn,
                  },
                },
              })

              // Default state
              expect(await page.screenshot()).toMatchSnapshot(`Button.Invisible Variants.${theme}.png`)
            })
          })
        }
      })

      test.describe('Dev: sx prop', () => {
        for (const theme of themes) {
          test.describe(theme, () => {
            test('default @vrt', async ({page}) => {
              await visit(page, {
                id: 'components-button-devonly--test-sx-prop',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_staff: featureFlagOn,
                  },
                },
              })

              // Default state
              expect(await page.screenshot()).toMatchSnapshot(`Button.sx prop.${theme}.png`)
            })
          })
        }
      })

      test.describe('Aria expanded buttons', () => {
        for (const theme of themes) {
          test.describe(theme, () => {
            test('default @vrt', async ({page}) => {
              await visit(page, {
                id: 'components-button-features--expanded-button',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_staff: featureFlagOn,
                  },
                },
              })

              // Default state
              expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
                `Button.Aria expanded buttons.${theme}.png`,
              )
            })

            // temporarily disabled due to a bug in primer/primitves

            // eslint-disable-next-line jest/no-commented-out-tests
            // test('axe @aat', async ({page}) => {
            //   await visit(page, {
            //     id: 'components-button-features--expanded-button',
            //     globals: {
            //       colorScheme: theme,
            //       featureFlags: {
            //         primer_react_css_modules_staff: featureFlagOn,
            //       },
            //     },
            //   })
            //   await expect(page).toHaveNoViolations({
            //     rules: {
            //       'color-contrast': {
            //         enabled: theme !== 'dark_dimmed',
            //       },
            //     },
            //   })
            // })
          })
        }
      })
    })
  }
})
