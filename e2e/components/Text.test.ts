import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

test.describe('Text', () => {
  test.describe('Default', () => {
    test('default @vrt', async ({page}) => {
      await visit(page, {
        id: 'components-text--default',
      })

      // Default state
      expect(await page.screenshot()).toMatchSnapshot(`Text.Default.png`)
    })

    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-text--default',
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Small', () => {
    test('default @vrt', async ({page}) => {
      await visit(page, {
        id: 'components-text-features--size-small',
      })

      // Default state
      expect(await page.screenshot()).toMatchSnapshot(`Text.Small.png`)
    })

    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-text-features--size-small',
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Medium', () => {
    test('default @vrt', async ({page}) => {
      await visit(page, {
        id: 'components-text-features--size-medium',
      })

      // Default state
      expect(await page.screenshot()).toMatchSnapshot(`Text.Medium.png`)
    })

    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-text-features--size-medium',
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Large', () => {
    test('default @vrt', async ({page}) => {
      await visit(page, {
        id: 'components-text-features--size-large',
      })

      // Default state
      expect(await page.screenshot()).toMatchSnapshot(`Text.Large.png`)
    })

    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-text-features--size-large',
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('LightWeight', () => {
    test('default @vrt', async ({page}) => {
      await visit(page, {
        id: 'components-text-features--light-weight',
      })

      // Default state
      expect(await page.screenshot()).toMatchSnapshot(`Text.Light.png`)
    })

    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-text-features--light-weight',
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('NormalWeight', () => {
    test('default @vrt', async ({page}) => {
      await visit(page, {
        id: 'components-text-features--normal-weight',
      })

      // Default state
      expect(await page.screenshot()).toMatchSnapshot(`Text.Normal.png`)
    })

    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-text-features--normal-weight',
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('MediumWeight', () => {
    test('default @vrt', async ({page}) => {
      await visit(page, {
        id: 'components-text-features--medium-weight',
      })

      // Default state
      expect(await page.screenshot()).toMatchSnapshot(`Text.Medium.png`)
    })

    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-text-features--medium-weight',
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('SemiboldWeight', () => {
    test('default @vrt', async ({page}) => {
      await visit(page, {
        id: 'components-text-features--semibold-weight',
      })

      // Default state
      expect(await page.screenshot()).toMatchSnapshot(`Text.Semibold.png`)
    })

    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-text-features--semibold-weight',
      })
      await expect(page).toHaveNoViolations()
    })
  })
})
