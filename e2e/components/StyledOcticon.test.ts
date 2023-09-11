import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

test.describe('StyledOcticon', () => {
  test.describe('Default', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-styledocticon--default',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`StyledOcticon.Default.${theme}.png`)
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-styledocticon--default',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('Playground', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-styledocticon--playground',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`StyledOcticon.Playground.${theme}.png`)
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-styledocticon--playground',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })
})
