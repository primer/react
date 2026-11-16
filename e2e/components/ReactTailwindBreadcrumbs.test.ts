import {expect, test} from '@playwright/test'
import {activateWithoutPointerFocus} from '../test-helpers/activateWithoutPointerFocus'
import {expectTargetHitSquare} from '../test-helpers/expectTargetHitSquare'
import {visit} from '../test-helpers/storybook'

test('breadcrumb measurements remain hidden and inert alongside host visibility utilities @aat', async ({
  page,
  browserName,
}) => {
  await page.setViewportSize({width: 320, height: 600})
  await visit(page, {id: 'react-tailwind-navigation-breadcrumbs-features--interactive-child-measurement'})
  const nav = page.getByRole('navigation', {name: 'Breadcrumbs'})
  const measurement = nav.locator('[data-breadcrumb-measurement]')
  const picker = nav.getByRole('button', {name: 'Choose repository'})
  const current = nav.getByRole('link', {name: 'Current page'})

  await expect(page.getByTestId('legacy-invisible')).toHaveCSS('visibility', 'visible')
  await expect(page.getByTestId('legacy-invisible')).toHaveCSS('opacity', '0')
  await expect(measurement).toHaveAttribute('inert')
  await expect(measurement).toHaveAttribute('aria-hidden', 'true')
  await expect(measurement).toHaveCSS('visibility', 'hidden')
  expect(
    await measurement
      .locator('li')
      .first()
      .evaluate(element => element.getBoundingClientRect().width),
  ).toBeGreaterThan(0)
  await expect(nav.locator('button').filter({hasText: 'Choose repository'})).toHaveCount(2)
  await expect(picker).toHaveCount(1)

  await page.addStyleTag({
    content: '[data-breadcrumb-measurement] { visibility: visible !important; opacity: 0 !important; }',
  })
  await page.keyboard.press('Tab')
  await expect(picker).toBeFocused()
  await page.keyboard.press('Tab')
  if (browserName === 'webkit') {
    // This automated WebKit configuration also skips native links in an independent control.
    await expect(measurement.locator('button')).not.toBeFocused()
    await current.focus()
  }
  await expect(current).toBeFocused()
  await measurement.locator('button').evaluate(element => element.focus())
  await expect(current).toBeFocused()
  await expect(page).toHaveNoViolations()
})

test('measured repository changes recalculate overflow without remounting the visible picker @aat', async ({page}) => {
  await page.setViewportSize({width: 320, height: 600})
  await visit(page, {id: 'react-tailwind-navigation-breadcrumbs-features--dynamic-repository'})
  const nav = page.getByRole('navigation', {name: 'Breadcrumbs'})
  const picker = nav.getByRole('button', {name: 'Choose repository'})
  const container = page.getByTestId('repository-breadcrumb-container')
  const visibleList = nav.locator('ol:not([data-breadcrumb-measurement])')

  await expect(nav.locator('button[aria-label="Choose repository"]')).toHaveCount(1)
  await picker.click()
  await expect(picker).toHaveAttribute('aria-pressed', 'true')
  const changeName = page.getByRole('button', {name: 'Use longer repository name'})
  await changeName.focus()
  await activateWithoutPointerFocus(changeName)
  const trigger = nav.getByRole('button', {name: '1 more breadcrumb items'})
  await expect(trigger).toBeVisible()
  await expect(changeName).toBeFocused()
  await expect(nav.getByRole('link', {name: 'longer-repository-name'})).toBeVisible()
  await expect(picker).toHaveAttribute('aria-pressed', 'true')
  expect(
    await visibleList.evaluate(element => {
      const bounds = element.getBoundingClientRect()
      const navBounds = element.closest('nav')?.getBoundingClientRect()
      return navBounds !== undefined && bounds.right <= navBounds.right + 1
    }),
  ).toBe(true)

  await activateWithoutPointerFocus(page.getByRole('button', {name: 'Use short repository name'}))
  await expect(trigger).toHaveCount(0)
  await expect(nav.getByRole('link', {name: 'Owner'})).toBeVisible()
  await expect(changeName).toBeFocused()
  await expect(picker).toHaveAttribute('aria-pressed', 'true')

  await activateWithoutPointerFocus(changeName)
  await expect(trigger).toBeVisible()
  await trigger.focus()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('menuitem', {name: 'Owner'})).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(trigger).toBeFocused()

  await container.evaluate(element => {
    element.style.width = '600px'
  })
  await expect(trigger).toHaveCount(0)
  await expect(nav.getByRole('link', {name: 'Owner'})).toBeFocused()
  await expect(picker).toHaveAttribute('aria-pressed', 'true')
})

