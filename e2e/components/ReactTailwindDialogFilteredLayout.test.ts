import path from 'node:path'
import {expect, test, type Page} from '@playwright/test'
import {
  buildReactTailwindFixture,
  reactTailwindHostUtilities,
  reactTailwindPackageRoot,
} from '../test-helpers/react-tailwind-fixture'

const alternateBaseUi = process.env.BASE_UI_REACT_DIR
let fixtureScript: string

test.beforeAll(async () => {
  fixtureScript = await buildReactTailwindFixture('script/dialog-filtered-layout-browser.tsx', alternateBaseUi)
})

async function loadFixture(
  page: Page,
  {
    direction,
    height,
    distinctPlaceholder = false,
    emptyState,
    fullscreen = false,
    zeroPadding = false,
    sharedLabels = false,
    stress = false,
    width = 320,
  }: {
    direction: 'ltr' | 'rtl'
    height: number
    distinctPlaceholder?: boolean
    emptyState?: 'dynamic' | 'embedded' | 'sibling'
    fullscreen?: boolean
    zeroPadding?: boolean
    sharedLabels?: boolean
    stress?: boolean
    width?: number
  },
) {
  await page.setViewportSize({width, height})
  const search = new URLSearchParams()
  if (distinctPlaceholder) search.set('placeholder', 'distinct')
  if (emptyState) search.set('empty', emptyState)
  if (fullscreen) search.set('position', 'fullscreen')
  if (zeroPadding) search.set('padding', 'zero')
  if (sharedLabels) search.set('labels', 'shared')
  if (stress) search.set('name', 'stress')
  await page.goto(`about:blank?${search}`)
  await page.evaluate(dir => {
    document.documentElement.lang = 'en'
    document.documentElement.dir = dir
    document.title = 'Assign security manager role'
    const root = document.createElement('main')
    root.id = 'root'
    document.body.append(root)
  }, direction)
  await page.addStyleTag({path: path.join(reactTailwindPackageRoot, 'dist/styles.css')})
  await page.addStyleTag({path: reactTailwindHostUtilities})
  await page.addStyleTag({
    content: `
      .Dialog_Body { height: 100%; padding: 0; }
      .Box { max-height: 100%; }
      .d-flex { display: flex; }
      .flex-column { flex-direction: column; }
      .p-4 { padding: var(--base-size-24, 24px) !important; }
      .p-0 { padding: 0 !important; }
      .Empty_Picker { height: auto; flex-shrink: 0; }
    `,
  })
  await page.addScriptTag({content: fixtureScript})
}

test('the empty-state status remains mounted as filtering changes its content @aat', async ({page}) => {
  await loadFixture(page, {direction: 'ltr', height: 480, emptyState: 'dynamic', zeroPadding: true})
  const status = page.locator('[data-component="FilteredActionList.Empty"]')
  const original = await status.elementHandle()
  if (!original) throw new Error('Expected the empty-state status')
  await expect(status).toHaveAttribute('role', 'status')
  await expect(status).toHaveAttribute('aria-live', 'polite')
  await expect(status).toBeEmpty()

  const input = page.getByRole('combobox', {name: 'Search for teams'})
  await input.fill('no matching team')
  await expect(status).toHaveText('No matching teams')
  await expect(page.getByText('0 items available')).toHaveCount(1)
  expect(await status.evaluate((node, initial) => node === initial, original)).toBe(true)
  await input.clear()
  await expect(status).toBeEmpty()
  expect(await status.evaluate((node, initial) => node === initial, original)).toBe(true)
})

