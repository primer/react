import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'

test('standalone items expose descriptions separately and retain listbox interaction @aat', async ({page}) => {
  await visit(page, {id: 'react-tailwind-components-actionlist-features--item-descriptions'})
  const actions = page.getByRole('list', {name: 'Repository actions'})
  const archive = actions.getByRole('button', {name: 'Archive', exact: true})
  const repository = actions.getByRole('link', {name: 'Repository Ready', exact: true})
  await expect(archive).toHaveAccessibleDescription('Move the repository out of active lists')
  await expect(repository).toHaveAccessibleDescription('Recently updated')
  await expect(repository).toHaveAttribute('href', '#repository')

  const option = page.getByRole('option', {name: 'Primer React', exact: true})
  await expect(option).toHaveAccessibleDescription('Design system')
  await expect(option).toHaveAttribute('aria-selected', 'false')
  await option.focus()
  await page.keyboard.press('Space')
  await expect(option).toHaveAttribute('aria-selected', 'true')
  await expect(page.getByRole('status')).toHaveText('Selected: Primer React')
  await expect(page).toHaveNoViolations()
})

test.describe('ActionList inline description reflow', () => {
  for (const direction of ['ltr', 'rtl'] as const) {
    test(`wraps unbroken logins with enlarged and spaced text in ${direction} @aat`, async ({page}) => {
      await page.setViewportSize({width: 320, height: 256})
      await visit(page, {id: 'react-tailwind-components-actionlist-features--inline-description'})
      const container = page.locator('#storybook-root')
      await container.evaluate((element, dir) => {
        element.style.width = '256px'
        element.setAttribute('dir', dir)
        document.documentElement.style.fontSize = '32px'
      }, direction)
      await page.addStyleTag({
        content: `
          #storybook-root * {
            line-height: 1.5 !important;
            letter-spacing: 0.12em !important;
            word-spacing: 0.16em !important;
          }
          #storybook-root p { margin-block-end: 2em !important; }
        `,
      })

      const item = container.getByRole('button').first()
      const login = 'a'.repeat(39)
      for (const name of [
        'A Very Long Display Name With Additional Organization And Repository Context',
        'UnbrokenDisplayNameWithAdditionalOrganizationAndRepositoryContext',
      ]) {
        await item.locator('[data-item-label]').evaluate((element, text) => {
          element.textContent = text
        }, login)
        await item.locator('[data-component="ActionList.Description"]').evaluate((element, text) => {
          element.textContent = text
        }, name)
        await expect(item).toHaveAccessibleName(login)
        await expect(item).toHaveAccessibleDescription(name)

        const geometry = await container.evaluate(element => {
          const item = element.querySelector('button')
          if (!item) throw new Error('Expected an action item')
          const bounds = item.getBoundingClientRect()
          const parts = ['[data-item-label]', '[data-component="ActionList.Description"]'].map(selector => {
            const part = item.querySelector(selector)
            if (!part) throw new Error(`Missing item content: ${selector}`)
            const range = document.createRange()
            range.selectNodeContents(part)
            return Array.from(range.getClientRects(), rect => ({
              left: rect.left,
              right: rect.right,
              top: rect.top,
              bottom: rect.bottom,
            }))
          })
          return {
            clientWidth: element.clientWidth,
            scrollWidth: element.scrollWidth,
            item: {left: bounds.left, right: bounds.right, top: bounds.top, bottom: bounds.bottom},
            parts,
          }
        })
        expect(geometry.clientWidth).toBe(256)
        expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.clientWidth + 1)
        for (const lines of geometry.parts) {
          expect(lines.length).toBeGreaterThan(1)
          for (const line of lines) {
            expect(line.left).toBeGreaterThanOrEqual(geometry.item.left - 1)
            expect(line.right).toBeLessThanOrEqual(geometry.item.right + 1)
            expect(line.top).toBeGreaterThanOrEqual(geometry.item.top - 1)
            expect(line.bottom).toBeLessThanOrEqual(geometry.item.bottom + 1)
          }
        }
      }
    })
  }
})

