import {expect, test} from '@playwright/test'
import {visit} from '../test-helpers/storybook'

test('a viewport-sized viewer rail contains its non-resizable pane across resizes', async ({page}) => {
  await page.setViewportSize({width: 800, height: 600})
  await visit(page, {id: 'react-tailwind-layout-splitpagelayout-features--sidebar-fill-rail'})
  const layout = page.getByTestId('viewer-layout')
  const rail = layout.locator('.viewer-rail')
  const pane = layout.locator('[data-component="SplitPageLayout.Sidebar"]')

  for (const width of [200, 320, 800, 1024, 1600, 1920]) {
    await page.setViewportSize({width, height: 600})
    const sizes = await layout.evaluate(element => {
      const railElement = element.querySelector<HTMLElement>('.viewer-rail')
      const paneElement = element.querySelector<HTMLElement>('[data-component="SplitPageLayout.Sidebar"]')
      if (!railElement || !paneElement) throw new Error('Expected the viewer rail and pane')
      const railRect = railElement.getBoundingClientRect()
      const paneRect = paneElement.getBoundingClientRect()
      return {
        railWidth: railRect.width,
        railLeft: railRect.left,
        railRight: railRect.right,
        paneLeft: paneRect.left,
        paneRight: paneRect.right,
        viewportOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      }
    })
    expect(sizes.railWidth).toBeCloseTo(Math.min(1280, width - 48), 0)
    expect(sizes.paneLeft).toBeGreaterThanOrEqual(sizes.railLeft - 0.5)
    expect(sizes.paneRight).toBeLessThanOrEqual(sizes.railRight + 0.5)
    expect(sizes.viewportOverflow).toBeLessThanOrEqual(1)
  }

  await rail.evaluate(element => {
    element.style.width = '40%'
  })
  await expect.poll(async () => (await rail.boundingBox())?.width).toBeCloseTo(1920 * 0.4, 0)
  await expect.poll(async () => (await pane.boundingBox())?.width).toBeCloseTo(1920 * 0.4 - 1, 0)
})

