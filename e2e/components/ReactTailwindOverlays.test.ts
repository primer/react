import {test, expect, type Locator, type Page} from '@playwright/test'
import {visit} from '../test-helpers/storybook'

async function expectMenuAccessibilityRelationships(page: Page, names: string[]) {
  const session = await page.context().newCDPSession(page)
  try {
    const {nodes} = await session.send('Accessibility.getFullAXTree')
    const nodesById = new Map(nodes.map(node => [node.nodeId, node]))
    for (const [index, name] of names.entries()) {
      const menu = nodes.find(node => node.role?.value === 'menu' && node.name?.value === name)
      expect(menu, `Accessibility tree contains menu "${name}"`).toBeDefined()
      if (!menu) throw new Error(`Missing menu "${name}" in the accessibility tree`)

      let ancestor = menu.parentId ? nodesById.get(menu.parentId) : undefined
      while (ancestor) {
        expect(ancestor.role?.value, `Menu "${name}" must not be a child of another menu`).not.toBe('menu')
        ancestor = ancestor.parentId ? nodesById.get(ancestor.parentId) : undefined
      }

      if (index === 0) continue
      const trigger = nodes.find(node => node.role?.value === 'menuitem' && node.name?.value === name)
      expect(trigger, `Accessibility tree contains trigger "${name}"`).toBeDefined()
      if (!trigger) throw new Error(`Missing trigger "${name}" in the accessibility tree`)
      const controls = trigger.properties?.find(property => property.name === 'controls')
      expect(controls?.value.relatedNodes?.some(node => node.backendDOMNodeId === menu.backendDOMNodeId)).toBe(true)
      const labelledBy = menu.properties?.find(property => property.name === 'labelledby')
      expect(labelledBy?.value.relatedNodes?.some(node => node.backendDOMNodeId === trigger.backendDOMNodeId)).toBe(
        true,
      )

      let triggerAncestor = trigger.parentId ? nodesById.get(trigger.parentId) : undefined
      while (triggerAncestor && triggerAncestor.role?.value !== 'menu') {
        triggerAncestor = triggerAncestor.parentId ? nodesById.get(triggerAncestor.parentId) : undefined
      }
      expect(triggerAncestor?.name?.value).toBe(names[index - 1])
    }
  } finally {
    await session.detach()
  }
}

async function expectSubmenuPlacement(trigger: Locator, menu: Locator) {
  const triggerBounds = await trigger.boundingBox()
  const menuBounds = await menu.boundingBox()
  expect(triggerBounds).not.toBeNull()
  expect(menuBounds).not.toBeNull()
  expect(menuBounds!.x).toBeCloseTo(triggerBounds!.x + triggerBounds!.width + 4, 0)
  expect(menuBounds!.y).toBeCloseTo(triggerBounds!.y, 0)
}

