import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

test.describe('RadioGroup', () => {
  test.describe('Default', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-forms-radiogroup-examples--default',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`RadioGroup.Default.${theme}.png`)
        })

        test('disabled @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-forms-radiogroup-examples--default',
            globals: {
              colorScheme: theme,
            },
            args: {
              disabled: true,
            },
          })

          expect(await page.screenshot()).toMatchSnapshot(`RadioGroup.Default.disabled.${theme}.png`)

          await expect(page).toHaveNoViolations({
            rules: {
              'color-contrast': {
                enabled: theme !== 'dark_dimmed',
              },
            },
          })
        })

        test('disabled @aat', async ({page}) => {
          await visit(page, {
            id: 'components-forms-radiogroup-examples--default',
            globals: {
              colorScheme: theme,
            },
            args: {
              disabled: true,
            },
          })

          await expect(page).toHaveNoViolations({
            rules: {
              'color-contrast': {
                enabled: theme !== 'dark_dimmed',
              },
            },
          })
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-forms-radiogroup-examples--default',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations({
            rules: {
              'color-contrast': {
                enabled: theme !== 'dark_dimmed',
              },
            },
          })
        })
      })
    }
  })
})
