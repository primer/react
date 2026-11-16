import path from 'node:path'
import {expect, test} from '@playwright/test'
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
        entry: path.join(packageRoot, 'script/pagination-focus-browser.tsx'),
        formats: ['iife'],
        name: 'PaginationFocusFixture',
      },
    },
  })
  const outputs = Array.isArray(result) ? result : [result]
  const script = outputs
    .flatMap(output => ('output' in output ? output.output : []))
    .find(file => file.type === 'chunk')
  if (!script) throw new Error('Pagination fixture build did not return a script')
  fixtureScript = script.code
})

test('a custom next link retains focus while page requests are pending @aat', async ({page}) => {
  await page.goto('about:blank?id=pagination-focus-fixture')
  await page.evaluate(() => {
    document.documentElement.lang = 'en'
    document.title = 'Pagination'
    const root = document.createElement('main')
    root.id = 'root'
    document.body.append(root)
  })
  await page.addStyleTag({path: path.join(packageRoot, 'dist/styles.css')})
  await page.addScriptTag({content: fixtureScript})

  const next = page.getByRole('link', {name: 'Next page'})
  const previous = page.getByRole('link', {name: 'Previous page'})
  const originalNext = await next.elementHandle()
  const originalPrevious = await previous.elementHandle()
  if (!originalNext || !originalPrevious) throw new Error('Pagination controls did not render')

  await next.focus()
  await page.keyboard.press('Enter')
  await expect(page.getByLabel('Requested pages')).toHaveText('3')
  await expect(next).toBeFocused()
  await expect(next).toHaveAttribute('href', '#4')
  await expect(next).toHaveAttribute('aria-disabled', 'true')
  expect(await next.evaluate((element, original) => element === original, originalNext)).toBe(true)
  await page.keyboard.press('Enter')
  await expect(page.getByLabel('Requested pages')).toHaveText('3')

  await page.getByRole('button', {name: 'Complete request'}).dispatchEvent('click')
  await expect(next).toBeFocused()
  await expect(next).not.toHaveAttribute('aria-disabled')
  await page.keyboard.press('Enter')
  await expect(page.getByLabel('Requested pages')).toHaveText('3,4')
  await page.getByRole('button', {name: 'Complete request'}).dispatchEvent('click')
  await page.keyboard.press('Enter')
  await expect(page.getByLabel('Requested pages')).toHaveText('3,4,5')
  expect(await previous.evaluate((element, original) => element === original, originalPrevious)).toBe(true)
  const disabledNext = page.getByRole('link', {name: 'Next page'})
  await expect(disabledNext).toHaveAttribute('aria-disabled', 'true')
  await expect(disabledNext).not.toHaveAttribute('href')
  expect(await disabledNext.evaluate((element, original) => element === original, originalNext)).toBe(false)
  await expect(page).toHaveNoViolations()
})