test.describe('React Tailwind overlay integration', () => {
  for (const colorScheme of ['light', 'dark', 'light_high_contrast', 'dark_high_contrast']) {
    test(`a current-model submenu separates selection from opening in ${colorScheme} @aat`, async ({page}) => {
      await visit(page, {
        id: 'react-tailwind-components-actionmenu-features--current-model-submenu',
        globals: {colorScheme},
      })
      await expect(page.getByRole('status')).toHaveText('Current model: Auto; tier: Fast')
      const menuButton = page.getByRole('button', {name: 'Models', exact: true})
      await menuButton.click()
      const trigger = page.getByRole('menuitemradio', {name: 'Auto Recommended', exact: true})
      await expect(trigger).toHaveAttribute('aria-checked', 'true')
      await expect(trigger).toHaveAccessibleDescription('Optimized for your task')
      await expect(trigger.locator('[data-component="ActionList.Selection"] svg')).toBeVisible()
      const submenu = page.getByRole('menu', {name: 'Optimization', exact: true})
      await trigger.click()
      await expect(submenu).toBeVisible()
      await expect(trigger).toHaveAttribute('aria-checked', 'true')
      await expect(page.getByRole('status')).toHaveText('Current model: Auto; tier: Fast')
      await page.keyboard.press('Escape')
      await expect(trigger).toBeFocused()
      await trigger.focus()
      await page.keyboard.press('ArrowRight')
      await expect(submenu).toBeVisible()
      await expect(submenu).not.toHaveAttribute('aria-labelledby')
      await expect(trigger).toHaveAttribute('aria-checked', 'true')
      await expect(page).toHaveNoViolations()
      await page.keyboard.press('Escape')
      await expect(trigger).toBeFocused()
      await page.getByRole('menuitemradio', {name: 'Manual', exact: true}).click()
      await expect(page.getByRole('status')).toHaveText('Current model: Manual; tier: Fast')
      await menuButton.click()
      await expect(trigger).toHaveAttribute('aria-checked', 'false')
      await expect(trigger.locator('[data-component="ActionList.Selection"] svg')).toBeHidden()
      await trigger.hover()
      await expect(submenu).toBeVisible()
      await expect(page.getByRole('status')).toHaveText('Current model: Manual; tier: Fast')
      await page.keyboard.press('Escape')
      await expect(trigger).toBeFocused()
      await trigger.focus()
      await page.keyboard.press('ArrowRight')
      await expect(submenu).toBeVisible()
      await expect(page.getByRole('status')).toHaveText('Current model: Manual; tier: Fast')
      await submenu.getByRole('menuitemradio', {name: 'Balanced', exact: true}).click()
      await expect(page.getByRole('status')).toHaveText('Current model: Auto; tier: Balanced')
      await expect(menuButton).toBeFocused()
    })

    test(`a current-model submenu exposes inactive and loading reasons in ${colorScheme} @aat`, async ({page}) => {
      await visit(page, {
        id: 'react-tailwind-components-actionmenu-features--current-model-submenu',
        globals: {colorScheme},
      })
      await expect(page.getByRole('status')).toHaveText('Current model: Auto; tier: Fast')
      const menuButton = page.getByRole('button', {name: 'Models', exact: true})
      for (const state of ['inactive', 'loading']) {
        await page.getByRole('button', {name: state === 'inactive' ? 'Make inactive' : 'Load tiers'}).click()
        await menuButton.click()
        const trigger = page.getByRole('menuitemradio', {name: /^Auto/})
        await expect(trigger).toHaveAttribute('aria-disabled', 'true')
        await expect(trigger).toHaveAttribute('aria-checked', 'true')
        await expect(trigger).toHaveAccessibleDescription(
          state === 'inactive' ? 'Optimized for your task Requires model access' : 'Optimized for your task',
        )
        if (state === 'loading') {
          await expect(trigger).toHaveAccessibleName('Auto Recommended Loading model tiers')
          await expect(trigger.locator('[data-component="Spinner"]')).toBeVisible()
        }
        await trigger.hover()
        await trigger.focus()
        await page.keyboard.press('ArrowRight')
        await expect(page.getByRole('menu', {name: 'Optimization'})).toBeHidden()
        await expect(page.getByRole('status')).toHaveText('Current model: Auto; tier: Fast')
        await expect(page).toHaveNoViolations()
        await page.keyboard.press('Escape')
        await expect(menuButton).toBeFocused()
      }
      await page.getByRole('button', {name: 'Make available'}).click()
      await menuButton.click()
      const trigger = page.getByRole('menuitemradio', {name: 'Auto Recommended', exact: true})
      await expect(trigger).not.toHaveAttribute('aria-disabled', 'true')
      await expect(trigger).toHaveAccessibleDescription('Optimized for your task')
      await trigger.focus()
      await page.keyboard.press('ArrowRight')
      await expect(page.getByRole('menu', {name: 'Optimization'})).toBeVisible()
    })
  }

  test('tooltip and menu triggers share a keyboard-operable button @aat', async ({page}) => {
    await visit(page, {id: 'react-tailwind-components-actionmenu-features--tooltip-trigger'})
    const trigger = page.getByRole('button', {name: 'Branches'})
    await trigger.focus()
    await expect(trigger).toHaveAccessibleDescription('Switch branches')
    await page.keyboard.press('Enter')
    const menu = page.getByRole('menu', {name: 'Branches'})
    await expect(menu.getByRole('menuitem', {name: 'main'})).toBeFocused()
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await expect(trigger).toHaveAttribute('aria-controls', (await menu.getAttribute('id'))!)
    await expect(page).toHaveNoViolations()
    await page.keyboard.press('Escape')
    await expect(trigger).toBeFocused()
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await page.keyboard.press('Space')
    await expect(menu.getByRole('menuitem', {name: 'main'})).toBeFocused()
    await page.keyboard.press('Escape')
    await expect(trigger).toBeFocused()
    await trigger.click()
    await expect(menu).toBeVisible()
  })

  test('icon menu triggers retain tooltip names, refs, keyboard behavior, and custom visuals @aat', async ({page}) => {
    await visit(page, {id: 'react-tailwind-components-actionmenu-features--custom-triggers'})
    const trigger = page.getByRole('button', {name: 'Repository actions', exact: true})
    const menu = page.getByRole('menu', {name: 'Repository actions'})
    const item = menu.getByRole('menuitem', {name: 'Copy'})
    await expect(trigger).not.toHaveAttribute('aria-label')
    await expect(trigger).toHaveAttribute('aria-labelledby', /\S/)
    const labelId = await trigger.getAttribute('aria-labelledby')
    if (!labelId) throw new Error('The trigger has no tooltip label reference')
    await expect(page.locator(`[id="${labelId}"]`)).toHaveText('Repository actions')
    await expect(trigger.getByTestId('rendered-menu-icon')).toBeVisible()
    await expect(trigger.locator('button')).toHaveCount(0)
    await trigger.focus()
    await expect(page.getByTestId('trigger-refs')).toHaveText('Refs: connected')
    await page.keyboard.press('Enter')
    await expect(item).toBeFocused()
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await expect(page).toHaveNoViolations()
    await page.keyboard.press('Escape')
    await expect(trigger).toBeFocused()
    await page.keyboard.press('Space')
    await expect(item).toBeFocused()
    await item.click()
    await expect(trigger).toBeFocused()
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')

    const componentIcon = page.getByRole('button', {name: 'Component actions'})
    await expect(componentIcon.locator('.octicon-gear')).toBeVisible()
    await componentIcon.click()
    await expect(page.getByRole('menuitem', {name: 'Archive'})).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(componentIcon).toBeFocused()

    await expect(page.getByRole('button', {name: 'Default chevron'}).locator('.octicon-triangle-down')).toBeVisible()
    await expect(
      page.getByRole('button', {name: 'No chevron'}).locator('[data-component="trailingAction"]'),
    ).toHaveCount(0)
    await expect(page.getByRole('button', {name: 'Custom chevron'}).getByTestId('custom-trailing-action')).toBeVisible()
    await expect(page).toHaveNoViolations()
  })

  test('a hovered tooltip does not block menu dismissal', async ({page}) => {
    await visit(page, {id: 'react-tailwind-components-actionmenu-features--tooltip-trigger'})
    const trigger = page.getByRole('button', {name: 'Branches'})
    await trigger.hover()
    await expect(page.locator('[data-component="Tooltip.Content"]')).toBeVisible()
    await trigger.click()
    const menu = page.getByRole('menu', {name: 'Branches'})
    await expect(menu).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(menu).toBeHidden()
    await expect(trigger).toBeFocused()
  })

  test('an icon button associates its tooltip popup independently of its visibility @aat', async ({page}) => {
    await visit(page, {id: 'react-tailwind-components-iconbutton-features--keybinding-hint'})
    const trigger = page.getByRole('button', {name: 'Bold', exact: true})
    await expect(trigger).not.toHaveAttribute('aria-labelledby')
    await expect(trigger).toHaveAccessibleDescription(/\(.+\)/)
    await trigger.hover()
    await expect(trigger).toHaveAttribute('data-popup-open')

    const owner = await trigger.getAttribute('data-tooltip-trigger')
    if (!owner) throw new Error('Tooltip trigger has no popup association')
    const popup = page.locator('[data-tooltip-popup]')
    await expect(popup).toHaveCount(1)
    await expect(popup).toHaveAttribute('data-tooltip-popup', owner)
    await expect(popup).toBeVisible()

    const associatedPopupIsVisible = () =>
      trigger.evaluate(element => {
        const association = element.getAttribute('data-tooltip-trigger')
        const associatedPopup = Array.from(
          element.ownerDocument.querySelectorAll<HTMLElement>('[data-tooltip-popup]'),
        ).find(candidate => candidate.getAttribute('data-tooltip-popup') === association)
        return associatedPopup?.checkVisibility({opacityProperty: true, visibilityProperty: true}) ?? false
      })
    expect(await associatedPopupIsVisible()).toBe(true)

    await popup.evaluate(element => {
      element.style.visibility = 'hidden'
    })
    await expect(popup).toBeHidden()
    await expect(trigger).toHaveAttribute('data-popup-open')
    expect(await associatedPopupIsVisible()).toBe(false)
    await expect(trigger).toHaveAccessibleName('Bold')
    await expect(trigger).toHaveAccessibleDescription(/\(.+\)/)
  })

  async function expectMenuTabOrder(
    page: Page,
    story: string,
    openName: string,
    overlayName: string,
    triggerName: string,
    actionName: string,
    nextName: string,
    dismissal: 'keyboard' | 'pointer' | 'escape',
  ) {
    await visit(page, {id: story})
    await page.getByRole('button', {name: openName}).click()
    const overlay = page.getByRole('dialog', {name: overlayName})
    const trigger = overlay.getByRole('button', {name: triggerName})
    await trigger.focus()
    await page.keyboard.press('Enter')
    const action = page.getByRole('menuitem', {name: actionName})
    await expect(action).toBeFocused()
    if (dismissal === 'keyboard') await page.keyboard.press('Enter')
    else if (dismissal === 'pointer') await action.click()
    else await page.keyboard.press('Escape')
    await expect(trigger).toBeFocused()
    await expect(trigger).not.toHaveAttribute('tabindex', '-1')
    await page.keyboard.press('Tab')
    await expect(overlay.getByRole('button', {name: nextName})).toBeFocused()
    await page.keyboard.press('Shift+Tab')
    await expect(trigger).toBeFocused()
  }

  for (const dismissal of ['keyboard', 'pointer', 'escape'] as const) {
    test(`a nested menu restores tab order after ${dismissal} dismissal`, async ({page}) => {
      await expectMenuTabOrder(
        page,
        'react-tailwind-components-anchoredoverlay-features--nested-menu-focus',
        'Open overlay',
        'Overlay actions',
        'More actions',
        'Copy',
        'After menu',
        dismissal,
      )
    })

    test(`a menu in a raw Base UI portal restores tab order after ${dismissal} dismissal`, async ({page}) => {
      await expectMenuTabOrder(
        page,
        'react-tailwind-components-anchoredoverlay-features--menu-inside-base-ui-portal',
        'Open Base UI overlay',
        'Base UI overlay actions',
        'More actions',
        'Copy',
        'After menu',
        dismissal,
      )
    })
  }

  // Base UI can leave the trigger untabbable when focus returns from a separate portal.
  test.fixme('a menu portaled outside its nonmodal overlay restores tab order', async ({page}) => {
    await expectMenuTabOrder(
      page,
      'react-tailwind-components-anchoredoverlay-features--separate-portal-focus-reproduction',
      'Open overlay',
      'Overlay actions',
      'More actions',
      'Copy',
      'After menu',
      'keyboard',
    )
  })

  test('inactive menu and list reasons are descriptions rather than names @aat', async ({page}) => {
    await visit(page, {id: 'react-tailwind-components-actionmenu-features--inactive-items'})
    await page.getByRole('button', {name: 'Open menu'}).click()
    for (const name of ['Workflows', 'Settings']) {
      const item = page.getByRole('menuitem', {name, exact: true})
      await expect(item).toHaveAttribute('aria-disabled', 'true')
      await expect(item).toHaveAccessibleDescription('Unavailable due to an outage')
      await expect(item).toHaveAttribute('title', 'Unavailable due to an outage')
      await expect(item.getByText('Unavailable due to an outage')).toBeVisible()
    }
    await expect(page).toHaveNoViolations()

    await visit(page, {id: 'react-tailwind-components-actionlist-features--inactive-single-select'})
    const item = page.getByRole('menuitem', {name: 'Inactive item', exact: true})
    await expect(item).toHaveAttribute('aria-disabled', 'true')
    await expect(item).toHaveAccessibleDescription('Unavailable due to an outage')
    await expect(page).toHaveNoViolations()
  })

  test('long menus keep the focused item visible at 320 by 256 pixels', async ({page}) => {
    await page.setViewportSize({width: 320, height: 256})
    await visit(page, {id: 'react-tailwind-components-actionmenu-examples--setting-max-height'})
    const trigger = page.getByRole('button', {name: 'Open menu'})
    await trigger.focus()
    await page.keyboard.press('Enter')
    const menu = page.getByRole('menu')
    const first = menu.getByRole('menuitem', {name: 'Item 1', exact: true})
    const last = menu.getByRole('menuitem', {name: 'Item 100', exact: true})
    await expect(first).toBeFocused()

    await page.keyboard.press('End')
    await expect(last).toBeFocused()
    await expect(last).toBeInViewport({ratio: 1})
    const [menuBounds, itemBounds] = await Promise.all([menu.boundingBox(), last.boundingBox()])
    expect(menuBounds).not.toBeNull()
    expect(itemBounds).not.toBeNull()
    expect(menuBounds!.x).toBeGreaterThanOrEqual(0)
    expect(menuBounds!.y).toBeGreaterThanOrEqual(0)
    expect(menuBounds!.x + menuBounds!.width).toBeLessThanOrEqual(320)
    expect(menuBounds!.y + menuBounds!.height).toBeLessThanOrEqual(256)
    expect(itemBounds!.y).toBeGreaterThanOrEqual(menuBounds!.y)
    expect(itemBounds!.y + itemBounds!.height).toBeLessThanOrEqual(menuBounds!.y + menuBounds!.height)
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320)

    await page.keyboard.press('Home')
    await expect(first).toBeFocused()
    await expect(first).toBeInViewport({ratio: 1})
    await page.keyboard.press('Escape')
    await expect(trigger).toBeFocused()
  })

  test('menu router links compose refs and preserve menu keyboard and pointer behavior @aat', async ({page}) => {
    async function openMenu() {
      await visit(page, {id: 'react-tailwind-components-actionmenu-features--router-link-composition'})
      await page.getByRole('button', {name: 'Project menu'}).focus()
      await page.keyboard.press('Enter')
      const link = page.getByRole('menuitem', {name: 'Browse projects', exact: true})
      await expect(link).toBeFocused()
      await expect(link).toHaveAttribute('href', '/projects')
      await expect(link).toHaveAccessibleDescription('View all projects')
      await expect(page.getByTestId('router-ref')).toHaveText('Ref: forwarded')
      return link
    }

    await openMenu()
    await page.keyboard.press('Enter')
    await expect(page.getByTestId('router-path')).toHaveText('Path: /projects')
    await expect(page.getByTestId('router-event')).toHaveText(
      'Last event: click: button=0, modified=false, prevented=false',
    )

    await openMenu()
    await page.keyboard.press('Space')
    await expect(page.getByTestId('router-path')).toHaveText('Path: /projects')
    await expect(page.getByTestId('router-event')).toHaveText(
      'Last event: click: button=0, modified=false, prevented=false',
    )

    const metaLink = await openMenu()
    await metaLink.click({modifiers: ['Meta']})
    await expect(page.getByTestId('router-path')).toHaveText('Path: /')
    await expect(page.getByTestId('router-event')).toHaveText(
      'Last event: click: button=0, modified=true, prevented=false',
    )

    const middleLink = await openMenu()
    await middleLink.click({button: 'middle'})
    await expect(page.getByTestId('router-path')).toHaveText('Path: /')
    await expect(page.getByTestId('router-event')).toHaveText('Last event: auxclick: button=1, prevented=false')
    await expect(page).toHaveNoViolations()
  })

  test('menu item descriptions stay separate from names and keyboard interaction @aat', async ({page}) => {
    await visit(page, {id: 'react-tailwind-components-actionmenu-features--item-descriptions'})
    const trigger = page.getByRole('button', {name: 'Repository actions'})
    await trigger.focus()
    await page.keyboard.press('Enter')

    const menu = page.getByRole('menu', {name: 'Repository actions'})
    const archive = menu.getByRole('menuitem', {name: 'Archive Ctrl+A', exact: true})
    const watch = menu.getByRole('menuitemcheckbox', {name: 'Watch', exact: true})
    const month = menu.getByRole('menuitemradio', {name: 'Current month', exact: true})
    const settings = menu.getByRole('menuitem', {name: 'Settings', exact: true})
    await expect(archive).toHaveAccessibleDescription('Move the repository out of active lists')
    await expect(watch).toHaveAccessibleDescription('Receive notifications')
    await expect(month).toHaveAccessibleDescription('June 2025')
    await expect(settings).toHaveAccessibleDescription('Manage repository settings')
    await expect(settings).toHaveAttribute('href', '#settings')
    await expect(archive).toBeFocused()

    await page.keyboard.press('ArrowDown')
    await expect(watch).toBeFocused()
    await page.keyboard.press('Space')
    await expect(watch).toHaveAttribute('aria-checked', 'true')
    await expect(page).toHaveNoViolations()
    await page.keyboard.press('Escape')
    await expect(trigger).toBeFocused()
  })

  for (const story of ['named-portal-with-nested-menu', 'named-portal-with-compound-dialog']) {
    test(`a named dialog portal keeps nested layers accessible (${story}) @aat`, async ({page}) => {
      await visit(page, {id: `react-tailwind-components-dialog-examples--${story}`})
      await page.getByRole('button', {name: 'Open settings'}).click()
      const root = page.getByTestId('named-dialog-root')
      const dialog = root.getByRole('dialog', {name: 'Repository settings'})
      await expect(dialog).toBeVisible()
      await dialog.getByRole('button', {name: 'Repository actions'}).click()
      const menu = root.getByRole('menu', {name: 'Repository actions'})
      await expect(menu.getByRole('menuitem', {name: 'Rename'})).toBeVisible()
      expect(await menu.evaluate(element => element.closest('[aria-hidden="true"], [inert]'))).toBeNull()
      expect(
        await menu.evaluate(element => getComputedStyle(element).getPropertyValue('--portal-test-scope').trim()),
      ).toBe('named')
      await expect(page).toHaveNoViolations()
      await menu.getByRole('menuitem', {name: 'Rename'}).click()
      await expect(dialog.getByRole('status')).toHaveText('Rename selected')
      await expect(dialog).toBeVisible()

      await dialog.getByRole('button', {name: 'Open help'}).click()
      const popover = root.getByRole('dialog', {name: 'Help'})
      await expect(popover).toBeVisible()
      expect(await popover.evaluate(element => element.closest('[aria-hidden="true"], [inert]'))).toBeNull()
      await page.keyboard.press('Escape')
      await expect(popover).toBeHidden()
      await expect(dialog).toBeVisible()

      await dialog.getByRole('button', {name: 'Open confirmation'}).click()
      const nested = root.getByRole('dialog', {name: 'Confirm changes'})
      await expect(nested).toBeVisible()
      expect(await nested.evaluate(element => element.closest('[aria-hidden="true"], [inert]'))).toBeNull()
      await page.keyboard.press('Escape')
      await expect(nested).toBeHidden()
      await expect(dialog).toBeVisible()
    })
  }

  test('a hovered file tooltip remains reachable while dialog focus stays elsewhere @aat', async ({page}) => {
    await visit(page, {id: 'react-tailwind-components-tooltip-examples--hovered-file-in-dialog'})
    await page.getByRole('button', {name: 'Open files'}).click()
    const dialog = page.getByRole('dialog', {name: 'Files'})
    const focused = dialog.getByRole('button', {name: 'Keep focus here'})
    const file = dialog.getByRole('treeitem', {name: 'Long file name, modified'})
    const tooltip = page.locator('[data-component="Tooltip.Content"]').filter({hasText: 'A-very-long-file-name.tsx'})
    await focused.focus()
    await file.hover()
    await expect(tooltip).toBeVisible()
    await tooltip.hover()
    await expect(tooltip).toBeVisible()
    await expect(focused).toBeFocused()
    await expect(page).toHaveNoViolations()
  })

  test.fixme('a hovered tooltip dismisses before its containing dialog when focus is elsewhere', async ({page}) => {
    await visit(page, {id: 'react-tailwind-components-tooltip-examples--hovered-file-in-dialog'})
    await page.getByRole('button', {name: 'Open files'}).click()
    const dialog = page.getByRole('dialog', {name: 'Files'})
    const focused = dialog.getByRole('button', {name: 'Keep focus here'})
    const file = dialog.getByRole('treeitem', {name: 'Long file name, modified'})
    const tooltip = page.locator('[data-component="Tooltip.Content"]').filter({hasText: 'A-very-long-file-name.tsx'})
    await focused.focus()
    await file.hover()
    await expect(tooltip).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(tooltip).toBeHidden()
    await expect(dialog).toBeVisible()
    await expect(focused).toBeFocused()
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
  })

  test('a Popover-owned Overlay keeps nested portaled interactions inside @aat', async ({page}) => {
    await visit(page, {id: 'react-tailwind-components-overlay-examples--portaled-children'})
    const trigger = page.getByRole('button', {name: 'Open overlay'})
    await trigger.click()
    const parent = page.getByRole('dialog', {name: 'Repository overlay'})
    const parentSurface = page.locator('[data-component="Overlay"][aria-label="Repository overlay"]')
    await expect(parent).toBeVisible()
    await expect(page).toHaveNoViolations()

    await parent.getByRole('button', {name: 'File actions'}).click()
    const menu = page.getByRole('menu')
    await expect(menu.getByRole('menuitem', {name: 'Copy path'})).toBeVisible()
    await menu.getByRole('menuitem', {name: 'Copy path'}).click()
    await expect(page.getByRole('status')).toHaveText('Last action: Copy path')
    await expect(parent).toBeVisible()

    await parent.getByRole('button', {name: 'Nested popover'}).click()
    const popover = page.getByRole('dialog', {name: 'Nested settings'})
    await popover.getByRole('button', {name: 'Apply settings'}).click()
    await expect(page.getByRole('status')).toHaveText('Last action: Apply settings')
    await expect(parent).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(popover).toBeHidden()
    await expect(parent).toBeVisible()

    await parent.getByRole('button', {name: 'Nested dialog'}).click()
    const dialog = page.getByRole('dialog', {name: 'Confirm changes'})
    await dialog.getByRole('button', {name: 'Confirm changes'}).click()
    await expect(page.locator('[role="status"]')).toHaveText('Last action: Confirm changes')
    await expect(dialog).toBeVisible()
    await expect(parentSurface).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await expect(parent).toBeVisible()

    await page.getByRole('button', {name: 'Outside overlay'}).click()
    await expect(parent).toBeHidden()
  })

  for (const mode of ['ref', 'callback'] as const) {
    test(`a non-tabbable dialog return target passed by ${mode} focuses its first tabbable child`, async ({page}) => {
      await visit(page, {id: 'react-tailwind-components-dialog-features--return-focus-to-container'})
      await page.getByRole('button', {name: `Open with ${mode}`}).click()
      await expect(
        page.getByRole('dialog', {name: `${mode === 'ref' ? 'Ref' : 'Callback'} focus target`}),
      ).toBeVisible()
      await expect(page).toHaveNoViolations()
      await page.keyboard.press('Escape')
      const feedbackAction = page.getByRole('button', {name: 'Feedback action'})
      await expect(feedbackAction).toHaveAttribute('aria-disabled', 'true')
      await expect(feedbackAction).toBeFocused()
      await expect(page.getByTestId('return-focus-container')).not.toBeFocused()
    })
  }

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

  for (const {story, modal} of [
    {story: 'react-tailwind-components-selectpanel-examples--default-portal-in-dialog', modal: false},
    {story: 'react-tailwind-components-selectpanel-examples--modal-with-default-portal-in-dialog', modal: true},
  ]) {
    test(`${modal ? 'a modal' : 'an anchored'} picker using the default portal remains accessible inside a dialog @aat`, async ({
      page,
    }) => {
      await visit(page, {id: story})
      const dialogTrigger = page.getByRole('button', {name: 'Open project settings'})
      await dialogTrigger.click()
      const parent = page.getByRole('dialog', {name: 'Project settings'})
      const scroll = page.getByTestId('project-picker-scroll')
      await scroll.evaluate(element => {
        element.scrollTop = 280
      })
      const trigger = parent.getByRole('button', {name: 'Projects', exact: true})
      await trigger.click()
      const popup = page.getByRole('dialog', {name: 'Projects'})
      const input = popup.getByRole('combobox', {name: 'Filter items'})
      await expect(input).toBeFocused()
      const option = popup.getByRole('option', {name: 'Roadmap', exact: true})
      await expect(option).toBeVisible()
      expect(await option.evaluate(element => element.closest('[aria-hidden="true"], [inert]'))).toBeNull()
      await expect(page).toHaveNoViolations()
      await option.click()
      if (modal) await popup.getByRole('button', {name: 'Save', exact: true}).click()
      await expect(popup).toBeHidden()
      const selectedTrigger = parent.getByRole('button', {name: 'Roadmap', exact: true})
      await expect(selectedTrigger).toBeFocused()

      await selectedTrigger.click()
      await expect(input).toBeFocused()
      await page.keyboard.press('Escape')
      await expect(popup).toBeHidden()
      await expect(selectedTrigger).toBeFocused()
      if (modal) await expect(parent).not.toHaveAttribute('data-nested-dialog-open')
      await page.keyboard.press('Escape')
      await expect(parent).toBeHidden()
      await expect(dialogTrigger).toBeFocused()
    })
  }

  test('a named portal in a transformed scroll container keeps its scroll position @aat', async ({page}) => {
    await page.setViewportSize({width: 1600, height: 900})
    await visit(page, {id: 'react-tailwind-components-selectpanel-examples--portal-in-transformed-scroll-container'})
    const scroll = page.getByRole('dialog', {name: 'Scrolled picker panel'})
    const portal = page.getByTestId('scrolled-picker-portal')
    await scroll.evaluate(element => {
      element.scrollTop = 1000
    })
    const initialScroll = await scroll.evaluate(element => element.scrollTop)
    expect(initialScroll).toBeGreaterThan(0)

    const trigger = scroll.getByRole('button', {name: 'Projects', exact: true})
    await trigger.click()
    const popup = portal.getByRole('dialog', {name: 'Projects'})
    const filter = popup.getByRole('combobox', {name: 'Filter items'})
    await expect(filter).toBeFocused()
    expect(await scroll.evaluate(element => element.scrollTop)).toBe(initialScroll)
    await expect(page).toHaveNoViolations()

    await page.keyboard.press('ArrowUp')
    await expect(filter).toHaveAttribute('aria-activedescendant', /.+/)
    await page.keyboard.press('Escape')
    await expect(trigger).toBeFocused()
    expect(await scroll.evaluate(element => element.scrollTop)).toBe(initialScroll)

    await page.keyboard.press('Enter')
    await expect(filter).toBeFocused()
    expect(await scroll.evaluate(element => element.scrollTop)).toBe(initialScroll)
    await popup.getByRole('option', {name: 'Project 1', exact: true}).click()
    await page.keyboard.press('Escape')
    await expect(scroll.getByRole('button', {name: 'Project 1', exact: true})).toBeFocused()
    expect(await scroll.evaluate(element => element.scrollTop)).toBe(initialScroll)
  })

  test('anchored pickers remain usable at 320 by 256 pixels', async ({page}) => {
    await page.setViewportSize({width: 320, height: 256})
    await visit(page, {id: 'react-tailwind-components-selectpanel-features--with-option-descriptions'})
    await page.getByRole('button', {name: 'Choose items'}).click()
    const popup = page.getByRole('dialog', {name: 'Choose items'})
    const filter = popup.getByRole('combobox', {name: 'Filter items'})
    await expect(filter).toBeFocused()
    const bounds = await popup.boundingBox()
    expect(bounds).not.toBeNull()
    expect(bounds!.x).toBeGreaterThanOrEqual(0)
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(320)
    expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(256)
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320)

    const option = popup.getByRole('option', {name: 'item1', exact: true})
    await option.scrollIntoViewIfNeeded()
    await expect(option).toBeInViewport({ratio: 1})
    await option.click()
  })

  test('fixed-height pickers keep options and footer reachable at 320 by 256 pixels', async ({page}) => {
    await page.setViewportSize({width: 320, height: 256})
    await visit(page, {id: 'react-tailwind-components-selectpanel-features--with-secondary-action-button'})
    await page.getByRole('button', {name: 'Labels'}).click()
    const popup = page.getByRole('dialog', {name: 'Select labels'})
    const filter = popup.getByRole('combobox', {name: 'Filter items'})
    await expect(filter).toBeFocused()
    const bounds = await popup.boundingBox()
    expect(bounds).not.toBeNull()
    expect(bounds!.x).toBeGreaterThanOrEqual(0)
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(320)
    expect(bounds!.y).toBeGreaterThanOrEqual(0)
    expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(256)

    const option = popup.getByRole('option', {name: /enhancement/})
    await option.scrollIntoViewIfNeeded()
    await expect(option).toBeInViewport({ratio: 1})
    await option.click()
    const action = popup.getByRole('button', {name: 'Edit labels'})
    await action.scrollIntoViewIfNeeded()
    await expect(action).toBeInViewport({ratio: 1})
  })

  test('modal pickers keep options and actions reachable at 320 by 256 pixels', async ({page}) => {
    await page.setViewportSize({width: 320, height: 256})
    await visit(page, {id: 'react-tailwind-components-selectpanel-features--modal-inside-required-form-control'})
    const trigger = page.getByRole('button', {name: /Items|Choose items/})
    await trigger.click()
    const popup = page.getByRole('dialog', {name: 'Choose items'})
    await expect(popup.getByRole('combobox', {name: 'Filter items'})).toBeFocused()
    const bounds = await popup.boundingBox()
    expect(bounds).not.toBeNull()
    expect(bounds!.x).toBeGreaterThanOrEqual(0)
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(320)
    expect(bounds!.y).toBeGreaterThanOrEqual(0)
    expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(256)
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320)

    const option = popup.getByRole('option', {name: 'enhancement', exact: true})
    await option.scrollIntoViewIfNeeded()
    await expect(option).toBeInViewport({ratio: 1})
    await option.click()
    const save = popup.getByRole('button', {name: 'Save', exact: true})
    await save.scrollIntoViewIfNeeded()
    await expect(save).toBeInViewport({ratio: 1})
    await save.click()
    await expect(popup).toBeHidden()
    await expect(trigger).toBeFocused()
  })

  for (const viewport of [
    {width: 1012, height: 768},
    {width: 320, height: 256},
  ]) {
    test(`initial picker height respects its maximum at ${viewport.width} by ${viewport.height}`, async ({page}) => {
      await page.setViewportSize(viewport)
      await visit(page, {
        id: 'react-tailwind-components-selectpanel-examples--height-initial-with-overflowing-items-story',
      })
      await page.getByRole('button', {name: 'Labels'}).click()
      const popup = page.getByRole('dialog', {name: 'Select labels'})
      const input = popup.getByRole('combobox', {name: 'Filter items'})
      await expect(input).toBeFocused()
      const initialBounds = await popup.boundingBox()
      expect(initialBounds).not.toBeNull()
      expect(initialBounds!.height).toBeLessThanOrEqual(192)
      expect(initialBounds!.y).toBeGreaterThanOrEqual(0)
      expect(initialBounds!.y + initialBounds!.height).toBeLessThanOrEqual(viewport.height)

      await input.fill('design')
      await expect(popup.getByRole('option', {name: 'design'})).toBeVisible()
      await expect.poll(async () => (await popup.boundingBox())?.height).toBe(initialBounds!.height)
    })
  }

  for (const {label, fixed} of [
    {label: 'With height:medium', fixed: true},
    {label: 'With height:auto, maxheight:medium', fixed: false},
  ]) {
    test(`${label} keeps its sizing contract after filtering`, async ({page}) => {
      await visit(page, {id: 'react-tailwind-components-selectpanel-examples--height-variations-and-scroll'})
      await page.getByRole('button', {name: label}).click()
      const popup = page.getByRole('dialog', {name: 'Select labels'})
      const input = popup.getByRole('combobox', {name: 'Filter items'})
      await expect(input).toBeFocused()
      const initialBounds = await popup.boundingBox()
      expect(initialBounds).not.toBeNull()
      expect(initialBounds!.height).toBe(320)
      await input.fill('not-here')
      await expect(popup.getByText('No items available')).toBeVisible()
      const emptyBounds = await popup.boundingBox()
      expect(emptyBounds).not.toBeNull()
      if (fixed) {
        expect(emptyBounds!.height).toBe(320)
      } else {
        expect(emptyBounds!.height).toBeLessThan(320)
      }
    })
  }

  test('an initially loading picker keeps its height, focus, and results reachable @aat', async ({page}) => {
    await page.setViewportSize({width: 320, height: 256})
    await visit(page, {
      id: 'react-tailwind-components-selectpanel-examples--height-initial-with-underflowing-items-after-fetch',
    })
    await page.getByRole('button', {name: 'Labels'}).click()
    const popup = page.getByRole('dialog', {name: 'Select labels'})
    const input = popup.getByRole('combobox', {name: 'Filter items'})
    await expect(input).toBeFocused()
    const initialBounds = await popup.boundingBox()
    expect(initialBounds).not.toBeNull()
    expect(initialBounds!.height).toBeLessThanOrEqual(192)
    const option = popup.getByRole('option', {name: 'bug'})
    await option.scrollIntoViewIfNeeded()
    await expect(option).toBeVisible()
    await expect(input).toBeFocused()
    await expect.poll(async () => (await popup.boundingBox())?.height).toBe(initialBounds!.height)
    await expect(page).toHaveNoViolations()
    await option.click()
    await expect(option).toHaveAttribute('aria-selected', 'true')
  })

  test('a narrow picker keeps empty-state content and actions reachable @aat', async ({page}) => {
    await page.setViewportSize({width: 320, height: 256})
    await visit(page, {id: 'react-tailwind-components-selectpanel-features--customised-no-initial-items'})
    await page.getByRole('button', {name: 'Select Labels'}).click()
    const popup = page.getByRole('dialog', {name: 'Set projects'})
    const input = popup.getByRole('combobox', {name: 'Filter items'})
    await expect(input).toBeFocused()
    await expect(popup.getByText("You haven't created any projects yet")).toBeVisible()
    const action = popup.getByRole('link', {name: 'Start your first project'})
    await action.scrollIntoViewIfNeeded()
    await expect(action).toBeInViewport({ratio: 1})
    const bounds = await popup.boundingBox()
    expect(bounds).not.toBeNull()
    expect(bounds!.x).toBeGreaterThanOrEqual(0)
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(320)
    expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(256)
    await expect(page).toHaveNoViolations()
  })

  test('the built-in virtualized picker renders and selects the last item in a large collection', async ({page}) => {
    await page.setViewportSize({width: 1600, height: 900})
    await visit(page, {id: 'react-tailwind-components-selectpanel-examples--virtualized-built-in'})
    const form = page.locator('form').filter({has: page.getByRole('heading', {name: 'With virtualization'})})
    await form.getByRole('button').click()
    const popup = page.getByRole('dialog', {name: 'Select labels'})
    const options = popup.getByRole('option')
    const list = popup.locator('[data-component="SelectPanel.VirtualizedList"]')
    await expect(list).toBeVisible()
    expect(await options.count()).toBeLessThan(100)
    await expect(options.first()).toHaveAttribute('aria-setsize', '1800')
    await expect(options.first()).toHaveAttribute('aria-posinset', '1')
    await list.evaluate(element => {
      element.scrollTop = element.scrollHeight
    })
    const last = popup.getByRole('option', {name: 'Item 1799', exact: true})
    await expect(last).toBeVisible()
    await expect(last).toHaveAttribute('aria-posinset', '1800')
    await last.click()
    await expect(last).toHaveAttribute('aria-selected', 'true')
  })

  test('virtualized emoji options retain names, focus, selection, and filtering @aat', async ({page}) => {
    await page.setViewportSize({width: 320, height: 600})
    await visit(page, {id: 'react-tailwind-components-selectpanel-examples--virtualized-emoji-picker'})
    await page.getByRole('button', {name: 'Choose emoji'}).click()
    const popup = page.getByRole('dialog', {name: 'Choose emoji'})
    const input = popup.getByRole('combobox', {name: 'Filter items'})
    const options = popup.getByRole('option')
    const list = popup.locator('[data-component="SelectPanel.VirtualizedList"]')
    await expect(input).toBeFocused()
    await expect(list).toBeVisible()
    expect(await options.count()).toBeLessThan(100)
    await expect(options.first()).toHaveAttribute('aria-setsize', '400')

    const longOption = popup.getByRole('option', {
      name: 'emoji-3-with-a-long-descriptive-name-that-wraps-in-the-picker',
      exact: true,
    })
    const label = longOption.locator('[data-emoji-label]')
    await expect.poll(() => label.evaluate(element => element.scrollWidth - element.clientWidth)).toBeLessThanOrEqual(1)
    const clippedLabelStyle = await page.addStyleTag({
      content:
        '[data-emoji-label] { display: block; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }',
    })
    await expect.poll(() => label.evaluate(element => element.scrollWidth - element.clientWidth)).toBeGreaterThan(0)
    await clippedLabelStyle.evaluate(element => {
      if (!element.parentNode) throw new Error('Expected the test style to remain attached')
      element.parentNode.removeChild(element)
    })
    const next = popup.getByRole('option', {name: 'emoji-4', exact: true})
    await expect
      .poll(async () => {
        const [longBounds, nextBounds] = await Promise.all([longOption.boundingBox(), next.boundingBox()])
        return longBounds!.y + longBounds!.height - nextBounds!.y
      })
      .toBeLessThanOrEqual(1)

    await input.press('ArrowUp')
    const last = popup.getByRole('option', {name: 'emoji-399', exact: true})
    await expect(last).toBeInViewport({ratio: 1})
    await expect(last).toHaveAttribute('aria-posinset', '400')
    await expect(input).toHaveAttribute('aria-activedescendant', (await last.getAttribute('id'))!)
    await input.press('ArrowUp')
    const disabled = popup.getByRole('option', {name: 'emoji-398', exact: true})
    await expect(disabled).toHaveAttribute('aria-disabled', 'true')
    await input.press('Enter')
    await expect(input).toBeFocused()
    await expect(disabled).toHaveAttribute('aria-selected', 'false')
    await expect(page.getByRole('button', {name: 'Choose emoji'})).toBeVisible()

    await input.press('ArrowDown')
    await list.evaluate(element => {
      element.scrollTop = 0
    })
    const first = popup.getByRole('option', {name: 'emoji-0', exact: true})
    await expect(first).toBeVisible()
    await expect(last).toHaveCount(1)
    await expect(input).toHaveAttribute('aria-activedescendant', (await last.getAttribute('id'))!)
    // The combobox owns focus while the virtualized region scrolls.
    await expect(page).toHaveNoViolations({rules: {'scrollable-region-focusable': {enabled: false}}})

    await input.press('ArrowDown')
    for (let index = 0; index < 40; index++) await input.press('ArrowDown')
    const middle = popup.getByRole('option', {name: 'emoji-40', exact: true})
    await expect(middle).toBeInViewport({ratio: 1})
    await expect(input).toHaveAttribute('aria-activedescendant', (await middle.getAttribute('id'))!)
    await input.press('Enter')
    const selectedButton = page.getByRole('button', {name: 'emoji-40'})
    await expect(selectedButton).toBeVisible()
    await expect(selectedButton.locator('svg')).toHaveCount(1)

    await selectedButton.click()
    await input.fill('emoji-399')
    const onlyOption = popup.getByRole('option', {name: 'emoji-399', exact: true})
    await expect(onlyOption).toHaveAttribute('aria-setsize', '1')
    await expect(onlyOption).toBeInViewport({ratio: 1})
    await input.fill('emoji-39')
    await expect(popup.getByRole('option', {name: 'emoji-39', exact: true})).toHaveAttribute('aria-setsize', '11')
    await input.press('ArrowUp')
    const filteredLast = popup.getByRole('option', {name: 'emoji-399', exact: true})
    await expect(filteredLast).toHaveAttribute('aria-posinset', '11')
    await expect(input).toHaveAttribute('aria-activedescendant', (await filteredLast.getAttribute('id'))!)
    await input.press('Enter')
    await expect(page.getByRole('button', {name: 'emoji-399'})).toBeVisible()
  })

  test('virtualized options wrap without overlap at narrow widths with increased text spacing', async ({page}) => {
    await page.setViewportSize({width: 320, height: 256})
    await visit(page, {id: 'react-tailwind-components-selectpanel-examples--virtualized-built-in'})
    const form = page.locator('form').filter({has: page.getByRole('heading', {name: 'With virtualization'})})
    await form.getByRole('button').click()
    const popup = page.getByRole('dialog', {name: 'Select labels'})
    const list = popup.locator('[data-component="SelectPanel.VirtualizedList"]')
    const option = popup.getByRole('option', {name: /This is being used to show what would happen/})
    await option.scrollIntoViewIfNeeded()
    const initialHeight = (await option.boundingBox())!.height
    await page.addStyleTag({
      content: `
        [data-component="SelectPanel.Item"], [data-component="SelectPanel.Item"] * {
          line-height: 1.5 !important;
          letter-spacing: 0.12em !important;
          word-spacing: 0.16em !important;
        }
      `,
    })
    await expect.poll(async () => (await option.boundingBox())!.height).toBeGreaterThan(initialHeight)
    const before = popup.getByRole('option', {name: 'Item 4', exact: true})
    const after = popup.getByRole('option', {name: 'Item 6', exact: true})
    await expect
      .poll(async () =>
        option.evaluate(
          (element, {beforeId, afterId}) => {
            const label = element.querySelector<HTMLElement>('[data-item-label]')!
            const beforeElement = document.getElementById(beforeId)!
            const afterElement = document.getElementById(afterId)!
            const bounds = element.getBoundingClientRect()
            return (
              label.scrollWidth <= label.clientWidth + 1 &&
              label.getBoundingClientRect().bottom <= bounds.bottom + 1 &&
              beforeElement.getBoundingClientRect().bottom <= bounds.top + 1 &&
              bounds.bottom <= afterElement.getBoundingClientRect().top + 1
            )
          },
          {beforeId: (await before.getAttribute('id'))!, afterId: (await after.getAttribute('id'))!},
        ),
      )
      .toBe(true)
    await expect
      .poll(async () => list.evaluate(element => element.scrollWidth - element.clientWidth))
      .toBeLessThanOrEqual(1)
  })

  test('virtualized rows remeasure on window resize without ResizeObserver', async ({page}) => {
    await page.setViewportSize({width: 320, height: 256})
    await visit(page, {id: 'react-tailwind-components-selectpanel-examples--virtualized-built-in'})
    await page.evaluate(() => {
      Object.defineProperty(window, 'ResizeObserver', {configurable: true, value: undefined})
    })
    const form = page.locator('form').filter({has: page.getByRole('heading', {name: 'With virtualization'})})
    await form.getByRole('button').click()
    const popup = page.getByRole('dialog', {name: 'Select labels'})
    const input = popup.getByRole('combobox', {name: 'Filter items'})
    const option = popup.getByRole('option', {name: /This is being used to show what would happen/})
    const before = popup.getByRole('option', {name: 'Item 4', exact: true})
    const after = popup.getByRole('option', {name: 'Item 6', exact: true})
    const initialHeight = (await option.boundingBox())!.height

    await page.addStyleTag({
      content: `
        [data-component="SelectPanel.Item"], [data-component="SelectPanel.Item"] * {
          line-height: 2 !important;
          letter-spacing: 0.12em !important;
          word-spacing: 0.16em !important;
        }
      `,
    })
    await page.setViewportSize({width: 360, height: 280})
    await expect.poll(async () => (await option.boundingBox())!.height).toBeGreaterThan(initialHeight)
    await expect
      .poll(async () => {
        const beforeBox = (await before.boundingBox())!
        const optionBox = (await option.boundingBox())!
        const afterBox = (await after.boundingBox())!
        return beforeBox.y + beforeBox.height <= optionBox.y + 1 && optionBox.y + optionBox.height <= afterBox.y + 1
      })
      .toBe(true)

    for (let index = 0; index < 7; index++) await input.press('ArrowDown')
    await expect(input).toHaveAttribute('aria-activedescendant', (await after.getAttribute('id'))!)
    await expect(after).toBeInViewport({ratio: 1})
    await input.press('Enter')
    await expect(after).toHaveAttribute('aria-selected', 'true')
  })

  test('virtualized keyboard wraparound mounts and selects the active option @aat', async ({page}) => {
    await page.setViewportSize({width: 320, height: 256})
    await visit(page, {id: 'react-tailwind-components-selectpanel-examples--virtualized-built-in'})
    const form = page.locator('form').filter({has: page.getByRole('heading', {name: 'With virtualization'})})
    await form.getByRole('button').click()
    const popup = page.getByRole('dialog', {name: 'Select labels'})
    const input = popup.getByRole('combobox', {name: 'Filter items'})
    const last = popup.getByRole('option', {name: 'Item 1799', exact: true})
    await input.press('ArrowUp')
    await expect(last).toBeVisible()
    await expect(last).toBeInViewport({ratio: 1})
    const lastId = await last.getAttribute('id')
    expect(lastId).not.toBeNull()
    await expect(input).toHaveAttribute('aria-activedescendant', lastId!)
    const list = popup.locator('[data-component="SelectPanel.VirtualizedList"]')
    await list.evaluate(element => {
      element.scrollTop = 0
    })
    const first = popup.getByRole('option', {name: 'Item 0', exact: true})
    await expect(first).toBeVisible()
    await expect(last).toHaveCount(1)
    await expect(input).toHaveAttribute('aria-activedescendant', lastId!)
    // Axe cannot verify combobox-driven scrolling; oversized rows are covered below and still need manual AT review.
    await expect(page).toHaveNoViolations({rules: {'scrollable-region-focusable': {enabled: false}}})
    await input.press('ArrowDown')
    await expect(first).toBeVisible()
    await expect(first).toBeInViewport({ratio: 1})
    const firstId = await first.getAttribute('id')
    expect(firstId).not.toBeNull()
    await expect(input).toHaveAttribute('aria-activedescendant', firstId!)
    await input.press('Enter')
    await expect(first).toHaveAttribute('aria-selected', 'true')

    await input.fill('Item 179')
    const filteredFirst = popup.getByRole('option', {name: 'Item 179', exact: true})
    await expect(filteredFirst).toHaveAttribute('aria-setsize', '11')
    await input.press('ArrowUp')
    const filteredLast = popup.getByRole('option', {name: 'Item 1799', exact: true})
    await expect(filteredLast).toBeVisible()
    await expect(filteredLast).toHaveAttribute('aria-posinset', '11')
    const filteredLastId = await filteredLast.getAttribute('id')
    expect(filteredLastId).not.toBeNull()
    await expect(input).toHaveAttribute('aria-activedescendant', filteredLastId!)
    await input.press('Enter')
    await expect(form.getByRole('button')).toContainText('Item 1799')
    await input.fill('Item 1799')
    await expect(filteredLast).toHaveAttribute('aria-selected', 'true')
  })

  test('virtualized keyboard navigation follows measured rows beyond the initial window', async ({page}) => {
    await page.setViewportSize({width: 320, height: 256})
    await visit(page, {id: 'react-tailwind-components-selectpanel-examples--virtualized-built-in'})
    const form = page.locator('form').filter({has: page.getByRole('heading', {name: 'With virtualization'})})
    await form.getByRole('button').click()
    const popup = page.getByRole('dialog', {name: 'Select labels'})
    const input = popup.getByRole('combobox', {name: 'Filter items'})

    for (let index = 0; index < 40; index++) {
      await input.press('ArrowDown')
      await expect
        .poll(() =>
          input.evaluate(element => {
            const id = element.getAttribute('aria-activedescendant')
            return id ? document.getElementById(id)?.getAttribute('aria-posinset') : null
          }),
        )
        .toBe(String(index + 1))
    }

    const active = popup.getByRole('option', {name: 'Item 39', exact: true})
    await expect(active).toBeInViewport({ratio: 1})
    await input.press('Enter')
    await expect(active).toHaveAttribute('aria-selected', 'true')
  })

  for (const virtualized of [false, true]) {
    test(`keyboard scrolling reveals oversized ${virtualized ? 'virtualized' : 'regular'} option text`, async ({
      page,
    }) => {
      await page.setViewportSize({width: 320, height: 256})
      await visit(page, {
        id: virtualized
          ? 'react-tailwind-components-selectpanel-examples--virtualized-built-in'
          : 'react-tailwind-components-selectpanel-examples--render-more-on-scroll',
      })
      const form = virtualized
        ? page.locator('form').filter({has: page.getByRole('heading', {name: 'With virtualization'})})
        : page.locator('form')
      await form.getByRole('button').click()
      const popup = page.getByRole('dialog', {name: 'Select labels'})
      const input = popup.getByRole('combobox', {name: 'Filter items'})
      await expect(input).toBeFocused()
      await input.fill('This is being used')
      await page.addStyleTag({
        content: `
          [data-component="SelectPanel.Item"], [data-component="SelectPanel.Item"] * {
            font-size: 28px !important;
            line-height: 1.5 !important;
            letter-spacing: 0.12em !important;
            word-spacing: 0.16em !important;
          }
        `,
      })
      await input.press('ArrowDown')
      const option = popup.getByRole('option', {name: /This is being used to show what would happen/})
      const optionId = await option.getAttribute('id')
      expect(optionId).not.toBeNull()
      await expect(input).toHaveAttribute('aria-activedescendant', optionId!)
      const list = popup.locator(
        virtualized ? '[data-component="SelectPanel.VirtualizedList"]' : '[data-component="SelectPanel.List"]',
      )
      const geometry = () =>
        list.evaluate((element, activeId) => {
          const active = document.getElementById(activeId)!
          const label = active.querySelector<HTMLElement>('[data-item-label]')!
          const viewport = element.getBoundingClientRect()
          const viewportTop = viewport.top + element.clientTop
          const bounds = active.getBoundingClientRect()
          const range = document.createRange()
          range.selectNodeContents(label)
          return {
            bottom: bounds.bottom - viewportTop,
            height: bounds.height,
            lines: Array.from(range.getClientRects(), line => ({
              top: line.top - viewportTop,
              bottom: line.bottom - viewportTop,
            })),
            scrollTop: element.scrollTop,
            top: bounds.top - viewportTop,
            viewportHeight: element.clientHeight,
          }
        }, optionId!)

      await expect
        .poll(async () => {
          const current = await geometry()
          return current.height - current.viewportHeight
        })
        .toBeGreaterThan(1)
      let current = await geometry()
      expect(current.top).toBeGreaterThanOrEqual(-1)
      expect(current.lines.length).toBeGreaterThan(2)
      const fullyVisibleLines = new Set<number>()
      const recordVisibleLines = () => {
        for (const [index, line] of current.lines.entries()) {
          if (line.top >= -1 && line.bottom <= current.viewportHeight + 1) fullyVisibleLines.add(index)
        }
      }
      recordVisibleLines()
      for (let step = 0; current.bottom > current.viewportHeight + 1 && step < 60; step++) {
        const previous = current
        await input.press('PageDown')
        await expect.poll(async () => (await geometry()).scrollTop).toBeGreaterThan(previous.scrollTop)
        current = await geometry()
        expect(current.scrollTop - previous.scrollTop).toBeLessThan(previous.viewportHeight)
        recordVisibleLines()
      }
      expect(current.bottom).toBeLessThanOrEqual(current.viewportHeight + 1)
      expect(fullyVisibleLines.size).toBe(current.lines.length)

      for (let step = 0; current.top < -1 && step < 60; step++) {
        const previousScrollTop = current.scrollTop
        await input.press('PageUp')
        await expect.poll(async () => (await geometry()).scrollTop).toBeLessThan(previousScrollTop)
        current = await geometry()
      }
      expect(current.top).toBeGreaterThanOrEqual(-1)
      await expect(input).toBeFocused()
      await expect(input).toHaveAttribute('aria-activedescendant', optionId!)
      await input.press('Enter')
      await expect(option).toHaveAttribute('aria-selected', 'true')
    })
  }

  test('an oversized option remains navigable in the unfiltered virtualized collection after resize', async ({
    page,
  }) => {
    await page.setViewportSize({width: 320, height: 256})
    await visit(page, {id: 'react-tailwind-components-selectpanel-examples--virtualized-built-in'})
    const form = page.locator('form').filter({has: page.getByRole('heading', {name: 'With virtualization'})})
    await form.getByRole('button').click()
    const popup = page.getByRole('dialog', {name: 'Select labels'})
    const input = popup.getByRole('combobox', {name: 'Filter items'})
    const list = popup.locator('[data-component="SelectPanel.VirtualizedList"]')
    await page.addStyleTag({
      content: `
        [data-component="SelectPanel.Item"], [data-component="SelectPanel.Item"] * {
          font-size: 28px !important;
          line-height: 1.5 !important;
          letter-spacing: 0.12em !important;
          word-spacing: 0.16em !important;
        }
      `,
    })
    for (let index = 0; index < 6; index++) await input.press('ArrowDown')
    const option = popup.getByRole('option', {name: /This is being used to show what would happen/})
    const optionId = await option.getAttribute('id')
    expect(optionId).not.toBeNull()
    await expect(input).toHaveAttribute('aria-activedescendant', optionId!)
    await expect(option).toHaveAttribute('aria-posinset', '6')
    await expect(option).toHaveAttribute('aria-setsize', '1800')
    expect(await popup.getByRole('option').count()).toBeLessThan(100)

    const geometry = () =>
      list.evaluate((element, activeId) => {
        const bounds = document.getElementById(activeId)!.getBoundingClientRect()
        const viewport = element.getBoundingClientRect()
        const top = viewport.top + element.clientTop
        return {
          bottom: bounds.bottom - top,
          height: bounds.height,
          scrollTop: element.scrollTop,
          top: bounds.top - top,
          viewportHeight: element.clientHeight,
        }
      }, optionId!)
    await expect
      .poll(async () => {
        const current = await geometry()
        return current.height - current.viewportHeight
      })
      .toBeGreaterThan(1)
    const initialScrollTop = (await geometry()).scrollTop
    await input.press('PageDown')
    await expect.poll(async () => (await geometry()).scrollTop).toBeGreaterThan(initialScrollTop)
    await expect(input).toHaveAttribute('aria-activedescendant', optionId!)

    await page.setViewportSize({width: 360, height: 320})
    await expect(input).toHaveAttribute('aria-activedescendant', optionId!)
    let current = await geometry()
    for (let step = 0; current.bottom > current.viewportHeight + 1 && step < 60; step++) {
      const previousScrollTop = current.scrollTop
      await input.press('PageDown')
      await expect.poll(async () => (await geometry()).scrollTop).toBeGreaterThan(previousScrollTop)
      current = await geometry()
    }
    expect(current.bottom).toBeLessThanOrEqual(current.viewportHeight + 1)
    await expect(input).toBeFocused()
    await expect(input).toHaveAttribute('aria-activedescendant', optionId!)
    await input.press('ArrowDown')
    const next = popup.getByRole('option', {name: 'Item 6', exact: true})
    await expect(input).toHaveAttribute('aria-activedescendant', (await next.getAttribute('id'))!)
    await expect(next).toBeInViewport({ratio: 1})
    await input.press('Enter')
    await expect(next).toHaveAttribute('aria-selected', 'true')
  })

  test('virtualized reflow preserves the visible keyboard position', async ({page}) => {
    await page.setViewportSize({width: 320, height: 256})
    await visit(page, {id: 'react-tailwind-components-selectpanel-examples--virtualized-built-in'})
    const form = page.locator('form').filter({has: page.getByRole('heading', {name: 'With virtualization'})})
    await form.getByRole('button').click()
    const popup = page.getByRole('dialog', {name: 'Select labels'})
    const input = popup.getByRole('combobox', {name: 'Filter items'})
    for (let index = 0; index < 20; index++) await input.press('ArrowDown')

    const active = popup.getByRole('option', {name: 'Item 19', exact: true})
    const next = popup.getByRole('option', {name: 'Item 20', exact: true})
    const initialHeight = (await active.boundingBox())!.height
    await page.addStyleTag({
      content: `
        [data-component="SelectPanel.Item"], [data-component="SelectPanel.Item"] * {
          line-height: 2 !important;
          letter-spacing: 0.12em !important;
          word-spacing: 0.16em !important;
        }
      `,
    })
    await expect.poll(async () => (await active.boundingBox())!.height).toBeGreaterThan(initialHeight)
    await expect
      .poll(async () => {
        const activeBox = (await active.boundingBox())!
        const nextBox = (await next.boundingBox())!
        return Math.abs(nextBox.y - activeBox.y - activeBox.height)
      })
      .toBeLessThanOrEqual(1)
    await expect(active).toBeInViewport({ratio: 1})
  })

  test('narrow fullscreen remains behind the feature flag', async ({page}) => {
    await page.setViewportSize({width: 375, height: 667})
    await visit(page, {id: 'react-tailwind-components-selectpanel--playground'})
    await page.getByRole('button', {name: 'Labels', exact: true}).click()
    await expect(page.getByRole('dialog', {name: 'Labels'})).toHaveAttribute('data-component', 'Popover.Popup')
    await expect(page.getByRole('dialog', {name: 'Labels'})).not.toHaveAttribute('aria-modal')

    await visit(page, {id: 'react-tailwind-components-selectpanel-features--fullscreen-on-narrow'})
    await page.getByRole('button', {name: 'Select labels', exact: true}).click()
    const fullscreen = page.getByRole('dialog', {name: 'Select labels'})
    await expect(fullscreen).toHaveAttribute('data-component', 'Dialog.Popup')
    await expect(fullscreen).toHaveAttribute('aria-modal', 'true')
    await expect(page.locator('dialog[open], [aria-modal="true"]')).toHaveCount(1)
    await expect(fullscreen.getByRole('combobox', {name: 'Filter items'})).toBeFocused()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('button', {name: 'Select labels', exact: true})).toBeFocused()
  })

  test('fullscreen ignores an anchored maximum height', async ({page}) => {
    await page.setViewportSize({width: 375, height: 667})
    await visit(page, {id: 'react-tailwind-components-selectpanel-features--fullscreen-on-narrow-with-max-height'})
    await page.getByRole('button', {name: 'Select labels', exact: true}).click()
    const fullscreen = page.getByRole('dialog', {name: 'Select labels'})
    await expect(fullscreen).toHaveAttribute('aria-modal', 'true')
    const bounds = await fullscreen.boundingBox()
    expect(bounds).not.toBeNull()
    expect(bounds!.width).toBe(375)
    expect(bounds!.height).toBe(667)
  })

  test('selected-first ordering stays stable until the filter is cleared', async ({page}) => {
    await visit(page, {id: 'react-tailwind-components-selectpanel-features--selected-options-first'})
    await page.getByRole('button', {name: 'Labels'}).click()
    const popup = page.getByRole('dialog', {name: 'Select labels'})
    const options = popup.getByRole('option')
    const filter = popup.getByRole('combobox', {name: 'Filter items'})
    await expect(options.nth(0)).toHaveAccessibleName('good first issue')
    await expect(options.nth(1)).toHaveAccessibleName('enhancement')
    await popup.getByRole('option', {name: 'enhancement'}).click()
    await expect(options.nth(0)).toHaveAccessibleName('good first issue')
    await expect(options.nth(1)).toHaveAccessibleName('enhancement')
    await filter.fill('e')
    await filter.fill('')
    await expect(options.nth(0)).toHaveAccessibleName('enhancement')
    await expect(options.nth(1)).toHaveAccessibleName('good first issue')
  })

  for (const {story, isModal, autoOpen, title} of [
    {story: 'react-tailwind-components-dialog--default', isModal: true, autoOpen: false, title: 'My Dialog'},
    {story: 'react-tailwind-components-dialog--non-modal', isModal: false, autoOpen: true, title: 'My Dialog'},
    {story: 'react-tailwind-components-dialog--playground', isModal: false, autoOpen: false, title: 'Dialog heading'},
  ]) {
    test(`dialog modality matches its interaction mode (${story})`, async ({page}) => {
      await visit(page, {id: story})
      const trigger = page.getByRole('button', {name: 'Show dialog'})
      if (!autoOpen) await trigger.click()
      const dialog = page.getByRole('dialog', {name: title})
      await expect(dialog.getByRole('button', {name: 'Close'})).toBeFocused()
      await expect(page.locator('dialog[open], [aria-modal="true"]')).toHaveCount(isModal ? 1 : 0)
      if (isModal) {
        await expect(dialog).toHaveAttribute('aria-modal', 'true')
        for (let index = 0; index < 6; index++) {
          await page.keyboard.press('Tab')
          await expect.poll(() => dialog.evaluate(element => element.contains(document.activeElement))).toBe(true)
        }
      } else {
        await expect(dialog).not.toHaveAttribute('aria-modal')
      }
      await page.keyboard.press('Escape')
      await expect(trigger).toBeFocused()

      await page.evaluate(() => {
        const button = document.createElement('button')
        button.textContent = 'Outside action'
        button.setAttribute('data-testid', 'outside-action')
        Object.assign(button.style, {position: 'fixed', top: '0', right: '0', zIndex: '1'})
        button.addEventListener('pointerdown', () => button.setAttribute('data-pressed', 'true'))
        document.getElementById('storybook-root')!.append(button)
      })
      await trigger.click()
      await expect(dialog).toBeVisible()
      await dialog.locator('[data-component="Dialog.Body"]').click()
      await expect(dialog).toBeVisible()
      const outside = page.getByTestId('outside-action')
      const bounds = await outside.boundingBox()
      expect(bounds).not.toBeNull()
      await page.mouse.click(bounds!.x + bounds!.width / 2, bounds!.y + bounds!.height / 2)
      if (isModal) {
        await expect(outside).not.toHaveAttribute('data-pressed')
      } else {
        await expect(outside).toHaveAttribute('data-pressed', 'true')
      }
    })
  }

  test('non-modal dialog content remains pointer-scrollable in a short viewport', async ({page}) => {
    await page.setViewportSize({width: 375, height: 256})
    await visit(page, {id: 'react-tailwind-components-dialog--non-modal'})
    const body = page.getByRole('dialog', {name: 'My Dialog'}).locator('[data-component="Dialog.Body"]')
    await expect(body).toBeVisible()
    const overflow = await body.evaluate(element => element.scrollHeight - element.clientHeight)
    expect(overflow).toBeGreaterThan(0)
    await body.hover()
    await page.mouse.wheel(0, 150)
    await expect.poll(() => body.evaluate(element => element.scrollTop)).toBeGreaterThan(0)
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
    const richItem = popup.locator('[role="option"]').filter({hasText: 'Rich description'})
    const trailingVisual = richItem.locator('[data-component="ActionList.TrailingVisual"]')
    const description = richItem.locator('[data-component="ActionList.Description"]')
    await description.evaluate(element => {
      const decoration = document.createElement('span')
      decoration.setAttribute('aria-hidden', 'true')
      decoration.textContent = ' Hidden decoration'
      element.append(decoration)
    })
    await expect(richItem).toHaveAccessibleDescription('Rich description')
    await trailingVisual.evaluate(element => {
      element.style.display = 'none'
    })
    await expect(richItem).toHaveAccessibleName('Rich item')
    await expect(richItem).toHaveAccessibleDescription('Rich description')
    await trailingVisual.evaluate(element => {
      element.style.removeProperty('display')
    })
    await expect(richItem).toHaveAccessibleName('Rich item Public')
    await trailingVisual.evaluate(element => {
      element.style.visibility = 'hidden'
    })
    await expect(richItem).toHaveAccessibleName('Rich item')
    await trailingVisual.evaluate(element => {
      element.style.removeProperty('visibility')
    })
    await expect(page).toHaveNoViolations()
  })

  for (const colorScheme of ['light', 'dark', 'light_high_contrast', 'dark_high_contrast']) {
    test(`a narrow picker remains accessible in ${colorScheme} @aat`, async ({page}) => {
      await page.setViewportSize({width: 320, height: 256})
      await visit(page, {
        id: 'react-tailwind-components-selectpanel-features--with-option-descriptions',
        globals: {colorScheme},
      })
      await page.getByRole('button', {name: 'Choose items'}).click()
      const popup = page.getByRole('dialog', {name: 'Choose items'})
      await expect(popup.getByRole('combobox', {name: 'Filter items'})).toBeFocused()
      const option = popup.getByRole('option', {name: 'item1', exact: true})
      await option.scrollIntoViewIfNeeded()
      await expect(option).toHaveAccessibleDescription('Loading')
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320)
      await expect(page).toHaveNoViolations()
    })
  }

  test('a controlled modal preserves its draft when close requests are declined @aat', async ({page}) => {
    await visit(page, {id: 'react-tailwind-components-selectpanel-features--guarded-modal-close'})
    const trigger = page.getByRole('button', {name: 'enhancement'})
    await trigger.click()
    const dialog = page.getByRole('dialog', {name: 'Select a label'})
    await expect(dialog.getByRole('combobox', {name: 'Filter items'})).toBeFocused()

    const option = dialog.getByRole('option', {name: 'bug'})
    await option.click()
    await expect(option).toHaveAttribute('aria-selected', 'true')
    await page.keyboard.press('Escape')
    await expect(dialog).toBeVisible()
    await expect(option).toHaveAttribute('aria-selected', 'true')

    await dialog.getByRole('button', {name: 'Save', exact: true}).click()
    await expect(dialog).toBeVisible()
    await expect(option).toHaveAttribute('aria-selected', 'true')
    await expect(page).toHaveNoViolations()

    await dialog.getByRole('button', {name: 'Finish pending work'}).click()
    await dialog.getByRole('button', {name: 'Save', exact: true}).click()
    await expect(dialog).toBeHidden()
    await expect(page.getByRole('button', {name: 'bug'})).toBeFocused()
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

  test('ActionMenu positions inside an anchor using measured offsets', async ({page}) => {
    await page.setViewportSize({width: 1280, height: 800})
    await visit(page, {id: 'react-tailwind-components-actionmenu-features--inside-anchor-placement'})
    const anchor = page.getByTestId('menu-anchor')
    const placement = page.getByLabel('Placement')
    const trigger = page.getByRole('button', {name: 'Open anchored menu'})

    for (const value of ['inside-top', 'inside-bottom', 'inside-left', 'inside-right', 'inside-center'] as const) {
      await placement.selectOption(value)
      await trigger.click()
      const menu = page.getByRole('menu', {name: 'Open anchored menu'})
      await expect(menu).toBeVisible()
      const anchorBounds = await anchor.boundingBox()
      const menuBounds = await menu.boundingBox()
      expect(anchorBounds).not.toBeNull()
      expect(menuBounds).not.toBeNull()

      const expectedX =
        value === 'inside-left'
          ? anchorBounds!.x + 8
          : value === 'inside-right'
            ? anchorBounds!.x + anchorBounds!.width - menuBounds!.width - 8
            : value === 'inside-center'
              ? anchorBounds!.x + (anchorBounds!.width - menuBounds!.width) / 2
              : anchorBounds!.x
      const expectedY =
        value === 'inside-top'
          ? anchorBounds!.y + 8
          : value === 'inside-bottom'
            ? anchorBounds!.y + anchorBounds!.height - menuBounds!.height - 8
            : value === 'inside-center'
              ? anchorBounds!.y + (anchorBounds!.height - menuBounds!.height) / 2
              : anchorBounds!.y
      expect(menuBounds!.x).toBeCloseTo(expectedX, 0)
      expect(menuBounds!.y).toBeCloseTo(expectedY, 0)

      await page.keyboard.press('Escape')
      await expect(menu).toBeHidden()
    }
  })

  test('ActionMenu uses the requested collision boundary and escapes physical clipping', async ({page}) => {
    await page.setViewportSize({width: 1280, height: 800})
    await visit(page, {id: 'react-tailwind-components-actionmenu-features--collision-boundary'})
    const trigger = page.getByRole('button', {name: 'Open positioned menu'})
    const boundary = page.getByTestId('menu-boundary')
    const portal = page.getByTestId('menu-portal')

    await trigger.click()
    const menu = portal.getByRole('menu', {name: 'Open positioned menu'})
    await expect(menu).toBeVisible()
    const positioner = portal.locator('[data-component="ActionMenu.Positioner"]')
    await expect(positioner).toHaveAttribute('data-side', 'top')
    await expect(positioner).toHaveCSS('position', 'fixed')
    await page.keyboard.press('Escape')
    await expect(menu).toBeHidden()

    await page.getByRole('checkbox', {name: 'Use viewport boundary'}).check()
    await trigger.click()
    await expect(positioner).toHaveAttribute('data-side', 'bottom')
    const boundaryBounds = await boundary.boundingBox()
    const menuBounds = await menu.boundingBox()
    expect(boundaryBounds).not.toBeNull()
    expect(menuBounds).not.toBeNull()
    expect(menuBounds!.y + menuBounds!.height).toBeGreaterThan(boundaryBounds!.y + boundaryBounds!.height)
    const point = {
      x: menuBounds!.x + menuBounds!.width / 2,
      y: boundaryBounds!.y + boundaryBounds!.height + 5,
    }
    expect(
      await menu.evaluate((element, {x, y}) => {
        const hit = document.elementFromPoint(x, y)
        return hit !== null && element.contains(hit)
      }, point),
    ).toBe(true)
  })

  test('fullscreen ActionMenu exposes its close action to menu keyboard navigation @aat', async ({page}) => {
    await page.setViewportSize({width: 320, height: 640})
    await visit(page, {id: 'react-tailwind-components-actionmenu-examples--full-screen'})
    const trigger = page.getByRole('button', {name: 'Menu'})
    await trigger.focus()
    await page.keyboard.press('Enter')

    const menu = page.getByRole('menu', {name: 'Menu'})
    const close = menu.getByRole('menuitem', {name: 'Close'})
    await expect(close).toBeVisible()
    await expect(close).toBeFocused()
    await page.keyboard.press('End')
    await expect(menu.getByRole('menuitem', {name: 'Option 2'}).last()).toBeFocused()
    await page.keyboard.press('Home')
    await expect(close).toBeFocused()
    await page.keyboard.press('ArrowDown')
    await expect(menu.getByRole('menuitem', {name: 'Option 1'})).toBeFocused()
    await page.keyboard.press('ArrowUp')
    await expect(close).toBeFocused()
    const closeBounds = await close.boundingBox()
    expect(closeBounds).not.toBeNull()
    expect(closeBounds!.y).toBeGreaterThanOrEqual(0)
    expect(closeBounds!.y + closeBounds!.height).toBeLessThan(48)
    expect(
      await close.evaluate(
        (element, {x, y}) => {
          const hit = document.elementFromPoint(x, y)
          return hit !== null && element.contains(hit)
        },
        {x: closeBounds!.x + closeBounds!.width / 2, y: closeBounds!.y + closeBounds!.height / 2},
      ),
    ).toBe(true)
    await expect(page).toHaveNoViolations()
    await page.keyboard.press('Escape')
    await expect(menu).toBeHidden()
    await expect(trigger).toBeFocused()

    await page.keyboard.press('Enter')
    await page.keyboard.press('Home')
    await expect(close).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(menu).toBeHidden()
    await expect(trigger).toBeFocused()

    await page.setViewportSize({width: 1024, height: 640})
    await page.keyboard.press('Enter')
    await expect(menu.getByRole('menuitem', {name: 'Option 1'})).toBeFocused()
    await expect(menu.getByRole('menuitem', {name: 'Close'})).toHaveCount(0)
    await page.keyboard.press('ArrowUp')
    await expect(menu.getByRole('menuitem', {name: 'Option 2'}).last()).toBeFocused()
  })

  test('fullscreen ActionMenu keeps focus in the menu when the viewport widens', async ({page}) => {
    await page.setViewportSize({width: 390, height: 844})
    await visit(page, {id: 'react-tailwind-components-actionmenu-examples--full-screen'})
    const trigger = page.getByRole('button', {name: 'Menu'})
    await trigger.focus()
    await page.keyboard.press('Enter')
    const menu = page.getByRole('menu', {name: 'Menu'})
    await page.keyboard.press('Home')
    const close = menu.getByRole('menuitem', {name: 'Close'})
    await expect(close).toBeFocused()

    await page.setViewportSize({width: 1024, height: 844})
    await expect(close).toBeHidden()
    await expect(menu.getByRole('menuitem', {name: 'Option 1'})).toBeFocused()
    await page.keyboard.press('ArrowDown')
    await expect(menu.getByRole('menuitem', {name: 'Option 2'}).first()).toBeFocused()
    await page.setViewportSize({width: 390, height: 844})
    await page.setViewportSize({width: 1024, height: 844})
    await expect(menu.getByRole('menuitem', {name: 'Option 2'}).first()).toBeFocused()
  })

  test('fullscreen submenu Escape from Close preserves the parent across reopening @aat', async ({page}) => {
    await page.setViewportSize({width: 320, height: 640})
    await visit(page, {id: 'react-tailwind-components-actionmenu-features--fullscreen-current-model-submenu'})
    const parent = page.getByRole('menu', {name: 'Models'})
    const trigger = page.getByRole('menuitemradio', {name: 'Auto Recommended'})
    const submenu = page.getByRole('menu', {name: 'Optimization'})
    const close = submenu.getByRole('menuitem', {name: 'Close'})

    await trigger.click()
    await expect(submenu).toBeVisible()
    await submenu.getByRole('menuitemradio', {name: 'Fast'}).focus()
    await page.keyboard.press('Escape')
    await expect(submenu).toBeHidden()
    await expect(parent).toBeVisible()
    await expect(trigger).toBeFocused()

    for (let attempt = 0; attempt < 2; attempt++) {
      await page.keyboard.press('ArrowRight')
      await expect(close).toBeFocused()
      await expect(
        page
          .locator('[data-component="Tooltip.Content"]')
          .filter({hasText: /^Close$/})
          .last(),
      ).toBeVisible()
      await page.keyboard.press('Escape')
      await expect(submenu).toBeHidden()
      await expect(parent).toBeVisible()
      await expect(trigger).toBeFocused()
      await expect(trigger).toHaveAttribute('aria-checked', 'false')
    }

    await page.keyboard.press('Escape')
    await expect(parent).toBeHidden()
    await expect(page.getByRole('button', {name: 'Models', exact: true})).toBeFocused()
  })

  test('fullscreen submenu Home and End follow visual close and tier order @aat', async ({page}) => {
    await page.setViewportSize({width: 390, height: 844})
    await visit(page, {id: 'react-tailwind-components-actionmenu-features--fullscreen-current-model-submenu'})
    const trigger = page.getByRole('menuitemradio', {name: 'Auto Recommended'})
    await trigger.focus()
    await page.keyboard.press('ArrowRight')
    const submenu = page.getByRole('menu', {name: 'Optimization'})
    const close = submenu.getByRole('menuitem', {name: 'Close'})
    await expect(close).toBeFocused()
    await page.keyboard.press('End')
    await expect(submenu.getByRole('menuitemradio', {name: 'Fast'})).toBeFocused()
    await page.keyboard.press('Home')
    await expect(close).toBeFocused()
    await page.keyboard.press('ArrowDown')
    await expect(submenu.getByRole('menuitemradio', {name: 'Balanced'})).toBeFocused()
    await expect(trigger).toHaveAttribute('aria-checked', 'false')
    await expect(page).toHaveNoViolations()
    await page.keyboard.press('Home')
    await page.keyboard.press('Enter')
    await expect(submenu).toBeHidden()
    await expect(page.getByRole('button', {name: 'Models', exact: true})).toBeFocused()
  })

  for (const {story, target} of [
    {story: 'react-tailwind-components-actionmenu-features--nested-menu-in-dialog', target: 'dialog-portal-root'},
    {
      story: 'react-tailwind-components-actionmenu-features--nested-menu-in-dialog-portal',
      target: 'dialog-menu-portal',
    },
  ]) {
    test(`nested menus remain accessible and restore focus through ${target} @aat`, async ({page}) => {
      await page.setViewportSize({width: 1280, height: 800})
      await visit(page, {id: story})
      await page.getByRole('button', {name: 'Open settings'}).click()
      const dialog = page.getByRole('dialog', {name: 'Repository settings'})
      const trigger = dialog.getByRole('button', {name: 'Repository actions'})
      await trigger.click()
      const portal = page.getByTestId(target)
      const menu = portal.getByRole('menu', {name: 'Repository actions'})
      const submenuTrigger = menu.getByRole('menuitem', {name: 'Models', exact: true})
      await submenuTrigger.focus()
      await page.keyboard.press('ArrowRight')
      const submenu = portal.getByRole('menu', {name: 'Models', exact: true})
      await expect(submenu.getByRole('menuitem', {name: 'Fast model'})).toBeFocused()
      await expect(submenuTrigger).toHaveAccessibleName('Models')
      expect(await submenu.evaluate(element => element.closest('[aria-hidden="true"], [inert]'))).toBeNull()
      await expectMenuAccessibilityRelationships(page, ['Repository actions', 'Models'])
      await expect(page).toHaveNoViolations()

      await page.keyboard.press('Escape')
      await expect(submenu).toBeHidden()
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
      await expect(submenuTrigger).toBeFocused()
      await expect(dialog).toBeVisible()
      await page.keyboard.press('Escape')
      await expect(menu).toBeHidden()
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
      await expect(trigger).toBeFocused()
      await expect(dialog).toBeVisible()
      await page.keyboard.press('Escape')
      await expect(dialog).toBeHidden()
      await expect(page.getByRole('button', {name: 'Open settings'})).toBeFocused()
    })
  }

  test('nested ActionMenu levels retain their names, semantics, and keyboard focus @aat', async ({page}) => {
    await visit(page, {id: 'react-tailwind-components-actionmenu-features--submenus'})
    const rootTrigger = page.getByRole('button', {name: 'Edit'})
    await rootTrigger.click()
    const firstTrigger = page.getByRole('menuitem', {name: 'Paste special', exact: true})
    await firstTrigger.focus()
    await page.keyboard.press('ArrowRight')
    const firstMenu = page.getByRole('menu', {name: 'Paste special', exact: true})
    await expect(firstMenu.getByRole('menuitem', {name: 'Paste plain text'})).toBeFocused()
    await expectSubmenuPlacement(firstTrigger, firstMenu)
    const secondTrigger = firstMenu.getByRole('menuitem', {name: 'Paste from', exact: true})
    await secondTrigger.focus()
    await page.keyboard.press('ArrowRight')
    const secondMenu = page.getByRole('menu', {name: 'Paste from', exact: true})
    await expect(secondMenu.getByRole('menuitem', {name: 'Current clipboard'})).toBeFocused()
    await expectSubmenuPlacement(secondTrigger, secondMenu)
    await expect(firstTrigger).toHaveAccessibleName('Paste special')
    await expect(secondTrigger).toHaveAccessibleName('Paste from')
    await expectMenuAccessibilityRelationships(page, ['Edit', 'Paste special', 'Paste from'])
    await expect(page).toHaveNoViolations()

    await page.keyboard.press('Escape')
    await expect(secondMenu).toBeHidden()
    await expect(secondTrigger).toBeFocused()
    await page.keyboard.press('Escape')
    await expect(firstMenu).toBeHidden()
    await expect(firstTrigger).toBeFocused()
    await page.keyboard.press('Escape')
    await expect(rootTrigger).toBeFocused()
  })

  test('inline submenus preserve keyboard access and do not nest interactive content in a button @aat', async ({
    page,
  }) => {
    await visit(page, {id: 'react-tailwind-components-actionmenu-features--inline-submenu'})
    const rootTrigger = page.getByRole('button', {name: 'Edit'})
    await rootTrigger.click()
    const firstTrigger = page.getByRole('menuitem', {name: 'Paste special', exact: true})
    await expect(firstTrigger).toHaveJSProperty('tagName', 'BUTTON')
    await firstTrigger.focus()
    await page.keyboard.press('ArrowRight')
    const firstMenu = page.getByRole('menu', {name: 'Paste special', exact: true})
    await expect(firstMenu.getByRole('menuitem', {name: 'Paste plain text'})).toBeFocused()
    await expectSubmenuPlacement(firstTrigger, firstMenu)
    const rootMenu = page.getByRole('menu', {name: 'Edit', exact: true})
    await expect(rootMenu.getByRole('menu', {name: 'Paste special'})).toHaveCount(0)
    await expect(rootMenu.locator('..').getByRole('menu', {name: 'Paste special'})).toBeVisible()
    expect(await firstTrigger.evaluate(element => element.querySelector('[role="menu"]'))).toBeNull()
    await expect(firstTrigger.locator('[tabindex], button, [role="menuitem"]')).toHaveCount(0)
    const secondTrigger = firstMenu.getByRole('menuitem', {name: 'Paste from', exact: true})
    await secondTrigger.focus()
    await page.keyboard.press('ArrowRight')
    const secondMenu = page.getByRole('menu', {name: 'Paste from', exact: true})
    await expect(secondMenu.getByRole('menuitem', {name: 'Current clipboard'})).toBeFocused()
    await expectSubmenuPlacement(secondTrigger, secondMenu)
    await expect(firstTrigger).toHaveAccessibleName('Paste special')
    await expect(secondTrigger).toHaveAccessibleName('Paste from')
    await expectMenuAccessibilityRelationships(page, ['Edit', 'Paste special', 'Paste from'])
    await expect(page).toHaveNoViolations()

    await secondMenu.getByRole('menuitem', {name: 'History'}).click()
    await expect(secondMenu).toBeHidden()
    await expect(firstMenu).toBeHidden()
    await expect(rootTrigger).toBeFocused()
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
