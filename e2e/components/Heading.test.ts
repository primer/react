import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'

const theme = 'light'

test.describe('Heading', () => {
  test.describe('Default', () => {
    test.describe(theme, () => {
      test('default @vrt', async ({page}) => {
        await visit(page, {
          id: 'components-heading--default',
          globals: {
            colorScheme: theme,
          },
        })

        // Default state
        expect(await page.screenshot()).toMatchSnapshot(`Heading.Default.${theme}.png`)
      })

      test('axe @aat', async ({page}) => {
        await visit(page, {
          id: 'components-heading--default',
          globals: {
            colorScheme: theme,
          },
        })
        await expect(page).toHaveNoViolations()
      })
    })
  })

  test.describe('Small', () => {
    test.describe(theme, () => {
      test('default @vrt', async ({page}) => {
        await visit(page, {
          id: 'components-heading--small',
          globals: {
            colorScheme: theme,
          },
        })

        // Default state
        expect(await page.screenshot()).toMatchSnapshot(`Heading.Default.${theme}.png`)
      })

      test('axe @aat', async ({page}) => {
        await visit(page, {
          id: 'components-heading--small',
          globals: {
            colorScheme: theme,
          },
        })
        await expect(page).toHaveNoViolations()
      })
    })
  })

  test.describe('Medium', () => {
    test.describe(theme, () => {
      test('default @vrt', async ({page}) => {
        await visit(page, {
          id: 'components-heading--medium',
          globals: {
            colorScheme: theme,
          },
        })

        // Default state
        expect(await page.screenshot()).toMatchSnapshot(`Heading.Default.${theme}.png`)
      })

      test('axe @aat', async ({page}) => {
        await visit(page, {
          id: 'components-heading--medium',
          globals: {
            colorScheme: theme,
          },
        })
        await expect(page).toHaveNoViolations()
      })
    })
  })

  test.describe('Large', () => {
    test.describe(theme, () => {
      test('default @vrt', async ({page}) => {
        await visit(page, {
          id: 'components-heading--large',
          globals: {
            colorScheme: theme,
          },
        })

        // Default state
        expect(await page.screenshot()).toMatchSnapshot(`Heading.Default.${theme}.png`)
      })

      test('axe @aat', async ({page}) => {
        await visit(page, {
          id: 'components-heading--large',
          globals: {
            colorScheme: theme,
          },
        })
        await expect(page).toHaveNoViolations()
      })
    })
  })
})
