import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

test.describe('Button', () => {
  test.describe('Default Button', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-button--default-button',
          globals: {
            colorScheme: theme
          }
        })

        // Default state
        expect(await page.screenshot()).toMatchSnapshot(`Default Button.${theme}.png`)

        // Focus state
        await page.keyboard.press('Tab')
        expect(await page.screenshot()).toMatchSnapshot(`Default Button.${theme}.focused.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-button--default-button'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Primary Button', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-button--primary-button',
          globals: {
            colorScheme: theme
          }
        })

        // Default state
        expect(await page.screenshot()).toMatchSnapshot(`Primary Button.${theme}.png`)

        // Focus state
        await page.keyboard.press('Tab')
        expect(await page.screenshot()).toMatchSnapshot(`Primary Button.${theme}.focused.png`)
      })
    })

    test.fixme('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-button--primary-button'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Danger Button', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-button--danger-button',
          globals: {
            colorScheme: theme
          }
        })

        // Default state
        expect(await page.screenshot()).toMatchSnapshot(`Danger Button.${theme}.png`)

        // Focus state
        await page.keyboard.press('Tab')
        expect(await page.screenshot()).toMatchSnapshot(`Danger Button.${theme}.focused.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-button--danger-button'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Invisible Button', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-button--invisible-button',
          globals: {
            colorScheme: theme
          }
        })

        // Default state
        expect(await page.screenshot()).toMatchSnapshot(`Invisible Button.${theme}.png`)

        // Focus state
        await page.keyboard.press('Tab')
        expect(await page.screenshot()).toMatchSnapshot(`Invisible Button.${theme}.focused.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-button--invisible-button'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Outline Button', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-button--outline-button',
          globals: {
            colorScheme: theme
          }
        })

        // Default state
        expect(await page.screenshot()).toMatchSnapshot(`Outline Button.${theme}.png`)

        // Focus state
        await page.keyboard.press('Tab')
        expect(await page.screenshot()).toMatchSnapshot(`Outline Button.${theme}.focused.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-button--outline-button'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Icon Before Button', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-button--icon-before-button',
          globals: {
            colorScheme: theme
          }
        })

        // Default state
        expect(await page.screenshot()).toMatchSnapshot(`Icon Before Button.${theme}.png`)

        // Focus state
        await page.keyboard.press('Tab')
        expect(await page.screenshot()).toMatchSnapshot(`Icon Before Button.${theme}.focused.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-button--icon-before-button'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Icon Button', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-button--icon-button',
          globals: {
            colorScheme: theme
          }
        })

        // Default state
        expect(await page.screenshot()).toMatchSnapshot(`Icon Button.${theme}.png`)

        // Focus state
        await page.keyboard.press('Tab')
        expect(await page.screenshot()).toMatchSnapshot(`Icon Button.${theme}.focused.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-button--icon-button'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Watch Counter Button', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-button--watch-counter-button',
          globals: {
            colorScheme: theme
          }
        })

        // Default state
        expect(await page.screenshot()).toMatchSnapshot(`Watch Counter Button.${theme}.png`)

        // Focus state
        await page.keyboard.press('Tab')
        expect(await page.screenshot()).toMatchSnapshot(`Watch Counter Button.${theme}.focused.png`)
      })
    })

    test.fixme('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-button--watch-counter-button'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Watch Icon Button', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-button--watch-icon-button',
          globals: {
            colorScheme: theme
          }
        })

        // Default state
        expect(await page.screenshot()).toMatchSnapshot(`Watch Icon Button.${theme}.png`)

        // Focus state
        await page.keyboard.press('Tab')
        expect(await page.screenshot()).toMatchSnapshot(`Watch Icon Button.${theme}.focused.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-button--watch-icon-button'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Caret Button', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-button--caret-button',
          globals: {
            colorScheme: theme
          }
        })

        // Default state
        expect(await page.screenshot()).toMatchSnapshot(`Caret Button.${theme}.png`)

        // Focus state
        await page.keyboard.press('Tab')
        expect(await page.screenshot()).toMatchSnapshot(`Caret Button.${theme}.focused.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-button--caret-button'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Block Button', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-button--block-button',
          globals: {
            colorScheme: theme
          }
        })

        // Default state
        expect(await page.screenshot()).toMatchSnapshot(`Block Button.${theme}.png`)

        // Focus state
        await page.keyboard.press('Tab')
        expect(await page.screenshot()).toMatchSnapshot(`Block Button.${theme}.focused.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-button--block-button'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Disabled Button', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-button--disabled-button',
          globals: {
            colorScheme: theme
          }
        })

        // Default state
        expect(await page.screenshot()).toMatchSnapshot(`Disabled Button.${theme}.png`)

        // Focus state
        await page.keyboard.press('Tab')
        expect(await page.screenshot()).toMatchSnapshot(`Disabled Button.${theme}.focused.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-button--disabled-button'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Link Button', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-button--link-button',
          globals: {
            colorScheme: theme
          }
        })

        // Default state
        expect(await page.screenshot()).toMatchSnapshot(`Link Button.${theme}.png`)

        // Focus state
        await page.keyboard.press('Tab')
        expect(await page.screenshot()).toMatchSnapshot(`Link Button.${theme}.focused.png`)
      })
    })

    test.fixme('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-button--link-button'
      })
      await expect(page).toHaveNoViolations()
    })
  })
})
