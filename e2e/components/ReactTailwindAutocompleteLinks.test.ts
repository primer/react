import path from 'node:path'
import {expect, test, type Page} from '@playwright/test'
import {buildReactTailwindFixture, reactTailwindPackageRoot} from '../test-helpers/react-tailwind-fixture'

const alternateBaseUi = process.env.BASE_UI_REACT_DIR
let fixtureScript: string

test.beforeAll(async () => {
  fixtureScript = await buildReactTailwindFixture('script/autocomplete-link-browser.tsx', alternateBaseUi)
})

async function setup(page: Page, mode: string) {
  await page.goto(`about:blank?id=autocomplete-link&mode=${mode}`)
  await page.evaluate(() => {
    document.documentElement.lang = 'en'
    const root = document.createElement('main')
    root.id = 'root'
    document.body.append(root)
  })
  await page.addStyleTag({path: path.join(reactTailwindPackageRoot, 'dist/styles.css')})
  await page.addScriptTag({content: fixtureScript})
}

async function exposedRoles(page: Page) {
  const session = await page.context().newCDPSession(page)
  try {
    const {nodes} = await session.send('Accessibility.getFullAXTree')
    return nodes.filter(node => node.name?.value === 'README.md').map(node => node.role?.value)
  } finally {
    await session.detach()
  }
}

// These are behavior probes, not an endorsement of anchors as listbox options.
for (const mode of ['local', 'raw', 'action-list'] as const) {
  test(`${mode} exposes an anchor suggestion as an option rather than a link @aat`, async ({page, browserName}) => {
    await setup(page, mode)
    const option = page.getByRole('option', {name: 'README.md'})
    await expect(option).toBeVisible()
    await expect(option).toHaveAttribute('href', '#readme')
    await expect(page.getByRole('link', {name: 'README.md'})).toHaveCount(0)
    if (browserName === 'chromium') {
      const roles = await exposedRoles(page)
      expect(roles).toContain('option')
      expect(roles).not.toContain('link')
    }
  })
}

test('a native result link retains its exposed link role @aat', async ({page, browserName}) => {
  await setup(page, 'native')
  await expect(page.getByRole('link', {name: 'README.md'})).toBeVisible()
  if (browserName === 'chromium') expect(await exposedRoles(page)).toContain('link')
})

for (const mode of ['local', 'raw'] as const) {
  test(`${mode} keeps input focus and highlights the suggestion @aat`, async ({page}) => {
    await setup(page, mode)
    const input = page.getByRole('combobox', {name: 'Find a file'})
    const option = page.getByRole('option', {name: 'README.md'})
    await input.focus()
    await page.keyboard.press('ArrowDown')
    await expect(input).toBeFocused()
    const optionId = await option.getAttribute('id')
    if (!optionId) throw new Error('Highlighted option has no id')
    await expect(input).toHaveAttribute('aria-activedescendant', optionId)
  })

  test(`${mode} associates its input and popup using Base UI attributes @aat`, async ({page}) => {
    await setup(page, mode)
    const input = page.getByRole('combobox', {name: 'Find a file'})
    const list = page.getByRole('listbox')
    const listId = await list.getAttribute('id')
    if (!listId) throw new Error('Autocomplete list has no id')
    await expect(input).toHaveAttribute('aria-autocomplete', 'list')
    await expect(input).toHaveAttribute('aria-controls', listId)
  })
}

for (const mode of ['local', 'raw', 'action-list', 'native'] as const) {
  test(`${mode} follows a pointer click on its anchor @aat`, async ({page}) => {
    await setup(page, mode)
    await page.locator('a[href="#readme"]').click()
    await expect(page).toHaveURL(/#readme$/)
  })

  test(`${mode} opens its anchor in a new tab on middle click @aat`, async ({page, browserName}) => {
    // eslint-disable-next-line playwright/no-skipped-test
    test.skip(browserName !== 'chromium', 'Automated WebKit does not open a new page even for the native control.')
    await setup(page, mode)
    const newPage = page.context().waitForEvent('page', {timeout: 3000})
    await page.locator('a[href="#readme"]').click({button: 'middle'})
    await expect(await newPage).toHaveURL(/#readme$/)
  })

  test(`${mode} opens its anchor in a new tab on modifier click @aat`, async ({page}) => {
    await setup(page, mode)
    const newPage = page.context().waitForEvent('page', {timeout: 3000})
    await page.locator('a[href="#readme"]').click({modifiers: ['ControlOrMeta']})
    await expect(await newPage).toHaveURL(/#readme$/)
  })

  test(`${mode} does not cancel the anchor context-menu event @aat`, async ({page}) => {
    await setup(page, mode)
    await page.evaluate(() => {
      document.addEventListener(
        'contextmenu',
        event => {
          document.documentElement.setAttribute('data-context-menu-cancelled', String(event.defaultPrevented))
        },
        {once: true},
      )
    })
    await page.locator('a[href="#readme"]').click({button: 'right'})
    await expect(page.locator('html')).toHaveAttribute('data-context-menu-cancelled', 'false')
  })
}

for (const mode of ['local', 'raw'] as const) {
  test(`${mode} follows the selected anchor on Enter @aat`, async ({page}) => {
    await setup(page, mode)
    const input = page.getByRole('combobox', {name: 'Find a file'})
    await input.focus()
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/#readme$/)
  })

  test(`${mode} leaves a rendered anchor implicitly tabbable @aat`, async ({page}) => {
    await setup(page, mode)
    const option = page.getByRole('option', {name: 'README.md'})
    expect(await option.evaluate(element => (element as HTMLElement).tabIndex)).toBe(0)
  })

  test(`${mode} does not activate the selected anchor on modified Enter @aat`, async ({page}) => {
    await setup(page, mode)
    const input = page.getByRole('combobox', {name: 'Find a file'})
    await page.evaluate(() => {
      document.addEventListener(
        'click',
        event => {
          if (event.target instanceof HTMLAnchorElement)
            document.documentElement.setAttribute('data-anchor-clicked', 'true')
        },
        true,
      )
    })
    await input.focus()
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('ControlOrMeta+Enter')
    await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => resolve())))
    await expect(page.locator('html')).not.toHaveAttribute('data-anchor-clicked', 'true')
    expect(page.url()).not.toContain('#readme')
    expect(page.context().pages()).toHaveLength(1)
  })

  test(`${mode} tabs from the input past the popup @aat`, async ({page}) => {
    await setup(page, mode)
    await page.getByRole('combobox', {name: 'Find a file'}).focus()
    await page.keyboard.press('Tab')
    await expect(page.getByRole('textbox', {name: 'After results'})).toBeFocused()
  })
}
