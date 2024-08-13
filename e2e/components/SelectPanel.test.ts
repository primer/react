import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

test.describe('SelectPanel', () => {
  test.describe('Default', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-selectpanel--default',
            globals: {
              colorScheme: theme,
            },
          })

          // Open select panel
          await page.keyboard.press('Tab')
          await page.keyboard.press('Enter')
          // Default state
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(`SelectPanel.Default.${theme}.png`)
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-selectpanel--default',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('Single Select', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-selectpanel-features--single-select',
            globals: {
              colorScheme: theme,
            },
          })

          // Open select panel
          await page.keyboard.press('Tab')
          await page.keyboard.press('Enter')
          // Default state
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `SelectPanel.Single Select.${theme}.png`,
          )
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-selectpanel-features--single-select',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('With External Anchor', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-selectpanel-features--with-external-anchor',
            globals: {
              colorScheme: theme,
            },
          })

          // Open select panel
          await page.keyboard.press('Tab')
          await page.keyboard.press('Enter')
          // Default state
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `SelectPanel.External Anchor.${theme}.png`,
          )
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-selectpanel-features--with-external-anchor',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('With Footer', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-selectpanel-features--with-footer',
            globals: {
              colorScheme: theme,
            },
          })

          // Open select panel
          await page.keyboard.press('Tab')
          await page.keyboard.press('Enter')
          // Default state
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `SelectPanel.With Footer.${theme}.png`,
          )
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-selectpanel-features--with-footer',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('With Groups', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-selectpanel-features--with-groups',
            globals: {
              colorScheme: theme,
            },
          })

          // Open select panel
          await page.keyboard.press('Tab')
          await page.keyboard.press('Enter')
          // Default state
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `SelectPanel.With Groups.${theme}.png`,
          )
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-selectpanel-features--with-groups',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('With Item Dividers', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-selectpanel-features--with-item-dividers',
            globals: {
              colorScheme: theme,
            },
          })

          // Open select panel
          await page.keyboard.press('Tab')
          await page.keyboard.press('Enter')
          // Default state
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `SelectPanel.With Item Dividers.${theme}.png`,
          )
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-selectpanel-features--with-item-dividers',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('With Placeholder for Search Input', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-selectpanel-features--with-placeholder-for-seach-input',
            globals: {
              colorScheme: theme,
            },
          })

          // Open select panel
          await page.keyboard.press('Tab')
          await page.keyboard.press('Enter')
          // Default state
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `SelectPanel.With Placeholder for Search Input.${theme}.png`,
          )
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-selectpanel-features--with-placeholder-for-seach-input',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('With Placeholder Select', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-selectpanel-features--with-placeholder-select',
            globals: {
              colorScheme: theme,
            },
          })

          // Open select panel
          await page.keyboard.press('Tab')
          await page.keyboard.press('Enter')
          // Default state
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `SelectPanel.With Placeholder Select.${theme}.png`,
          )
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-selectpanel-features--with-placeholder-select',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('Above Tall Body', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-selectpanel-examples--above-tall-body',
            globals: {
              colorScheme: theme,
            },
          })

          // Open select panel
          await page.keyboard.press('Tab')
          await page.keyboard.press('Enter')
          // Default state
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `SelectPanel.Above Tall Body.${theme}.png`,
          )
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-selectpanel-examples--above-tall-body',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('Height Variantions and Scroll', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-selectpanel-examples--height-variantions-and-scroll',
            globals: {
              colorScheme: theme,
            },
          })

          // Open select panel
          await page.keyboard.press('Tab')
          await page.keyboard.press('Enter')
          // Default state
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `SelectPanel.Height Variantions and Scroll.${theme}.png`,
          )
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-selectpanel-examples--height-variantions-and-scroll',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('Height Initial with Overflowing Items', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-selectpanel-examples--height-initial-with-overflowing-items-story',
            globals: {
              colorScheme: theme,
            },
          })

          // Open select panel
          await page.keyboard.press('Tab')
          await page.keyboard.press('Enter')
          // Default state
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `SelectPanel.Height Initial with Overflowing Items.${theme}.png`,
          )
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-selectpanel-examples--height-initial-with-overflowing-items-story',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('Height Initial with Underflowing Items', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-selectpanel-examples--height-initial-with-underflowing-items-story',
            globals: {
              colorScheme: theme,
            },
          })

          // Open select panel
          await page.keyboard.press('Tab')
          await page.keyboard.press('Enter')
          // Default state
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `SelectPanel.Height Initial with Underflowing Items.${theme}.png`,
          )
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-selectpanel-examples--height-initial-with-underflowing-items-story',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('Height Initial with Underflowing Items After Fetch', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-selectpanel-examples--height-initial-with-underflowing-items-after-fetch',
            globals: {
              colorScheme: theme,
            },
          })

          // Open select panel
          await page.keyboard.press('Tab')
          await page.keyboard.press('Enter')
          // Default state
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `SelectPanel.Height Initial with Underflowing Items After Fetch.${theme}.png`,
          )
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-selectpanel-examples--height-initial-with-underflowing-items-after-fetch',
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
