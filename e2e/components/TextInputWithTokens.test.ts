import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'

test.describe('TextInputWithTokens', () => {
  test.describe('Default', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-forms-textinputwithtokens--default',
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

  test.describe('Unstyled', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-forms-textinputwithtokens--unstyled',
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

  test.describe('Using Issue Label Tokens', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-forms-textinputwithtokens--using-issue-label-tokens',
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

  test.describe('With Leading Visual', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-forms-textinputwithtokens--with-leading-visual',
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

  test.describe('With Loading Indicator', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-forms-textinputwithtokens--with-loading-indicator',
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

  test.describe('With Trailing Visual', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-forms-textinputwithtokens--with-trailing-visual',
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
