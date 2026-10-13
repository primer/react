import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories = ['flat', 'grouped', 'mixed', 'async-actions', 'composed-table'] as const

test.describe('DataTable bulk actions', () => {
  for (const story of stories) {
    for (const theme of themes) {
      test(`${story} ${theme} @avt`, async ({page}) => {
        await visit(page, {
          id: `experimental-components-datatable-features-bulk-actions--${story}`,
          globals: {colorScheme: theme},
        })
        await expect(page).toHaveNoViolations()
      })
    }
  }

  for (const story of ['flat', 'grouped', 'mixed', 'composed-table'] as const) {
    test(`${story} keyboard focus and unobscured header @avt`, async ({page}) => {
      await visit(page, {id: `experimental-components-datatable-features-bulk-actions--${story}`})
      if (story === 'flat') {
        await expect(page.getByRole('columnheader', {name: 'Repository', exact: true})).toHaveAttribute(
          'aria-sort',
          'ascending',
        )
      }
      const selectAll = page.getByRole('checkbox', {name: 'Select rows', exact: true})
      await selectAll.focus()
      await page.keyboard.press('Space')
      await expect(selectAll).toBeFocused()
      const actions = page.getByRole('group', {name: 'Bulk actions'})
      await expect(actions.getByText('3 rows selected')).toBeVisible()
      const actionsBox = await actions.boundingBox()
      const headerBox = await selectAll.boundingBox()
      expect(actionsBox).not.toBeNull()
      expect(headerBox).not.toBeNull()
      expect(actionsBox!.y + actionsBox!.height).toBeLessThanOrEqual(headerBox!.y)

      await actions.getByRole('button', {name: 'Clear selection'}).focus()
      await page.keyboard.press('Enter')
      await expect(selectAll).toBeFocused()
      await expect(actions).toHaveCount(0)
      await expect(page).toHaveNoViolations()
    })
  }

  test('asynchronous failure retains selection; success handles deletion and final-record focus @avt', async ({
    page,
  }) => {
    await visit(page, {id: 'experimental-components-datatable-features-bulk-actions--async-actions'})
    await expect(page.getByRole('columnheader', {name: 'Repository', exact: true})).toHaveAttribute(
      'aria-sort',
      'ascending',
    )
    await page.getByRole('button', {name: 'Simulate failed action'}).click()
    await expect(
      page
        .locator('#storybook-root')
        .getByText('Unable to delete repositories. Your selection is unchanged; try again.'),
    ).toBeVisible()
    await expect(page.getByRole('checkbox', {name: 'Select primer/react', exact: true})).toBeChecked()
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
        id: 'experimental-components-datatable-features-bulk-actions--mixed',
        globals: {colorScheme: theme},
      })
      await expect(page).toHaveScreenshot(`DataTable.BulkActions.Mixed.${theme}.png`)
    })
  }

  test('actions reflow without clipping at a narrow viewport and with text-spacing overrides @avt', async ({page}) => {
    await page.setViewportSize({width: 320, height: 256})
    await visit(page, {id: 'experimental-components-datatable-features-bulk-actions--mixed'})
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
      right: element.getBoundingClientRect().right,
    }))
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.width)
    expect(dimensions.right).toBeLessThanOrEqual(320)
    await actions.getByRole('button', {name: 'Clear selection'}).click()
    await expect(page.getByRole('checkbox', {name: 'Select rows', exact: true})).toBeFocused()
  })
})
