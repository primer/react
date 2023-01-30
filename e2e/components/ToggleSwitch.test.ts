import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'

test.describe('ToggleSwitch', () => {
  test.describe('Controlled', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-toggleswitch-examples--controlled',
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

  test.describe('Default (uncontrolled)', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-toggleswitch-examples--default',
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

  test.describe('statusLabelPosition="end"', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-toggleswitch-examples--status-label-positioned-at-end',
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

  test.describe('Associated with a caption', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-toggleswitch-fixtures--with-caption',
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

  test.describe('Small', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-toggleswitch-fixtures--small',
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
