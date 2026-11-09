import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

test.describe('React Tailwind Table native heading elements', () => {
  for (const theme of themes) {
    for (const width of [320, 1024, 1400]) {
      test(`preserves native semantics and layout in ${theme} at ${width}px @aat`, async ({page}) => {
        const errors: string[] = []
        page.on('pageerror', error => errors.push(error.message))
        await page.setViewportSize({width, height: 720})
        const id = 'react-tailwind-data-table-features--with-heading-levels'
        const title = page.locator('[data-component="Table.Title"]')
        const subtitle = page.locator('[data-component="Table.Subtitle"]')
        const readLayout = () =>
          page.locator('[data-component="Table.Title"], [data-component="Table.Subtitle"]').evaluateAll(elements =>
            elements.map(element => {
              const style = getComputedStyle(element)
              const {x, y, width, height} = element.getBoundingClientRect()
              return {
                x,
                y,
                width,
                height,
                fontFamily: style.fontFamily,
                fontSize: style.fontSize,
                fontWeight: style.fontWeight,
                lineHeight: style.lineHeight,
                color: style.color,
                margin: style.margin,
                gridColumn: style.gridColumn,
                alignSelf: style.alignSelf,
              }
            }),
          )
        await visit(page, {id, globals: {colorScheme: theme}, args: {titleAs: 'h2', subtitleAs: 'p'}})
        await page.evaluate(() => document.fonts.ready)
        const baseline = await readLayout()
        for (const subtitleAs of ['p', 'h4']) {
          await visit(page, {id, globals: {colorScheme: theme}, args: {titleAs: 'h3', subtitleAs}})
          await expect(page.getByRole('heading', {name: 'Components', level: 3, exact: true})).toBeVisible()
          await expect(subtitle).toHaveJSProperty('tagName', subtitleAs.toUpperCase())
          if (subtitleAs === 'h4') {
            await expect(
              page.getByRole('heading', {name: 'Components available in this project', level: 4}),
            ).toBeVisible()
          }
          await expect(title).not.toHaveAttribute('as')
          await expect(subtitle).not.toHaveAttribute('as')
          const table = page.getByRole('table', {name: 'Components', exact: true})
          await expect(table).toHaveAttribute('aria-labelledby', (await title.getAttribute('id'))!)
          await expect(table).toHaveAttribute('aria-describedby', (await subtitle.getAttribute('id'))!)
          await expect(table).toHaveAccessibleDescription('Components available in this project')
          expect(await readLayout()).toEqual(baseline)
          await page.locator('[data-component="Table.Container"]').evaluate(element => {
            element.style.fontWeight = '600'
          })
          await expect(subtitle).toHaveCSS('font-weight', '600')
          await expect(page).toHaveNoViolations()
        }
        await visit(page, {id, globals: {colorScheme: theme}, args: {titleAs: 'p', subtitleAs: 'p'}})
        await expect(title).toHaveJSProperty('tagName', 'P')
        await expect(page.getByRole('heading', {name: 'Components', exact: true})).toHaveCount(0)
        await expect(page.getByRole('table', {name: 'Components', exact: true})).toBeVisible()
        expect(await readLayout()).toEqual(baseline)
        expect(errors).toEqual([])
      })
    }
  }
})

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

test.describe('React Tailwind Table skeleton columns', () => {
  for (const theme of themes) {
    for (const direction of ['ltr', 'rtl'] as const) {
      test(`callback headers and logical alignment in ${theme} ${direction} @aat`, async ({page}) => {
        await page.setViewportSize({width: 320, height: 640})
        await visit(page, {
          id: 'react-tailwind-data-table-features--with-skeleton-columns',
          globals: {colorScheme: theme},
        })
        await page.evaluate(dir => {
          document.documentElement.dir = dir
        }, direction)
        const table = page.getByRole('table', {name: 'Repository activity'})
        await expect(table).toHaveAttribute('aria-busy', 'true')
        await expect(table.getByRole('columnheader', {name: 'Repository'})).toHaveAttribute('data-align', 'start')
        await expect(table.getByRole('columnheader', {name: 'Open issues'})).toHaveAttribute('data-align', 'end')
        const cells = table.getByRole('cell')
        await expect(cells.nth(0)).toHaveAttribute('data-align', 'start')
        await expect(cells.nth(1)).toHaveAttribute('data-align', 'end')
        for (const [index, alignment] of ['start', 'end'].entries()) {
          const placeholders = cells.nth(index).getByRole('img', {name: 'Loading'})
          await expect(placeholders).toHaveCount(3)
          const edgeGap = await placeholders.first().evaluate((element, align) => {
            const row = element.parentElement!
            const bounds = element.getBoundingClientRect()
            const rowBounds = row.getBoundingClientRect()
            const style = getComputedStyle(row)
            const left = (align === 'start') === (style.direction === 'ltr')
            return left
              ? bounds.left - rowBounds.left - parseFloat(style.paddingLeft)
              : rowBounds.right - bounds.right - parseFloat(style.paddingRight)
          }, alignment)
          expect(Math.abs(edgeGap)).toBeLessThan(1)
          await expect(placeholders.first()).toHaveCSS('max-width', '85%')
        }
        await expect(page).toHaveNoViolations()
        const skeletonLayout = await table.evaluate(element =>
          element.style.getPropertyValue('--grid-template-columns'),
        )
        await page.getByRole('button', {name: 'Show data'}).click()
        await expect(table).not.toHaveAttribute('aria-busy')
        await expect(table.getByRole('columnheader', {name: 'Open issues'})).toHaveAttribute('data-align', 'end')
        await expect(table.getByRole('cell', {name: '7'})).toHaveAttribute('data-align', 'end')
        expect(await table.evaluate(element => element.style.getPropertyValue('--grid-template-columns'))).toBe(
          skeletonLayout,
        )
        await expect(page).toHaveNoViolations()
      })
    }
  }
})
