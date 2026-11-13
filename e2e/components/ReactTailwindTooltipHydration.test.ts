import path from 'node:path'
import {expect, test, type Page} from '@playwright/test'
import {build} from 'vite'

const packageRoot = path.resolve(__dirname, '../../packages/react-tailwind')
const alternateBaseUi = process.env.BASE_UI_REACT_DIR
let fixtureScript: string
const errorsByPage = new WeakMap<Page, string[]>()

test.beforeAll(async () => {
  const result = await build({
    configFile: false,
    logLevel: 'silent',
    root: packageRoot,
    resolve: {
      dedupe: ['react', 'react-dom'],
      alias: alternateBaseUi ? [{find: /^@base-ui\/react\/(.+)$/, replacement: `${alternateBaseUi}/$1/index.mjs`}] : [],
    },
    define: {'process.env.NODE_ENV': JSON.stringify('production')},
    oxc: {jsx: {runtime: 'automatic'}},
    build: {
      write: false,
      minify: false,
      lib: {
        entry: path.join(packageRoot, 'script/tooltip-hydration-browser.tsx'),
        formats: ['iife'],
        name: 'TooltipHydrationFixture',
      },
    },
  })
  const outputs = Array.isArray(result) ? result : [result]
  const script = outputs
    .flatMap(output => ('output' in output ? output.output : []))
    .find(file => file.type === 'chunk')
  if (!script) throw new Error('Tooltip hydration fixture build did not return a script')
  if (alternateBaseUi && !script.moduleIds.some(id => id.startsWith(`${alternateBaseUi}/`))) {
    throw new Error('The alternate Base UI package was not included in the fixture')
  }
  fixtureScript = script.code
})

test.beforeEach(({page}) => {
  const errors: string[] = []
  errorsByPage.set(page, errors)
  page.on('pageerror', error => errors.push(error.message))
  page.on('console', message => {
    if (message.type() === 'error') errors.push(message.text())
  })
})

test.afterEach(({page}) => {
  expect(errorsByPage.get(page)).toEqual([])
})

async function setup(page: Page, mode: string) {
  await page.goto(`about:blank?id=tooltip-hydration&mode=${mode}`)
  await page.evaluate(() => {
    document.documentElement.lang = 'en'
    const root = document.createElement('main')
    root.id = 'root'
    document.body.append(root)
  })
  await page.addStyleTag({path: path.join(packageRoot, 'dist/styles.css')})
  await page.addScriptTag({content: fixtureScript})
}

async function hydrate(page: Page) {
  await page.evaluate(() => document.dispatchEvent(new Event('hydrate-tooltip')))
  await expect(page.locator('#tooltip-text')).toHaveCount(1)
}

async function expectChromiumText(page: Page, expected: {name?: string; description?: string}) {
  const session = await page.context().newCDPSession(page)
  try {
    const {root} = await session.send('DOM.getDocument')
    const {nodeId} = await session.send('DOM.querySelector', {nodeId: root.nodeId, selector: '#root button'})
    expect(nodeId).not.toBe(0)
    const {nodes} = await session.send('Accessibility.getPartialAXTree', {nodeId, fetchRelatives: false})
    const button = nodes.find(node => node.role?.value === 'button')
    if (expected.name !== undefined) expect(button?.name?.value).toBe(expected.name)
    if (expected.description !== undefined) expect(button?.description?.value).toBe(expected.description)
  } finally {
    await session.detach()
  }
}

for (const [mode, role, name] of [
  ['menu-icon', 'button', 'Repository actions'],
  ['link-icon', 'link', 'View repository'],
] as const) {
  test(`an icon ${role} can share its tooltip reference before and after hydration @aat`, async ({page}) => {
    await setup(page, mode)
    const trigger = page.getByRole(role, {name})
    await expect(trigger).toHaveAttribute('aria-labelledby', 'tooltip-text')
    await expect(page.locator('#tooltip-text')).toHaveCount(1)
    await hydrate(page)
    await expect(trigger).toHaveAccessibleName(name)

    if (mode === 'menu-icon') {
      await trigger.click()
      await expect(page.getByRole('menu', {name})).toBeVisible()
      await expect(page.locator('#tooltip-text')).toHaveCount(1)
      await page.keyboard.press('Escape')
      await expect(trigger).toBeFocused()
    }
  })
}