for (const [width, height] of [
  [320, 256],
  [320, 480],
  [1280, 720],
] as const) {
  for (const direction of ['ltr', 'rtl'] as const) {
    test(`a suppressed empty-state has no padded footprint at ${width}×${height} (${direction}) @aat`, async ({
      page,
    }) => {
      await loadFixture(page, {direction, width, height, emptyState: 'sibling', zeroPadding: true})
      const empty = page.locator('[data-component="FilteredActionList.Empty"]')
      await expect(empty).toHaveAttribute('role', 'status')
      expect(await empty.evaluate(element => element.getBoundingClientRect().height)).toBe(0)
      const inputBounds = await page.locator('[data-component="TextInput"]').evaluate(element => {
        const header = element.closest('[data-component="FilteredActionList.Header"]')
        if (!header) throw new Error('Expected the input inside the picker header')
        const input = element.getBoundingClientRect()
        const available = header.getBoundingClientRect()
        return {
          inputLeft: input.left,
          inputRight: input.right,
          availableLeft: available.left,
          availableRight: available.right,
        }
      })
      expect(inputBounds.inputLeft).toBeGreaterThanOrEqual(inputBounds.availableLeft - 0.5)
      expect(inputBounds.inputRight).toBeLessThanOrEqual(inputBounds.availableRight + 0.5)
      await expect(page.getByText('No teams found')).toHaveCount(1)
      await expect(page.getByText('0 items available')).toHaveCount(1)
      await page.getByRole('combobox', {name: 'Search for teams'}).click()
    })

    test(`embedded empty-state content fills its available width at ${width}×${height} (${direction}) @aat`, async ({
      page,
    }) => {
      await loadFixture(page, {direction, width, height, emptyState: 'embedded', zeroPadding: true})
      const empty = page.locator('[data-component="FilteredActionList.Empty"]')
      const blankslate = empty.locator('[data-component="Blankslate.Container"]')
      const dimensions = await empty.evaluate(element => {
        const content = element.querySelector<HTMLElement>('[data-component="Blankslate.Container"]')
        if (!content) throw new Error('Expected the embedded blankslate')
        return {
          availableWidth: element.getBoundingClientRect().width,
          contentWidth: content.getBoundingClientRect().width,
        }
      })
      await expect(blankslate).toHaveCount(1)
      expect(dimensions.contentWidth).toBeGreaterThanOrEqual(dimensions.availableWidth - 25)
      expect(dimensions.contentWidth).toBeLessThanOrEqual(dimensions.availableWidth)
    })
  }
}

async function optionVisibility(page: Page) {
  return page.getByRole('option').evaluate(element => {
    const list = element.closest('[data-component="FilteredActionList.Container"]')
    const body = element.closest('[data-component="Dialog.Body"]')
    const dialog = element.closest('[data-component="Dialog.Content"]')
    if (!list || !body || !dialog) throw new Error('Expected the option inside the dialog and list scrollports')
    const row = element.getBoundingClientRect()
    const bounds = [list, body, dialog].map(ancestor => ancestor.getBoundingClientRect())
    const visibleTop = Math.max(row.top, ...bounds.map(rect => rect.top), 0)
    const visibleBottom = Math.min(row.bottom, ...bounds.map(rect => rect.bottom), window.innerHeight)
    const visibleLeft = Math.max(...bounds.map(rect => rect.left), 0)
    const visibleRight = Math.min(...bounds.map(rect => rect.right), window.innerWidth)
    const label = element.querySelector('[data-item-label]')
    if (!label) throw new Error('Expected the result label')
    const textRange = document.createRange()
    textRange.selectNodeContents(label)
    const textRects = Array.from(textRange.getClientRects()).filter(rect => rect.width > 0 && rect.height > 0)
    return {
      height: row.height,
      visibleHeight: Math.max(0, visibleBottom - visibleTop),
      listHeight: list.clientHeight,
      textVisible:
        textRects.length > 0 &&
        textRects.every(
          rect =>
            rect.top >= visibleTop - 1 &&
            rect.bottom <= visibleBottom + 1 &&
            rect.left >= visibleLeft - 1 &&
            rect.right <= visibleRight + 1,
        ),
    }
  })
}

async function expectKeyboardScroll(page: Page, browserName: string) {
  const container = page.locator('[data-component="FilteredActionList.Container"]')
  await page.getByRole('combobox', {name: 'Search for teams'}).focus()
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
    test.fail(true, 'Automated WebKit does not focus the results scrollport; specialist review is needed.')
  }
  expect(await container.evaluate(element => document.activeElement === element)).toBe(true)
  await page.keyboard.press('PageDown')
  await expect.poll(() => container.evaluate(element => element.scrollTop)).toBeGreaterThan(initialScrollTop)
}