test.describe('static ActionList rows', () => {
  for (const theme of ['light', 'dark', 'light_high_contrast', 'dark_high_contrast']) {
    for (const direction of ['ltr', 'rtl'] as const) {
      test(`preserve passive content and an independent trailing link at 320 pixels in ${theme} ${direction} @aat`, async ({
        page,
      }) => {
        await page.setViewportSize({width: 320, height: 480})
        await visit(page, {
          id: 'react-tailwind-components-actionlist-features--static-items',
          globals: {colorScheme: theme},
        })
        await page.evaluate(dir => {
          document.documentElement.dir = dir
        }, direction)

        const list = page.getByRole('list', {name: 'Repository statuses'})
        const rows = list.getByRole('listitem')
        await expect(rows).toHaveCount(2)
        const passiveRow = rows.filter({hasText: 'primer/react'})
        await expect(passiveRow).toContainText('Owned by octocat')
        await expect(passiveRow).toContainText('Changes blocked by enterprise')
        await expect(passiveRow).not.toHaveAttribute('aria-disabled')
        const textRects = await passiveRow.evaluate(row => {
          function getTextRects(selector: string) {
            const element = row.querySelector(selector)
            if (!element) throw new Error(`Missing static-row content: ${selector}`)
            const range = document.createRange()
            range.selectNodeContents(element)
            return Array.from(range.getClientRects(), rect => ({
              left: rect.left,
              right: rect.right,
              top: rect.top,
              bottom: rect.bottom,
            })).filter(rect => rect.right > rect.left && rect.bottom > rect.top)
          }
          return {
            label: getTextRects('[data-component="ActionList.Item.Label"]'),
            description: getTextRects('[data-component="ActionList.Description"]'),
            trailing: getTextRects('[data-testid="passive-trailing"]'),
          }
        })
        expect(textRects.label.length).toBeGreaterThan(0)
        expect(textRects.description.length).toBeGreaterThan(0)
        expect(textRects.trailing.length).toBeGreaterThan(0)
        for (const main of [...textRects.label, ...textRects.description]) {
          for (const trailing of textRects.trailing) {
            const overlaps =
              main.left < trailing.right &&
              main.right > trailing.left &&
              main.top < trailing.bottom &&
              main.bottom > trailing.top
            expect(overlaps).toBe(false)
          }
        }
        await expect(
          rows.filter({hasText: 'Repository details'}).getByRole('link', {name: 'View details'}),
        ).toHaveAttribute('href', '#details')
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320)
        await expect(page).toHaveNoViolations()
      })
    }
  }
})

test.describe('inactive ActionList reasons', () => {
  for (const theme of ['light', 'dark', 'light_high_contrast', 'dark_high_contrast']) {
    test(`remain visible and reflow at 320 pixels in ${theme} @aat`, async ({page}) => {
      await page.setViewportSize({width: 320, height: 256})
      await visit(page, {
        id: 'react-tailwind-components-actionlist-features--inactive-reasons',
        globals: {colorScheme: theme},
      })

      const reason = 'Contact an administrator to grant project:configure_administration_and_billing_permissions.'
      const item = page.getByRole('button', {name: 'Transfer project', exact: true})
      const itemReason = item.getByText(reason, {exact: true})
      const link = page
        .locator('[aria-disabled="true"]')
        .filter({has: page.getByText('Billing settings', {exact: true})})
      const linkReason = link.getByText('Billing details are available to organization owners.', {exact: true})
      const linkWithLeading = page
        .locator('[aria-disabled="true"]')
        .filter({has: page.getByText('Security settings', {exact: true})})
      const leadingReason = linkWithLeading.getByText('Contact an owner to update security settings.', {exact: true})

      await expect(item).toHaveAccessibleDescription(reason)
      await expect(item).toHaveAttribute('title', reason)
      await expect(link).toHaveAccessibleName('Billing settings')
      await expect(link).toHaveAccessibleDescription('Billing details are available to organization owners.')
      await expect(link).not.toHaveAttribute('href')
      await expect(linkWithLeading).toHaveAccessibleName('Security settings Admin')
      await expect(linkWithLeading).toHaveAccessibleDescription('Contact an owner to update security settings.')
      await expect(linkWithLeading).not.toHaveAttribute('href')
      for (const text of [itemReason, linkReason, leadingReason]) {
        await expect(text).toBeVisible()
        const bounds = await text.boundingBox()
        expect(bounds).not.toBeNull()
        expect(bounds!.width).toBeGreaterThan(1)
        expect(bounds!.height).toBeGreaterThan(1)
        expect(bounds!.x).toBeGreaterThanOrEqual(0)
        expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(320)
      }
      const wrapping = await itemReason.evaluate(element => ({
        clientWidth: element.clientWidth,
        overflowWrap: getComputedStyle(element).overflowWrap,
        scrollWidth: element.scrollWidth,
      }))
      expect(wrapping.overflowWrap).toBe('break-word')
      expect(wrapping.scrollWidth).toBeLessThanOrEqual(wrapping.clientWidth)
      for (const inactiveLink of [link, linkWithLeading]) {
        const labelBounds = await inactiveLink.locator('[data-component="ActionList.Item.Label"]').boundingBox()
        const indicatorBounds = await inactiveLink.locator('svg').boundingBox()
        expect(labelBounds).not.toBeNull()
        expect(indicatorBounds).not.toBeNull()
        expect(Math.abs(labelBounds!.y - indicatorBounds!.y)).toBeLessThanOrEqual(3)
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320)
      await expect(page).toHaveNoViolations()
    })
  }
})

