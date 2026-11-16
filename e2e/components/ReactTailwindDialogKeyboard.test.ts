import path from 'node:path'
import {expect, test, type Page} from '@playwright/test'
import {build} from 'vite'

const packageRoot = path.resolve(__dirname, '../../packages/react-tailwind')
const alternateBaseUi = process.env.BASE_UI_REACT_DIR
let fixtureScript: string
const errorsByPage = new WeakMap<Page, string[]>()

interface KeyRecord {
  scope: string
  key: string
  defaultPrevented: boolean
  nativeEventId: number
}

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
        entry: path.join(packageRoot, 'script/dialog-keyboard-browser.tsx'),
        formats: ['iife'],
        name: 'DialogKeyboardFixture',
      },
    },
  })
  const outputs = Array.isArray(result) ? result : [result]
  const script = outputs
    .flatMap(output => ('output' in output ? output.output : []))
    .find(file => file.type === 'chunk')
  if (!script) throw new Error('Dialog keyboard fixture build did not return a script')
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
  await page.goto(`about:blank?mode=${mode}`)
  await page.evaluate(() => {
    document.documentElement.lang = 'en'
    const root = document.createElement('main')
    root.id = 'root'
    document.body.append(root)
  })
  await page.addStyleTag({path: path.join(packageRoot, 'dist/styles.css')})
  await page.addScriptTag({content: fixtureScript})
}

async function getKeyLog(page: Page): Promise<KeyRecord[]> {
  const text = await page.getByTestId('key-log').textContent()
  if (text === null) throw new Error('Dialog keyboard fixture did not produce an event log')
  return JSON.parse(text)
}

async function getNativeCaretPositions(page: Page) {
  await page.evaluate(() => {
    const input = document.createElement('input')
    input.id = 'native-caret-reference'
    input.value = 'primer'
    document.body.append(input)
  })
  const input = page.locator('#native-caret-reference')
  await input.focus()
  await input.evaluate((element: HTMLInputElement) => element.setSelectionRange(2, 2))
  const positions: Array<number | null> = []
  for (const key of ['Home', 'End', 'Meta+ArrowLeft', 'Meta+ArrowRight']) {
    await input.press(key)
    positions.push(await input.evaluate((element: HTMLInputElement) => element.selectionStart))
  }
  await input.evaluate(element => element.remove())
  return positions
}

for (const mode of ['portaled', 'inline', 'non-modal', 'trap-focus', 'popup', 'raw']) {
  test(`scopes keyboard commands within ${mode} Dialog content @aat`, async ({page}) => {
    await setup(page, mode)
    const [nativeHome, nativeEnd, nativeStart, nativeFinish] = await getNativeCaretPositions(page)

    const trigger = page.getByRole('button', {name: 'Open search'})
    await trigger.click()
    const dialog = page.getByRole('dialog', {name: 'Search'})
    const input = dialog.getByRole('textbox', {name: 'Search terms'})
    await expect(input).toBeFocused()

    await input.evaluate((element: HTMLInputElement) => element.setSelectionRange(1, 1))
    await input.press('ArrowRight')
    await expect.poll(() => input.evaluate((element: HTMLInputElement) => element.selectionStart)).toBe(2)
    await input.press('Home')
    await expect.poll(() => input.evaluate((element: HTMLInputElement) => element.selectionStart)).toBe(nativeHome)
    await input.press('End')
    await expect.poll(() => input.evaluate((element: HTMLInputElement) => element.selectionStart)).toBe(nativeEnd)
    await input.press('ArrowDown')
    await input.press('Enter')

    const log = await getKeyLog(page)
    for (const key of ['ArrowRight', 'Home', 'End', 'ArrowDown']) {
      const entries = log.filter(event => event.key === key)
      expect(entries.map(({scope, key, defaultPrevented}) => ({scope, key, defaultPrevented}))).toEqual([
        {scope: 'inside', key, defaultPrevented: false},
        {scope: 'popup', key, defaultPrevented: false},
      ])
      expect(new Set(entries.map(event => event.nativeEventId)).size).toBe(1)
    }
    const enterEntries = log.filter(event => event.key === 'Enter')
    const enterScopes = enterEntries.map(event => event.scope)
    expect(enterScopes.slice(0, 2)).toEqual(['inside', 'popup'])
    expect(enterScopes).toContain('outside')
    expect(new Set(enterEntries.map(event => event.nativeEventId)).size).toBe(1)

    await input.evaluate((element: HTMLInputElement) => element.setSelectionRange(2, 2))
    await input.press('Home')
    await input.press('End')
    await input.press('Meta+ArrowLeft')
    await expect.poll(() => input.evaluate((element: HTMLInputElement) => element.selectionStart)).toBe(nativeStart)
    await input.press('Meta+ArrowRight')
    await expect.poll(() => input.evaluate((element: HTMLInputElement) => element.selectionStart)).toBe(nativeFinish)

    await input.press('Escape')
    await expect(dialog).toBeHidden()
    await expect(trigger).toBeFocused()
  })
}

test('a command scope inside Dialog handles navigation and submission once @aat', async ({page}) => {
  await setup(page, 'command')
  await page.getByRole('button', {name: 'Open search'}).click()
  const input = page.getByRole('dialog', {name: 'Search'}).getByRole('textbox', {name: 'Search terms'})
  await expect(input).toBeFocused()

  await input.press('ArrowDown')
  await input.press('ArrowDown')
  await input.press('Enter')
  await expect(page.getByTestId('commands')).toHaveText('2:1')
  await input.press('Escape')
  await expect(page.getByRole('button', {name: 'Open search'})).toBeFocused()
})

for (const mode of ['portaled', 'raw']) {
  test(`an unhandled key reaches an ancestor only once in ${mode} Dialog @aat`, async ({page}) => {
    await setup(page, mode)
    await page.getByRole('button', {name: 'Open search'}).click()
    const input = page.getByRole('dialog', {name: 'Search'}).getByRole('textbox', {name: 'Search terms'})
    await expect(input).toBeFocused()
    await input.press('Enter')

    const entries = (await getKeyLog(page)).filter(event => event.key === 'Enter')
    expect(entries.filter(event => event.scope === 'inside')).toHaveLength(1)
    expect(new Set(entries.map(event => event.nativeEventId)).size).toBe(1)
    expect(entries.filter(event => event.scope === 'outside')).toHaveLength(2)
    test.fail(true, 'The same native event currently reaches the outer React handler twice')
    expect(entries.filter(event => event.scope === 'outside')).toHaveLength(1)
  })
}
