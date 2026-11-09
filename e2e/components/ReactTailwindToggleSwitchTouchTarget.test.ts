import {expect, test, type Locator} from '@playwright/test'
import {visit} from '../test-helpers/storybook'

async function getTouchTarget(control: Locator) {
  return control.evaluate(element => {
    const root = element.getBoundingClientRect()
    const container = element.closest('[data-component="ToggleSwitch.Container"]')
    if (!container) throw new Error('ToggleSwitch container was not found')
    const containerBounds = container.getBoundingClientRect()
    const pseudoStyle = getComputedStyle(element, '::before')
    const height = parseFloat(pseudoStyle.minHeight)
    const x = root.left + root.width / 2
    const left = root.left + 1
    const right = root.right - 1
    const top = root.top + root.height / 2 - height / 2 + 2
    const bottom = root.top + root.height / 2 + height / 2 - 2
    const hit = (hitX: number, hitY: number) => {
      const target = document.elementFromPoint(hitX, hitY)
      return target === element || element.contains(target)
    }

    return {
      x,
      left,
      right,
      top,
      bottom,
      height,
      width: parseFloat(pseudoStyle.width),
      trackWidth: root.width,
      trackHeight: root.height,
      containerHeight: containerBounds.height,
      contained: top >= containerBounds.top && bottom <= containerBounds.bottom,
      hitsTop: hit(x, top),
      hitsBottom: hit(x, bottom),
      hitsTopLeft: hit(left, top),
      hitsBottomRight: hit(right, bottom),
    }
  })
}