test('inactive custom renders cannot invoke internal activation handlers @aat', async ({page}) => {
  await visit(page, {id: 'react-tailwind-components-actionmenu-features--disabled-custom-render'})
  const option = page.getByRole('option', {name: 'Transfer selection', exact: true})
  const availableOption = page.getByRole('option', {name: 'Available selection', exact: true})
  const status = page.getByRole('status')
  const trigger = page.getByRole('button', {name: 'Project actions'})

  async function tryDisabledActivation(item: typeof option) {
    await expect(item).toHaveAttribute('aria-disabled', 'true')
    await item.focus()
    await page.keyboard.press('Enter')
    await page.keyboard.press('Space')
    const bounds = await item.boundingBox()
    expect(bounds).not.toBeNull()
    const x = bounds!.x + bounds!.width / 2
    const y = bounds!.y + bounds!.height / 2
    await page.mouse.click(x, y)
    await page.mouse.click(x, y, {button: 'middle'})
    await expect(status).toHaveText('Internal activations: 0')
  }

  await tryDisabledActivation(option)
  await option.focus()
  await page.keyboard.press('ArrowDown')
  await expect(availableOption).toBeFocused()

  await trigger.click()
  const menu = page.getByRole('menu', {name: 'Project actions'})
  const menuItem = menu.getByRole('menuitem', {name: 'Transfer action', exact: true})
  await tryDisabledActivation(menuItem)
  await menuItem.focus()
  await page.keyboard.press('ArrowDown')
  await expect(menu.getByRole('menuitem', {name: 'Available action'})).toBeFocused()
  await expect(page).toHaveNoViolations()
  await page.keyboard.press('Escape')
  await expect(trigger).toBeFocused()

  await page.getByRole('button', {name: 'Make available'}).click()
  await option.click()
  await expect(status).toHaveText('Internal activations: 1')
  await trigger.click()
  await menu.getByRole('menuitem', {name: 'Transfer action', exact: true}).click()
  await expect(status).toHaveText('Internal activations: 2')
})

test('inactive render-element capture handlers suppress activation without blocking navigation keys @aat', async ({
  page,
}) => {
  await visit(page, {id: 'react-tailwind-components-actionmenu-features--disabled-custom-render'})
  const status = page.getByTestId('capture-status')
  const option = page.getByRole('option', {name: 'Capture selection', exact: true})
  const trigger = page.getByRole('button', {name: 'Project actions'})

  async function checkInactive(item: typeof option, otherCaptures: number) {
    await expect(item).toHaveAttribute('aria-disabled', 'true')
    await item.focus()
    await page.keyboard.press('Enter')
    await page.keyboard.press('Space')
    const bounds = await item.boundingBox()
    expect(bounds).not.toBeNull()
    await page.mouse.click(bounds!.x + bounds!.width / 2, bounds!.y + bounds!.height / 2)
    await page.mouse.click(bounds!.x + bounds!.width / 2, bounds!.y + bounds!.height / 2, {button: 'middle'})
    await expect(status).toHaveText(`Activation captures: 0; other captures: ${otherCaptures}`)
    await item.focus()
    await page.keyboard.press('ArrowDown')
    await item.focus()
    await page.keyboard.press('Shift')
    await expect(status).toHaveText(`Activation captures: 0; other captures: ${otherCaptures + 2}`)
  }

  await checkInactive(option, 0)
  await trigger.click()
  await checkInactive(page.getByRole('menuitem', {name: 'Capture action', exact: true}), 2)
  await expect(page).toHaveNoViolations()
  await page.keyboard.press('Escape')
  await page.getByRole('button', {name: 'Make available'}).click()
  await option.click()
  await expect(status).toHaveText('Activation captures: 1; other captures: 4')
  await trigger.click()
  await page.getByRole('menuitem', {name: 'Capture action', exact: true}).click()
  await expect(status).toHaveText('Activation captures: 2; other captures: 4')
})

