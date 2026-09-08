import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

test.describe('Table With Groups', () => {
  for (const theme of themes) {
    test(`default ${theme} @vrt`, async ({page}) => {
      await visit(page, {
        id: 'experimental-components-table-features--with-groups',
        globals: {colorScheme: theme},
      })
      expect(await page.screenshot()).toMatchSnapshot(`Table.With Groups.${theme}.png`)
    })

    test(`header associations and axe ${theme} @aat`, async ({page}) => {
      await visit(page, {
        id: 'experimental-components-table-features--with-groups',
        globals: {colorScheme: theme},
      })

      const table = page.getByRole('table', {name: 'Repositories by visibility'})
      const visibilityColumnId = await table
        .getByRole('columnheader', {name: 'Visibility', exact: true})
        .getAttribute('id')

      for (const group of [
        {name: 'Internal, 1 row', rows: ['github/github']},
        {name: 'Public, 2 rows', rows: ['primer/react', 'primer/css']},
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

      await expect(page).toHaveNoViolations()
    })
  }
})