for (const direction of ['ltr', 'rtl'] as const) {
  for (const sharedLabels of [false, true]) {
    test(`input and listbox names ${sharedLabels ? 'default to the same label' : 'can differ'} (${direction}) @aat`, async ({
      page,
    }) => {
      await loadFixture(page, {direction, height: 480, sharedLabels, distinctPlaceholder: true})
      await expect(page.getByRole('combobox')).toHaveAccessibleName('Search for teams')
      await expect(page.getByRole('combobox')).toHaveAttribute('placeholder', 'Filter by team')
      await expect(page.getByRole('listbox')).toHaveAccessibleName(sharedLabels ? 'Search for teams' : 'Select teams')
    })
  }

  test(`default padding still clips a centered dialog's results beside legacy utilities (${direction}) @aat`, async ({
    page,
  }) => {
    await loadFixture(page, {direction, height: 256})
    const body = page.locator('[data-component="Dialog.Body"]')
    // The package-owned `primer:p-4` class is not matched by the injected legacy `.p-4` rule.
    await expect(body).toHaveClass(/(?:^|\s)primer:p-4(?:\s|$)/)
    await expect(body).not.toHaveClass(/(?:^|\s)p-4(?:\s|$)/)
    await expect(body).toHaveCSS('padding', '16px')
    const result = await optionVisibility(page)
    expect(result.listHeight).toBeGreaterThan(0)
    expect(result.visibleHeight).toBeGreaterThan(0)
    expect(result.visibleHeight).toBeLessThan(result.height)
    expect(result.textVisible).toBe(false)
  })

  test(`replacing the padding class does not make a long centered result fully visible (${direction}) @aat`, async ({
    page,
  }) => {
    await loadFixture(page, {direction, height: 256, zeroPadding: true})
    const body = page.locator('[data-component="Dialog.Body"]')
    await expect(body).not.toHaveClass(/(?:^|\s)(?:primer:)?p-4(?:\s|$)/)
    await expect(body).toHaveClass(/(?:^|\s)p-0(?:\s|$)/)
    await expect(body).toHaveCSS('padding', '0px')
    const result = await optionVisibility(page)
    expect(result.listHeight).toBeGreaterThan(0)
    expect(result.visibleHeight).toBeGreaterThan(0)
    expect(result.visibleHeight).toBeLessThan(result.height)
  })

  test(`keyboard access to the clipped centered result (${direction}) @aat`, async ({page, browserName}) => {
    await loadFixture(page, {direction, height: 256, zeroPadding: true})
    const result = await optionVisibility(page)
    expect(result.visibleHeight).toBeGreaterThan(0)
    expect(result.visibleHeight).toBeLessThan(result.height)
    await expectKeyboardScroll(page, browserName)
  })

  test(`fullscreen does not guarantee keyboard access to taller results (${direction}) @aat`, async ({
    page,
    browserName,
  }) => {
    await loadFixture(page, {direction, height: 256, fullscreen: true, zeroPadding: true, stress: true})
    expect(await page.locator('[data-item-label]').textContent()).toHaveLength(250)
    const result = await optionVisibility(page)
    expect(result.visibleHeight).toBeGreaterThan(0)
    expect(result.visibleHeight).toBeLessThan(result.height)
    expect(result.textVisible).toBe(false)
    await expectKeyboardScroll(page, browserName)
  })

  for (const height of [256, 480]) {
    test(`a fullscreen dialog exposes the long result at 320×${height} (${direction}) @aat`, async ({page}) => {
      await loadFixture(page, {direction, height, fullscreen: true, zeroPadding: true})
      const body = page.locator('[data-component="Dialog.Body"]')
      await expect(body).not.toHaveClass(/(?:^|\s)(?:primer:)?p-4(?:\s|$)/)
      await expect(body).toHaveCSS('padding', '0px')
      const option = page.getByRole('option')
      await expect(option).toHaveAccessibleName(
        'security-managers-and-compliance-reviewers-for-organization-projects-and-enterprise-audit-workflows',
      )
      const result = await optionVisibility(page)
      expect(result.listHeight).toBeGreaterThanOrEqual(result.height)
      expect(result.visibleHeight).toBeGreaterThanOrEqual(result.height - 1)
      expect(result.textVisible).toBe(true)

      await option.click()
      await expect(option).toHaveAttribute('aria-selected', 'true')

      const input = page.getByRole('combobox', {name: 'Search for teams'})
      await input.focus()
      await page.keyboard.press('ArrowDown')
      const optionId = await option.getAttribute('id')
      if (!optionId) throw new Error('Expected the result to have an id')
      await expect(input).toHaveAttribute('aria-activedescendant', optionId)
      await page.keyboard.press('Enter')
      await expect(option).toHaveAttribute('aria-selected', 'false')
    })
  }
}