test('a live repository picker reflows inside a narrow container without remounting @aat', async ({page}) => {
  await page.setViewportSize({width: 320, height: 600})
  await visit(page, {id: 'react-tailwind-navigation-breadcrumbs-features--dynamic-repository'})
  const nav = page.getByRole('navigation', {name: 'Breadcrumbs'})
  const container = page.getByTestId('repository-breadcrumb-container')
  const picker = nav.getByRole('button', {name: 'Choose repository'})
  const pickerElement = await picker.elementHandle()
  await picker.click()
  await expect(picker).toBeFocused()
  await activateWithoutPointerFocus(page.getByRole('button', {name: 'Use longer repository name'}))
  const repository = nav.getByRole('link', {name: 'longer-repository-name'})

  for (const direction of ['ltr', 'rtl']) {
    await nav.evaluate((element, value) => element.setAttribute('dir', value), direction)
    for (const [width, marginLeft] of [
      [180, 120],
      [64, 200],
    ]) {
      await container.evaluate(
        (element, size) => {
          element.style.width = `${size.width}px`
          element.style.marginLeft = `${size.marginLeft}px`
        },
        {width, marginLeft},
      )
      await expect(nav.getByRole('button', {name: '1 more breadcrumb items'})).toBeVisible()
      await expect
        .poll(async () =>
          nav.evaluate(element => {
            const navBounds = element.getBoundingClientRect()
            const leaf = element.querySelector<HTMLElement>('[data-breadcrumb-live-leaf]')
            if (!leaf) throw new Error('Expected the live final breadcrumb')
            const link = leaf.querySelector('a')
            const button = leaf.querySelector('button')
            if (!link || !button) throw new Error('Expected a repository link and picker')
            const bounds = [link, button].map(child => child.getBoundingClientRect())
            return Math.max(...bounds.flatMap(child => [navBounds.left - child.left, child.right - navBounds.right]))
          }),
        )
        .toBeLessThanOrEqual(1)
      await expect(picker).toBeFocused()
      await expect(picker).toHaveAttribute('aria-pressed', 'true')
      await expect(nav.locator('button[aria-label="Choose repository"]')).toHaveCount(1)
      expect(await pickerElement?.evaluate(element => element.isConnected)).toBe(true)
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320)
      expect(await repository.evaluate(element => element.scrollWidth - element.clientWidth)).toBeLessThanOrEqual(1)
      await expect(repository).toBeVisible()
    }
  }

  await expect(page).toHaveNoViolations()
  await container.evaluate(element => {
    element.style.width = '280px'
    element.style.marginLeft = '0px'
  })
  await expect(nav.getByRole('link', {name: 'Owner'})).toBeVisible()
  await expect(picker).toBeFocused()
  await expect(picker).toHaveAttribute('aria-pressed', 'true')
  expect(await pickerElement?.evaluate(element => element.isConnected)).toBe(true)
})

