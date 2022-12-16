import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'
import {matrix, serialize} from '../test-helpers/props'

const scenarios = matrix({
  checked: [true, false],
  indeterminate: [true, false],
  disabled: [true, false],
  exclude: [
    {
      checked: true,
      indeterminate: true,
    },
  ],
})

test.describe('Checkbox', () => {
  test.describe('Default', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        for (const scenario of scenarios) {
          const info = serialize(scenario)

          test.describe(info, () => {
            test('default @vrt', async ({page}) => {
              await visit(page, {
                id: 'components-forms-checkbox--default',
                globals: {
                  colorScheme: theme,
                },
                args: scenario,
              })

              // Default state
              expect(await page.screenshot()).toMatchSnapshot(`Checkbox.Default.${theme}.${info}.png`)
            })

            test('axe @aat', async ({page}) => {
              await visit(page, {
                id: 'components-forms-checkbox--default',
                globals: {
                  colorScheme: theme,
                },
                args: scenario,
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
    }
  })
})
