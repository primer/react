import {expect, test} from '@playwright/test'
import {visit} from '../test-helpers/storybook'

for (const width of [200, 320]) {
  for (const direction of ['ltr', 'rtl'] as const) {
    test(`keeps hidden table-cell labels inside the scrollable region at ${width}px in ${direction}`, async ({
      page,
    }) => {
      await page.setViewportSize({width, height: 256})
      await visit(page, {id: 'react-tailwind-data-table-features--overflow-with-hidden-cell-label'})
      await page.getByTestId('table-frame').evaluate((element, value) => element.setAttribute('dir', value), direction)

      const region = page.getByRole('region', {name: 'Security features'})
      const toggle = page.getByRole('switch', {name: 'Enable security alerts'})
      await expect(region).toHaveAttribute('tabindex', '0')
      await expect(toggle).toHaveAttribute('aria-checked', 'false')
      const geometry = await region.evaluate(element => ({
        clientWidth: element.clientWidth,
        scrollWidth: element.scrollWidth,
        documentWidth: document.documentElement.clientWidth,
        documentScrollWidth: document.documentElement.scrollWidth,
      }))
      expect(geometry.clientWidth).toBe(width - 2)
      expect(geometry.scrollWidth).toBeGreaterThan(geometry.clientWidth)
      expect(geometry.documentScrollWidth).toBeLessThanOrEqual(geometry.documentWidth)
      expect(
        await page.locator('#security-alert-label').evaluate(element => {
          return element instanceof HTMLElement ? element.offsetParent?.getAttribute('data-component') : null
        }),
      ).toBe('Table')

      await region.focus()
      await expect(region).toBeFocused()
      await expect(async () => {
        await page.keyboard.press(direction === 'ltr' ? 'ArrowRight' : 'ArrowLeft')
        expect(Math.abs(await region.evaluate(element => element.scrollLeft))).toBeGreaterThan(0)
      }).toPass({intervals: [100, 300], timeout: 5000})
      await toggle.focus()
      await expect(toggle).toBeFocused()
      const positions = await toggle.evaluate(element => {
        const toggleBounds = element.getBoundingClientRect()
        const regionBounds = element.closest('[data-component="Table.OverflowWrapper"]')!.getBoundingClientRect()
        return {left: toggleBounds.left - regionBounds.left, right: toggleBounds.right - regionBounds.right}
      })
      expect(positions.left).toBeGreaterThanOrEqual(-1)
      expect(positions.right).toBeLessThanOrEqual(1)
      await page.keyboard.press('Space')
      await expect(toggle).toHaveAttribute('aria-checked', 'true')
    })
  }
}

for (const direction of ['ltr', 'rtl'] as const) {
  test(`keeps enlarged and spaced table content scrollable in ${direction}`, async ({page}) => {
    await page.setViewportSize({width: 320, height: 256})
    await visit(page, {id: 'react-tailwind-data-table-features--overflow-with-hidden-cell-label'})
    await page.getByTestId('table-frame').evaluate((element, value) => element.setAttribute('dir', value), direction)
    await page.addStyleTag({
      content: `
        html { font-size: 32px !important; }
        * { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; }
        p { margin-bottom: 2em !important; }
      `,
    })

    const region = page.getByRole('region', {name: 'Security features'})
    const toggle = page.getByRole('switch', {name: 'Enable security alerts'})
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).fontSize)).toBe('32px')
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320)
    await region.focus()
    await expect(async () => {
      await page.keyboard.press(direction === 'ltr' ? 'ArrowRight' : 'ArrowLeft')
      expect(Math.abs(await region.evaluate(element => element.scrollLeft))).toBeGreaterThan(0)
    }).toPass({intervals: [100, 300], timeout: 5000})
    await toggle.focus()
    const positions = await toggle.evaluate(element => {
      const toggleBounds = element.getBoundingClientRect()
      const regionBounds = element.closest('[data-component="Table.OverflowWrapper"]')!.getBoundingClientRect()
      return {left: toggleBounds.left - regionBounds.left, right: toggleBounds.right - regionBounds.right}
    })
    expect(positions.left).toBeGreaterThanOrEqual(-1)
    expect(positions.right).toBeLessThanOrEqual(1)
    await page.keyboard.press('Space')
    await expect(toggle).toHaveAttribute('aria-checked', 'true')
  })
}

test('updates the scroll-region affordance when the table fits and overflows again', async ({page}) => {
  await page.setViewportSize({width: 320, height: 256})
  await visit(page, {id: 'react-tailwind-data-table-features--overflow-with-hidden-cell-label'})
  const region = page.getByRole('region', {name: 'Security features'})
  const toggle = page.getByRole('switch', {name: 'Enable security alerts'})
  await expect(region).toBeVisible()
  await page.setViewportSize({width: 600, height: 256})
  await expect(region).toHaveCount(0)
  await expect(toggle).toBeVisible()
  await page.setViewportSize({width: 320, height: 256})
  await expect(region).toHaveAttribute('tabindex', '0')
  await expect(toggle).toHaveAttribute('aria-checked', 'false')
})