test('a trigger explicitly referencing the tooltip id retains its contextual label through hydration @aat', async ({
  page,
  browserName,
}) => {
  await setup(page, 'own-id')
  const trigger = page.getByRole('button')
  await expect(trigger).toHaveAttribute('aria-labelledby', 'tooltip-text')
  await expect(trigger).toHaveAccessibleName('Close feedback form and return to the list')
  if (browserName === 'chromium') await expectChromiumText(page, {name: 'Close feedback form and return to the list'})
  await expect(page.locator('#tooltip-text')).toHaveCount(1)
  await hydrate(page)
  await expect(trigger).toHaveAccessibleName('Close feedback form and return to the list')
  if (browserName === 'chromium') await expectChromiumText(page, {name: 'Close feedback form and return to the list'})
})

test('a trigger referencing a description tooltip retains its name and description through hydration @aat', async ({
  page,
  browserName,
}) => {
  await setup(page, 'description-own-id')
  const trigger = page.getByRole('button')
  await expect(trigger).toHaveAttribute('aria-labelledby', 'tooltip-text')
  await expect(trigger).toHaveAccessibleName('Close feedback form and return to the list')
  await expect(trigger).toHaveAccessibleDescription('Close feedback form and return to the list')
  if (browserName === 'chromium') {
    await expectChromiumText(page, {
      name: 'Close feedback form and return to the list',
      description: 'Close feedback form and return to the list',
    })
  }
  await hydrate(page)
  await expect(trigger).toHaveAccessibleName('Close feedback form and return to the list')
  await expect(trigger).toHaveAccessibleDescription('Close feedback form and return to the list')
  if (browserName === 'chromium') {
    await expectChromiumText(page, {
      name: 'Close feedback form and return to the list',
      description: 'Close feedback form and return to the list',
    })
  }
})

test('a description-tooltip reference takes precedence over a trigger fallback label through hydration @aat', async ({
  page,
}) => {
  await setup(page, 'description-own-id-fallback')
  const trigger = page.getByRole('button')
  await expect(trigger).toHaveAttribute('aria-label', 'Fallback name')
  await expect(trigger).toHaveAccessibleName('Close feedback form and return to the list')
  await hydrate(page)
  await expect(trigger).toHaveAccessibleName('Close feedback form and return to the list')
})

for (const [mode, expectedName] of [
  ['description-mixed-ids', 'Independent name Close feedback form and return to the list'],
  ['description-mixed-ids-reversed', 'Close feedback form and return to the list Independent name'],
] as const) {
  test(`a ${mode} reference retains its complete name through hydration @aat`, async ({page, browserName}) => {
    await setup(page, mode)
    const trigger = page.getByRole('button')
    await expect(trigger).toHaveAccessibleName(expectedName)
    if (browserName === 'chromium') await expectChromiumText(page, {name: expectedName})
    await hydrate(page)
    await expect(trigger).toHaveAccessibleName(expectedName)
    if (browserName === 'chromium') await expectChromiumText(page, {name: expectedName})
  })
}

test('a mixed reference uses the tooltip target even when another referenced id is missing @aat', async ({page}) => {
  await setup(page, 'description-missing-ids')
  const trigger = page.getByRole('button')
  await expect(trigger).toHaveAttribute('aria-label', 'Fallback name')
  await expect(trigger).toHaveAccessibleName('Close feedback form and return to the list')
  await hydrate(page)
  await expect(trigger).toHaveAccessibleName('Close feedback form and return to the list')
})

