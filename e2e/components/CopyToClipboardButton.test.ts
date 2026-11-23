import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'

test.describe('CopyToClipboardButton', () => {
  for (const failed of [false, true]) {
    test(`${failed ? 'failure' : 'success'} feedback @avt`, async ({page}) => {
      await page.addInitScript(shouldFail => {
        Object.defineProperty(navigator, 'clipboard', {
          value: {
            writeText: async () => {
              if (shouldFail) throw new Error('Clipboard permission denied')
            },
          },
        })
      }, failed)
      await visit(page, {id: 'components-copytoclipboardbutton--default'})
      const button = page.getByRole('button', {name: 'Copy greeting', exact: true})
      await expect(page).toHaveNoViolations()
      await button.click()
      await expect(button).toHaveAttribute(failed ? 'data-copy-error' : 'data-copied', 'true')
      await expect(button).toHaveAccessibleName('Copy greeting')
      await expect(button).toBeFocused()
      await expect(page).toHaveNoViolations()
    })
  }

  test('disabled @avt', async ({page}) => {
    await visit(page, {id: 'components-copytoclipboardbutton--disabled'})
    await expect(page.getByRole('button', {name: 'Copy greeting', exact: true})).toBeDisabled()
    await expect(page).toHaveNoViolations()
  })
})
