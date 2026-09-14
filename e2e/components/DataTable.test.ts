import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories: ReadonlyArray<{
  title: string
  id: string
  aat?: boolean
  vrt?: boolean
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
    aat: true,
  },
  {
    title: 'With Row Selection',
    id: 'experimental-components-datatable-features--with-row-selection',
    aat: true,
    vrt: false,
  },
  {
    title: 'With Grouped Row Selection',
    id: 'experimental-components-datatable-features--with-grouped-row-selection',
    aat: true,
    vrt: false,
  },
  {
    title: 'With Sortable Groups',
    id: 'experimental-components-datatable-features--with-sortable-groups',
    aat: true,
  },
  {
    title: 'With Mixed Row Selection',
    id: 'experimental-components-datatable-features--with-mixed-row-selection',
    aat: true,
    vrt: false,
  },
]

test.describe('DataTable', () => {
  for (const id of [
    'experimental-components-datatable-features--with-row-selection',
    'experimental-components-datatable-features--with-grouped-row-selection',
    'experimental-components-datatable-features--with-mixed-row-selection',
  ]) {
    test(`controlled selection round-trip ${id} @aat`, async ({page}) => {
      await visit(page, {id})
      const rowCheckbox = page.getByRole('checkbox', {name: 'Select strapi', exact: true})
      const otherCheckbox = page.getByRole('checkbox', {name: 'Select bootstrap', exact: true})
      const selectAll = page.getByRole('checkbox', {name: 'Select rows', exact: true})

      await expect(rowCheckbox).not.toBeChecked()
      await rowCheckbox.click()
      await expect(rowCheckbox).toBeChecked()
      await rowCheckbox.click()
      await expect(rowCheckbox).not.toBeChecked()
      await expect(rowCheckbox).toBeFocused()

      await rowCheckbox.press('Space')
      await otherCheckbox.click()
      await expect(rowCheckbox).toBeChecked()
      await expect(otherCheckbox).toBeChecked()
      await selectAll.click()
      await expect(selectAll).toBeChecked()
      await rowCheckbox.click()
      await expect(rowCheckbox).not.toBeChecked()
      await expect(otherCheckbox).toBeChecked()
      await expect(selectAll).toBeChecked({indeterminate: true})
      if (id === 'experimental-components-datatable-features--with-mixed-row-selection') {
        await page.getByRole('button', {name: 'Name', exact: true}).click()
        await expect(rowCheckbox).not.toBeChecked()
        await expect(otherCheckbox).toBeChecked()
        await expect(selectAll).toBeChecked({indeterminate: true})
      }
      await selectAll.click()
      await selectAll.click()
      await expect(selectAll).not.toBeChecked()
      await expect(selectAll).toBeFocused()
      await expect(page).toHaveNoViolations()
    })
  }

  for (const story of stories) {
    test.describe(story.title, () => {
      for (const theme of themes) {
        test.describe(theme, () => {
          if (story.vrt !== false) {
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
                  mask: await page
                    .locator('td', {
                      has: page.locator('relative-time'),
                    })
                    .all(),
                }),
              ).toMatchSnapshot(`DataTable.${story.title}.${theme}.png`)
            })
          }

          if (story.aat) {
            test('axe @aat', async ({page}) => {
              await visit(page, {
                id: story.id,
                globals: {
                  colorScheme: theme,
                },
              })

              await expect(page).toHaveNoViolations()
            })
          }

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

      if (story.id === 'experimental-components-datatable-features--with-groups') {
        test('pagination across a group boundary @aat', async ({page}) => {
          await visit(page, {id: story.id})
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
      }
    })
  }
})
