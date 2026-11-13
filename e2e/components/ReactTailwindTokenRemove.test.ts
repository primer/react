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
        entry: path.join(packageRoot, 'script/token-remove-label-browser.tsx'),
        formats: ['iife'],
        name: 'TokenRemoveLabelFixture',
      },
    },
  })
  const outputs = Array.isArray(result) ? result : [result]
  const script = outputs
    .flatMap(output => ('output' in output ? output.output : []))
    .find(file => file.type === 'chunk')
  if (!script) throw new Error('Token fixture build did not return a script')
  fixtureScript = script.code
})

test('rich-text tokens expose distinct remove names without changing interactive removal @aat', async ({page}) => {
  await page.goto('about:blank?id=token-remove-label-fixture')
  await page.evaluate(() => {
    document.documentElement.lang = 'en'
    document.title = 'Removable tokens'
    const root = document.createElement('main')
    root.id = 'root'
    document.body.append(root)
  })
  await page.addStyleTag({path: path.join(packageRoot, 'dist/theme.css')})
  await page.addStyleTag({path: path.join(packageRoot, 'dist/styles.css')})
  await page.addScriptTag({content: fixtureScript})

  const before = page.getByRole('button', {name: 'Before', exact: true})
  const tokenRemove = page.getByRole('button', {name: 'Remove linked pull request #42', exact: true})
  const labelRemove = page.getByRole('button', {name: 'Remove linked pull request #43', exact: true})
  const action = page.getByRole('link', {
    name: 'Open pull request #44 (press backspace or delete to remove)',
    exact: true,
  })

  await before.focus()
  await page.keyboard.press('Tab')
  await expect(tokenRemove).toBeFocused()
  await page.keyboard.press('Space')
  await expect(page.getByTestId('token-removals')).toHaveText('1')

  await page.keyboard.press('Tab')
  await expect(labelRemove).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.getByTestId('label-removals')).toHaveText('1')

  await page.keyboard.press('Tab')
  await expect(action).toBeFocused()
  await page.keyboard.press('Backspace')
  await expect(page.getByTestId('interactive-removals')).toHaveText('1')

  const affordance = page.getByTestId('interactive-token').locator('[data-component="Token.RemoveButton"]')
  await expect(affordance).toHaveAttribute('aria-hidden', 'true')
  await expect(affordance).not.toHaveAttribute('aria-label')
  await expect(page.getByRole('button', {name: 'Not a separate button'})).toHaveCount(0)
  await affordance.click()
  await expect(page.getByTestId('interactive-removals')).toHaveText('2')
  await expect(page).toHaveNoViolations()
})