test('an explicitly referenced description tooltip includes its shortcut in the name through hydration @aat', async ({
  page,
  browserName,
}) => {
  await setup(page, 'description-own-id-hint')
  const trigger = page.getByRole('button')
  const text = 'Close feedback form and return to the list (control k)'
  await expect(trigger).toHaveAccessibleName(text)
  await expect(trigger).toHaveAccessibleDescription(text)
  if (browserName === 'chromium') await expectChromiumText(page, {name: text, description: text})
  await hydrate(page)
  await expect(trigger).toHaveAccessibleName(text)
  await expect(trigger).toHaveAccessibleDescription(text)
  if (browserName === 'chromium') await expectChromiumText(page, {name: text, description: text})
})

for (const mode of ['own-id-fallback', 'own-id-fallback-hint'] as const) {
  test(`an explicit tooltip reference takes precedence over its fallback label with ${mode} @aat`, async ({page}) => {
    await setup(page, mode)
    const trigger = page.getByRole('button')
    await expect(trigger).toHaveAttribute('aria-label', 'Fallback name')
    await expect(trigger).toHaveAccessibleName('Close feedback form and return to the list')
    if (mode === 'own-id-fallback-hint') await expect(trigger).toHaveAccessibleDescription('(control k)')
    await hydrate(page)
    await expect(trigger).toHaveAccessibleName('Close feedback form and return to the list')
    if (mode === 'own-id-fallback-hint') await expect(trigger).toHaveAccessibleDescription('(control k)')
  })
}

for (const [mode, expectedName] of [
  ['aria-label', 'Caller-owned name'],
  ['aria-labelledby', 'Independent name'],
] as const) {
  test(`an independent ${mode} remains the accessible name after hydration @aat`, async ({page, browserName}) => {
    await setup(page, mode)
    const trigger = page.getByRole('button')
    await expect(trigger).toHaveAccessibleName(expectedName)
    if (browserName === 'chromium') await expectChromiumText(page, {name: expectedName})
    await hydrate(page)
    await expect(trigger).toHaveAccessibleName(expectedName)
    if (browserName === 'chromium') await expectChromiumText(page, {name: expectedName})
  })
}

test('a contextual content label remains the name when a keybinding hint is supplied @aat', async ({page}) => {
  await setup(page, 'content-hint')
  const trigger = page.getByRole('button')
  await expect(trigger).toHaveAccessibleName('Close feedback form and return to the list')
  await expect(trigger).toHaveAccessibleDescription('(control k)')
  await hydrate(page)
  await expect(trigger).toHaveAccessibleName('Close feedback form and return to the list')
  await expect(trigger).toHaveAccessibleDescription('(control k)')
  await expect(page.locator('#tooltip-text')).toHaveAttribute('role', 'group')
  await expect(page.getByRole('group')).toHaveCount(0)
  await expect(page).toHaveNoViolations()
})

test('a render callback preserves its independent trigger label after hydration @aat', async ({page}) => {
  await setup(page, 'render-callback')
  const trigger = page.getByRole('button')
  await expect(trigger).toHaveAccessibleName('Caller-owned name')
  await hydrate(page)
  await expect(trigger).toHaveAccessibleName('Caller-owned name')
})

test('a render callback preserves an independent label reference after hydration @aat', async ({page}) => {
  await setup(page, 'render-callback-reference')
  const trigger = page.getByRole('button')
  await expect(trigger).toHaveAccessibleName('Independent name')
  await hydrate(page)
  await expect(trigger).toHaveAccessibleName('Independent name')
})

test('a trigger component name can be passed explicitly to preserve it after hydration @aat', async ({page}) => {
  await setup(page, 'component-trigger-explicit')
  const trigger = page.getByRole('button')
  await expect(trigger).toHaveAccessibleName('Component trigger name')
  await hydrate(page)
  await expect(trigger).toHaveAccessibleName('Component trigger name')
})