test.describe('React Tailwind ToggleSwitch coarse-pointer targets', () => {
  test.use({hasTouch: true})

  for (const size of ['small', 'medium'] as const) {
    for (const position of ['start', 'end'] as const) {
      for (const direction of ['ltr', 'rtl'] as const) {
        test(`${size} target with status ${position} in ${direction}`, async ({page}) => {
          for (const mode of ['enabled', 'disabled', 'readOnly', 'loading'] as const) {
            await visit(page, {
              id: 'react-tailwind-forms-toggleswitch--playground',
              args: {
                size,
                statusLabelPosition: position,
                disabled: mode === 'disabled',
                readOnly: mode === 'readOnly',
                loading: mode === 'loading',
              },
            })
            await page.evaluate(value => {
              document.documentElement.dir = value
            }, direction)
            const control = page.getByRole('switch', {name: 'Toggle label'})
            await expect(control).toHaveAttribute('aria-checked', 'false')
            expect(await page.evaluate(() => matchMedia('(pointer: coarse)').matches)).toBe(true)
            await expect(control).toHaveAttribute('tabindex', '0')
            if (mode === 'disabled' || mode === 'loading')
              await expect(control).toHaveAttribute('aria-disabled', 'true')
            if (mode === 'readOnly' || mode === 'loading')
              await expect(control).toHaveAttribute('aria-readonly', 'true')

            const target = await getTouchTarget(control)
            expect(target.height).toBe(44)
            expect(target.containerHeight).toBeGreaterThanOrEqual(target.height)
            expect(target.contained).toBe(true)
            expect(target.hitsTop).toBe(true)
            expect(target.hitsBottom).toBe(true)
            const labelIsBefore = await control.evaluate(element => {
              const label = element
                .closest('[data-component="ToggleSwitch.Container"]')
                ?.querySelector('[data-component="ToggleSwitch.StatusLabel"]')
              if (!label) throw new Error('ToggleSwitch status label was not found')
              return label.getBoundingClientRect().left < element.getBoundingClientRect().left
            })
            expect(labelIsBefore).toBe((position === 'start') === (direction === 'ltr'))

            await page.touchscreen.tap(target.x, target.top)
            if (mode === 'enabled') await expect(control).toBeChecked()
            else await expect(control).not.toBeChecked()

            await page.touchscreen.tap(target.x, target.bottom)
            await expect(control).not.toBeChecked()
            const status = control.locator('xpath=..').locator('[data-component="ToggleSwitch.StatusLabel"]')
            await status.tap()
            if (mode === 'enabled') await expect(control).toBeChecked()
            else await expect(control).not.toBeChecked()

            await control.focus()
            await expect(control).toBeFocused()
            await page.keyboard.press('Space')
            await page.keyboard.press('Enter')
            if (mode === 'enabled') await expect(control).toBeChecked()
            else await expect(control).not.toBeChecked()
          }
        })
      }
    }
  }

  for (const width of [200, 320, 1280]) {
    for (const direction of ['ltr', 'rtl'] as const) {
      test(`does not introduce table or page overflow at ${width}px in ${direction}`, async ({page}) => {
        await page.setViewportSize({width, height: 900})
        await visit(page, {id: 'react-tailwind-data-table-features--overflow-with-hidden-cell-label'})
        await page
          .getByTestId('table-frame')
          .evaluate((element, value) => element.setAttribute('dir', value), direction)
        const wrapper = page.locator('[data-component="Table.OverflowWrapper"]')
        const control = page.getByRole('switch', {name: 'Enable security alerts'})
        await control.scrollIntoViewIfNeeded()
        const target = await getTouchTarget(control)
        expect(target.hitsTop).toBe(true)
        expect(target.contained).toBe(true)
        await page.touchscreen.tap(target.x, target.top)
        await expect(control).toBeChecked()

        await expect.poll(() => wrapper.evaluate(element => element.scrollHeight - element.clientHeight)).toBe(0)
        const dimensions = await wrapper.evaluate(element => ({
          clientWidth: element.clientWidth,
          scrollWidth: element.scrollWidth,
          documentWidth: document.documentElement.clientWidth,
          documentScrollWidth: document.documentElement.scrollWidth,
          documentHeight: document.documentElement.clientHeight,
          documentScrollHeight: document.documentElement.scrollHeight,
        }))
        expect(dimensions.documentScrollWidth).toBeLessThanOrEqual(dimensions.documentWidth)
        expect(dimensions.documentScrollHeight).toBeLessThanOrEqual(dimensions.documentHeight)
        if (width === 1280) {
          expect(dimensions.scrollWidth).toBe(dimensions.clientWidth)
          await expect(wrapper).not.toHaveAttribute('role')
          await expect(wrapper).not.toHaveAttribute('tabindex')
        } else {
          expect(dimensions.scrollWidth).toBeGreaterThan(dimensions.clientWidth)
          await expect(wrapper).toHaveAttribute('role', 'region')
          await expect(wrapper).toHaveAttribute('tabindex', '0')
        }
      })
    }
  }

  for (const rootFontSize of [4, 8, 12]) {
    for (const size of ['small', 'medium'] as const) {
      for (const position of ['start', 'end'] as const) {
        for (const direction of ['ltr', 'rtl'] as const) {
          test(`keeps the ${size} target reachable with status ${position} and a ${rootFontSize}px root font in ${direction}`, async ({
            page,
          }) => {
            await visit(page, {
              id: 'react-tailwind-forms-toggleswitch--playground',
              args: {size, statusLabelPosition: position},
            })
            await page.addStyleTag({content: `html { font-size: ${rootFontSize}px !important; }`})
            await page.evaluate(value => {
              document.documentElement.dir = value
            }, direction)
            const control = page.getByRole('switch', {name: 'Toggle label'})
            const target = await getTouchTarget(control)
            const expectedHeight = Math.max(24, rootFontSize * 2.75)
            expect(target.height).toBe(expectedHeight)
            expect(target.trackWidth).toBe(Math.max(24, rootFontSize * (size === 'small' ? 3 : 4)))
            expect(target.trackHeight).toBe(rootFontSize * (size === 'small' ? 1.5 : 2))
            expect(target.width).toBeGreaterThanOrEqual(24)
            expect(target.containerHeight).toBeGreaterThanOrEqual(expectedHeight)
            expect(target.contained).toBe(true)
            expect(target.hitsTop).toBe(true)
            expect(target.hitsBottom).toBe(true)
            expect(target.hitsTopLeft).toBe(true)
            expect(target.hitsBottomRight).toBe(true)
            await page.touchscreen.tap(target.x, target.top)
            await expect(control).toBeChecked()
            await page.touchscreen.tap(target.x, target.bottom)
            await expect(control).not.toBeChecked()
          })
        }
      }
    }
  }

  test('activates the top corner of a small target at a 4px root font', async ({page, browserName}) => {
    test.fixme(
      browserName === 'chromium' && !process.env.RUN_KNOWN_FAILURE,
      'Chromium can retarget this touch to an ancestor; set RUN_KNOWN_FAILURE=1 to reproduce.',
    )
    await visit(page, {
      id: 'react-tailwind-forms-toggleswitch--playground',
      args: {size: 'small', statusLabelPosition: 'end'},
    })
    await page.addStyleTag({content: 'html { font-size: 4px !important; }'})

    const control = page.getByRole('switch', {name: 'Toggle label'})
    const target = await getTouchTarget(control)
    expect(target.hitsTopLeft).toBe(true)
    await page.touchscreen.tap(target.left, target.top)
    await expect(control).toBeChecked()
  })

  for (const width of [320, 1280]) {
    for (const direction of ['ltr', 'rtl'] as const) {
      for (const cellPadding of ['normal', 'condensed'] as const) {
        test(`keeps ${cellPadding} table targets separate with a reduced root font at ${width}px in ${direction}`, async ({
          page,
        }) => {
          await page.setViewportSize({width, height: 900})
          await visit(page, {
            id: 'react-tailwind-data-table-features--overflow-with-multiple-switches',
            args: {cellPadding},
          })
          await page.addStyleTag({content: 'html { font-size: 12px !important; }'})
          await page
            .getByTestId('table-frame')
            .evaluate((element, value) => element.setAttribute('dir', value), direction)
          const wrapper = page.locator('[data-component="Table.OverflowWrapper"]')
          const controls = ['Alerts', 'Audit logs', 'Policy checks'].map(name => page.getByRole('switch', {name}))
          if (width === 1280) {
            await expect(wrapper).not.toHaveAttribute('role')
            await expect(wrapper).not.toHaveAttribute('tabindex')
          } else {
            await expect(wrapper).toHaveAttribute('role', 'region')
            await expect(wrapper).toHaveAttribute('tabindex', '0')
          }
          await controls[1].scrollIntoViewIfNeeded()

          const targets = await Promise.all(controls.map(getTouchTarget))
          for (const [index, target] of targets.entries()) {
            expect(target.height).toBe(33)
            expect(target.trackWidth).toBe(36)
            expect(target.width).toBeGreaterThanOrEqual(24)
            expect(target.contained).toBe(true)
            expect(target.hitsTop).toBe(true)
            if (index !== targets.length - 1 || width === 1280) expect(target.hitsBottom).toBe(true)
          }
          expect(targets[1].top).toBeGreaterThan(targets[0].bottom)
          expect(targets[2].top).toBeGreaterThan(targets[1].bottom)
          await page.touchscreen.tap(targets[1].x, targets[1].top)
          await expect(controls[1]).toBeChecked()
          await expect(controls[0]).not.toBeChecked()
          await expect(controls[2]).not.toBeChecked()
          await page.touchscreen.tap(targets[1].x, targets[1].bottom)
          await expect(controls[1]).not.toBeChecked()

          await page.touchscreen.tap(targets[2].x, targets[2].bottom)
          await expect(controls[2]).toBeChecked()
          await page.touchscreen.tap(targets[2].x, targets[2].bottom)
          await expect(controls[2]).not.toBeChecked()

          await expect.poll(() => wrapper.evaluate(element => element.scrollHeight - element.clientHeight)).toBe(0)
          expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)
        })
      }
    }
  }

  test('keeps multiline labels and the target within a responsive layout with enlarged text', async ({page}) => {
    await page.setViewportSize({width: 320, height: 600})
    await visit(page, {
      id: 'react-tailwind-forms-toggleswitch--playground',
      args: {
        size: 'small',
        statusLabelPosition: 'end',
        buttonLabelOn: 'Enabled with notifications',
        buttonLabelOff: 'Off',
      },
    })
    await page.evaluate(() => {
      document.documentElement.dir = 'rtl'
    })
    await page.addStyleTag({
      content: `
        html { font-size: 32px !important; }
        * { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; }
        [data-component="ToggleSwitch.StatusLabel"] { max-width: 104px; overflow-wrap: anywhere; }
      `,
    })
    const control = page.getByRole('switch', {name: 'Toggle label'})
    await control.evaluate(element => {
      const layout = element.closest('[data-component="ToggleSwitch.Container"]')?.parentElement
      if (!layout) throw new Error('ToggleSwitch layout was not found')
      layout.style.display = 'flex'
      layout.style.flexWrap = 'wrap'
      layout.style.columnGap = '8px'
      layout.style.maxWidth = '100%'
    })
    const target = await getTouchTarget(control)
    expect(target.height).toBe(88)
    expect(target.contained).toBe(true)
    expect(target.hitsTop).toBe(true)
    expect(target.hitsBottom).toBe(true)
    const status = page.locator('[data-component="ToggleSwitch.StatusLabel"]')
    const before = await status.boundingBox()
    await page.touchscreen.tap(target.x, target.top)
    await expect(control).toBeChecked()
    await expect(status.getByText('Enabled with notifications', {exact: true})).toBeVisible()
    const after = await status.boundingBox()
    expect(after!.width).toBeCloseTo(before!.width, 1)
    expect(after!.height).toBeCloseTo(before!.height, 1)
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320)
  })
})