test('a short repository link has a usable target next to its picker @aat', async ({page}) => {
  await page.setViewportSize({width: 320, height: 600})
  await visit(page, {id: 'react-tailwind-navigation-breadcrumbs-features--short-repository-targets'})

  for (const variant of ['normal', 'spacious']) {
    for (const overflow of ['wrap', 'menu', 'menu-with-root']) {
      const nav = page.getByRole('navigation', {name: `${variant} ${overflow} breadcrumbs`})
      const container = page.getByTestId(`${variant}-${overflow}-breadcrumb-container`)
      const repository = nav.getByRole('link', {name: 'i', exact: true})
      const picker = nav.getByRole('button', {name: 'Choose repository'})

      for (const direction of ['ltr', 'rtl']) {
        await nav.evaluate((element, value) => element.setAttribute('dir', value), direction)
        for (const width of [180, 64]) {
          await container.evaluate((element, value) => (element.style.width = `${value}px`), width)
          if (overflow !== 'wrap') {
            const trigger = nav.getByRole('button', {name: '1 more breadcrumb items'})
            if (width === 64) await expect(trigger).toBeVisible()
            else await expect(trigger).toHaveCount(0)
          }
          await repository.scrollIntoViewIfNeeded()
          const bounds = await repository.boundingBox()
          const pickerBounds = await picker.boundingBox()
          const navBounds = await nav.boundingBox()
          if (!bounds || !pickerBounds || !navBounds)
            throw new Error('Expected the breadcrumbs and controls to have bounds')
          expect(bounds.width).toBeGreaterThanOrEqual(24)
          expect(bounds.height).toBeGreaterThanOrEqual(24)
          const overlapX = Math.max(
            0,
            Math.min(bounds.x + bounds.width, pickerBounds.x + pickerBounds.width) - Math.max(bounds.x, pickerBounds.x),
          )
          const overlapY = Math.max(
            0,
            Math.min(bounds.y + bounds.height, pickerBounds.y + pickerBounds.height) -
              Math.max(bounds.y, pickerBounds.y),
          )
          expect(overlapX * overlapY).toBe(0)
          for (const child of [bounds, pickerBounds]) {
            expect(child.x).toBeGreaterThanOrEqual(navBounds.x - 1)
            expect(child.x + child.width).toBeLessThanOrEqual(navBounds.x + navBounds.width + 1)
          }
          await expect(repository).toBeVisible()
          await expect(picker).toBeVisible()
          await page.evaluate(() => history.replaceState(null, '', location.pathname + location.search))
          const linkX = direction === 'ltr' ? bounds.x + bounds.width - 2 : bounds.x + 2
          await page.mouse.click(linkX, bounds.y + bounds.height / 2)
          await expect(page).toHaveURL(/#repository$/)
          const wasPressed = await picker.getAttribute('aria-pressed')
          await picker.click()
          await expect(picker).toHaveAttribute('aria-pressed', wasPressed === 'true' ? 'false' : 'true')
          expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320)
        }
      }
    }
  }
})

test('a short breadcrumb link and picker retain minimum targets with smaller root text @aat', async ({page}) => {
  await page.setViewportSize({width: 320, height: 600})
  await visit(page, {id: 'react-tailwind-navigation-breadcrumbs-features--short-repository-targets'})
  for (const rootSize of [12, 16]) {
    await page.evaluate(value => {
      document.documentElement.style.fontSize = `${value}px`
    }, rootSize)
    for (const variant of ['normal', 'spacious']) {
      for (const overflow of ['wrap', 'menu', 'menu-with-root']) {
        const nav = page.getByRole('navigation', {name: `${variant} ${overflow} breadcrumbs`})
        const repository = nav.getByRole('link', {name: 'i', exact: true})
        const picker = nav.getByRole('button', {name: 'Choose repository'})
        for (const direction of ['ltr', 'rtl']) {
          await nav.evaluate((element, value) => element.setAttribute('dir', value), direction)
          for (const target of [repository, picker]) {
            const bounds = await target.boundingBox()
            if (!bounds) throw new Error('Expected the breadcrumb control to have bounds')
            expect(bounds.width).toBeGreaterThanOrEqual(28)
            expect(bounds.height).toBeGreaterThanOrEqual(28)
            await expectTargetHitSquare(target)
          }
        }
      }
    }
  }
})

test('wrapped breadcrumbs stay within a narrow container when text grows @aat', async ({page}) => {
  await page.setViewportSize({width: 320, height: 600})
  await visit(page, {id: 'react-tailwind-navigation-breadcrumbs-features--short-repository-targets'})

  for (const rootSize of [20, 32]) {
    await page.evaluate(value => {
      document.documentElement.style.fontSize = `${value}px`
    }, rootSize)
    for (const variant of ['normal', 'spacious']) {
      const nav = page.getByRole('navigation', {name: `${variant} wrap breadcrumbs`})
      const container = page.getByTestId(`${variant}-wrap-breadcrumb-container`)
      const controls = nav.locator('[data-breadcrumb-visible] a, [data-breadcrumb-visible] button')

      for (const direction of ['ltr', 'rtl']) {
        await nav.evaluate((element, value) => element.setAttribute('dir', value), direction)
        for (const width of [64, 180]) {
          await container.evaluate((element, value) => {
            element.style.width = `${value}px`
          }, width)
          await expect
            .poll(async () =>
              nav.evaluate(element => {
                const navBounds = element.getBoundingClientRect()
                const children = [
                  ...element.querySelectorAll('[data-breadcrumb-visible] a, [data-breadcrumb-visible] button'),
                ]
                return Math.max(
                  element.scrollWidth - element.clientWidth,
                  ...children.flatMap(child => {
                    const bounds = child.getBoundingClientRect()
                    return [navBounds.left - bounds.left, bounds.right - navBounds.right]
                  }),
                )
              }),
            )
            .toBeLessThanOrEqual(1)
          await expect(controls).toHaveCount(3)
          for (const control of await controls.all()) await expectTargetHitSquare(control)
        }
      }
    }
  }
})