test('inactive router links preserve refs, suppress activation, and recover when available @aat', async ({page}) => {
  await visit(page, {id: 'react-tailwind-components-actionmenu-features--inactive-router-links'})
  const option = page.getByRole('option', {name: 'List project', exact: true})
  const otherOption = page.getByRole('option', {name: 'Other option', exact: true})
  const trigger = page.getByRole('button', {name: 'Project link menu'})
  const menu = page.getByRole('menu', {name: 'Project link menu'})
  const captures = page.getByTestId('link-captures')
  const path = page.getByRole('status')

  await expect(option).toHaveAttribute('aria-disabled', 'true')
  await expect(option).toHaveAccessibleDescription('Requires access')
  await expect(option).not.toHaveAttribute('href')
  await expect(option).not.toHaveAttribute('data-router-link')
  await option.focus()
  await expect(page.getByTestId('list-ref')).toHaveText('List ref: placeholder')
  await page.keyboard.press('Enter')
  await page.keyboard.press('Space')
  await expect(captures).toHaveText('Activation captures: 0')
  await expect(path).toHaveText('Current path: /')
  await page.keyboard.press('ArrowDown')
  await expect(otherOption).toBeFocused()

  await trigger.click()
  const menuLink = menu.getByRole('menuitem', {name: 'Menu project', exact: true})
  await expect(menuLink).toHaveAttribute('aria-disabled', 'true')
  await expect(menuLink).toHaveAttribute('data-component', 'ActionMenu.LinkItem')
  await expect(menuLink).toHaveAccessibleDescription('Requires access')
  await expect(menuLink).not.toHaveAttribute('href')
  await expect(menuLink).not.toHaveAttribute('data-router-link')
  await menuLink.focus()
  await expect(page.getByTestId('menu-ref')).toHaveText('Menu ref: placeholder')
  await page.keyboard.press('Enter')
  await page.keyboard.press('Space')
  const bounds = await menuLink.boundingBox()
  expect(bounds).not.toBeNull()
  await page.mouse.click(bounds!.x + bounds!.width / 2, bounds!.y + bounds!.height / 2)
  await expect(captures).toHaveText('Activation captures: 0')
  await expect(path).toHaveText('Current path: /')
  await menuLink.focus()
  await page.keyboard.press('ArrowDown')
  await expect(menu.getByRole('menuitem', {name: 'Other action'})).toBeFocused()
  await expect(page).toHaveNoViolations()
  await page.keyboard.press('Escape')
  await expect(trigger).toBeFocused()

  await page.getByRole('button', {name: 'Make available'}).click()
  await expect(option).toHaveAttribute('href', '#list-project')
  await expect(option).toHaveAttribute('data-router-link', 'list')
  await option.focus()
  await expect(page.getByTestId('list-ref')).toHaveText('List ref: router')
  await page.keyboard.press('Enter')
  await expect(path).toHaveText('Current path: #list-project')
  await expect(captures).toHaveText('Activation captures: 1')
  await trigger.click()
  await expect(menuLink).toHaveAttribute('href', '#menu-project')
  await expect(menuLink).toHaveAttribute('data-router-link', 'menu')
  await menuLink.focus()
  await expect(page.getByTestId('menu-ref')).toHaveText('Menu ref: router')
  await page.keyboard.press('Space')
  await expect(path).toHaveText('Current path: #menu-project')
  await expect(captures).toHaveText('Activation captures: 2')
  await page.keyboard.press('Escape')

  await page.getByRole('button', {name: 'Make inactive'}).click()
  await option.focus()
  await expect(page.getByTestId('list-ref')).toHaveText('List ref: placeholder')
  await expect(option).not.toHaveAttribute('href')
  await trigger.click()
  await menuLink.focus()
  await expect(page.getByTestId('menu-ref')).toHaveText('Menu ref: placeholder')
  await expect(menuLink).not.toHaveAttribute('href')
})

test('navigation descriptions, tooltips, and wrapped regions preserve geometry @aat', async ({page}) => {
  await visit(page, {id: 'react-tailwind-navigation-navlist-features--item-descriptions'})
  const direct = page.getByTestId('direct-description')
  const wrapped = page.getByTestId('wrapped-description')
  for (const link of [direct, wrapped]) {
    await expect(link).toHaveAccessibleName('Improve navigation Ready')
    await expect(link).toHaveAccessibleDescription('#42 · feature/navigation View issue')
  }
  await expect(page.getByRole('link', {name: 'Settings', exact: true})).toHaveAccessibleDescription(
    'Configure the repository',
  )
  await expect(page.getByRole('link', {name: 'Profile', exact: true})).toHaveAccessibleDescription(
    'Update your profile',
  )
  expect(Buffer.compare(await direct.screenshot(), await wrapped.screenshot())).toBe(0)
  await wrapped.focus()
  await expect(wrapped).toBeFocused()
  await expect(page).toHaveNoViolations()
})

