import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

test.describe('Dialog', () => {
  test.describe('Default', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-dialog--default',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`Dialog.Default.${theme}.png`)
          // Open Dialog
          await page.getByRole('button', {name: 'Show dialog'}).click()
          expect(await page.screenshot()).toMatchSnapshot(`Dialog.Default.${theme}.open.png`)
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-dialog--default',
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

  test.describe('Basic Dialog', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-dialog-features--basic-dialog',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`Dialog.Basic Dialog.${theme}.png`)
          // Open Dialog
          await page.getByRole('button', {name: 'Show dialog'}).click()
          expect(await page.screenshot()).toMatchSnapshot(`Dialog.Basic Dialog.${theme}.open.png`)
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-dialog-features--basic-dialog',
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
