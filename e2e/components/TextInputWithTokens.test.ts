import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

test.describe('TextInputWithTokens', () => {
  test.describe('Default', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-forms-textinputwithtokens--default',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`Default.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-forms-textinputwithtokens--default'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('With Leading Visual', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-forms-textinputwithtokens--with-leading-visual',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`With Leading Visual.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-forms-textinputwithtokens--with-leading-visual'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('With Trailing Visual', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-forms-textinputwithtokens--with-trailing-visual',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`With Trailing Visual.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-forms-textinputwithtokens--with-trailing-visual'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('With Loading Indicator', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-forms-textinputwithtokens--with-loading-indicator',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`With Loading Indicator.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-forms-textinputwithtokens--with-loading-indicator'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Using Issue Label Tokens', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-forms-textinputwithtokens--using-issue-label-tokens',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`Using Issue Label Tokens.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-forms-textinputwithtokens--using-issue-label-tokens'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Unstyled', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-forms-textinputwithtokens--unstyled',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`Unstyled.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-forms-textinputwithtokens--unstyled'
      })
      await expect(page).toHaveNoViolations()
    })
  })
})