test('inactive navigation retains its name and reason without activating @aat', async ({page}) => {
  await visit(page, {id: 'react-tailwind-navigation-navlist-features--with-inactive-items'})
  const link = page.getByRole('link', {name: 'Item 1', exact: true})
  await expect(link).toHaveAttribute('aria-disabled', 'true')
  await expect(link).toHaveAccessibleDescription('Unavailable due to an outage')
  const url = page.url()
  await link.focus()
  await page.keyboard.press('Enter')
  await expect(link).toBeFocused()
  expect(page.url()).toBe(url)
  expect(
    await link.evaluate(element => {
      const event = new MouseEvent('auxclick', {bubbles: true, button: 1, cancelable: true})
      element.dispatchEvent(event)
      return event.defaultPrevented
    }),
  ).toBe(true)
  await expect(page).toHaveNoViolations()
})

test.describe('React Tailwind ActionList link composition', () => {
  for (const theme of ['light', 'dark', 'light_high_contrast', 'dark_high_contrast']) {
    test(`custom and native links retain appearance and keyboard behavior in ${theme}`, async ({page}) => {
      await page.setViewportSize({width: 320, height: 600})
      await visit(page, {
        id: 'react-tailwind-components-actionlist-features--router-link-composition',
        globals: {colorScheme: theme},
      })

      const nativeLink = page.getByRole('link', {name: 'Native projects link'})
      const routerLink = page.getByRole('link', {name: 'Router projects link'})
      await expect(routerLink).toHaveAttribute('href', '/projects')
      expect(Buffer.compare(await nativeLink.screenshot(), await routerLink.screenshot())).toBe(0)

      await page.keyboard.press('Tab')
      await expect(nativeLink).toBeFocused()
      const nativeOutline = await nativeLink.evaluate(element => {
        const style = getComputedStyle(element)
        return [style.outlineColor, style.outlineStyle, style.outlineWidth, style.outlineOffset]
      })
      await page.keyboard.press('Tab')
      await expect(routerLink).toBeFocused()
      const routerOutline = await routerLink.evaluate(element => {
        const style = getComputedStyle(element)
        return [style.outlineColor, style.outlineStyle, style.outlineWidth, style.outlineOffset]
      })
      expect(routerOutline).toEqual(nativeOutline)
      expect(routerOutline[1]).not.toBe('none')

      const status = page.getByRole('status')
      await expect(status).toHaveText('Current path: /')
      await page.keyboard.press('Space')
      await expect(status).toHaveText('Current path: /')
      await page.keyboard.press('Enter')
      await expect(status).toHaveText('Current path: /projects')
    })
  }
})

test('a disabled, partially checked tree item remains discoverable without activating @aat', async ({page}) => {
  await visit(page, {id: 'react-tailwind-components-actionlist-features--tree-with-managed-focus'})
  const tree = page.getByRole('tree', {name: 'Projects'})
  const first = tree.getByRole('treeitem', {name: 'First project'})
  const disabled = tree.getByRole('treeitem', {name: 'Unavailable project'})
  const last = tree.getByRole('treeitem', {name: 'Last project'})
  const status = page.getByRole('status')

  await first.focus()
  await page.keyboard.press('ArrowDown')
  await expect(disabled).toBeFocused()
  await expect(disabled).toHaveAttribute('aria-disabled', 'true')
  await expect(disabled).toHaveAttribute('aria-checked', 'mixed')
  await expect(disabled).not.toHaveAttribute('aria-selected')
  await expect(disabled.locator('[data-indeterminate] svg')).toHaveAttribute('viewBox', '0 0 10 2')
  await expect(disabled).not.toHaveAttribute('disabled')
  await expect(page).toHaveNoViolations()
  await page.keyboard.press('Enter')
  await page.keyboard.press('Space')
  const bounds = await disabled.boundingBox()
  expect(bounds).not.toBeNull()
  await page.mouse.click(bounds!.x + bounds!.width / 2, bounds!.y + bounds!.height / 2)
  await expect(status).toHaveText('Last activated: none')

  await page.keyboard.press('ArrowDown')
  await expect(last).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(status).toHaveText('Last activated: Last project')
  await page.keyboard.press('ArrowUp')
  await expect(disabled).toBeFocused()
})

