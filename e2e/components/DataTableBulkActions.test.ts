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
    await expect(actions.getByText('3 selected')).toBeVisible()
    await expect(actions.getByRole('button', {name: 'Clear selection'})).toHaveCount(0)
    const actionsBox = await actions.boundingBox()
    const headerBox = await selectAll.boundingBox()
    expect(actionsBox).not.toBeNull()
    expect(headerBox).not.toBeNull()
    expect(headerBox!.y).toBeGreaterThanOrEqual(actionsBox!.y)
    expect(headerBox!.y + headerBox!.height).toBeLessThanOrEqual(actionsBox!.y + actionsBox!.height)
    expect(headerBox!.x + headerBox!.width).toBeLessThan(actionsBox!.x)

    await page.keyboard.press('Tab')
    await expect(actions.getByRole('button', {name: 'Make internal'})).toBeFocused()
    await page.keyboard.press('Tab')
    await expect(actions.getByRole('button', {name: 'Delete selected'})).toBeFocused()
    await page.keyboard.press('Shift+Tab')
    await page.keyboard.press('Shift+Tab')
    await page.keyboard.press('Space')
    await expect(selectAll).toBeFocused()
    await expect(actions).toHaveCount(0)
    await expect(page.getByRole('button', {name: 'Repository', exact: true})).toBeVisible()
    await expect(page).toHaveNoViolations()
  })

  test('deletion and final-record focus @avt', async ({page}) => {
    await visit(page, {id: storyId})
    await page.getByRole('button', {name: 'Delete selected'}).click()
    await expect(page.getByRole('rowheader', {name: 'primer/react', exact: true})).toHaveCount(0)
    const selectAll = page.getByRole('checkbox', {name: 'Select rows', exact: true})
    await expect(selectAll).toBeFocused()

    await selectAll.click()
    await page.getByRole('button', {name: 'Delete selected'}).click()
    await expect(page.getByRole('rowheader')).toHaveCount(0)
    await expect(page.getByRole('button', {name: 'Reset repositories'})).toBeFocused()
    await expect(selectAll).toBeDisabled()
    await expect(page).toHaveNoViolations()
  })

  test('makes only selected repositories internal @avt', async ({page}) => {
    await visit(page, {id: storyId})
    await page.getByRole('button', {name: 'Make internal'}).click()
    await expect(page.getByRole('row', {name: /primer\/react/}).getByRole('cell', {name: 'Internal'})).toBeVisible()
    await expect(page.getByRole('row', {name: /primer\/css/}).getByRole('cell', {name: 'Public'})).toBeVisible()
    await expect(page.getByRole('checkbox', {name: 'Select rows', exact: true})).toBeFocused()
    await expect(page.getByRole('group', {name: 'Bulk actions'})).toHaveCount(0)
  })

  for (const density of ['condensed', 'normal', 'spacious'] as const) {
    test(`preserves header height and typography (${density}) @avt`, async ({page}) => {
      await visit(page, {id: storyId})
      const table = page.getByRole('table')
      await table.evaluate((element, value) => {
        element.setAttribute('data-cell-padding', value)
      }, density)
      await page.getByRole('button', {name: 'Reset repositories'}).click()
      const head = table.locator('thead')
      const before = await head.boundingBox()
      const labelBefore = await page.getByRole('button', {name: 'Repository', exact: true}).boundingBox()
      const columnStyle = await page.getByRole('columnheader', {name: 'Repository', exact: true}).evaluate(element => {
        const style = getComputedStyle(element)
        return [style.fontFamily, style.fontSize, style.fontWeight, style.lineHeight, style.color]
      })

      await page.getByRole('checkbox', {name: 'Select rows', exact: true}).click()
      const count = table.getByText('3 selected', {exact: true})
      await expect(count).toBeVisible()
      const selected = await head.boundingBox()
      expect(selected!.height).toBe(before!.height)
      expect((await count.boundingBox())!.x).toBe(labelBefore!.x)
      const actions = table.getByRole('group', {name: 'Bulk actions'})
      await expect(actions.getByRole('button')).toHaveCount(2)
      const padding = await actions.evaluate(element => {
        const cell = element.parentElement!
        return getComputedStyle(cell).paddingInlineEnd
      })
      expect(padding).toBe('8px')
      const lastAction = await actions.getByRole('button', {name: 'Delete selected'}).boundingBox()
      expect(selected!.x + selected!.width - lastAction!.x - lastAction!.width).toBe(9)
      expect(
        await count.evaluate(element => {
          const style = getComputedStyle(element)
          return [style.fontFamily, style.fontSize, style.fontWeight, style.lineHeight, style.color]
        }),
      ).toEqual(columnStyle)

      await page.getByRole('checkbox', {name: 'Select rows', exact: true}).click()
      expect((await head.boundingBox())!.height).toBe(before!.height)
    })
  }

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
    await expect(actions.getByText('1 selected')).toBeVisible()
    await expect(actions.getByRole('button', {name: 'Delete selected'})).toBeVisible()
    const dimensions = await actions.evaluate(element => ({
      width: element.clientWidth,
      scrollWidth: element.scrollWidth,
    }))
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.width)
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320)
    const selectAll = page.getByRole('checkbox', {name: 'Select rows', exact: true})
    await selectAll.focus()
    await page.keyboard.press('Tab')
    await expect(actions.getByRole('button', {name: 'Make internal'})).toBeFocused()
    await page.keyboard.press('Tab')
    const deleteButton = actions.getByRole('button', {name: 'Delete selected'})
    await expect(deleteButton).toBeFocused()
    await expect(deleteButton).toBeInViewport({ratio: 1})
    const buttonBox = await deleteButton.boundingBox()
    expect(buttonBox!.width).toBeLessThanOrEqual(320)
    await page.keyboard.press('Enter')
    await expect(selectAll).toBeFocused()
    await expect(selectAll).toBeInViewport({ratio: 1})
  })
})
