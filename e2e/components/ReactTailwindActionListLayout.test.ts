import path from 'node:path'
import {expect, test, type Locator, type Page} from '@playwright/test'
import {source, type AxeResults, type run} from 'axe-core'
import {buildReactTailwindFixture, reactTailwindPackageRoot} from '../test-helpers/react-tailwind-fixture'

type AxeWindow = Window & {axe?: {run: typeof run}}

let fixtureScript: string

test.beforeAll(async () => {
  fixtureScript = await buildReactTailwindFixture('script/action-list-layout-browser.tsx')
})

async function loadFixture(page: Page, direction: 'ltr' | 'rtl', withoutResizeObserver = false) {
  await page.setViewportSize({width: 320, height: 480})
  await page.goto('about:blank?id=action-list-layout')
  await page.evaluate(
    ({dir, withoutObserver}) => {
      document.documentElement.lang = 'en'
      document.documentElement.dir = dir
      document.title = 'Action item layouts'
      if (withoutObserver) Object.defineProperty(window, 'ResizeObserver', {value: undefined, configurable: true})
      const root = document.createElement('main')
      root.id = 'root'
      document.body.append(root)
    },
    {dir: direction, withoutObserver: withoutResizeObserver},
  )
  await page.addStyleTag({path: path.join(reactTailwindPackageRoot, 'dist/styles.css')})
  await page.addScriptTag({content: fixtureScript})
}

async function expectTextToFit(row: Locator, hasDescription = true) {
  const geometry = await row.evaluate((element, descriptionExpected) => {
    const rowBounds = element.getBoundingClientRect()
    function textRects(selector: string, required = true) {
      const part = element.querySelector(selector)
      if (!part) {
        if (required) throw new Error(`Missing item part: ${selector}`)
        return []
      }
      const range = document.createRange()
      range.selectNodeContents(part)
      return Array.from(range.getClientRects(), rect => ({
        left: rect.left,
        right: rect.right,
        top: rect.top,
        bottom: rect.bottom,
      })).filter(rect => rect.right > rect.left && rect.bottom > rect.top)
    }
    return {
      row: {left: rowBounds.left, right: rowBounds.right, top: rowBounds.top, bottom: rowBounds.bottom},
      label: textRects('[data-item-label]'),
      description: textRects('[data-component="ActionList.Description"]', descriptionExpected),
      trailing: textRects('[data-testid="long-trailing"]'),
    }
  }, hasDescription)

  for (const [part, rects] of Object.entries({
    label: geometry.label,
    ...(hasDescription ? {description: geometry.description} : {}),
    trailing: geometry.trailing,
  })) {
    expect(rects.length).toBeGreaterThan(0)
    for (const rect of rects) {
      expect(rect.left, `${part} escapes the start of ${JSON.stringify(geometry.row)}`).toBeGreaterThanOrEqual(
        geometry.row.left - 1,
      )
      expect(rect.right, `${part} escapes the end of ${JSON.stringify(geometry.row)}`).toBeLessThanOrEqual(
        geometry.row.right + 1,
      )
      expect(rect.top, `${part} escapes the top of ${JSON.stringify(geometry.row)}`).toBeGreaterThanOrEqual(
        geometry.row.top - 1,
      )
      expect(rect.bottom, `${part} escapes the bottom of ${JSON.stringify(geometry.row)}`).toBeLessThanOrEqual(
        geometry.row.bottom + 1,
      )
    }
    expect(
      geometry.trailing.length,
      'the trailing text should not collapse into a character-wide column',
    ).toBeLessThanOrEqual(10)
  }
  for (const main of [...geometry.label, ...geometry.description]) {
    for (const trailing of geometry.trailing) {
      expect(
        main.left < trailing.right &&
          main.right > trailing.left &&
          main.top < trailing.bottom &&
          main.bottom > trailing.top,
      ).toBe(false)
    }
  }
}

async function firstVisibleItem(container: Locator) {
  return container.evaluate(element => {
    const viewport = element.getBoundingClientRect()
    const row = Array.from(element.querySelectorAll<HTMLElement>('[data-component="FilteredActionList.Item"]')).find(
      option => {
        const bounds = option.getBoundingClientRect()
        return bounds.bottom > viewport.top && bounds.top < viewport.bottom
      },
    )
    return row ? {index: row.getAttribute('data-index'), offset: row.getBoundingClientRect().top - viewport.top} : null
  })
}