for (const mode of ['component-trigger', 'component-trigger-callback'] as const) {
  test(`a ${mode} keeps its internal name without an explicit trigger label @aat`, async ({page}) => {
    await setup(page, mode)
    const trigger = page.getByRole('button')
    await expect(trigger).toHaveAttribute('aria-label', 'Component trigger name')
    await expect(page.locator('#tooltip-text')).toHaveCount(1)
    await hydrate(page)
    test.fail(true, 'The generated tooltip reference overrides the custom trigger component name.')
    await expect(trigger).toHaveAccessibleName('Component trigger name')
  })
}

test('a content component name is used without a shortcut hint @aat', async ({page}) => {
  await setup(page, 'component-content')
  await expect(page.getByRole('button')).toHaveAccessibleName('Close feedback form')
  await hydrate(page)
  await expect(page.getByRole('button')).toHaveAccessibleName('Component content name')
})

test('a content component name can be passed explicitly alongside a shortcut hint @aat', async ({page}) => {
  await setup(page, 'component-content-explicit')
  await expect(page.getByRole('button')).toHaveAccessibleName('Component content name')
  await expect(page.getByRole('button')).toHaveAccessibleDescription('(control k)')
  await hydrate(page)
  const trigger = page.getByRole('button')
  await expect(trigger).toHaveAccessibleName('Component content name')
  await expect(trigger).toHaveAccessibleDescription('(control k)')
})

for (const mode of ['component-content-hint', 'component-content-callback'] as const) {
  test(`a ${mode} keeps its internal name alongside a shortcut hint @aat`, async ({page}) => {
    await setup(page, mode)
    await hydrate(page)
    const trigger = page.getByRole('button')
    await expect(trigger).toHaveAccessibleDescription('(control k)')
    test.fail(true, 'A name supplied inside a custom content component is not available to the hint target.')
    await expect(trigger).toHaveAccessibleName('Component content name')
  })
}

test('a content component provides its description without a shortcut hint @aat', async ({page}) => {
  await setup(page, 'component-description')
  await expect(page.getByRole('button', {name: 'Search'})).toHaveAccessibleDescription('Close feedback form')
  await hydrate(page)
  await expect(page.getByRole('button', {name: 'Search'})).toHaveAccessibleDescription('Component content name')
})

test('an explicit content name provides a description with a shortcut hint @aat', async ({page}) => {
  await setup(page, 'component-description-explicit')
  await expect(page.getByRole('button', {name: 'Search'})).toHaveAccessibleDescription(
    'Component content name (control k)',
  )
  await hydrate(page)
  await expect(page.getByRole('button', {name: 'Search'})).toHaveAccessibleDescription(
    'Component content name (control k)',
  )
})

test('a content component keeps its internal description with a shortcut hint @aat', async ({page}) => {
  await setup(page, 'component-description-hint')
  await hydrate(page)
  await expect(page.getByRole('button', {name: 'Search'})).toHaveAttribute('aria-describedby', 'tooltip-text')
  test.fail(true, 'A name supplied inside a custom content component is not available to the hint target.')
  await expect(page.getByRole('button', {name: 'Search'})).toHaveAccessibleDescription(
    'Component content name (control k)',
  )
})

for (const [mode, expectedName] of [
  ['content-hint-element', 'Element contextual label'],
  ['content-hint-callback', 'Callback contextual label'],
] as const) {
  test(`a ${mode} popup supplies its name separately from the shortcut @aat`, async ({page}) => {
    await setup(page, mode)
    const trigger = page.getByRole('button')
    await expect(trigger).toHaveAccessibleName(
      mode === 'content-hint-callback' ? 'Close feedback form and return to the list' : expectedName,
    )
    await expect(trigger).toHaveAccessibleDescription('(control k)')
    await hydrate(page)
    await expect(trigger).toHaveAccessibleName(expectedName)
    await expect(trigger).toHaveAccessibleDescription('(control k)')
    const popup = page.locator('[data-component="Tooltip.Content"]')
    await trigger.focus()
    await expect(popup).toHaveAttribute('data-open', '')
    await page.keyboard.press('Escape')
    await expect(popup).toHaveAttribute('data-closed', '')
    await expect(trigger).toBeFocused()
    await expect(trigger).toHaveAccessibleName(expectedName)
  })
}

