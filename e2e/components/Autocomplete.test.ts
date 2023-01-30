import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'

test.describe('Autocomplete', () => {
  test.describe('Add New Item', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-forms-autocomplete--add-new-item',
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

  test.describe('Async Loading Of Items', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-forms-autocomplete--async-loading-of-items',
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

  test.describe('Custom Overlay Menu Anchor', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-forms-autocomplete--custom-overlay-menu-anchor',
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

  test.describe('Custom Search Filter Fn', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-forms-autocomplete--custom-search-filter-fn',
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

  test.describe('Custom Sort After Menu Close', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-forms-autocomplete--custom-sort-after-menu-close',
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

  test.describe('Default', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-forms-autocomplete--default',
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

  test.describe('In Overlay With Custom Scroll Container Ref', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-forms-autocomplete--in-overlay-with-custom-scroll-container-ref',
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

  test.describe('Rendering The Menu Outside An Overlay', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-forms-autocomplete--rendering-the-menu-outside-an-overlay',
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

  test.describe('With Callback When Overlay Open State Changes', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-forms-autocomplete--with-callback-when-overlay-open-state-changes',
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

  test.describe('With Token Input', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-forms-autocomplete--with-token-input',
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