test('fill mode keeps dividers and content inside the rail in both directions', async ({page}) => {
  await page.setViewportSize({width: 800, height: 600})
  await visit(page, {id: 'react-tailwind-layout-splitpagelayout-features--sidebar-fill-rail-variants'})

  for (const width of [200, 320, 800, 1024, 1600]) {
    await page.setViewportSize({width, height: 600})
    const cases = await page.locator('[data-testid^="ltr-"], [data-testid^="rtl-"]').evaluateAll(elements =>
      elements.map(element => {
        const rail = element.querySelector<HTMLElement>('.sidebar-rail')
        const pane = element.querySelector<HTMLElement>('[data-component="SplitPageLayout.Sidebar"]')
        const content = element.querySelector<HTMLElement>('[data-component="SplitPageLayout.Content"]')
        const input = element.querySelector<HTMLInputElement>('input')
        if (!rail || !pane || !content || !input) throw new Error('Expected a complete sidebar fixture')
        const layoutRect = element.getBoundingClientRect()
        const railRect = rail.getBoundingClientRect()
        const paneRect = pane.getBoundingClientRect()
        const contentRect = content.getBoundingClientRect()
        const inputRect = input.getBoundingClientRect()
        const dividers = [...rail.querySelectorAll<HTMLElement>('[aria-hidden="true"]')]
          .map(divider => divider.getBoundingClientRect())
          .filter(rect => rect.width > 0)
        return {
          id: element.getAttribute('data-testid') ?? '',
          layoutWidth: layoutRect.width,
          layoutOverflow: element.scrollWidth - element.clientWidth,
          railWidth: railRect.width,
          railLeft: railRect.left,
          railRight: railRect.right,
          paneWidth: paneRect.width,
          paneLeft: paneRect.left,
          paneRight: paneRect.right,
          contentLeft: contentRect.left,
          inputLeft: inputRect.left,
          inputRight: inputRect.right,
          dividers: dividers.map(rect => ({width: rect.width, left: rect.left, right: rect.right})),
        }
      }),
    )
    expect(cases).toHaveLength(12)
    for (const item of cases) {
      const [direction, position, divider] = item.id.split('-')
      const dividerWidth = divider === 'none' ? 0 : divider === 'line' ? 1 : 8
      const railOnLeft = (position === 'start') !== (direction === 'rtl')
      expect(item.railWidth, item.id).toBeCloseTo(item.layoutWidth * 0.6, 0)
      expect(item.paneWidth, item.id).toBeCloseTo(item.railWidth - dividerWidth, 0)
      expect(item.layoutOverflow, item.id).toBeLessThanOrEqual(1)
      expect(item.paneLeft, item.id).toBeGreaterThanOrEqual(item.railLeft - 0.5)
      expect(item.paneRight, item.id).toBeLessThanOrEqual(item.railRight + 0.5)
      expect(item.inputLeft, item.id).toBeGreaterThanOrEqual(item.paneLeft - 0.5)
      expect(item.inputRight, item.id).toBeLessThanOrEqual(item.paneRight + 0.5)
      expect(item.railLeft < item.contentLeft, item.id).toBe(railOnLeft)
      expect(item.dividers, item.id).toHaveLength(dividerWidth ? 1 : 0)
      if (item.dividers[0]) {
        const border = item.dividers[0]
        expect(border.width, item.id).toBeCloseTo(dividerWidth, 0)
        expect(railOnLeft ? border.left : border.right, item.id).toBeCloseTo(
          railOnLeft ? item.paneRight : item.paneLeft,
          0,
        )
      }
    }
  }

  await page.setViewportSize({width: 800, height: 600})
  const fixture = page.getByTestId('ltr-start-line')
  const rail = fixture.locator('.sidebar-rail')
  for (const parentWidth of [400, 700]) {
    await fixture.evaluate((element, nextWidth) => {
      element.style.width = `${nextWidth}px`
    }, parentWidth)
    await expect.poll(async () => (await rail.boundingBox())?.width).toBeCloseTo(parentWidth * 0.6, 0)
  }
  const input = fixture.getByRole('textbox', {name: 'Search document'})
  await input.focus()
  await expect(input).toBeFocused()
  await input.fill('example')
  await expect(input).toHaveValue('example')
})

test('fill mode preserves fullscreen sidebar sizing on narrow viewports', async ({page}) => {
  await page.setViewportSize({width: 320, height: 600})
  await visit(page, {id: 'react-tailwind-layout-splitpagelayout-features--sidebar-fill-fullscreen'})
  const rail = page.locator('.fullscreen-rail')
  const pane = rail.locator('[data-component="SplitPageLayout.Sidebar"]')
  await expect(rail).toHaveCSS('position', 'fixed')
  await expect.poll(async () => (await rail.boundingBox())?.width).toBeCloseTo(320, 0)
  await expect.poll(async () => (await pane.boundingBox())?.width).toBeCloseTo(320, 0)
  await expect(rail.getByRole('textbox', {name: 'Search document'})).toBeVisible()
})

