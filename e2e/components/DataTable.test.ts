import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories: ReadonlyArray<{
  title: string
  id: string
  aat?: boolean
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
    title: 'With Sortable Groups',
    id: 'experimental-components-datatable-features--with-sortable-groups',
    aat: true,
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
                mask: await page
                  .locator('td', {
                    has: page.locator('relative-time'),
                  })
                  .all(),
              }),
            ).toMatchSnapshot(`DataTable.${story.title}.${theme}.png`)
          })

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
              await expect(page.getByRole('columnheader', {name: 'Public, 2 rows', exact: true})).toBeVisible()
              expect(await page.screenshot()).toMatchSnapshot(`DataTable.With Groups.Next Page.${theme}.png`)
            })

            test('pagination across a group boundary @aat', async ({page}) => {
              await visit(page, {id: story.id, globals: {colorScheme: theme}})
              const table = page.getByRole('table', {name: 'Paginated repositories by visibility'})
              await expect(table.getByRole('rowheader')).toHaveCount(10)
              await expect(table.getByRole('columnheader', {name: 'Public, 10 rows', exact: true})).toBeVisible()
              await expect(table.getByRole('columnheader', {name: 'Internal, 3 rows', exact: true})).toHaveCount(0)

              await page.getByRole('button', {name: 'Next page', exact: true}).click()
              await expect(table.getByRole('rowheader')).toHaveCount(5)
              await expect(table.getByRole('columnheader', {name: 'Public, 2 rows', exact: true})).toBeVisible()
              await expect(table.getByRole('columnheader', {name: 'Internal, 3 rows', exact: true})).toBeVisible()
              await expect(table.getByRole('rowheader', {name: 'public/repository-11', exact: true})).toBeVisible()
              await expect(table.getByRole('rowheader', {name: 'public/repository-1', exact: true})).toHaveCount(0)

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

              await page.getByRole('button', {name: 'Previous page', exact: true}).click()
              await expect(table.getByRole('rowheader')).toHaveCount(10)
              await expect(table.getByRole('columnheader', {name: 'Public, 10 rows', exact: true})).toBeVisible()
              await expect(table.getByRole('rowheader', {name: 'public/repository-1', exact: true})).toBeVisible()
            })
          }
        })
      }
    })
  }
})
