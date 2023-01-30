import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'

test.describe('NavList', () => {
  test.describe('Simple', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-navlist--simple',
      })
      await expect(page).toHaveNoViolations({
        rules: {
          'color-contrast': {
            enabled: false,
          },
        },
      })
    })
  })

  test.describe('With Next JS Link', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-navlist--with-next-js-link',
      })
      await expect(page).toHaveNoViolations({
        rules: {
          'color-contrast': {
            enabled: false,
          },
        },
      })
    })
  })

  test.describe('With React Router Link', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-navlist--with-react-router-link',
      })
      await expect(page).toHaveNoViolations({
        rules: {
          'color-contrast': {
            enabled: false,
          },
        },
      })
    })
  })

  test.describe('With Sub Items', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-navlist--with-sub-items',
      })
      await expect(page).toHaveNoViolations({
        rules: {
          'color-contrast': {
            enabled: false,
          },
        },
      })
    })
  })
})
