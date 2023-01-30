import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'

test.describe('PageLayout', () => {
  test.describe('Custom Sticky Header', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-pagelayout--custom-sticky-header',
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
        id: 'components-pagelayout--default',
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

  test.describe('CustomStickyHeader', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-pagelayout-interactions--custom-sticky-header',
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

  test.describe('NonStickyPane', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-pagelayout-interactions--non-sticky-pane',
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

  test.describe('StickyPane', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-pagelayout-interactions--sticky-pane',
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

  test.describe('Nested Scroll Container', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-pagelayout--nested-scroll-container',
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

  test.describe('Pull Request Page', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-pagelayout--pull-request-page',
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

  test.describe('Resizable Pane', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-pagelayout--resizable-pane',
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

  test.describe('Scroll Container Within Page Layout Pane', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-pagelayout--scroll-container-within-page-layout-pane',
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

  test.describe('Sticky Pane', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-pagelayout--sticky-pane',
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