test('the overflow trigger retains a usable target as root text changes @aat', async ({page}) => {
  await page.setViewportSize({width: 320, height: 600})
  await visit(page, {id: 'react-tailwind-navigation-breadcrumbs-features--short-repository-targets'})

  for (const rootSize of [8, 12, 16, 20]) {
    await page.evaluate(value => {
      document.documentElement.style.fontSize = `${value}px`
    }, rootSize)
    for (const variant of ['normal', 'spacious']) {
      for (const overflow of ['menu', 'menu-with-root']) {
        const nav = page.getByRole('navigation', {name: `${variant} ${overflow} breadcrumbs`})
        const container = page.getByTestId(`${variant}-${overflow}-breadcrumb-container`)
        await container.evaluate(element => {
          element.style.width = '64px'
        })
        const trigger = nav.getByRole('button', {name: /more breadcrumb items/})
        for (const direction of ['ltr', 'rtl']) {
          await nav.evaluate((element, value) => element.setAttribute('dir', value), direction)
          await expect(trigger).toBeVisible()
          const bounds = await trigger.boundingBox()
          if (!bounds) throw new Error('Expected the overflow trigger to have bounds')
          expect(bounds.width).toBeGreaterThanOrEqual(28)
          expect(bounds.height).toBeGreaterThanOrEqual(28)
          await expectTargetHitSquare(trigger)
        }
      }
    }
  }
})

test('a changing overflow trigger width recalculates the visible root without losing focus @aat', async ({page}) => {
  await page.setViewportSize({width: 1280, height: 720})
  await visit(page, {id: 'react-tailwind-navigation-breadcrumbs-features--overflow-menu-with-root'})
  const nav = page.getByRole('navigation', {name: 'Breadcrumbs'})
  await nav.evaluate(element => {
    element.style.width = '300px'
  })
  const trigger = nav.getByRole('button', {name: /more breadcrumb items/})

  for (const direction of ['ltr', 'rtl']) {
    await nav.evaluate((element, value) => element.setAttribute('dir', value), direction)
    await expect(trigger).toHaveAttribute('aria-label', '4 more breadcrumb items')
    const root = nav.getByRole('link', {name: 'github', exact: true})
    await expect(root).toBeVisible()
    await root.focus()
    await expect(root).toBeFocused()
    const original = await trigger.elementHandle()
    if (!original) throw new Error('Expected the overflow trigger to exist')

    await trigger.evaluate(element => element.style.setProperty('--base-size-4', '20px'))
    await expect(trigger).toHaveAttribute('aria-label', '5 more breadcrumb items')
    await expect(root).toHaveCount(0)
    await expect(trigger).toBeFocused()
    expect(await trigger.evaluate((element, previous) => element === previous, original)).toBe(true)

    await page.keyboard.press('Enter')
    const menu = page.getByRole('menu')
    await expect(page.getByRole('menuitem', {name: 'github', exact: true})).toBeFocused()
    await original.evaluate(element => element.style.removeProperty('--base-size-4'))
    await expect(trigger).toHaveAttribute('aria-label', '4 more breadcrumb items')
    await expect(root).toBeVisible()
    await expect(menu).toBeVisible()
    expect(await menu.evaluate(element => element.contains(element.ownerDocument.activeElement))).toBe(true)
    await page.keyboard.press('Escape')
    await expect(trigger).toBeFocused()
    expect(await trigger.evaluate((element, previous) => element === previous, original)).toBe(true)
  }
})

