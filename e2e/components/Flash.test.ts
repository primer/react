import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

test.describe('Flash', () => {
  test.describe('Default', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-flash--default',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`Flash.Default.${theme}.png`)
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-flash--default',
            globals: {
              colorScheme: theme,
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
            id: 'components-flash-features--danger',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`Flash.Danger.${theme}.png`)
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-flash-features--danger',
            globals: {
              colorScheme: theme,
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

  test.describe('Full', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-flash-features--full',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`Flash.Full.${theme}.png`)
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-flash-features--full',
            globals: {
              colorScheme: theme,
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
            id: 'components-flash-features--success',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`Flash.Success.${theme}.png`)
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-flash-features--success',
            globals: {
              colorScheme: theme,
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

  test.describe('Warning', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-flash-features--warning',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`Flash.Warning.${theme}.png`)
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-flash-features--warning',
            globals: {
              colorScheme: theme,
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
