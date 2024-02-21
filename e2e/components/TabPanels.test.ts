import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

test.describe('TabPanels', () => {
  test.describe('Default', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-tabpanels--default',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`TabPanels.Default.${theme}.png`)
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-tabpanels--default',
            globals: {
              colorScheme: theme,
            },
          })
          // axe doesn't play nicely with the way we're using Shadow DOM because we're using slots to project content
          await expect(page).toHaveNoViolations({
            rules: {
              'aria-required-parent': {
                enabled: false,
              },
            },
          })
        })
      })
    }
  })
})
