import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories: ReadonlyArray<{
  title: string
  id: string
  snapshotTitle?: string
}> = [
  {
    title: 'Default',
    id: 'experimental-components-datatable--default',
  },
  {
    title: 'With Title',
    id: 'experimental-components-datatable-features--with-title',
  },
  {
    title: 'With Title and Subtitle',
    id: 'experimental-components-datatable-features--with-title-and-subtitle',
  },
  {
    title: 'With Sorting',
    id: 'experimental-components-datatable-features--with-sorting',
  },
  {
    title: 'With Actions',
    id: 'experimental-components-datatable-features--with-actions',
  },
  {
    title: 'With Action',
    id: 'experimental-components-datatable-features--with-action',
  },
  {
    title: 'With Row Action',
    id: 'experimental-components-datatable-features--with-row-action',
  },
  {
    title: 'With Row Actions',
    id: 'experimental-components-datatable-features--with-row-actions',
  },
  {
    title: 'With Row Action Menu',
    id: 'experimental-components-datatable-features--with-row-action-menu',
  },
  {
    title: 'With Custom Heading',
    id: 'experimental-components-datatable-features--with-custom-heading',
  },
  {
    title: 'With Overflow',
    id: 'experimental-components-datatable-features--with-overflow',
  },
  {
    title: 'With Groups',
    id: 'experimental-components-datatable-features--with-groups',
  },
  {
    title: 'With Row Selection',
    id: 'experimental-components-datatable-features--with-row-selection',
  },
  {
    title: 'With Grouped Row Selection',
    id: 'experimental-components-datatable-features--with-grouped-row-selection',
  },
  {
    title: 'With Sortable Groups',
    id: 'experimental-components-datatable-features--with-sortable-groups',
  },
  {
    title: 'With Standalone And Grouped Row Selection',
    id: 'experimental-components-datatable-features--with-standalone-and-grouped-row-selection',
    snapshotTitle: 'With Mixed Row Selection',
  },
  {
    title: 'With Paginated Row Selection',
    id: 'experimental-components-datatable-features--with-paginated-row-selection',
  },
]