test.describe('React Tailwind ToggleSwitch fine-pointer targets', () => {
  test.use({hasTouch: false})

  for (const size of ['small', 'medium'] as const) {
    test(`keeps the ${size} desktop layout and a usable target at reduced font size`, async ({page}) => {
      await visit(page, {id: 'react-tailwind-forms-toggleswitch--playground', args: {size}})
      const control = page.getByRole('switch', {name: 'Toggle label'})
      expect(await page.evaluate(() => matchMedia('(pointer: fine)').matches)).toBe(true)
      const defaultTarget = await getTouchTarget(control)
      expect(defaultTarget.trackHeight).toBe(size === 'small' ? 24 : 32)
      expect(defaultTarget.containerHeight).toBe(defaultTarget.trackHeight)
      expect(defaultTarget.height).toBe(24)
      expect(defaultTarget.hitsTop).toBe(true)
      expect(defaultTarget.hitsBottom).toBe(true)

      await page.addStyleTag({content: 'html { font-size: 12px !important; }'})
      const reducedTarget = await getTouchTarget(control)
      expect(reducedTarget.trackHeight).toBe(size === 'small' ? 18 : 24)
      expect(reducedTarget.height).toBe(24)
      expect(reducedTarget.containerHeight).toBeGreaterThanOrEqual(24)
      expect(reducedTarget.contained).toBe(true)
      expect(reducedTarget.hitsTop).toBe(true)
      expect(reducedTarget.hitsBottom).toBe(true)
      await page.mouse.click(reducedTarget.x, reducedTarget.top)
      await expect(control).toBeChecked()
      await page.mouse.click(reducedTarget.x, reducedTarget.bottom)
      await expect(control).not.toBeChecked()
    })
  }
})
