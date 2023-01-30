import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'

test.describe('SelectPanel', () => {
  test.describe('Multi Select', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-selectpanel--multi-select-story',
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

  test.describe('SelectPanel, Above a Tall Body', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-selectpanel--select-panel-above-tall-body',
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

  test.describe('SelectPanel, Height and Scroll', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-selectpanel--select-panel-height-and-scroll',
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

  test.describe('SelectPanel, Height: Initial, Overflowing Items', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-selectpanel--select-panel-height-initial-with-overflowing-items-story',
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

  test.describe('SelectPanel, Height: Initial, Underflowing Items', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-selectpanel--select-panel-height-initial-with-underflowing-items-story',
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

  test.describe('SelectPanel, Height: Initial, Underflowing Items (After Fetch)', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-selectpanel--select-panel-height-initial-with-underflowing-items-after-fetch',
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

  test.describe('Single Select', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-selectpanel--single-select-story',
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

  test.describe('With External Anchor', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-selectpanel--external-anchor-story',
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