test('a fill-mode overflow region remains keyboard reachable with enlarged text', async ({page}) => {
  await page.setViewportSize({width: 320, height: 256})
  await visit(page, {id: 'react-tailwind-layout-splitpagelayout-features--sidebar-fill-scrollable'})
  await page.addStyleTag({
    content: `
      html { font-size: 32px; }
      * { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; }
      p { margin-bottom: 2em !important; }
    `,
  })

  const region = page.getByRole('region', {name: 'Scrollable document'})
  await expect(region).toHaveAttribute('tabindex', '0')
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(321)

  await page.keyboard.press('Tab')
  await expect(region).toBeFocused()
  // WebKit's automated keyboard scrolling needs a nonzero key hold.
  await page.keyboard.press('ArrowDown', {delay: 100})
  await expect.poll(() => region.evaluate(element => element.scrollTop)).toBeGreaterThan(0)
  await page.keyboard.press('Tab')
  const note = page.getByRole('textbox', {name: 'Add note'})
  await expect(note).toBeFocused()
  const visibility = await note.evaluate(element => {
    const pane = element.closest('[data-component="SplitPageLayout.Sidebar"]')
    if (!pane) throw new Error('Expected the note inside the sidebar')
    const paneRect = pane.getBoundingClientRect()
    const noteRect = element.getBoundingClientRect()
    return {
      top: noteRect.top - paneRect.top,
      bottom: paneRect.bottom - noteRect.bottom,
      left: noteRect.left - paneRect.left,
      right: paneRect.right - noteRect.right,
    }
  })
  expect(visibility.top).toBeGreaterThanOrEqual(-1)
  expect(visibility.bottom).toBeGreaterThanOrEqual(-1)
  expect(visibility.left).toBeGreaterThanOrEqual(-1)
  expect(visibility.right).toBeGreaterThanOrEqual(-1)
  await note.fill('Read')
  await expect(note).toHaveValue('Read')
  await page.keyboard.press('Tab')
  await expect(page.getByRole('textbox', {name: 'After sidebar'})).toBeFocused()
  await expect(page).toHaveNoViolations()
})

test('a focused fill-mode region keeps focus when resizing removes overflow', async ({page}) => {
  await page.setViewportSize({width: 320, height: 256})
  await visit(page, {id: 'react-tailwind-layout-splitpagelayout-features--sidebar-fill-scrollable'})
  const pane = page.locator('[data-component="SplitPageLayout.Sidebar"]')
  const note = page.getByRole('textbox', {name: 'Add note'})

  await expect(page.getByRole('region', {name: 'Scrollable document'})).toHaveAttribute('tabindex', '0')
  await page.keyboard.press('Tab')
  await expect(pane).toBeFocused()

  await page.setViewportSize({width: 1600, height: 256})
  await expect.poll(() => pane.evaluate(element => element.scrollHeight - element.clientHeight)).toBe(0)
  await page.evaluate(
    () => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))),
  )
  await expect(pane).toBeFocused()
  await expect(pane).toHaveAttribute('role', 'region')
  await expect(pane).toHaveAttribute('tabindex', '0')

  await page.keyboard.press('Tab')
  await expect(note).toBeFocused()
  await expect(pane).not.toHaveAttribute('role')
  await expect(pane).not.toHaveAttribute('tabindex')

  await page.setViewportSize({width: 320, height: 256})
  await expect.poll(() => pane.evaluate(element => element.scrollHeight - element.clientHeight)).toBeGreaterThan(0)
  await expect(note).toBeFocused()
  await expect(pane).toHaveAttribute('tabindex', '0')
  await page.keyboard.press('Shift+Tab')
  await expect(pane).toBeFocused()
})

test('default and resizable sidebars retain pixel-based sizing', async ({page}) => {
  await page.setViewportSize({width: 1280, height: 600})
  await visit(page, {id: 'react-tailwind-layout-splitpagelayout-features--with-sidebar-start'})
  let pane = page.locator('[data-component="SplitPageLayout.Sidebar"]')
  await expect.poll(async () => (await pane.boundingBox())?.width).toBeCloseTo(296, 0)

  await visit(page, {id: 'react-tailwind-layout-splitpagelayout-features--with-resizable-sidebar'})
  pane = page.locator('[data-component="SplitPageLayout.Sidebar"]')
  const handle = page.getByRole('slider', {name: 'Resizable sidebar'})
  await expect(handle).toBeVisible()
  await expect(handle).toHaveAttribute('aria-valuenow', '296')
  await handle.focus()
  await page.keyboard.press('ArrowRight')
  await expect(handle).toHaveAttribute('aria-valuenow', '299')
  await expect.poll(async () => (await pane.boundingBox())?.width).toBeCloseTo(299, 0)
})
