import {test, expect} from '@playwright/test'
import {visit} from '../../test-helpers/storybook'
import {themes} from '../../test-helpers/themes'

test.describe('SelectPanel', () => {
  test.describe('Default', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'drafts-components-selectpanel--default',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          await page.getByText('Assign label').click()
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `drafts.SelectPanel.Default.${theme}.png`,
          )
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'drafts-components-selectpanel--default',
            globals: {
              colorScheme: theme,
            },
          })
          await page.getByText('Assign label').click()
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('As Modal', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'drafts-components-selectpanel-features--as-modal',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          await page.getByText('Assign label').click()
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `drafts.SelectPanel.As Modal.${theme}.png`,
          )
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'drafts-components-selectpanel-features--as-modal',
            globals: {
              colorScheme: theme,
            },
          })
          await page.getByText('Assign label').click()
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('Instant Selection Variant', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'drafts-components-selectpanel-features--instant-selection-variant',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          await page.getByText('Choose a tag').click()
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `drafts.SelectPanel.Instant Selection Variant.${theme}.png`,
          )
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'drafts-components-selectpanel-features--instant-selection-variant',
            globals: {
              colorScheme: theme,
            },
          })
          await page.getByText('Choose a tag').click()
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('With Errors', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'drafts-components-selectpanel-features--with-errors',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          await page.getByLabel('Break issues API').click()
          await page.getByText('Assignees').click()
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `drafts.SelectPanel.With Errors.${theme}.png`,
          )
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'drafts-components-selectpanel-features--with-errors',
            globals: {
              colorScheme: theme,
            },
          })
          await page.getByLabel('Break issues API').click()
          await page.getByText('Assignees').click()
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('With Warning', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'drafts-components-selectpanel-features--with-warning',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          await page.getByText('Assignees').click()
          await page.getByRole('option').nth(1).click()
          await page.getByRole('option').nth(2).click()

          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `drafts.SelectPanel.With Warnings.${theme}.png`,
          )
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'drafts-components-selectpanel-features--with-warning',
            globals: {
              colorScheme: theme,
            },
          })
          await page.getByText('Assignees').click()
          await page.getByRole('option').nth(1).click()
          await page.getByRole('option').nth(2).click()
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })
})
