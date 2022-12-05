import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

test.describe('Button', () => {
  test.describe('Default Button', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-button-features--default',
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

    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-button-features--default'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Primary Button', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-button-features--primary',
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

    test.fixme('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-button-features--primary'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Danger Button', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-button-features--danger',
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

    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-button-features--danger'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Invisible Button', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-button-features--invisible',
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

    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-button-features--invisible'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Outline Button', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-button-features--outline',
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

    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-button-features--outline'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Icon Before Button', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-button-features--leading-visual',
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

    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-button-features--leading-visual'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Icon Button', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-iconbutton-features--default',
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

    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-iconbutton-features--default'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Watch Counter Button', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-button-features--trailing-counter',
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

    test.fixme('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-button-features--trailing-counter'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Caret Button', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-button-features--trailing-action',
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

    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-button-features--trailing-action'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Block Button', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-button-features--block',
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

    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-button-features--block'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Disabled Button', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-button-features--disabled',
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

    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-button-features--disabled'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Link Button', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-linkbutton-features--default',
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

    test.fixme('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-linkbutton-features--default'
      })
      await expect(page).toHaveNoViolations()
    })
  })
})
