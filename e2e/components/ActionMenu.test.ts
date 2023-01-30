import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'

test.describe('ActionMenu', () => {
  test.describe('Groups And Description', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-actionmenu-examples--groups-and-description',
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

  test.describe('Menu With Actions', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-actionmenu-examples--menu-with-actions',
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

  test.describe('Mixed Selection', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-actionmenu-examples--mixed-selection',
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

  test.describe('Multiple Selection', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-actionmenu-examples--multiple-selection',
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

  test.describe('Single Selection', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-actionmenu-examples--single-selection',
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

  test.describe('Single Selection With Placeholder', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-actionmenu-examples--single-selection-with-placeholder',
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

  test.describe('Actions Story', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-actionmenu-fixtures--actions-story',
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

  test.describe('Controlled Menu', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-actionmenu-fixtures--controlled-menu',
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

  test.describe('Custom Anchor', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-actionmenu-fixtures--custom-anchor',
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

  test.describe('External Anchor', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-actionmenu-fixtures--external-anchor',
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

  test.describe('Memex Add Column', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-actionmenu-fixtures--memex-add-column',
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

  test.describe('Memex Iteration', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-actionmenu-fixtures--memex-iteration',
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

  test.describe('Memex Keyboard Shortcut', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-actionmenu-fixtures--memex-keyboard-shortcut',
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

  test.describe('Memex Table Menu', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-actionmenu-fixtures--memex-table-menu',
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

  test.describe('Memex View Options Menu', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-actionmenu-fixtures--memex-view-options-menu',
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

  test.describe('Mnemonics Test', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-actionmenu-fixtures--mnemonics-test',
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

  test.describe('Overlay Props', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-actionmenu-fixtures--overlay-props',
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

  test.describe('Tab Test', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-actionmenu-fixtures--tab-test',
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

  test.describe('Within Focus Zone', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-actionmenu-fixtures--within-focus-zone',
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
