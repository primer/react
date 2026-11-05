import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'

test.describe('DataTable selection announcements', () => {
  test('inactive actions leave the table tree and clearing restores keyboard focus @aat', async ({page}) => {
    await visit(page, {id: 'experimental-components-datatable-features--with-bulk-actions'})
    const headerRows = page.getByRole('table').locator('thead').getByRole('row')
    const message = page.locator('live-region [aria-live="polite"]')
    await page.getByRole('button', {name: 'Reset repositories', exact: true}).click()
    await expect(headerRows).toHaveCount(1)
    await expect(message).toHaveText('0 selected')
    await expect(page).toHaveNoViolations()

    const row = page.getByRole('checkbox', {name: 'Select primer/react', exact: true})
    await row.focus()
    await page.keyboard.press('Space')
    await expect(row).toBeFocused()
    await expect(message).toHaveText('1 selected')
    await expect(headerRows).toHaveCount(2)
    await expect(page.getByRole('columnheader', {name: 'Repository', exact: true})).toHaveCount(1)
    await expect(page.getByRole('button', {name: 'Repository', exact: true})).toHaveCount(0)
    await expect(page).toHaveNoViolations()

    await page.getByRole('button', {name: 'Make internal', exact: true}).focus()
    await page.keyboard.press('Enter')
    await expect(page.getByRole('checkbox', {name: 'Select rows', exact: true})).toBeFocused()
    await expect(message).toHaveText('0 selected')
    await expect(headerRows).toHaveCount(1)
    await expect(page.getByRole('button', {name: 'Repository', exact: true})).toHaveCount(1)
    await expect(page).toHaveNoViolations()
  })

  test('selection without a toolbar updates the shared live region @aat', async ({page}) => {
    await visit(page, {id: 'experimental-components-datatable-features--with-row-selection'})
    const selectAll = page.getByRole('checkbox', {name: 'Select rows', exact: true})
    const message = page.locator('live-region [aria-live="polite"]')
    await selectAll.focus()
    await page.keyboard.press('Space')
    await expect(message).toHaveText('8 selected')
    await expect(selectAll).toBeFocused()
    await page.keyboard.press('Space')
    await expect(message).toHaveText('0 selected')
    await expect(selectAll).toBeFocused()
    await expect(page).toHaveNoViolations()
  })
})
