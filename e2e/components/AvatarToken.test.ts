import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'
import {matrix, serialize} from '../test-helpers/props'

const scenarios = matrix({
  size: ['small', 'medium', 'large', 'xlarge', 'extralarge'],
  isSelected: [true, false],
})

test.describe('AvatarToken', () => {
  test.describe('Default', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        for (const args of scenarios) {
          const info = serialize(args)

          test.describe(info, () => {
            test(`default @vrt`, async ({page}) => {
              await visit(page, {
                id: 'components-avatartoken--default-token',
                globals: {
                  colorScheme: theme,
                },
                args,
              })

              // Default state
              expect(await page.screenshot()).toMatchSnapshot(`AvatarToken.Default.${theme}.${info}.png`)
            })

            test('axe @aat', async ({page}) => {
              await visit(page, {
                id: 'components-avatartoken--default-token',
                globals: {
                  colorScheme: theme,
                },
                args,
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

  test.describe('Interactive', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-avatartoken--interactive',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`AvatarToken.Interactive.${theme}.png`)

          // Hover state
          await page.locator('button', {hasText: 'Button'}).hover()
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `AvatarToken.Interactive.${theme}.hover.png`,
          )
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-avatartoken--default-token',
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
