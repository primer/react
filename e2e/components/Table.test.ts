import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

test.describe('Table With Row Selection', () => {
  const storyId = 'experimental-components-table-features--with-row-selection'

  for (const theme of themes) {
    test.describe(theme, () => {
      test('default @vrt', async ({page}) => {
        await visit(page, {id: storyId, globals: {colorScheme: theme}})
        expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(`Table.With Row Selection.${theme}.png`)
      })

      test('axe @aat', async ({page}) => {
        await visit(page, {id: storyId, globals: {colorScheme: theme}})
        await expect(page).toHaveNoViolations()
      })
    })
  }

  test('composed selection keyboard wiring and header associations @aat', async ({page}) => {
    await visit(page, {id: storyId})
    const table = page.getByRole('table', {name: 'Selectable repositories using Table'})
    const selectionColumn = table.getByRole('columnheader', {name: 'Select rows', exact: true})
    const selectionColumnId = await selectionColumn.getAttribute('id')
    const selectAll = selectionColumn.getByRole('checkbox', {name: 'Select rows', exact: true})
    const react = table.getByRole('checkbox', {name: 'Select primer/react', exact: true})
    const css = table.getByRole('checkbox', {name: 'Select primer/css', exact: true})
    const disabled = table.getByRole('checkbox', {name: 'Select github/github', exact: true})

    await expect(selectAll).toHaveAccessibleDescription('Select all 2 rows')
    await expect(selectAll).toBeChecked({indeterminate: true})
    await expect(react).toBeChecked()
    await expect(css).not.toBeChecked()
    await expect(disabled).toBeDisabled()
    await expect(disabled).not.toBeChecked()

    for (const group of [
      {name: /^Internal\s*, 1 row$/, rows: ['github/github']},
      {name: /^Public\s*, 2 rows$/, rows: ['primer/react', 'primer/css']},
    ]) {
      const groupHeader = table.getByRole('columnheader', {name: group.name})
      await expect(groupHeader).toHaveAttribute('colspan', '3')
      const groupHeaderId = await groupHeader.getAttribute('id')

      for (const name of group.rows) {
        const rowHeaderId = await table.getByRole('rowheader', {name, exact: true}).getAttribute('id')
        const checkbox = table.getByRole('checkbox', {name: `Select ${name}`, exact: true})
        const cell = table.getByRole('cell', {name: `Select ${name}`, exact: true})
        await expect(cell).toHaveAttribute('headers', `${groupHeaderId} ${selectionColumnId}`)
        const labelledBy = await checkbox.getAttribute('aria-labelledby')
        expect(labelledBy?.split(' ')).toContain(rowHeaderId)
      }
    }

    await selectAll.focus()
    await page.keyboard.press('Space')
    await expect(selectAll).toBeChecked()
    await expect(selectAll).not.toBeChecked({indeterminate: true})
    await expect(selectAll).toBeFocused()
    await expect(css).toBeChecked()
    await expect(disabled).not.toBeChecked()
    await react.focus()
    await page.keyboard.press('Space')
    await expect(react).not.toBeChecked()
    await expect(react).toBeFocused()
    await expect(selectAll).toBeChecked({indeterminate: true})
    await expect(selectionColumn).toHaveAccessibleName('Select rows')
    await expect(page).toHaveNoViolations()
  })
})

test.describe('Table With Groups', () => {
  for (const theme of themes) {
    test.describe(theme, () => {
      test('default @vrt', async ({page}) => {
        await visit(page, {
          id: 'experimental-components-table-features--with-groups',
          globals: {colorScheme: theme},
        })
        expect(await page.screenshot()).toMatchSnapshot(`Table.With Groups.${theme}.png`)
      })

      test('axe @aat', async ({page}) => {
        await visit(page, {
          id: 'experimental-components-table-features--with-groups',
          globals: {colorScheme: theme},
        })

        await expect(page).toHaveNoViolations()
      })
    })
  }

  test('header associations @aat', async ({page}) => {
    await visit(page, {
      id: 'experimental-components-table-features--with-groups',
    })

    const table = page.getByRole('table', {name: 'Repositories by visibility'})
    const visibilityColumnId = await table
      .getByRole('columnheader', {name: 'Visibility', exact: true})
      .getAttribute('id')

    for (const group of [
      {name: /^Internal\s*, 1 row$/, rows: ['github/github']},
      {name: /^Public\s*, 2 rows$/, rows: ['primer/react', 'primer/css']},
    ]) {
      const groupHeader = table.getByRole('columnheader', {name: group.name, exact: true})
      await expect(groupHeader).toHaveAttribute('scope', 'colgroup')
      await expect(groupHeader).toHaveAttribute('colspan', '2')
      const groupHeaderId = await groupHeader.getAttribute('id')

      for (const name of group.rows) {
        const rowHeaderId = await table.getByRole('rowheader', {name, exact: true}).getAttribute('id')
        await expect(table.getByRole('row', {name: new RegExp(name)}).getByRole('cell')).toHaveAttribute(
          'headers',
          `${groupHeaderId} ${rowHeaderId} ${visibilityColumnId}`,
        )
      }
    }
  })
})