for (const direction of ['ltr', 'rtl'] as const) {
  test(`item text reflows without overlap in shared layouts at 320 pixels (${direction}) @aat`, async ({page}) => {
    await loadFixture(page, direction)
    for (const name of ['static-row', 'action-row', 'block-row', 'nav-row', 'nav-leading-row']) {
      await test.step(name, () => expectTextToFit(page.getByTestId(name)))
    }
    for (const name of ['nav-row', 'nav-leading-row', 'nav-short-row']) {
      const bounds = await page.getByTestId(name).evaluate(element => {
        const nav = element.closest('nav')
        if (!nav) throw new Error('Navigation item has no navigation container')
        const itemBounds = element.getBoundingClientRect()
        const navBounds = nav.getBoundingClientRect()
        return {
          itemLeft: itemBounds.left,
          itemRight: itemBounds.right,
          navLeft: navBounds.left,
          navRight: navBounds.right,
        }
      })
      expect(bounds.itemLeft).toBeGreaterThanOrEqual(bounds.navLeft - 1)
      expect(bounds.itemRight).toBeLessThanOrEqual(bounds.navRight + 1)
    }
    for (const name of ['action-row', 'nav-row', 'nav-leading-row']) {
      const item = page.getByTestId(name)
      await expect(item).toHaveAccessibleName('Primer React EnterprisePolicyBlocksThisRepositoryWithoutAnySpaces')
      await expect(item).toHaveAccessibleDescription('Owned by an organization with additional review requirements')
    }
    const filteredList = page.getByTestId('regular-filtered')
    const filteredOption = filteredList.getByRole('option', {name: /Primer React/})
    await expectTextToFit(filteredOption)
    await expect(filteredOption).toHaveAccessibleName(
      'Primer React EnterprisePolicyBlocksThisRepositoryWithoutAnySpaces',
    )
    await expect(filteredOption).toHaveAccessibleDescription(
      'Owned by an organization with additional review requirements',
    )
    await expectTextToFit(
      page.getByTestId('virtual-filtered').locator('[data-component="FilteredActionList.Item"]').first(),
      false,
    )
    await expect(page.getByTestId('virtual-filtered').getByRole('option')).toHaveCount(30)
    await page.getByTestId('action-row').click()
    await expect(page.getByTestId('action-result')).toHaveText('action')

    await filteredList.getByRole('combobox', {name: 'Filter items'}).focus()
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('Enter')
    await expect(page.getByTestId('selection-result')).toHaveText('filtered:repository')

    await page.getByRole('button', {name: 'Open layout menu'}).click()
    const menuItem = page.getByTestId('menu-row')
    await expectTextToFit(menuItem)
    await expect(menuItem).toHaveAccessibleName('Primer React EnterprisePolicyBlocksThisRepositoryWithoutAnySpaces')
    await expect(menuItem).toHaveAccessibleDescription('Owned by an organization with additional review requirements')
    await menuItem.click()
    await expect(page.getByTestId('action-result')).toHaveText('menu')

    await page.getByRole('button', {name: 'Open layout picker'}).click()
    const pickerOption = page.locator('[data-component="SelectPanel.Item"]')
    await expectTextToFit(pickerOption)
    await expect(pickerOption).toHaveAccessibleName('Primer React EnterprisePolicyBlocksThisRepositoryWithoutAnySpaces')
    await expect(pickerOption).toHaveAccessibleDescription(
      'Owned by an organization with additional review requirements',
    )
    await pickerOption.click()
    await expect(page.getByTestId('selection-result')).toHaveText('picker:repository')
  })

  test(`keyboard access to oversized option content (${direction}) @aat`, async ({page, browserName}) => {
    await loadFixture(page, direction)
    const list = page.getByTestId('oversized-filtered')
    const container = list.locator('[data-component="FilteredActionList.Container"]')
    const input = list.getByRole('combobox', {name: 'Filter items'})
    const dimensions = await container.evaluate(element => ({
      clientHeight: element.clientHeight,
      scrollHeight: element.scrollHeight,
    }))
    expect(dimensions.scrollHeight).toBeGreaterThan(dimensions.clientHeight)
    await input.focus()
    await page.keyboard.press('ArrowDown')
    const initialScrollTop = await container.evaluate(element => element.scrollTop)
    await page.keyboard.press('PageDown')
    await page.keyboard.press('End')
    expect(await container.evaluate(element => element.scrollTop)).toBe(initialScrollTop)
    await page.keyboard.press('Tab')
    if (browserName === 'webkit') {
      expect(await container.evaluate(element => document.activeElement === element)).toBe(false)
      await page.keyboard.press('PageDown')
      expect(await container.evaluate(element => element.scrollTop)).toBe(initialScrollTop)
      test.fail(
        true,
        'Automated WebKit does not put the scroll container in the Tab order; the interaction needs specialist review.',
      )
    }
    expect(await container.evaluate(element => document.activeElement === element)).toBe(true)
    await page.keyboard.press('PageDown')
    await expect.poll(() => container.evaluate(element => element.scrollTop)).toBeGreaterThan(initialScrollTop)
  })

  test(`axe identifies only the known scrolling gap (${direction}) @aat`, async ({page}) => {
    await loadFixture(page, direction)
    await page.evaluate(source)
    await page.addScriptTag({path: require.resolve('@github/axe-github/configure-browser')})
    const results: AxeResults = await page.evaluate(() => {
      const axe = (window as AxeWindow).axe
      if (!axe) throw new Error('Expected axe to be installed in the browser fixture')
      return axe.run(
        {exclude: [['[data-base-ui-focus-guard]']]},
        {
          rules: {
            'document-title': {enabled: false},
            'html-has-lang': {enabled: false},
            'landmark-one-main': {enabled: false},
            'page-has-heading-one': {enabled: false},
            region: {enabled: false},
            'avoid-both-disabled-and-aria-disabled': {enabled: true},
            'color-contrast': {enabled: true},
          },
        },
      )
    })
    expect(results.violations.map(violation => violation.id)).toEqual(['scrollable-region-focusable'])
    const targets = results.violations[0].nodes.map(node => node.target.join(' '))
    const knownContainers = [
      'regular-filtered',
      'virtual-filtered',
      'resizable-filtered',
      'late-filtered',
      'recovery-filtered',
      'delayed-filtered',
      'oversized-filtered',
    ]
    expect(targets.some(target => target.includes('oversized-filtered'))).toBe(true)
    expect(
      targets.every(
        target =>
          target.includes('FilteredActionList.Container') &&
          knownContainers.some(container => target.includes(`data-testid="${container}"`)),
      ),
    ).toBe(true)
  })

  test(`virtual rows adapt when a trailing visual changes size (${direction}) @aat`, async ({page}) => {
    await loadFixture(page, direction)
    const list = page.getByTestId('delayed-filtered')
    const options = list.getByRole('option')
    await expect.poll(() => options.count()).toBeLessThan(80)
    await expect(list.getByTestId('delayed-visual')).toHaveText('OK')
    await page.getByTestId('load-visual').click()
    await expect(options).toHaveCount(80)
    await expect(list.getByTestId('delayed-visual')).toHaveText('EnterprisePolicyBlocksThisRepositoryWithoutAnySpaces')
    await expectTextToFit(options.first(), false)
  })

  test(`virtual rows adapt to resizing and newly visible content (${direction}) @aat`, async ({page}) => {
    await loadFixture(page, direction)
    const resizable = page.getByTestId('resizable-filtered')
    const resizableOptions = resizable.getByRole('option')
    expect(await resizableOptions.count()).toBeLessThan(80)
    const scrollContainer = resizable.locator('[data-component="FilteredActionList.Container"]')
    await scrollContainer.evaluate(element => {
      element.scrollTop = 20 * 32
      element.dispatchEvent(new Event('scroll'))
    })
    const firstVisibleRow = () => firstVisibleItem(scrollContainer)
    await expect.poll(async () => Number((await firstVisibleRow())?.index)).toBeGreaterThanOrEqual(19)
    const beforeResize = await firstVisibleRow()
    await resizable.evaluate(element => {
      element.style.width = '96px'
    })
    await expect(resizableOptions).toHaveCount(80)
    await expectTextToFit(resizableOptions.first(), false)
    const afterResize = await firstVisibleRow()
    expect(afterResize?.index).toBe(beforeResize?.index)
    expect(Math.abs(afterResize!.offset - beforeResize!.offset)).toBeLessThanOrEqual(1)

    const late = page.getByTestId('late-filtered')
    const lateOptions = late.getByRole('option')
    expect(await lateOptions.count()).toBeLessThan(80)
    const input = late.getByRole('combobox', {name: 'Filter items'})
    await input.focus()
    for (let index = 0; index < 40; index++) await page.keyboard.press('ArrowDown')
    await expect(lateOptions).toHaveCount(80)
    await expect(input).toBeFocused()
    const activeId = await input.getAttribute('aria-activedescendant')
    expect(activeId).not.toBeNull()
    const active = late.locator(`[data-component="FilteredActionList.Item"][id="${activeId}"]`)
    await expect(active).toHaveCount(1)
    await expect(active).toHaveAttribute('data-index', '39')
    const activeVisibility = await active.evaluate(element => {
      const container = element.closest('[data-component="FilteredActionList.Container"]')
      if (!container) throw new Error('Virtualized list has no scroll container')
      const row = element.getBoundingClientRect()
      const viewport = container.getBoundingClientRect()
      return {rowTop: row.top, rowBottom: row.bottom, viewportTop: viewport.top, viewportBottom: viewport.bottom}
    })
    expect(activeVisibility.rowTop).toBeGreaterThanOrEqual(activeVisibility.viewportTop - 1)
    expect(activeVisibility.rowBottom).toBeLessThanOrEqual(activeVisibility.viewportBottom + 1)
    await page.keyboard.press('Enter')
    await expect(page.getByTestId('selection-result')).toHaveText('late:late-39')
  })

  test(`virtualization recovers after toggling and item replacement (${direction}) @aat`, async ({page}) => {
    await loadFixture(page, direction)
    const recovery = page.getByTestId('recovery-filtered')
    const options = recovery.getByRole('option')
    await expect(options).toHaveCount(80)

    await recovery.evaluate(element => {
      element.style.width = '272px'
    })
    await page.getByTestId('toggle-virtualization').click()
    const scrollContainer = recovery.locator('[data-component="FilteredActionList.Container"]')
    await scrollContainer.evaluate(element => {
      element.scrollTop = 20 * 32
      element.dispatchEvent(new Event('scroll'))
    })
    const beforeVirtualization = await firstVisibleItem(scrollContainer)
    expect(Number(beforeVirtualization?.index)).toBeGreaterThanOrEqual(19)
    await page.getByTestId('toggle-virtualization').click()
    await expect.poll(() => options.count()).toBeLessThan(80)
    await expect
      .poll(async () => {
        const index = (await firstVisibleItem(scrollContainer))?.index
        return index === undefined ? Infinity : Math.abs(Number(index) - Number(beforeVirtualization?.index))
      })
      .toBeLessThanOrEqual(1)

    await page.getByTestId('replace-items').click()
    await expect(options).toHaveCount(80)
    await page.getByTestId('replace-items').click()
    await expect.poll(() => options.count()).toBeLessThan(80)
    await expect.poll(() => firstVisibleItem(scrollContainer)).not.toBeNull()
  })

  test(`falls back safely without ResizeObserver (${direction}) @aat`, async ({page}) => {
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    await loadFixture(page, direction, true)
    expect(await page.evaluate(() => typeof ResizeObserver)).toBe('undefined')
    expect(errors).toEqual([])
    const list = page.getByTestId('resizable-filtered')
    await expect(list.getByRole('option')).toHaveCount(80)
    await list.evaluate(element => {
      element.style.width = '96px'
    })
    await expectTextToFit(list.getByRole('option').first(), false)
    expect(errors).toEqual([])
  })

  test(`explicit truncation and short trailing visuals retain their layout (${direction}) @aat`, async ({page}) => {
    await loadFixture(page, direction)
    for (const name of ['truncated-row', 'wrapped-truncated-row']) {
      const description = page.getByTestId(name).locator('[data-component="ActionList.Description"]')
      const metrics = await description.evaluate(element => {
        const style = getComputedStyle(element)
        const parent = element.parentElement
        if (!parent) throw new Error('Description has no parent')
        return {
          clientWidth: element.clientWidth,
          scrollWidth: element.scrollWidth,
          overflow: style.overflow,
          textOverflow: style.textOverflow,
          whiteSpace: style.whiteSpace,
          parentClientWidth: parent.clientWidth,
          parentScrollWidth: parent.scrollWidth,
        }
      })
      expect(
        Math.max(metrics.scrollWidth - metrics.clientWidth, metrics.parentScrollWidth - metrics.parentClientWidth),
      ).toBeGreaterThan(0)
      expect(metrics).toMatchObject({overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'})
    }

    for (const name of ['short-row', 'nav-short-row']) {
      const short = page.getByTestId(name)
      const labelBounds = await short.locator('[data-item-label]').boundingBox()
      const trailingBounds = await short.getByTestId('short-trailing').boundingBox()
      expect(labelBounds).not.toBeNull()
      expect(trailingBounds).not.toBeNull()
      expect(Math.abs(labelBounds!.y - trailingBounds!.y)).toBeLessThanOrEqual(3)
    }
  })
}