test('direct listbox options preserve ownership, focus, selection, and router navigation @aat', async ({page}) => {
  await visit(page, {id: 'react-tailwind-components-actionlist-features--direct-listbox'})
  const listbox = page.getByRole('listbox', {name: 'Select a project'})
  const group = listbox.getByRole('group', {name: 'Repositories'})
  const first = listbox.getByRole('option', {name: 'First project'})
  const disabled = group.getByRole('option', {name: 'Unavailable project'})
  const unavailableLink = group.getByRole('option', {name: 'Unavailable link'})
  const project = group.getByRole('option', {name: 'Primer React'})
  const link = group.getByRole('option', {name: 'Browse repositories'})
  const status = page.getByRole('status')

  await expect(first).toHaveAttribute('aria-selected', 'true')
  await expect(first).toHaveAccessibleDescription('Recently updated')
  await expect(disabled).toHaveAttribute('aria-disabled', 'true')
  await expect(disabled).not.toHaveAttribute('disabled')
  await expect(unavailableLink).toHaveAttribute('aria-disabled', 'true')
  await expect(unavailableLink).not.toHaveAttribute('href')
  await expect(link).toHaveAttribute('href', '/repositories')
  await expect(listbox.locator('li[role="none"], li[role="presentation"]')).toHaveCount(0)
  await expect(listbox.getByTestId('first-divider')).toBeHidden()
  await expect(page).toHaveNoViolations()

  const ownership = await listbox.evaluate(element => ({
    first: element.querySelector('[aria-label="First project"]')?.parentElement === element,
    group: element.querySelector('[role="group"]')?.parentElement === element,
    groupOptions: Array.from(element.querySelectorAll('[role="group"] > [role="option"]')).length,
  }))
  expect(ownership).toEqual({first: true, group: true, groupOptions: 4})

  const session = await page.context().newCDPSession(page)
  const {nodes} = await session.send('Accessibility.getFullAXTree')
  const listboxNode = nodes.find(node => node.role?.value === 'listbox' && node.name?.value === 'Select a project')
  const directChildren = listboxNode?.childIds?.map(id => nodes.find(node => node.nodeId === id))
  expect(directChildren?.some(node => node?.role?.value === 'option' && node.name?.value === 'First project')).toBe(
    true,
  )
  const groupNode = directChildren?.find(node => node?.role?.value === 'group' && node.name?.value === 'Repositories')
  expect(groupNode).toBeDefined()
  const groupChildren = groupNode?.childIds?.map(id => nodes.find(node => node.nodeId === id))
  expect(groupChildren?.filter(node => node?.role?.value === 'option')).toHaveLength(4)

  const dividerVisibility = (option: typeof first) =>
    option
      .locator('[data-component="ActionList.Item--DividerContainer"]')
      .evaluate(element => getComputedStyle(element, '::before').visibility)
  expect(await dividerVisibility(first)).toBe('hidden')
  expect(await dividerVisibility(disabled)).toBe('hidden')
  expect(await dividerVisibility(project)).toBe('visible')

  await first.focus()
  await page.keyboard.press('ArrowDown')
  await expect(disabled).toBeFocused()
  await page.keyboard.press('Enter')
  await page.keyboard.press('Space')
  await expect(status).toHaveText('Selected: First project; current path: /')
  await page.keyboard.press('ArrowDown')
  await expect(unavailableLink).toBeFocused()
  await page.keyboard.press('Enter')
  await page.keyboard.press('Space')
  await expect(status).toHaveText('Selected: First project; current path: /')
  await page.keyboard.press('ArrowDown')
  await expect(project).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(status).toHaveText('Selected: Primer React; current path: /')
  await expect(project).toHaveAttribute('aria-selected', 'true')
  await page.keyboard.press('ArrowDown')
  await expect(link).toBeFocused()
  await page.keyboard.press('Space')
  await expect(status).toHaveText('Selected: Primer React; current path: /')
  await page.keyboard.press('Enter')
  await expect(status).toHaveText('Selected: Primer React; current path: /repositories')
})

