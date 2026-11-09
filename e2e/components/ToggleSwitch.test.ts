import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories = [
  {
    title: 'Default',
    id: 'components-toggleswitch--default',
  },
  {
    title: 'Checked',
    id: 'components-toggleswitch-features--checked',
  },
  {
    title: 'Checked Disabled',
    id: 'components-toggleswitch-features--checked-disabled',
  },
  {
    title: 'Controlled',
    id: 'components-toggleswitch-features--controlled',
  },
  {
    title: 'Disabled',
    id: 'components-toggleswitch-features--disabled',
  },
  {
    title: 'Label End',
    id: 'components-toggleswitch-features--label-end',
  },
  {
    title: 'Loading',
    id: 'components-toggleswitch-features--loading',
  },
  {
    title: 'Small',
    id: 'components-toggleswitch-features--small',
  },
  {
    title: 'With Caption',
    id: 'components-toggleswitch-features--with-caption',
  },
  {
    title: 'With Custom Labels',
    id: 'components-toggleswitch-features--with-custom-labels',
  },
] as const

test.describe('React Tailwind ToggleSwitch unavailable state', () => {
  for (const theme of ['light', 'dark', 'light_high_contrast', 'dark_high_contrast']) {
    test(`disabled and loading remain discoverable and suppress input in ${theme} @aat`, async ({page}) => {
      await visit(page, {
        id: 'react-tailwind-forms-toggleswitch-features--unavailable-controlled',
        globals: {colorScheme: theme},
      })
      const control = page.getByRole('switch', {name: 'Firewall'})
      for (const mode of ['Make disabled', 'Make loading', 'Make disabled and loading']) {
        await page.getByRole('button', {name: mode, exact: true}).click()
        await expect(control).toHaveAttribute('aria-disabled', 'true')
        await expect(control).toHaveAttribute('tabindex', '0')
        await expect(control).toHaveAccessibleDescription(/Managed by your organization/)
        await page.getByRole('button', {name: 'Before switch'}).focus()
        await page.keyboard.press('Tab')
        await expect(control).toBeFocused()
        await page.keyboard.press('Space')
        await page.keyboard.press('Enter')
        await expect(control).not.toBeChecked()
        await page.keyboard.press('Tab')
        await expect(page.getByRole('button', {name: 'After switch'})).toBeFocused()
        const bounds = await control.boundingBox()
        expect(bounds).not.toBeNull()
        await page.mouse.click(bounds!.x + bounds!.width / 2, bounds!.y + bounds!.height / 2)
        await control.locator('..').locator('[data-component="ToggleSwitch.StatusLabel"]').dispatchEvent('click')
        await expect(control).not.toBeChecked()
        await expect(page.getByRole('status').filter({hasText: 'Changes requested:'})).toHaveText(
          'Changes requested: 0',
        )
        await page.getByRole('button', {name: 'Update value externally'}).click()
        await expect(control).toBeChecked()
        await expect(control).toHaveAttribute('aria-disabled', 'true')
        await page.getByRole('button', {name: 'Update value externally'}).click()
        await expect(control).not.toBeChecked()
      }
      await expect(page).toHaveNoViolations()
      await page.getByRole('button', {name: 'Make available'}).click()
      await expect(control).not.toHaveAttribute('aria-disabled')
      await control.focus()
      await page.keyboard.press('Space')
      await expect(control).toBeChecked()
      await expect(control).toBeFocused()
      await expect(page.getByRole('status').filter({hasText: 'Changes requested:'})).toHaveText('Changes requested: 1')
      await expect(page).toHaveNoViolations()
    })
  }
})

test.describe('React Tailwind ToggleSwitch status labels', () => {
  for (const {theme, size, position, direction} of [
    {theme: 'light', size: 'small', position: 'start', direction: 'ltr'},
    {theme: 'dark', size: 'medium', position: 'end', direction: 'rtl'},
    {theme: 'light_high_contrast', size: 'small', position: 'end', direction: 'rtl'},
    {theme: 'dark_high_contrast', size: 'medium', position: 'start', direction: 'ltr'},
  ]) {
    test(`custom multiline labels remain visible in ${theme}, ${size}, ${position}, ${direction}`, async ({page}) => {
      await page.setViewportSize({width: 320, height: 600})
      await visit(page, {
        id: 'react-tailwind-forms-toggleswitch--playground',
        args: {
          size,
          statusLabelPosition: position,
          buttonLabelOn: 'Enabled with notifications',
          buttonLabelOff: 'Off',
        },
        globals: {colorScheme: theme},
      })
      await page.evaluate(value => {
        document.documentElement.dir = value
      }, direction)
      await page.addStyleTag({
        content: `
          html { font-size: 32px !important; }
          * { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; }
          [data-component="ToggleSwitch.StatusLabel"] { max-width: 104px; overflow-wrap: anywhere; }
        `,
      })

      const control = page.getByRole('switch', {name: 'Toggle label'})
      const status = page.locator('[data-component="ToggleSwitch.StatusLabel"]')
      const onLabel = status.getByText('Enabled with notifications', {exact: true})
      const offLabel = status.getByText('Off', {exact: true})
      await expect(status).toHaveAttribute('aria-hidden', 'true')
      await expect(status).toHaveCSS('overflow', 'visible')
      await expect(offLabel).toBeVisible()
      await expect(onLabel).toBeHidden()
      const initial = await status.boundingBox()
      expect(initial).not.toBeNull()

      await control.focus()
      await page.keyboard.press('Space')
      await expect(control).toBeChecked()
      await expect(control).toBeFocused()
      await expect(onLabel).toBeVisible()
      await expect(offLabel).toBeHidden()
      await expect(onLabel).toHaveCSS('overflow', 'visible')
      const after = await status.boundingBox()
      expect(after).not.toBeNull()
      expect(after!.width).toBeCloseTo(initial!.width, 1)
      expect(after!.height).toBeCloseTo(initial!.height, 1)
      const labelSize = await onLabel.evaluate(element => ({
        clientWidth: element.clientWidth,
        clientHeight: element.clientHeight,
        scrollWidth: element.scrollWidth,
        scrollHeight: element.scrollHeight,
      }))
      expect(labelSize.scrollWidth).toBeLessThanOrEqual(labelSize.clientWidth)
      expect(labelSize.scrollHeight).toBeLessThanOrEqual(labelSize.clientHeight)
      await expect(page).toHaveNoViolations()

      await onLabel.click()
      await expect(control).not.toBeChecked()
      await expect(offLabel).toBeVisible()
    })
  }
})

test.describe('ToggleSwitch', () => {
  for (const story of stories) {
    test.describe(story.title, () => {
      for (const theme of themes) {
        test.describe(theme, () => {
          test('default @vrt', async ({page}) => {
            await visit(page, {
              id: story.id,
              globals: {
                colorScheme: theme,
              },
            })

            await expect(page).toHaveScreenshot(`ToggleSwitch.${story.title}.${theme}.png`)
          })
        })
      }
    })
  }
})
