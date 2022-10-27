import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

test.describe('Radio', () => {
  test.describe('Default', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-forms-radio--default',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`Default.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-forms-radio--default'
      })
      await expect(page).toHaveNoViolations()
    })
  })
})