test.describe('ActionList group heading auxiliary text', () => {
  for (const colorScheme of ['light', 'dark', 'light_high_contrast', 'dark_high_contrast']) {
    test(`retains group names and reflows in both directions in ${colorScheme} @aat`, async ({page}) => {
      await visit(page, {
        id: 'react-tailwind-components-actionlist-features--group-heading-auxiliary-text',
        globals: {colorScheme},
      })
      const list = page.getByRole('list', {name: 'Repository actions'})
      const heading = list.getByRole('heading', {name: 'Repositories'})
      const groupAction = list.getByRole('button', {name: 'Manage repositories'})
      const item = list.locator('[data-component="ActionList.Item"]')
      const itemLabel = item.getByRole('button', {name: 'Primer React'})
      const itemAction = item.getByRole('button', {name: 'Repository details'})
      const listbox = page.getByRole('listbox', {name: 'Projects'})
      const group = listbox.getByRole('group', {name: 'Libraries'})
      const option = group.getByRole('option', {name: 'Octicons'})

      await expect(group).toHaveAccessibleName('Libraries')
      await expect(group).toHaveAccessibleDescription('')
      await expect(group.getByText('Additional projects')).toBeVisible()
      await expect(option).toBeVisible()
      await expect(group.locator('[role="none"], [role="presentation"]')).toHaveCount(0)
      const groupLabelId = await group.getAttribute('aria-labelledby')
      if (!groupLabelId) throw new Error('Expected the group to reference its heading.')
      expect(await page.evaluate(id => document.getElementById(id)?.textContent, groupLabelId)).toBe('Libraries')

      await page.keyboard.press('Tab')
      await expect(groupAction).toBeFocused()
      await page.keyboard.press('Tab')
      await expect(itemLabel).toBeFocused()
      await page.keyboard.press('Tab')
      await expect(itemAction).toBeFocused()

      const session = await page.context().newCDPSession(page)
      try {
        const {nodes} = await session.send('Accessibility.getFullAXTree')
        const groupNode = nodes.find(node => node.role?.value === 'group' && node.name?.value === 'Libraries')
        const children = groupNode?.childIds?.map(id => nodes.find(node => node.nodeId === id))
        expect(children?.some(node => node?.role?.value === 'option' && node.name?.value === 'Octicons')).toBe(true)
      } finally {
        await session.detach()
      }

      const longHeading = 'RepositoryverwaltungseinstellungenMitEinzelzugriffsberechtigungen'
      const longAuxiliary = 'ZusätzlicheZugriffsrichtlinienFürUnternehmensadministratoren'
      await heading.evaluate((element, value) => {
        element.textContent = value
      }, longHeading)
      await list.getByText('Recently updated by your team').evaluate((element, value) => {
        element.textContent = value
      }, longAuxiliary)
      const updatedHeading = list.getByRole('heading', {name: longHeading})
      const auxiliary = list.getByText(longAuxiliary)
      const headingWrapper = list.locator('[data-component="ActionList.GroupHeading"]')

      for (const width of [200, 320]) {
        await page.setViewportSize({width, height: 768})
        for (const direction of ['ltr', 'rtl'] as const) {
          await page.evaluate(value => document.documentElement.setAttribute('dir', value), direction)
          for (const text of [updatedHeading, auxiliary]) {
            const dimensions = await text.evaluate(element => ({
              clientWidth: element.clientWidth,
              scrollWidth: element.scrollWidth,
              overflowWrap: getComputedStyle(element).overflowWrap,
            }))
            expect(dimensions.overflowWrap).toBe('break-word')
            expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth)
          }
          const wrapperWidth = await headingWrapper.evaluate(element => ({
            clientWidth: element.clientWidth,
            scrollWidth: element.scrollWidth,
          }))
          expect(wrapperWidth.scrollWidth).toBeLessThanOrEqual(wrapperWidth.clientWidth)
          expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)

          const headingBounds = await updatedHeading.boundingBox()
          const groupActionBounds = await groupAction.boundingBox()
          const itemBounds = await itemLabel.boundingBox()
          const itemActionBounds = await itemAction.boundingBox()
          expect(headingBounds).not.toBeNull()
          expect(groupActionBounds).not.toBeNull()
          expect(itemBounds).not.toBeNull()
          expect(itemActionBounds).not.toBeNull()
          if (!headingBounds || !groupActionBounds || !itemBounds || !itemActionBounds) {
            throw new Error('Expected the heading and actions to be visible.')
          }
          if (direction === 'ltr') {
            expect(headingBounds.x + headingBounds.width).toBeLessThanOrEqual(groupActionBounds.x + 1)
            expect(itemBounds.x + itemBounds.width).toBeLessThanOrEqual(itemActionBounds.x + 1)
          } else {
            expect(groupActionBounds.x + groupActionBounds.width).toBeLessThanOrEqual(headingBounds.x + 1)
            expect(itemActionBounds.x + itemActionBounds.width).toBeLessThanOrEqual(itemBounds.x + 1)
          }
        }
      }
      await expect(page).toHaveNoViolations()
    })
  }
})

