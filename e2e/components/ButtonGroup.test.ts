import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

test.describe('ButtonGroup', () => {
  test.describe('Default', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-buttongroup--default',
            globals: {
              colorScheme: theme,
              featureFlags: {
                primer_react_css_modules_team: true,
              },
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`ButtonGroup.Default.${theme}.png`)
        })

        test('default @vrt (styled-components)', async ({page}) => {
          await visit(page, {
            id: 'components-buttongroup--default',
            globals: {
              colorScheme: theme,
              featureFlags: {
                primer_react_css_modules_team: false,
              },
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`ButtonGroup.Default.${theme}.png`)
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-buttongroup--default',
            globals: {
              colorScheme: theme,
              featureFlags: {
                primer_react_css_modules_team: true,
              },
            },
          })
          await expect(page).toHaveNoViolations()
        })

        test('axe @aat (styled-components)', async ({page}) => {
          await visit(page, {
            id: 'components-buttongroup--default',
            globals: {
              colorScheme: theme,
              featureFlags: {
                primer_react_css_modules_team: false,
              },
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
            id: 'components-buttongroup--playground',
            globals: {
              colorScheme: theme,
              featureFlags: {
                primer_react_css_modules_team: true,
              },
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`ButtonGroup.Playground.${theme}.png`)
        })

        test('default @vrt (styled-components)', async ({page}) => {
          await visit(page, {
            id: 'components-buttongroup--playground',
            globals: {
              colorScheme: theme,
              featureFlags: {
                primer_react_css_modules_team: false,
              },
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`ButtonGroup.Playground.${theme}.png`)
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-buttongroup--playground',
            globals: {
              colorScheme: theme,
              featureFlags: {
                primer_react_css_modules_team: true,
              },
            },
          })
          await expect(page).toHaveNoViolations()
        })

        test('axe @aat (styled-components)', async ({page}) => {
          await visit(page, {
            id: 'components-buttongroup--playground',
            globals: {
              colorScheme: theme,
              featureFlags: {
                primer_react_css_modules_team: false,
              },
            },
          })
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('Icon Buttons', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-buttongroup-features--icon-buttons',
            globals: {
              colorScheme: theme,
              featureFlags: {
                primer_react_css_modules_team: true,
              },
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`ButtonGroup.Icon Buttons.${theme}.png`)
        })

        test('default @vrt (styled-components)', async ({page}) => {
          await visit(page, {
            id: 'components-buttongroup-features--icon-buttons',
            globals: {
              colorScheme: theme,
              featureFlags: {
                primer_react_css_modules_team: false,
              },
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`ButtonGroup.Icon Buttons.${theme}.png`)
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-buttongroup-features--icon-buttons',
            globals: {
              colorScheme: theme,
              featureFlags: {
                primer_react_css_modules_team: true,
              },
            },
          })
          await expect(page).toHaveNoViolations()
        })

        test('axe @aat (styled-components)', async ({page}) => {
          await visit(page, {
            id: 'components-buttongroup-features--icon-buttons',
            globals: {
              colorScheme: theme,
              featureFlags: {
                primer_react_css_modules_team: false,
              },
            },
          })
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })
})
