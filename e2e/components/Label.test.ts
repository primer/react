import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

test.describe('Label', () => {
  for (const enabled of [true, false]) {
    test.describe(`Feature flag enabled: ${enabled}`, () => {
      test.describe('Default', () => {
        for (const theme of themes) {
          test.describe(theme, () => {
            test('default @vrt', async ({page}) => {
              await visit(page, {
                id: 'components-label--default',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_staff: enabled,
                  },
                },
              })

              // Default state
              expect(await page.screenshot()).toMatchSnapshot(`Label.Default.${theme}.png`)
            })

            test('axe @aat', async ({page}) => {
              await visit(page, {
                id: 'components-label--default',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_staff: enabled,
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

      test.describe('Playground', () => {
        for (const theme of themes) {
          test.describe(theme, () => {
            test('default @vrt', async ({page}) => {
              await visit(page, {
                id: 'components-label--playground',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_staff: enabled,
                  },
                },
              })

              // Default state
              expect(await page.screenshot()).toMatchSnapshot(`Label.Playground.${theme}.png`)
            })

            test('axe @aat', async ({page}) => {
              await visit(page, {
                id: 'components-label--playground',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_staff: enabled,
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

      test.describe('Accent', () => {
        for (const theme of themes) {
          test.describe(theme, () => {
            test('default @vrt', async ({page}) => {
              await visit(page, {
                id: 'components-label-features--accent',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_staff: enabled,
                  },
                },
              })

              // Default state
              expect(await page.screenshot()).toMatchSnapshot(`Label.Accent.${theme}.png`)
            })

            test('axe @aat', async ({page}) => {
              await visit(page, {
                id: 'components-label-features--accent',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_staff: enabled,
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

      test.describe('Attention', () => {
        for (const theme of themes) {
          test.describe(theme, () => {
            test('default @vrt', async ({page}) => {
              await visit(page, {
                id: 'components-label-features--attention',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_staff: enabled,
                  },
                },
              })

              // Default state
              expect(await page.screenshot()).toMatchSnapshot(`Label.Attention.${theme}.png`)
            })

            test('axe @aat', async ({page}) => {
              await visit(page, {
                id: 'components-label-features--attention',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_staff: enabled,
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
                id: 'components-label-features--danger',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_staff: enabled,
                  },
                },
              })

              // Default state
              expect(await page.screenshot()).toMatchSnapshot(`Label.Danger.${theme}.png`)
            })

            test('axe @aat', async ({page}) => {
              await visit(page, {
                id: 'components-label-features--danger',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_staff: enabled,
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

      test.describe('Done', () => {
        for (const theme of themes) {
          test.describe(theme, () => {
            test('default @vrt', async ({page}) => {
              await visit(page, {
                id: 'components-label-features--done',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_staff: enabled,
                  },
                },
              })

              // Default state
              expect(await page.screenshot()).toMatchSnapshot(`Label.Done.${theme}.png`)
            })

            test('axe @aat', async ({page}) => {
              await visit(page, {
                id: 'components-label-features--done',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_staff: enabled,
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
                id: 'components-label-features--primary',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_staff: enabled,
                  },
                },
              })

              // Default state
              expect(await page.screenshot()).toMatchSnapshot(`Label.Primary.${theme}.png`)
            })

            test('axe @aat', async ({page}) => {
              await visit(page, {
                id: 'components-label-features--primary',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_staff: enabled,
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

      test.describe('Secondary', () => {
        for (const theme of themes) {
          test.describe(theme, () => {
            test('default @vrt', async ({page}) => {
              await visit(page, {
                id: 'components-label-features--secondary',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_staff: enabled,
                  },
                },
              })

              // Default state
              expect(await page.screenshot()).toMatchSnapshot(`Label.Secondary.${theme}.png`)
            })

            test('axe @aat', async ({page}) => {
              await visit(page, {
                id: 'components-label-features--secondary',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_staff: enabled,
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

      test.describe('Severe', () => {
        for (const theme of themes) {
          test.describe(theme, () => {
            test('default @vrt', async ({page}) => {
              await visit(page, {
                id: 'components-label-features--severe',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_staff: enabled,
                  },
                },
              })

              // Default state
              expect(await page.screenshot()).toMatchSnapshot(`Label.Severe.${theme}.png`)
            })

            test('axe @aat', async ({page}) => {
              await visit(page, {
                id: 'components-label-features--severe',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_staff: enabled,
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

      test.describe('Size Large', () => {
        for (const theme of themes) {
          test.describe(theme, () => {
            test('default @vrt', async ({page}) => {
              await visit(page, {
                id: 'components-label-features--size-large',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_staff: enabled,
                  },
                },
              })

              // Default state
              expect(await page.screenshot()).toMatchSnapshot(`Label.Size Large.${theme}.png`)
            })

            test('axe @aat', async ({page}) => {
              await visit(page, {
                id: 'components-label-features--size-large',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_staff: enabled,
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

      test.describe('Size Small', () => {
        for (const theme of themes) {
          test.describe(theme, () => {
            test('default @vrt', async ({page}) => {
              await visit(page, {
                id: 'components-label-features--size-small',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_staff: enabled,
                  },
                },
              })

              // Default state
              expect(await page.screenshot()).toMatchSnapshot(`Label.Size Small.${theme}.png`)
            })

            test('axe @aat', async ({page}) => {
              await visit(page, {
                id: 'components-label-features--size-small',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_staff: enabled,
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

      test.describe('Sponsors', () => {
        for (const theme of themes) {
          test.describe(theme, () => {
            test('default @vrt', async ({page}) => {
              await visit(page, {
                id: 'components-label-features--sponsors',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_staff: enabled,
                  },
                },
              })

              // Default state
              expect(await page.screenshot()).toMatchSnapshot(`Label.Sponsors.${theme}.png`)
            })

            test('axe @aat', async ({page}) => {
              await visit(page, {
                id: 'components-label-features--sponsors',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_staff: enabled,
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

      test.describe('Success', () => {
        for (const theme of themes) {
          test.describe(theme, () => {
            test('default @vrt', async ({page}) => {
              await visit(page, {
                id: 'components-label-features--success',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_staff: enabled,
                  },
                },
              })

              // Default state
              expect(await page.screenshot()).toMatchSnapshot(`Label.Success.${theme}.png`)
            })

            test('axe @aat', async ({page}) => {
              await visit(page, {
                id: 'components-label-features--success',
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_modules_staff: enabled,
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
    })
  }
})