test('a very long repository name reflows with text spacing in an offset container @aat', async ({page}) => {
  await page.setViewportSize({width: 320, height: 256})
  await visit(page, {id: 'react-tailwind-navigation-breadcrumbs-features--dynamic-repository'})
  const nav = page.getByRole('navigation', {name: 'Breadcrumbs'})
  const container = page.getByTestId('repository-breadcrumb-container')
  const picker = nav.getByRole('button', {name: 'Choose repository'})
  const pickerElement = await picker.elementHandle()
  await container.evaluate(element => {
    element.style.width = '180px'
    element.style.marginLeft = '64px'
  })
  await page.addStyleTag({
    content:
      '[data-component="Breadcrumbs"] * { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; }',
  })
  await picker.click()
  await activateWithoutPointerFocus(page.getByRole('button', {name: 'Use very long repository name'}))
  const repository = nav.getByRole('link', {name: 'r'.repeat(77)})

  for (const overflow of ['menu', 'wrap']) {
    if (overflow === 'wrap') {
      await activateWithoutPointerFocus(page.getByRole('button', {name: 'Toggle overflow mode'}))
    }
    for (const direction of ['ltr', 'rtl']) {
      await nav.evaluate((element, value) => element.setAttribute('dir', value), direction)
      const trigger = nav.getByRole('button', {name: '1 more breadcrumb items'})
      if (overflow === 'menu') await expect(trigger).toBeVisible()
      else await expect(trigger).toHaveCount(0)
      await expect(repository).toBeVisible()
      await expect
        .poll(async () =>
          nav.evaluate(element => {
            const navBounds = element.getBoundingClientRect()
            const leaf = element.querySelector<HTMLElement>('[data-breadcrumb-live-leaf]')
            const link = leaf?.querySelector('a')
            const button = leaf?.querySelector('button')
            if (!link || !button) throw new Error('Expected a repository link and picker')
            return Math.max(
              element.scrollWidth - element.clientWidth,
              ...[link, button].flatMap(child => {
                const bounds = child.getBoundingClientRect()
                return [navBounds.left - bounds.left, bounds.right - navBounds.right]
              }),
            )
          }),
        )
        .toBeLessThanOrEqual(1)
      expect(await repository.evaluate(element => element.scrollWidth - element.clientWidth)).toBeLessThanOrEqual(1)
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320)
      await expect(picker).toBeFocused()
      await expect(picker).toHaveAttribute('aria-pressed', 'true')
      await expect(nav.locator('button[aria-label="Choose repository"]')).toHaveCount(1)
      expect(await pickerElement?.evaluate(element => element.isConnected)).toBe(true)
    }
  }
})

test('a single repository picker mounts once and reflows in a narrow container @aat', async ({page}) => {
  await page.setViewportSize({width: 320, height: 256})
  await visit(page, {id: 'react-tailwind-navigation-breadcrumbs-features--single-repository'})
  const nav = page.getByRole('navigation', {name: 'Breadcrumbs'})
  const picker = nav.getByRole('button', {name: 'Choose repository'})
  const pickerElement = await picker.elementHandle()
  await page.getByTestId('repository-breadcrumb-container').evaluate(element => {
    element.style.width = '180px'
    element.style.marginLeft = '64px'
  })
  await picker.click()
  await activateWithoutPointerFocus(page.getByRole('button', {name: 'Use very long repository name'}))
  const repository = nav.getByRole('link', {name: 'r'.repeat(77)})
  await expect(repository).toBeVisible()
  await expect(nav.locator('button[aria-label="Choose repository"]')).toHaveCount(1)
  await expect(picker).toBeFocused()
  await expect(picker).toHaveAttribute('aria-pressed', 'true')
  expect(await pickerElement?.evaluate(element => element.isConnected)).toBe(true)
  expect(
    await nav.evaluate(element => {
      const bounds = element.getBoundingClientRect()
      const children = [
        ...element.querySelectorAll<HTMLElement>('[data-breadcrumb-visible] a, [data-breadcrumb-visible] button'),
      ]
      return Math.max(
        ...children.flatMap(child => {
          const childBounds = child.getBoundingClientRect()
          return [bounds.left - childBounds.left, childBounds.right - bounds.right]
        }),
      )
    }),
  ).toBeLessThanOrEqual(1)
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320)
})

test('focus survives transitions between one and multiple breadcrumb items @aat', async ({page}) => {
  await page.setViewportSize({width: 320, height: 600})
  await visit(page, {id: 'react-tailwind-navigation-breadcrumbs-features--dynamic-repository'})
  const nav = page.getByRole('navigation', {name: 'Breadcrumbs'})
  const picker = nav.getByRole('button', {name: 'Choose repository'})
  const pickerElement = await picker.elementHandle()
  const toggle = page.getByRole('button', {name: 'Toggle owner'})
  await page.getByTestId('repository-breadcrumb-container').evaluate(element => {
    element.style.width = '180px'
  })
  await activateWithoutPointerFocus(page.getByRole('button', {name: 'Use longer repository name'}))
  const repository = nav.getByRole('link', {name: 'longer-repository-name'})
  const trigger = nav.getByRole('button', {name: '1 more breadcrumb items'})

  await trigger.focus()
  await activateWithoutPointerFocus(toggle)
  await expect(repository).toBeFocused()
  await activateWithoutPointerFocus(toggle)
  await expect(trigger).toBeVisible()
  await expect(repository).toBeFocused()
  expect(await pickerElement?.evaluate(element => element.isConnected)).toBe(true)

  await trigger.focus()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('menuitem', {name: 'Owner'})).toBeFocused()
  await activateWithoutPointerFocus(toggle)
  await expect(repository).toBeFocused()

  await activateWithoutPointerFocus(toggle)
  await expect(trigger).toBeVisible()
  await toggle.focus()
  await activateWithoutPointerFocus(toggle)
  await expect(toggle).toBeFocused()
  expect(await pickerElement?.evaluate(element => element.isConnected)).toBe(true)
})