test('a contextual description and shortcut are both available through hydration @aat', async ({page, browserName}) => {
  await setup(page, 'description-hint')
  const trigger = page.getByRole('button', {name: 'Search'})
  await expect(trigger).toHaveAccessibleDescription('Close feedback form and return to the list (control k)')
  if (browserName === 'chromium') {
    await expectChromiumText(page, {description: 'Close feedback form and return to the list (control k)'})
  }
  await hydrate(page)
  await expect(trigger).toHaveAccessibleDescription('Close feedback form and return to the list (control k)')
  if (browserName === 'chromium') {
    await expectChromiumText(page, {description: 'Close feedback form and return to the list (control k)'})
  }
})

test('Playwright computes a content label reference and shortcut through hydration @aat', async ({page}) => {
  await setup(page, 'description-reference-hint')
  const trigger = page.getByRole('button', {name: 'Search'})
  await expect(trigger).toHaveAccessibleDescription('Independent name (control k)')
  await hydrate(page)
  await expect(trigger).toHaveAccessibleDescription('Independent name (control k)')
})

for (const phase of ['server', 'hydrated'] as const) {
  test(`Chromium exposes a content label reference and shortcut ${phase} @aat`, async ({page, browserName}) => {
    // CDP is Chromium-specific; the other engines still run the Playwright-computed check above.
    // eslint-disable-next-line playwright/no-skipped-test
    test.skip(browserName !== 'chromium', 'The native accessibility tree check requires Chromium.')
    await setup(page, 'description-reference-hint')
    await expect(page.locator('#tooltip-text')).toHaveCount(1)
    if (phase === 'hydrated') await hydrate(page)
    test.fail(true, 'Chromium does not follow the chained content reference in the native accessibility tree.')
    await expectChromiumText(page, {description: 'Independent name (control k)'})
  })
}

for (const mode of ['empty-label', 'space-label', 'empty-labelledby', 'space-labelledby'] as const) {
  test(`a trigger with ${mode} receives a tooltip name before and after hydration @aat`, async ({
    page,
    browserName,
  }) => {
    await setup(page, mode)
    const trigger = page.getByRole('button')
    await expect(trigger).toHaveAccessibleName('Close feedback form and return to the list')
    if (browserName === 'chromium') await expectChromiumText(page, {name: 'Close feedback form and return to the list'})
    await hydrate(page)
    await expect(trigger).toHaveAccessibleName('Close feedback form and return to the list')
    if (browserName === 'chromium') await expectChromiumText(page, {name: 'Close feedback form and return to the list'})
  })
}

for (const mode of ['blank-content', 'blank-content-hint'] as const) {
  test(`a ${mode} aria-label falls back to tooltip text through hydration @aat`, async ({page, browserName}) => {
    await setup(page, mode)
    const trigger = page.getByRole('button')
    await expect(trigger).toHaveAccessibleName('Close feedback form')
    if (browserName === 'chromium') await expectChromiumText(page, {name: 'Close feedback form'})
    if (mode === 'blank-content-hint') await expect(trigger).toHaveAccessibleDescription('(control k)')
    await hydrate(page)
    await expect(trigger).toHaveAccessibleName('Close feedback form')
    if (browserName === 'chromium') await expectChromiumText(page, {name: 'Close feedback form'})
    if (mode === 'blank-content-hint') await expect(trigger).toHaveAccessibleDescription('(control k)')
  })
}