test.describe('DataTable', () => {
  for (const story of stories) {
    test.describe(story.title, () => {
      for (const theme of themes) {
        test.describe(theme, () => {
          test('default @vrt', async ({page}) => {
            await visit(page, {
              id: story.id,
              globals: {
                colorScheme: theme,
              },
            })

            // Default state
            expect(
              await page.screenshot({
                animations: 'disabled',
                mask: await page
                  .locator('td', {
                    has: page.locator('relative-time'),
                  })
                  .all(),
              }),
            ).toMatchSnapshot(`DataTable.${story.snapshotTitle ?? story.title}.${theme}.png`)
          })

          if (story.id === 'experimental-components-datatable-features--with-grouped-row-selection') {
            for (const state of ['mixed', 'all selected'] as const) {
              test(`${state} @vrt`, async ({page}) => {
                await visit(page, {id: story.id, globals: {colorScheme: theme}})
                const selectAll = page.getByRole('checkbox', {name: 'Select rows', exact: true})
                if (state === 'mixed') {
                  await page.getByRole('checkbox', {name: 'Select strapi', exact: true}).click()
                  await expect(selectAll).toBeChecked({indeterminate: true})
                } else {
                  await selectAll.click()
                  await expect(selectAll).toBeChecked()
                }
                await expect(page.getByRole('checkbox', {name: 'Select codeql-dca-worker'})).toBeDisabled()
                expect(
                  await page.screenshot({
                    animations: 'disabled',
                    mask: await page.locator('td', {has: page.locator('relative-time')}).all(),
                  }),
                ).toMatchSnapshot(`DataTable.${story.title}.${state}.${theme}.png`)
              })
            }
          }

          test('axe @aat', async ({page}) => {
            await visit(page, {
              id: story.id,
              globals: {
                colorScheme: theme,
              },
            })

            await expect(page).toHaveNoViolations()
          })

          if (story.id === 'experimental-components-datatable-features--with-groups') {
            test('continued group on next page @vrt', async ({page}) => {
              await visit(page, {id: story.id, globals: {colorScheme: theme}})
              await page.getByRole('button', {name: 'Next page', exact: true}).click()
              await expect(page.getByRole('columnheader', {name: /^Public\s*, 3 rows$/})).toBeVisible()
              expect(await page.screenshot()).toMatchSnapshot(`DataTable.With Groups.Next Page.${theme}.png`)
            })
          }
        })
      }
    })
  }

  test('standalone and grouped selection stays wired through keyboard input and sorting @aat', async ({page}) => {
    await visit(page, {id: 'experimental-components-datatable-features--with-standalone-and-grouped-row-selection'})
    const standalone = page.getByRole('checkbox', {name: 'Select codeql-dca-worker', exact: true})
    const grouped = page.getByRole('checkbox', {name: 'Select strapi', exact: true})
    const selectAll = page.getByRole('checkbox', {name: 'Select rows', exact: true})

    await expect(standalone).toBeEnabled()
    await standalone.focus()
    await page.keyboard.press('Space')
    await expect(standalone).toBeChecked()
    await expect(standalone).toBeFocused()
    await grouped.click()
    await page.getByRole('button', {name: 'Name', exact: true}).click()
    await expect(standalone).toBeChecked()
    await expect(grouped).toBeChecked()
    await expect(selectAll).toBeChecked({indeterminate: true})
    await selectAll.focus()
    await page.keyboard.press('Space')
    await expect(selectAll).toBeChecked()
    await expect(selectAll).toBeFocused()
    await expect(page).toHaveNoViolations()
  })

  test('paginated selection example selects only the current page @aat', async ({page}) => {
    await visit(page, {id: 'experimental-components-datatable-features--with-paginated-row-selection'})
    const selectAll = page.getByRole('checkbox', {name: 'Select rows', exact: true})
    const checkedRows = page.locator('tbody input[type="checkbox"]:checked')

    await selectAll.click()
    await expect(checkedRows).toHaveCount(10)
    await page.getByRole('button', {name: 'Next page', exact: true}).click()
    await expect(checkedRows).toHaveCount(0)
    await expect(selectAll).toHaveAccessibleDescription('Select all 7 rows')
    await selectAll.click()
    await expect(checkedRows).toHaveCount(7)
    await page.getByRole('button', {name: 'Previous page', exact: true}).click()
    await expect(checkedRows).toHaveCount(0)
    await expect(page).toHaveNoViolations()
  })

  test('pagination across a group boundary @aat', async ({page}) => {
    await visit(page, {id: 'experimental-components-datatable-features--with-groups'})
    const table = page.getByRole('table', {name: 'Paginated repositories by visibility'})
    await expect(table.getByRole('rowheader')).toHaveCount(10)
    await expect(table.getByRole('columnheader', {name: /^Public\s*, 9 rows$/})).toBeVisible()
    await expect(table.getByRole('columnheader', {name: /^Internal\s*, 3 rows$/})).toHaveCount(0)
    await expect(table.getByRole('rowheader').first()).toHaveText('standalone/before')

    await page.getByRole('button', {name: 'Next page', exact: true}).click()
    await expect(table.getByRole('rowheader')).toHaveCount(7)
    await expect(table.getByRole('columnheader', {name: /^Public\s*, 3 rows$/})).toBeVisible()
    await expect(table.getByRole('columnheader', {name: /^Internal\s*, 3 rows$/})).toBeVisible()
    await expect(table.getByRole('rowheader', {name: 'public/repository-10', exact: true})).toBeVisible()
    await expect(table.getByRole('rowheader', {name: 'public/repository-1', exact: true})).toHaveCount(0)
    await expect(table.getByRole('rowheader').last()).toHaveText('standalone/after')
    const standalone = table.getByRole('rowheader', {name: 'standalone/after', exact: true})
    const rowHeaderId = await standalone.getAttribute('id')
    const columnId = await table.getByRole('columnheader', {name: 'Visibility', exact: true}).getAttribute('id')
    await expect(table.getByRole('row', {name: 'standalone/after Unassigned'}).getByRole('cell')).toHaveAttribute(
      'headers',
      `${rowHeaderId} ${columnId}`,
    )

    const unresolvedHeaders = await table
      .locator('[headers]')
      .evaluateAll(cells =>
        cells.flatMap(cell =>
          (cell.getAttribute('headers') ?? '')
            .split(' ')
            .filter(id => !cell.closest('table')?.querySelector(`[id="${id}"]`)),
        ),
      )
    expect(unresolvedHeaders).toEqual([])
    await expect(page).toHaveNoViolations()

    const sortButton = table.getByRole('button', {name: 'Name', exact: true})
    await sortButton.click()
    await sortButton.click()
    await expect(table.getByRole('rowheader')).toHaveText([
      'public/repository-12',
      'public/repository-11',
      'public/repository-10',
      'internal/repository-3',
      'internal/repository-2',
      'internal/repository-1',
      'standalone/after',
    ])
    await expect(table.getByRole('columnheader', {name: 'Name', exact: true})).toHaveAttribute(
      'aria-sort',
      'descending',
    )
    await expect(table.getByRole('row', {name: 'standalone/after Unassigned'}).getByRole('cell')).toHaveAttribute(
      'headers',
      `${rowHeaderId} ${columnId}`,
    )

    await page.getByRole('button', {name: 'Previous page', exact: true}).click()
    await expect(table.getByRole('rowheader')).toHaveCount(10)
    await expect(table.getByRole('columnheader', {name: /^Public\s*, 9 rows$/})).toBeVisible()
    await expect(table.getByRole('rowheader', {name: 'public/repository-1', exact: true})).toBeVisible()
  })
})
