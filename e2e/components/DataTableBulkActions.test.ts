import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const storyId = 'experimental-components-datatable-features--with-bulk-actions'

test.describe('DataTable bulk actions', () => {
  for (const theme of themes) {
    test(`${theme} @avt`, async ({page}) => {
      await visit(page, {
        id: storyId,
        globals: {colorScheme: theme},
      })
      await expect(page).toHaveNoViolations()
    })
  }

  test('bulk actions replace column labels beside the header checkbox @avt', async ({page}) => {
    await visit(page, {id: storyId})
    const selectAll = page.getByRole('checkbox', {name: 'Select rows', exact: true})
    await selectAll.focus()
    await page.keyboard.press('Space')
    await expect(selectAll).toBeFocused()
    const actions = page.getByRole('table').getByRole('group', {name: 'Bulk actions'})
    await expect(page.getByRole('button', {name: 'Repository', exact: true})).toHaveCount(0)
    await expect(page.getByRole('columnheader', {name: 'Repository', exact: true})).toHaveCount(1)
    await expect(actions.getByText('3 rows selected')).toBeVisible()
    const actionsBox = await actions.boundingBox()
    const headerBox = await selectAll.boundingBox()
    expect(actionsBox).not.toBeNull()
    expect(headerBox).not.toBeNull()
    expect(headerBox!.y).toBeGreaterThanOrEqual(actionsBox!.y)
    expect(headerBox!.y + headerBox!.height).toBeLessThanOrEqual(actionsBox!.y + actionsBox!.height)
    expect(headerBox!.x + headerBox!.width).toBeLessThan(actionsBox!.x)

    await page.keyboard.press('Tab')
    await expect(actions.getByRole('button', {name: 'Clear selection'})).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(selectAll).toBeFocused()
    await expect(actions).toHaveCount(0)
    await expect(page.getByRole('button', {name: 'Repository', exact: true})).toBeVisible()
    await expect(page).toHaveNoViolations()
  })

  test('deletion and final-record focus @avt', async ({page}) => {
    await visit(page, {id: storyId})
    await page.getByRole('button', {name: 'Delete selected'}).click()
    await expect(page.locator('#storybook-root').getByText('1 repository deleted')).toBeVisible()
    const selectAll = page.getByRole('checkbox', {name: 'Select rows', exact: true})
    await expect(selectAll).toBeFocused()

    await selectAll.click()
    await page.getByRole('button', {name: 'Delete selected'}).click()
    await expect(page.getByRole('rowheader')).toHaveCount(0)
    await expect(page.getByRole('button', {name: 'Reset repositories'})).toBeFocused()
    await expect(selectAll).toBeDisabled()
    await expect(page).toHaveNoViolations()
  })

  for (const theme of ['light', 'dark'] as const) {
    test(`mixed ${theme} @vrt`, async ({page}) => {
      await visit(page, {
        id: storyId,
        globals: {colorScheme: theme},
      })
      await expect(page).toHaveScreenshot(`DataTable.BulkActions.Mixed.${theme}.png`)
    })
  }

  test('header actions remain reachable in a narrow scrolling table with text-spacing overrides @avt', async ({
    page,
  }) => {
    await page.setViewportSize({width: 320, height: 256})
    await visit(page, {id: storyId})
    await page.addStyleTag({
      content:
        '* {line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important;} p {margin-bottom: 2em !important;}',
    })
    const actions = page.getByRole('group', {name: 'Bulk actions'})
    await expect(actions.getByRole('button', {name: 'Clear selection'})).toBeVisible()
    await expect(actions.getByRole('button', {name: 'Delete selected'})).toBeVisible()
    const dimensions = await actions.evaluate(element => ({
      width: element.clientWidth,
      scrollWidth: element.scrollWidth,
    }))
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.width)
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320)
    const deleteButton = actions.getByRole('button', {name: 'Delete selected'})
    await deleteButton.focus()
    await expect(deleteButton).toBeInViewport({ratio: 1})
    const buttonBox = await deleteButton.boundingBox()
    expect(buttonBox!.width).toBeLessThanOrEqual(320)
    await actions.getByRole('button', {name: 'Clear selection'}).click()
    await expect(page.getByRole('checkbox', {name: 'Select rows', exact: true})).toBeFocused()
  })
})
