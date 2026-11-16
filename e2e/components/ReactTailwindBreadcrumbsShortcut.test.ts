import path from 'node:path'
import {expect, test} from '@playwright/test'
import {activateWithoutPointerFocus} from '../test-helpers/activateWithoutPointerFocus'
import {buildReactTailwindFixture, reactTailwindPackageRoot} from '../test-helpers/react-tailwind-fixture'

let fixtureScript: string

test.beforeAll(async () => {
  fixtureScript = await buildReactTailwindFixture(
    'script/breadcrumbs-shortcut-browser.tsx',
    process.env.BASE_UI_REACT_DIR,
  )
})

test('a late suggestions response keeps the final repository picker shortcut on the visible instance @aat', async ({
  page,
}) => {
  await page.setViewportSize({width: 320, height: 600})
  await page.goto('about:blank')
  await page.evaluate(() => {
    const root = document.createElement('main')
    root.id = 'root'
    document.body.append(root)
  })
  await page.addStyleTag({path: path.join(reactTailwindPackageRoot, 'dist/base.css')})
  await page.addStyleTag({path: path.join(reactTailwindPackageRoot, 'dist/styles.css')})
  await page.addScriptTag({content: fixtureScript})

  const picker = page.getByRole('button', {name: 'Choose repository'})
  const search = page.getByRole('textbox', {name: 'Search repositories'})
  await expect(page.locator('button[aria-label="Choose repository"]')).toHaveCount(1)
  await expect(page.locator('html')).toHaveAttribute('data-command-count', '1')
  await picker.click()
  await expect(search).toBeFocused()
  await search.fill('a different query')
  await search.press('Escape')
  await expect(picker).toBeFocused()

  await expect(page.locator('html')).toHaveAttribute('data-last-command-version', '-1')
  const lastCommand = await page.locator('html').getAttribute('data-last-command')
  await activateWithoutPointerFocus(page.getByRole('button', {name: 'Resolve older suggestions'}))
  await expect(page.getByTestId('suggestions-version')).toHaveText('1')
  await page.evaluate(
    () => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))),
  )
  await expect(page.locator('html')).toHaveAttribute('data-command-count', '1')
  await expect(page.locator('html')).toHaveAttribute('data-last-command', lastCommand ?? '')

  await page.keyboard.press('Alt+Shift+R')
  await expect(picker).toHaveAttribute('aria-expanded', 'true')
  await expect(search).toBeFocused()
})

test('a late suggestions response keeps an ancestor picker shortcut on the visible instance @aat', async ({page}) => {
  test.fixme(!process.env.RUN_KNOWN_FAILURE, 'Ancestor items still have duplicate measurement mounts.')
  await page.setViewportSize({width: 320, height: 600})
  await page.goto('about:blank?ancestor')
  await page.evaluate(() => {
    const root = document.createElement('main')
    root.id = 'root'
    document.body.append(root)
  })
  await page.addStyleTag({path: path.join(reactTailwindPackageRoot, 'dist/base.css')})
  await page.addStyleTag({path: path.join(reactTailwindPackageRoot, 'dist/styles.css')})
  await page.addScriptTag({content: fixtureScript})

  const picker = page.getByRole('button', {name: 'Choose repository'})
  await picker.click()
  const search = page.getByRole('textbox', {name: 'Search repositories'})
  await search.fill('a different query')
  await search.press('Escape')
  await activateWithoutPointerFocus(page.getByRole('button', {name: 'Resolve older suggestions'}))
  await expect(page.getByTestId('suggestions-version')).toHaveText('1')
  await expect(page.locator('html')).toHaveAttribute('data-last-command-version', '1')
  await page.keyboard.press('Alt+Shift+R')
  await expect(picker).toHaveAttribute('aria-expanded', 'true')
  await expect(search).toBeFocused()
})