test('focus stays outside when a previously focused breadcrumb is removed @aat', async ({page}) => {
  await page.setViewportSize({width: 320, height: 600})
  await visit(page, {id: 'react-tailwind-navigation-breadcrumbs-features--dynamic-repository'})
  const nav = page.getByRole('navigation', {name: 'Breadcrumbs'})
  await page.getByTestId('repository-breadcrumb-container').evaluate(element => {
    element.style.width = '180px'
  })
  await activateWithoutPointerFocus(page.getByRole('button', {name: 'Use longer repository name'}))
  await nav.getByRole('button', {name: '1 more breadcrumb items'}).focus()
  await page.mouse.click(310, 590)
  expect(await page.evaluate(() => document.activeElement === document.body)).toBe(true)

  await activateWithoutPointerFocus(page.getByRole('button', {name: 'Toggle owner'}))
  await expect.poll(() => page.evaluate(() => document.activeElement === document.body)).toBe(true)
})

test('focus recovery skips hidden and disabled custom content @aat', async ({page}) => {
  await page.setViewportSize({width: 320, height: 600})
  await visit(page, {id: 'react-tailwind-navigation-breadcrumbs-features--focus-recovery-hidden-targets'})
  const nav = page.getByRole('navigation', {name: 'Breadcrumbs'})
  await page.getByTestId('repository-breadcrumb-container').evaluate(element => {
    element.style.width = '180px'
  })
  await activateWithoutPointerFocus(page.getByRole('button', {name: 'Use longer repository name'}))
  await nav.getByRole('button', {name: '1 more breadcrumb items'}).focus()
  await activateWithoutPointerFocus(page.getByRole('button', {name: 'Toggle owner'}))
  await expect(nav.getByRole('link', {name: 'longer-repository-name'})).toBeFocused()
})

test('a retained final breadcrumb reflows in menu-with-root mode @aat', async ({page}) => {
  await page.setViewportSize({width: 320, height: 600})
  await visit(page, {id: 'react-tailwind-navigation-breadcrumbs-features--overflow-menu-with-root'})
  const nav = page.getByRole('navigation', {name: 'Breadcrumbs'})
  await nav.evaluate(element => {
    element.style.width = '180px'
    element.style.marginLeft = '120px'
  })
  const current = nav.getByRole('link', {name: 'global-navigation-reviewers'})
  for (const direction of ['ltr', 'rtl']) {
    await nav.evaluate((element, value) => element.setAttribute('dir', value), direction)
    await expect(current).toBeVisible()
    await expect
      .poll(async () => {
        const navBounds = await nav.boundingBox()
        const currentBounds = await current.boundingBox()
        if (!navBounds || !currentBounds) throw new Error('Expected visible breadcrumb bounds')
        return Math.max(
          navBounds.x - currentBounds.x,
          currentBounds.x + currentBounds.width - navBounds.x - navBounds.width,
        )
      })
      .toBeLessThanOrEqual(1)
    const measuredWidths = await nav
      .locator('[data-breadcrumb-measurement] > li')
      .evaluateAll(items => items.map(item => item.getBoundingClientRect().width))
    expect(measuredWidths).toHaveLength(5)
    expect(measuredWidths.every(width => width > 0)).toBe(true)
    expect(measuredWidths.at(-1)).toBeGreaterThan(150)
    expect(await current.evaluate(element => element.scrollWidth - element.clientWidth)).toBeLessThanOrEqual(1)
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320)
  }
})

