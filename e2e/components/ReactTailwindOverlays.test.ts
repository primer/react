import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'

test.describe('React Tailwind overlay integration', () => {
  for (const {story, modal} of [
    {story: 'react-tailwind-components-selectpanel-examples--portal-in-scrollable-dialog', modal: false},
    {story: 'react-tailwind-components-selectpanel-examples--modal-in-scrollable-dialog-portal', modal: true},
  ]) {
    test(`named portal inside a scrollable modal (${modal ? 'modal' : 'anchored'} picker)`, async ({page}) => {
      await visit(page, {id: story})
      await page.getByRole('button', {name: 'Open project settings'}).click()
      const scroll = page.getByTestId('project-picker-scroll')
      await scroll.evaluate(element => {
        element.scrollTop = 280
      })
      const initialScroll = await scroll.evaluate(element => element.scrollTop)
      expect(initialScroll).toBeGreaterThan(0)

      const trigger = page.getByRole('button', {name: 'Projects', exact: true})
      await trigger.click()
      const popup = page.getByTestId('project-picker-portal').getByRole('dialog', {name: 'Projects'})
      await expect(popup).toBeVisible()
      await expect(popup.getByRole('combobox', {name: 'Filter items'})).toBeFocused()
      expect(await scroll.evaluate(element => element.scrollTop)).toBe(initialScroll)

      if (!modal) {
        const popupBounds = await popup.boundingBox()
        const scrollBounds = await scroll.boundingBox()
        expect(popupBounds).not.toBeNull()
        expect(scrollBounds).not.toBeNull()
        const x = scrollBounds!.x + scrollBounds!.width + 8
        const y = popupBounds!.y + Math.min(20, popupBounds!.height / 2)
        expect(popupBounds!.x + popupBounds!.width).toBeGreaterThan(x)
        expect(
          await popup.evaluate(
            (element, point) => {
              const hit = document.elementFromPoint(point.x, point.y)
              return hit !== null && element.contains(hit)
            },
            {x, y},
          ),
        ).toBe(true)
      }

      await page.keyboard.press('Escape')
      await expect(popup).toBeHidden()
      await expect(trigger).toBeFocused()
      expect(await scroll.evaluate(element => element.scrollTop)).toBe(initialScroll)

      await trigger.click()
      await popup.getByRole('option', {name: 'Roadmap'}).click()
      if (modal) await popup.getByRole('button', {name: 'Save', exact: true}).click()
      await expect(popup).toBeHidden()
      await expect(page.getByRole('button', {name: 'Roadmap', exact: true})).toBeFocused()
      expect(await scroll.evaluate(element => element.scrollTop)).toBe(initialScroll)
    })
  }

  test('narrow fullscreen remains behind the feature flag', async ({page}) => {
    await page.setViewportSize({width: 375, height: 667})
    await visit(page, {id: 'react-tailwind-components-selectpanel--playground'})
    await page.getByRole('button', {name: 'Labels', exact: true}).click()
    await expect(page.getByRole('dialog', {name: 'Labels'})).toHaveAttribute('data-component', 'Popover.Popup')

    await visit(page, {id: 'react-tailwind-components-selectpanel-features--fullscreen-on-narrow'})
    await page.getByRole('button', {name: 'Select labels', exact: true}).click()
    const fullscreen = page.getByRole('dialog', {name: 'Select labels'})
    await expect(fullscreen).toHaveAttribute('data-component', 'Dialog.Popup')
    await expect(fullscreen.getByRole('combobox', {name: 'Filter items'})).toBeFocused()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('button', {name: 'Select labels', exact: true})).toBeFocused()
  })

  for (const {story, modal} of [
    {story: 'react-tailwind-components-selectpanel-features--inside-required-form-control', modal: false},
    {story: 'react-tailwind-components-selectpanel-features--modal-inside-required-form-control', modal: true},
  ]) {
    test(`required field leaves its ${modal ? 'modal' : 'anchored'} picker controls independent @aat`, async ({
      page,
    }) => {
      await visit(page, {id: story})

      const label = page.locator('label').filter({hasText: 'Items'})
      const trigger = page.getByRole('button', {name: /Items|Choose items/})
      await expect(label).toHaveAttribute('for', (await trigger.getAttribute('id'))!)
      await expect(trigger).toHaveAccessibleName('Items *')
      await expect(trigger).toHaveAccessibleDescription('An item is required Choose at least one item Required')
      await expect(trigger).toHaveAttribute('aria-invalid', 'true')
      await trigger.click()

      const popup = page.getByRole('dialog', {name: 'Choose items'})
      const filter = popup.getByRole('combobox', {name: 'Filter items'})
      await expect(filter).toBeFocused()
      await expect(filter).toHaveAttribute('aria-expanded', 'true')
      await expect(filter).not.toHaveAttribute('aria-labelledby')
      await expect(filter).not.toHaveAttribute('aria-describedby')
      await expect(filter).not.toHaveAttribute('aria-invalid')
      await expect(filter).not.toHaveAttribute('aria-required', 'true')
      await expect(filter).not.toHaveAttribute('required')
      await expect(filter).not.toHaveAttribute('name', 'items')

      const selectAll = popup.getByRole('checkbox', {name: 'Select all'})
      await expect(selectAll).not.toHaveAttribute('aria-describedby')
      await expect(selectAll).not.toHaveAttribute('aria-invalid')
      const notification = popup.getByRole('checkbox', {name: 'Notify me'})
      await expect(notification).toHaveAccessibleDescription('Email me when selection changes')
      await expect(notification).not.toHaveAttribute('aria-invalid')
      await expect(notification).not.toHaveAttribute('aria-required', 'true')
      await expect(page).toHaveNoViolations()
      await selectAll.click()
      await expect(popup.getByRole('checkbox', {name: 'Deselect all'})).toBeChecked()
      await page.keyboard.press('Escape')
      await expect(trigger).toBeFocused()
    })
  }

  test('picker option names and descriptions remain separate @aat', async ({page}) => {
    await visit(page, {id: 'react-tailwind-components-selectpanel-features--with-option-descriptions'})
    await page.getByRole('button', {name: 'Choose items'}).click()
    const popup = page.getByRole('dialog', {name: 'Choose items'})

    await expect(popup.getByRole('option', {name: 'item1', exact: true})).toHaveAccessibleDescription('Loading')
    await expect(popup.getByRole('option', {name: 'Rich item Public', exact: true})).toHaveAccessibleDescription(
      'Rich description',
    )
    await expect(popup.getByRole('option', {name: 'Rendered item Premium', exact: true})).toHaveAccessibleDescription(
      'First detail Second detail',
    )
    await expect(popup.getByRole('option', {name: 'Hidden visual item', exact: true})).toHaveAccessibleDescription(
      'Visible detail',
    )
    await expect(popup.getByRole('option', {name: 'Raw custom content', exact: true})).toHaveAccessibleDescription(
      'Not available',
    )
    await expect(popup.getByRole('option', {name: 'Custom item name', exact: true})).toHaveAccessibleDescription(
      'Item description',
    )
    await expect(page).toHaveNoViolations()
  })

  test('a non-button ActionMenu item can open a picker and recover focus', async ({page}) => {
    await visit(page, {id: 'react-tailwind-components-selectpanel-examples--action-menu-anchor'})
    await page.getByRole('button', {name: 'Actions'}).click()
    const menu = page.getByRole('menu')
    const anchor = menu.getByRole('menuitem', {name: 'Select labels'})
    await anchor.focus()
    await page.keyboard.press('Enter')

    const popup = page.getByRole('dialog', {name: 'Select labels'})
    await expect(popup.getByRole('combobox', {name: 'Filter items'})).toBeFocused()
    await page.keyboard.press('Escape')
    await expect(anchor).toBeFocused()
    await expect(menu).toBeVisible()

    await anchor.click()
    await popup.getByRole('option', {name: 'enhancement'}).click()
    await expect(popup).toBeHidden()
    await expect(menu.getByRole('menuitem', {name: 'enhancement'})).toBeFocused()
  })

  test('disabled menu items remain discoverable but cannot be activated', async ({page}) => {
    await visit(page, {id: 'react-tailwind-components-actionmenu-features--disabled-items'})
    await page.getByRole('button', {name: 'Open menu'}).click()
    const menu = page.getByRole('menu')
    const disabled = menu.getByRole('menuitem', {name: 'Workflows'})
    await expect(disabled).toHaveAttribute('aria-disabled', 'true')

    const disabledBounds = await disabled.boundingBox()
    expect(disabledBounds).not.toBeNull()
    await page.mouse.click(
      disabledBounds!.x + disabledBounds!.width / 2,
      disabledBounds!.y + disabledBounds!.height / 2,
    )
    await expect(menu).toBeVisible()
    await disabled.focus()
    await page.keyboard.press('Enter')
    await page.keyboard.press('Space')
    await expect(menu).toBeVisible()

    await page.keyboard.press('ArrowDown')
    const enabled = menu.getByRole('menuitem', {name: 'Archived items'})
    await expect(enabled).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(menu).toBeHidden()
  })
})
