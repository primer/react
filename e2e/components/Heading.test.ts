import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'

test.describe('Heading', () => {
  test.describe('Default', () => {
    test('default @vrt', async ({page}) => {
      await visit(page, {
        id: 'components-heading--default',
      })

      // Default state
      expect(await page.screenshot()).toMatchSnapshot(`Heading.Default.png`)
    })

    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-heading--default',
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Small', () => {
    test('default @vrt', async ({page}) => {
      await visit(page, {
        id: 'components-heading-features--small',
      })

      expect(await page.screenshot()).toMatchSnapshot(`Heading.Small.png`)
    })

    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-heading-features--small',
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Medium', () => {
    test('default @vrt', async ({page}) => {
      await visit(page, {
        id: 'components-heading-features--medium',
      })

      expect(await page.screenshot()).toMatchSnapshot(`Heading.Medium.png`)
    })

    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-heading-features--medium',
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Large', () => {
    test('default @vrt', async ({page}) => {
      await visit(page, {
        id: 'components-heading-features--large',
      })

      // Default state
      expect(await page.screenshot()).toMatchSnapshot(`Heading.Large.png`)
    })

    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-heading-features--large',
      })
      await expect(page).toHaveNoViolations()
    })
  })
})