test('focus follows a breadcrumb into and out of overflow after its width changes @aat', async ({page}) => {
  await page.setViewportSize({width: 320, height: 600})
  await visit(page, {id: 'react-tailwind-navigation-breadcrumbs-features--dynamic-repository'})
  const nav = page.getByRole('navigation', {name: 'Breadcrumbs'})
  const owner = nav.getByRole('link', {name: 'Owner'})
  await owner.focus()

  await activateWithoutPointerFocus(page.getByRole('button', {name: 'Use longer repository name'}))
  const trigger = nav.getByRole('button', {name: '1 more breadcrumb items'})
  await expect(trigger).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('menuitem', {name: 'Owner'})).toBeFocused()

  await page.getByTestId('repository-breadcrumb-container').evaluate(element => {
    element.style.width = '600px'
  })
  await expect(trigger).toHaveCount(0)
  await expect(owner).toBeFocused()
})

test('a later blur cancels focus recovery scheduled by a resize @aat', async ({page}) => {
  await page.addInitScript(() => {
    const NativeResizeObserver = window.ResizeObserver
    window.ResizeObserver = class extends NativeResizeObserver {
      constructor(callback: ResizeObserverCallback) {
        super((entries, observer) => {
          callback(entries, observer)
          if (
            document.documentElement.hasAttribute('data-blur-after-breadcrumb-resize') &&
            entries.some(entry => entry.target.closest('[data-component="Breadcrumbs"]'))
          ) {
            document.documentElement.removeAttribute('data-blur-after-breadcrumb-resize')
            if (document.activeElement instanceof HTMLElement) {
              document.documentElement.setAttribute(
                'data-blurred-breadcrumb-target',
                document.activeElement.textContent.trim(),
              )
              document.body.setAttribute('tabindex', '-1')
              document.body.focus()
              document.body.removeAttribute('tabindex')
            }
          }
        })
      }
    }
  })
  await page.setViewportSize({width: 320, height: 600})
  await visit(page, {id: 'react-tailwind-navigation-breadcrumbs-features--dynamic-repository'})
  const nav = page.getByRole('navigation', {name: 'Breadcrumbs'})
  await page.getByTestId('repository-breadcrumb-container').evaluate(element => {
    element.style.width = '180px'
  })
  await nav.getByRole('link', {name: 'Owner'}).focus()
  await page.evaluate(() => {
    document.documentElement.setAttribute('data-blur-after-breadcrumb-resize', '')
  })
  await activateWithoutPointerFocus(page.getByRole('button', {name: 'Use longer repository name'}))
  await expect(nav.getByRole('button', {name: '1 more breadcrumb items'})).toBeVisible()
  await expect
    .poll(() => page.evaluate(() => document.documentElement.getAttribute('data-blurred-breadcrumb-target')))
    .toBe('Owner')
  await expect.poll(() => page.evaluate(() => document.activeElement === document.body)).toBe(true)
})

test('focus follows an overflow control when switching to wrap mode @aat', async ({page}) => {
  await page.setViewportSize({width: 320, height: 600})
  await visit(page, {id: 'react-tailwind-navigation-breadcrumbs-features--dynamic-repository'})
  const nav = page.getByRole('navigation', {name: 'Breadcrumbs'})
  const toggle = page.getByRole('button', {name: 'Toggle overflow mode'})
  await page.getByTestId('repository-breadcrumb-container').evaluate(element => {
    element.style.width = '180px'
  })
  await activateWithoutPointerFocus(page.getByRole('button', {name: 'Use longer repository name'}))
  const trigger = nav.getByRole('button', {name: '1 more breadcrumb items'})
  await trigger.focus()

  await activateWithoutPointerFocus(toggle)
  await expect(nav.getByRole('link', {name: 'Owner'})).toBeFocused()
  await activateWithoutPointerFocus(toggle)
  await expect(trigger).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('menuitem', {name: 'Owner'})).toBeFocused()

  await activateWithoutPointerFocus(toggle)
  await expect(nav.getByRole('link', {name: 'Owner'})).toBeFocused()
  await toggle.focus()
  await activateWithoutPointerFocus(toggle)
  await expect(toggle).toBeFocused()

  await trigger.focus()
  await page.mouse.click(310, 590)
  expect(await page.evaluate(() => document.activeElement === document.body)).toBe(true)
  await activateWithoutPointerFocus(toggle)
  await expect.poll(() => page.evaluate(() => document.activeElement === document.body)).toBe(true)
})

