import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

test.describe('Avatar', () => {
  for (const enabled of [true, false]) {
    test.describe(`Feature flag enabled: ${enabled}`, () => {
      test.describe('Default', () => {
        for (const theme of themes) {
          test.describe(theme, () => {
            test('default @vrt', async ({page}) => {
              await visit(page, {
                id: 'components-avatar--default',
                globals: {
                  colorScheme: theme,
                  primer_react_css_modules_staff: enabled,
                },
              })

              // Default state
              expect(await page.screenshot()).toMatchSnapshot(`Avatar.Default.${theme}.png`)
            })

            test('axe @aat', async ({page}) => {
              await visit(page, {
                id: 'components-avatar--default',
                globals: {
                  colorScheme: theme,
                  primer_react_css_modules_staff: enabled,
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

      test.describe('Size', () => {
        for (const theme of themes) {
          test.describe(theme, () => {
            test('default @vrt', async ({page}) => {
              await visit(page, {
                id: 'components-avatar-features--size',
                globals: {
                  colorScheme: theme,
                  primer_react_css_modules_staff: enabled,
                },
              })

              // Default state
              expect(await page.screenshot()).toMatchSnapshot(`Avatar.Size.${theme}.png`)
            })

            test('axe @aat', async ({page}) => {
              await visit(page, {
                id: 'components-avatar-features--size',
                globals: {
                  colorScheme: theme,
                  primer_react_css_modules_staff: enabled,
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

      test.describe('Size Responsive', () => {
        for (const theme of themes) {
          test.describe(theme, () => {
            test('default @vrt', async ({page}) => {
              await visit(page, {
                id: 'components-avatar-features--size-responsive',
                globals: {
                  colorScheme: theme,
                  primer_react_css_modules_staff: enabled,
                },
              })

              // Default state
              expect(await page.screenshot()).toMatchSnapshot(`Avatar.Size Responsive.${theme}.png`)
            })

            test('axe @aat', async ({page}) => {
              await visit(page, {
                id: 'components-avatar-features--size-responsive',
                globals: {
                  colorScheme: theme,
                  primer_react_css_modules_staff: enabled,
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

      test.describe('Square', () => {
        for (const theme of themes) {
          test.describe(theme, () => {
            test('default @vrt', async ({page}) => {
              await visit(page, {
                id: 'components-avatar-features--square',
                globals: {
                  colorScheme: theme,
                  primer_react_css_modules_staff: enabled,
                },
              })

              // Default state
              expect(await page.screenshot()).toMatchSnapshot(`Avatar.Square.${theme}.png`)
            })

            test('axe @aat', async ({page}) => {
              await visit(page, {
                id: 'components-avatar-features--square',
                globals: {
                  colorScheme: theme,
                  primer_react_css_modules_staff: enabled,
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