test('direct tree items keep their semantic list and disabled keyboard behavior @aat', async ({page}) => {
  await visit(page, {id: 'react-tailwind-components-actionlist-features--direct-tree-items'})
  const tree = page.getByRole('tree', {name: 'Projects'})
  const parent = tree.getByRole('treeitem', {name: 'Project group'})
  const disabled = tree.getByRole('treeitem', {name: 'Unavailable project'})
  const project = tree.getByRole('treeitem', {name: 'Primer React'})
  const status = page.getByRole('status')

  await expect(tree).toHaveJSProperty('tagName', 'UL')
  await expect(disabled).toHaveJSProperty('tagName', 'LI')
  await expect(tree.locator('[role="group"] > [role="treeitem"]')).toHaveCount(2)
  await expect(tree.locator('li[role="none"], li[role="presentation"]')).toHaveCount(0)
  await expect(disabled).toHaveAttribute('aria-disabled', 'true')
  await expect(disabled).toHaveAttribute('aria-checked', 'mixed')
  await expect(disabled).not.toHaveAttribute('aria-selected')
  await expect(disabled.locator('[data-indeterminate] svg')).toHaveAttribute('viewBox', '0 0 10 2')
  await expect(page).toHaveNoViolations()

  const session = await page.context().newCDPSession(page)
  const {nodes} = await session.send('Accessibility.getFullAXTree')
  const treeNode = nodes.find(node => node.role?.value === 'tree' && node.name?.value === 'Projects')
  const treeChildren = treeNode?.childIds?.map(id => nodes.find(node => node.nodeId === id))
  const parentNode = treeChildren?.find(
    node => node?.role?.value === 'treeitem' && node.name?.value === 'Project group',
  )
  expect(parentNode).toBeDefined()
  const unignoredChildren = (node: (typeof nodes)[number]): typeof nodes =>
    (node.childIds ?? []).flatMap(id => {
      const child = nodes.find(candidate => candidate.nodeId === id)
      return child ? (child.ignored ? unignoredChildren(child) : [child]) : []
    })
  const parentChildren = parentNode && unignoredChildren(parentNode)
  const groupNode = parentChildren?.find(node => node.role?.value === 'group' && node.name?.value === 'Projects')
  expect(groupNode).toBeDefined()
  const groupChildren = groupNode && unignoredChildren(groupNode)
  expect(groupChildren?.filter(node => node.role?.value === 'treeitem')).toHaveLength(2)

  await parent.focus()
  await page.keyboard.press('ArrowDown')
  await expect(disabled).toBeFocused()
  await page.keyboard.press('Enter')
  await page.keyboard.press('Space')
  const bounds = await disabled.boundingBox()
  expect(bounds).not.toBeNull()
  await page.mouse.click(bounds!.x + bounds!.width / 2, bounds!.y + bounds!.height / 2)
  await expect(status).toHaveText('Last activated: none; count: 0')
  await page.keyboard.press('ArrowDown')
  await expect(project).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(status).toHaveText('Last activated: Primer React; count: 1')
  await page.keyboard.press('Space')
  await expect(status).toHaveText('Last activated: Primer React; count: 2')
  await parent.focus()
  await page.keyboard.press('Enter')
  await expect(parent).toHaveAttribute('aria-expanded', 'false')
  await expect(disabled).toBeHidden()
  await page.keyboard.press('Enter')
  await expect(parent).toHaveAttribute('aria-expanded', 'true')
  await expect(disabled).toBeVisible()
})

for (const theme of ['light', 'dark', 'light_high_contrast', 'dark_high_contrast']) {
  test(`direct listbox rows match ordinary ActionList styles in ${theme}`, async ({page}) => {
    await page.setViewportSize({width: 900, height: 600})
    await visit(page, {
      id: 'react-tailwind-components-actionlist-features--direct-listbox-visual-parity',
      globals: {colorScheme: theme},
    })
    const standard = page.getByTestId('standard-actions')
    const direct = page.getByTestId('selectable-actions')
    await expect(direct).toHaveAttribute('aria-multiselectable', 'true')

    expect(Buffer.compare(await standard.screenshot(), await direct.screenshot())).toBe(0)

    const standardRows = standard.locator(':scope > [data-component="ActionList.Item"]')
    const directRows = direct.locator(':scope > [data-component="ActionList.Item"]')
    await expect(standardRows).toHaveCount(4)
    await expect(directRows).toHaveCount(4)
    await standardRows.nth(3).hover()
    const standardHover = await standardRows.nth(3).screenshot()
    await directRows.nth(3).hover()
    const directHover = await directRows.nth(3).screenshot()
    expect(Buffer.compare(standardHover, directHover)).toBe(0)

    await page.mouse.move(0, 0)
    await page.keyboard.press('Tab')
    const standardItem = standardRows.first().getByRole('button')
    await standardItem.focus()
    const standardFocus = await standardRows.first().screenshot()
    await directRows.first().focus()
    const directFocus = await directRows.first().screenshot()
    expect(Buffer.compare(standardFocus, directFocus)).toBe(0)
  })
}