test('opening the overflow control can be canceled by dragging away @aat', async ({page}) => {
  await page.setViewportSize({width: 320, height: 600})
  await visit(page, {id: 'react-tailwind-navigation-breadcrumbs-features--dynamic-repository'})
  await page.getByTestId('repository-breadcrumb-container').evaluate(element => {
    element.style.width = '180px'
  })
  await activateWithoutPointerFocus(page.getByRole('button', {name: 'Use longer repository name'}))
  const trigger = page.getByRole('button', {name: '1 more breadcrumb items'})
  const bounds = await trigger.boundingBox()
  if (!bounds) throw new Error('Expected the overflow control to be visible')

  await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2)
  await page.mouse.down()
  await page.mouse.move(310, 590)
  await page.mouse.up()
  await expect(page.getByRole('menu')).toHaveCount(0)
  await expect(trigger).toHaveAttribute('aria-expanded', 'false')
})

test('focus remains in an open overflow menu when its focused item becomes visible @aat', async ({page}) => {
  await page.setViewportSize({width: 800, height: 600})
  await visit(page, {id: 'react-tailwind-navigation-breadcrumbs-features--overflow-menu'})
  const nav = page.getByRole('navigation', {name: 'Breadcrumbs'})
  await nav.evaluate(element => {
    element.style.width = '180px'
  })

  const trigger = nav.getByRole('button', {name: '6 more breadcrumb items'})
  await trigger.focus()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('menuitem', {name: 'Home'})).toBeFocused()
  await page.keyboard.press('End')
  await expect(page.getByRole('menuitem', {name: 'Details'})).toBeFocused()

  await nav.evaluate(element => {
    element.style.width = '700px'
  })
  await expect(nav.getByRole('button', {name: '3 more breadcrumb items'})).toBeVisible()
  await expect(page.getByRole('menuitem', {name: 'Category'})).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(nav.getByRole('button', {name: '3 more breadcrumb items'})).toBeFocused()
})

test('focus recovery skips an unavailable overflow item after resizing @aat', async ({page}) => {
  await page.setViewportSize({width: 800, height: 600})
  await visit(page, {id: 'react-tailwind-navigation-breadcrumbs-features--overflow-menu'})
  const nav = page.getByRole('navigation', {name: 'Breadcrumbs'})
  await nav.evaluate(element => {
    element.style.width = '180px'
  })

  await nav.getByRole('button', {name: '6 more breadcrumb items'}).focus()
  await page.keyboard.press('Enter')
  await page.getByRole('menuitem', {name: 'Details', exact: true}).focus()
  await page.getByRole('menuitem', {name: 'Category', exact: true}).evaluate(element => {
    element.style.display = 'none'
  })

  await nav.evaluate(element => {
    element.style.width = '700px'
  })
  await expect(nav.getByRole('button', {name: '3 more breadcrumb items'})).toBeVisible()
  await expect(page.getByRole('menuitem', {name: 'Products', exact: true})).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(nav.getByRole('button', {name: '3 more breadcrumb items'})).toBeFocused()
})

test('focus remains on the menu when all remaining overflow items are unavailable @aat', async ({page}) => {
  await page.setViewportSize({width: 800, height: 600})
  await visit(page, {id: 'react-tailwind-navigation-breadcrumbs-features--overflow-menu'})
  const nav = page.getByRole('navigation', {name: 'Breadcrumbs'})
  await nav.evaluate(element => {
    element.style.width = '180px'
  })

  await nav.getByRole('button', {name: '6 more breadcrumb items'}).focus()
  await page.keyboard.press('Enter')
  await page.getByRole('menuitem', {name: 'Details', exact: true}).focus()
  for (const name of ['Home', 'Products', 'Category']) {
    await page.getByRole('menuitem', {name, exact: true}).evaluate(element => {
      element.setAttribute('aria-disabled', 'true')
    })
  }

  await nav.evaluate(element => {
    element.style.width = '700px'
  })
  await expect(nav.getByRole('button', {name: '3 more breadcrumb items'})).toBeVisible()
  await expect(page.getByRole('menu')).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(nav.getByRole('button', {name: '3 more breadcrumb items'})).toBeFocused()
})

test.fixme('rapid End after opening a resized overflow menu reaches the last item @aat', async ({page}) => {
  await page.setViewportSize({width: 800, height: 600})
  await visit(page, {id: 'react-tailwind-navigation-breadcrumbs-features--overflow-menu'})
  const nav = page.getByRole('navigation', {name: 'Breadcrumbs'})
  await nav.evaluate(element => {
    element.style.width = '180px'
  })

  await nav.getByRole('button', {name: '6 more breadcrumb items'}).focus()
  await page.keyboard.press('Enter')
  await page.keyboard.press('End')
  await expect(page.getByRole('menuitem', {name: 'Details'})).toBeFocused()
})
