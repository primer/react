import path from 'node:path'
import {expect, test} from '@playwright/test'
import {reactTailwindHostUtilities} from '../test-helpers/react-tailwind-fixture'
import {build} from 'vite'

const packageRoot = path.resolve(__dirname, '../../packages/react-tailwind')
let fixtureScript: string

test.beforeAll(async () => {
  const result = await build({
    configFile: false,
    logLevel: 'silent',
    root: packageRoot,
    resolve: {dedupe: ['react', 'react-dom']},
    define: {'process.env.NODE_ENV': JSON.stringify('production')},
    oxc: {jsx: {runtime: 'automatic'}},
    build: {
      write: false,
      minify: false,
      lib: {
        entry: path.join(packageRoot, 'script/actionbar-inset-browser.tsx'),
        formats: ['iife'],
        name: 'ActionBarInsetFixture',
      },
    },
  })
  const outputs = Array.isArray(result) ? result : [result]
  const script = outputs
    .flatMap(output => ('output' in output ? output.output : []))
    .find(file => file.type === 'chunk')
  if (!script) throw new Error('ActionBar fixture build did not return a script')
  fixtureScript = script.code
})

for (const [theme, direction, viewportWidth] of [
  ['light', 'ltr', 320],
  ['dark', 'rtl', 768],
  ['light_high_contrast', 'ltr', 1440],
  ['dark_high_contrast', 'rtl', 320],
] as const) {
  test(`keeps the overflow control usable with a conflicting host inset (${theme}, ${direction}, ${viewportWidth}px) @aat`, async ({
    page,
  }) => {
    await page.setViewportSize({width: viewportWidth, height: 800})
    await page.goto('about:blank?id=actionbar-inset-fixture')
    await page.evaluate(
      ({colorMode, dir}) => {
        document.documentElement.lang = 'en'
        document.documentElement.dir = dir
        const mode = colorMode.startsWith('dark') ? 'dark' : 'light'
        document.documentElement.setAttribute('data-color-mode', mode)
        document.documentElement.setAttribute(`data-${mode}-theme`, colorMode)
        document.title = 'ActionBar'
        const root = document.createElement('main')
        root.id = 'root'
        document.body.append(root)
      },
      {colorMode: theme, dir: direction},
    )
    await page.addStyleTag({path: path.join(packageRoot, 'dist/styles.css')})
    await page.addStyleTag({path: reactTailwindHostUtilities})
    await page.addScriptTag({content: fixtureScript})

    const toolbar = page.getByRole('toolbar', {name: 'Default actions'})
    const wrapper = toolbar.locator('..')
    await expect.poll(() => wrapper.evaluate(element => getComputedStyle(element).paddingInlineStart)).toBe('16px')
    await expect.poll(() => wrapper.evaluate(element => getComputedStyle(element).paddingInlineEnd)).toBe('16px')

    await page.addStyleTag({content: '.px-4 { padding-left: 24px !important; padding-right: 24px !important; }'})
    await expect.poll(() => wrapper.evaluate(element => getComputedStyle(element).paddingInlineStart)).toBe('16px')
    await expect.poll(() => wrapper.evaluate(element => getComputedStyle(element).paddingInlineEnd)).toBe('16px')

    const more = toolbar.getByRole('button', {name: 'More items'})
    await expect(more).toBeVisible()
    const [toolbarBounds, moreBounds] = await Promise.all([toolbar.boundingBox(), more.boundingBox()])
    if (!toolbarBounds || !moreBounds) throw new Error('ActionBar controls did not have layout bounds')
    expect(toolbarBounds.width).toBeGreaterThanOrEqual(moreBounds.width)

    await more.click()
    const menu = page.getByRole('menu', {name: 'More items'})
    await expect(menu.getByRole('menuitem', {name: 'Assign'})).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(menu).toBeHidden()
    await expect(more).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(menu).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(more).toBeFocused()

    const flush = page.getByRole('toolbar', {name: 'Flush actions'}).locator('..')
    const customized = page.getByRole('toolbar', {name: 'Customized actions'}).locator('..')
    const explicit = page.getByRole('toolbar', {name: 'Explicit host utility'}).locator('..')
    await expect.poll(() => flush.evaluate(element => getComputedStyle(element).paddingInlineStart)).toBe('0px')
    await expect.poll(() => flush.evaluate(element => getComputedStyle(element).paddingInlineEnd)).toBe('0px')
    await expect.poll(() => customized.evaluate(element => getComputedStyle(element).paddingInlineStart)).toBe('8px')
    await expect.poll(() => customized.evaluate(element => getComputedStyle(element).paddingInlineEnd)).toBe('8px')
    await expect.poll(() => explicit.evaluate(element => getComputedStyle(element).paddingInlineStart)).toBe('24px')
    await wrapper.evaluate(element => element.style.setProperty('--base-size-16', '12px'))
    await expect.poll(() => wrapper.evaluate(element => getComputedStyle(element).paddingInlineStart)).toBe('12px')
    await expect.poll(() => wrapper.evaluate(element => getComputedStyle(element).paddingInlineEnd)).toBe('12px')
    await expect(page).toHaveNoViolations()
  })
}
