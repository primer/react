import path from 'node:path'
import {expect, test} from '@playwright/test'
import {buildReactTailwindFixture, reactTailwindPackageRoot} from '../test-helpers/react-tailwind-fixture'

let fixtureScript: string

test.beforeAll(async () => {
  fixtureScript = await buildReactTailwindFixture('script/action-list-static-browser.tsx')
})

test('static rows forward keyboard and descendant capture events in the browser @aat', async ({page}) => {
  await page.goto('about:blank?id=action-list-static')
  await page.evaluate(() => {
    document.documentElement.lang = 'en'
    document.title = 'Static results'
    const root = document.createElement('main')
    root.id = 'root'
    document.body.append(root)
  })
  await page.addStyleTag({path: path.join(reactTailwindPackageRoot, 'dist/styles.css')})
  await page.addStyleTag({content: '.consumer-static-row { outline: 2px solid rgb(1, 2, 3); }'})
  await page.addScriptTag({content: fixtureScript})

  const list = page.getByRole('list', {name: 'Results'})
  const row = list.getByRole('listitem')
  const button = row.getByRole('button', {name: 'Open'})
  const link = row.getByRole('link', {name: 'Details'})
  const events = page.getByTestId('events')
  await expect(row).toHaveCount(1)
  await expect(row).toHaveClass(/consumer-static-row/)
  await expect(row).toHaveCSS('outline-width', '2px')
  await expect(row).not.toHaveAttribute('aria-disabled')
  await expect(row).toContainText('Owned by octocat')
  await expect(row).toContainText('Changes blocked by enterprise')

  await row.focus()
  await page.keyboard.press('ArrowDown')
  await expect(events).toHaveText('keyDownCapture:LI:LI,keyDown:LI:LI,keyUpCapture:LI:LI')
  await page.keyboard.press('Tab')
  await expect(button).toBeFocused()
  await button.click()
  await expect(events).toContainText('clickCapture:LI:BUTTON')
  await expect(page.getByTestId('activations')).toHaveText('Button activations: 1')

  await page.keyboard.press('Tab')
  await expect(link).toBeFocused()
  const newPage = page.context().waitForEvent('page', {timeout: 3000})
  await link.click({button: 'middle'})
  await expect(await newPage).toHaveURL(/#details$/)
  await expect(events).toContainText('auxClickCapture:LI:A')
  await expect(page).toHaveNoViolations()
})
