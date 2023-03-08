import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

test.describe('DialogV2', () => {
  test.describe('Default', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'drafts-components-dialog--default',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(
            await page.screenshot({
              animations: 'disabled',
            }),
          ).toMatchSnapshot(`DialogV2.Default.${theme}.png`)
          // Open Dialog
          await page.getByRole('button', {name: 'Show dialog'}).click()
          // wait for dialog to open
          await page.getByRole('dialog', {name: 'Dialog'}).waitFor()
          // Open state
          expect(
            await page.screenshot({
              animations: 'disabled',
            }),
          ).toMatchSnapshot(`DialogV2.Default.${theme}.open.png`)
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'drafts-components-dialog--default',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('Basic Dialog', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'drafts-components-dialog-features--basic-dialog',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(
            await page.screenshot({
              animations: 'disabled',
            }),
          ).toMatchSnapshot(`DialogV2.Basic Dialog.${theme}.png`)
          // Open Dialog
          await page.getByRole('button', {name: 'Show dialog'}).click()
          // wait for dialog to open
          await page.getByRole('dialog', {name: 'Dialog'}).waitFor()
          // Open state
          expect(
            await page.screenshot({
              animations: 'disabled',
            }),
          ).toMatchSnapshot(`DialogV2.Basic Dialog.${theme}.open.png`)
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'drafts-components-dialog-features--basic-dialog',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('Basic Confirmation Dialog', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'drafts-components-dialog-features--basic-confirmation-dialog',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(
            await page.screenshot({
              animations: 'disabled',
            }),
          ).toMatchSnapshot(`DialogV2.Basic Confirmation Dialog.${theme}.png`)
          // Open Dialog
          await page.getByRole('button', {name: 'Show dialog'}).click()
          // wait for dialog to open
          await page.getByRole('alertdialog').waitFor()
          // Open state
          expect(
            await page.screenshot({
              animations: 'disabled',
            }),
          ).toMatchSnapshot(`DialogV2.Basic Confirmation Dialog.${theme}.open.png`)
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'drafts-components-dialog-features--basic-confirmation-dialog',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })
})