test('a height-constrained table stops overflowing when its width becomes sufficient', async ({page}) => {
  await page.setViewportSize({width: 600, height: 900})
  await visit(page, {id: 'react-tailwind-data-table-features--overflow-with-hidden-cell-label'})
  const wrapper = page.locator('[data-component="Table.OverflowWrapper"]')
  await expect(wrapper).not.toHaveAttribute('role')
  await wrapper.evaluate(element => {
    element.style.maxHeight = `${element.clientHeight}px`
  })

  await page.setViewportSize({width: 320, height: 900})
  await expect(wrapper).toHaveAttribute('role', 'region')
  await expect.poll(() => wrapper.evaluate(element => element.scrollHeight - element.clientHeight)).toBe(0)

  await page.setViewportSize({width: 600, height: 900})
  await expect(wrapper).not.toHaveAttribute('role')
  await expect(wrapper).not.toHaveAttribute('tabindex')
  expect(await wrapper.evaluate(element => element.scrollHeight - element.clientHeight)).toBe(0)
})

for (const width of [320, 1280]) {
  test(`toggling a table switch does not create vertical overflow at ${width}px`, async ({page}) => {
    await page.setViewportSize({width, height: 900})
    await visit(page, {id: 'react-tailwind-data-table-features--overflow-with-hidden-cell-label'})
    const wrapper = page.locator('[data-component="Table.OverflowWrapper"]')
    const toggle = page.getByRole('switch', {name: 'Enable security alerts'})
    const status = page.locator('[data-component="ToggleSwitch.StatusLabel"]')

    await expect(toggle).toHaveAttribute('aria-checked', 'false')
    expect(await wrapper.evaluate(element => element.scrollHeight - element.clientHeight)).toBe(0)
    const initialStatusWidth = (await status.boundingBox())!.width
    await toggle.focus()
    await page.keyboard.press('Space')
    await expect(toggle).toHaveAttribute('aria-checked', 'true')
    await expect(toggle).toBeFocused()
    await expect(status.getByText('On', {exact: true})).toBeVisible()
    await expect(status.getByText('Off', {exact: true})).toBeHidden()
    await expect.poll(() => wrapper.evaluate(element => element.scrollHeight - element.clientHeight)).toBe(0)
    await page.evaluate(
      () => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))),
    )
    expect((await status.boundingBox())!.width).toBeCloseTo(initialStatusWidth, 1)
    if (width === 1280) {
      await expect(wrapper).not.toHaveAttribute('role')
      await expect(wrapper).not.toHaveAttribute('tabindex')
    } else {
      await expect(wrapper).toHaveAttribute('role', 'region')
      await expect(wrapper).toHaveAttribute('tabindex', '0')
    }

    await page.keyboard.press('Space')
    await expect(toggle).toHaveAttribute('aria-checked', 'false')
    await expect(status.getByText('Off', {exact: true})).toBeVisible()
    await expect(status.getByText('On', {exact: true})).toBeHidden()
    await expect.poll(() => wrapper.evaluate(element => element.scrollHeight - element.clientHeight)).toBe(0)
  })
}

test('a focused table region keeps focus when the table fits after resizing', async ({page}) => {
  await page.setViewportSize({width: 320, height: 256})
  await visit(page, {id: 'react-tailwind-data-table-features--overflow-with-hidden-cell-label'})
  const wrapper = page.locator('[data-component="Table.OverflowWrapper"]')
  const toggle = page.getByRole('switch', {name: 'Enable security alerts'})

  await expect(page.getByRole('region', {name: 'Security features'})).toHaveAttribute('tabindex', '0')
  await wrapper.focus()
  await expect(wrapper).toBeFocused()

  await page.setViewportSize({width: 600, height: 256})
  await expect.poll(() => wrapper.evaluate(element => element.scrollWidth - element.clientWidth)).toBe(0)
  await page.evaluate(
    () => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))),
  )
  await expect(wrapper).toBeFocused()
  await expect(wrapper).toHaveAttribute('role', 'region')
  await expect(wrapper).toHaveAttribute('tabindex', '0')

  await toggle.focus()
  await expect(toggle).toBeFocused()
  await expect(wrapper).not.toHaveAttribute('role')
  await expect(wrapper).not.toHaveAttribute('tabindex')

  await page.setViewportSize({width: 320, height: 256})
  await expect(page.getByRole('region', {name: 'Security features'})).toHaveAttribute('tabindex', '0')
  await expect(toggle).toBeFocused()
})
