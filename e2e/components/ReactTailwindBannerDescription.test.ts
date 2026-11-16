import path from 'node:path'
import {expect, test, type Page} from '@playwright/test'
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
        entry: path.join(packageRoot, 'script/banner-description-browser.tsx'),
        formats: ['iife'],
        name: 'BannerDescriptionFixture',
      },
    },
  })
  const outputs = Array.isArray(result) ? result : [result]
  const script = outputs
    .flatMap(output => ('output' in output ? output.output : []))
    .find(file => file.type === 'chunk')
  if (!script) throw new Error('Banner description fixture build did not return a script')
  fixtureScript = script.code
})

async function descriptionInChromium(page: Page, selector: string) {
  const session = await page.context().newCDPSession(page)
  try {
    const {root} = await session.send('DOM.getDocument')
    const {nodeId} = await session.send('DOM.querySelector', {nodeId: root.nodeId, selector})
    if (!nodeId) throw new Error(`No node matched ${selector}`)
    const {nodes} = await session.send('Accessibility.getPartialAXTree', {nodeId, fetchRelatives: false})
    return nodes.find(node => node.role?.value === 'textbox')?.description?.value
  } finally {
    await session.detach()
  }
}

test('associates a field with banner title and details @aat', async ({page}) => {
  await page.goto('about:blank')
  await page.evaluate(() => {
    document.documentElement.lang = 'en'
    const root = document.createElement('main')
    root.id = 'root'
    document.body.append(root)
  })
  await page.addStyleTag({path: path.join(packageRoot, 'dist/styles.css')})
  await page.addScriptTag({content: fixtureScript})

  const rootInput = page.getByRole('textbox', {name: 'Root reference'})
  const separateInput = page.getByRole('textbox', {name: 'Separate references'})
  const groupedInput = page.getByRole('textbox', {name: 'Grouped reference'})
  await expect(rootInput).toBeVisible()
  await expect(page.locator('#root-errors')).toHaveAttribute('aria-labelledby', /\S/)
  const expected = 'FormControl error Filter contains 1 issue: Invalid value for state'
  await expect(rootInput).toHaveAccessibleDescription(/FormControl error Filter contains 1 issue:/)
  await expect(separateInput).toHaveAccessibleDescription(expected)
  await expect(groupedInput).toHaveAccessibleDescription(expected)
  expect(await descriptionInChromium(page, '#root-input')).toContain('FormControl error Filter contains 1 issue:')
  expect(await descriptionInChromium(page, '#separate-input')).toBe(expected)
  expect(await descriptionInChromium(page, '#grouped-input')).toBe(expected)
  await expect(page.getByRole('region', {name: 'Filter contains 1 issue:'})).toHaveCount(3)

  await page.getByRole('button', {name: 'Update detail'}).click()
  const updated = 'FormControl error Filter contains 1 issue: State must be open or closed'
  await expect(separateInput).toHaveAccessibleDescription(updated)
  await expect(groupedInput).toHaveAccessibleDescription(updated)
  expect(await descriptionInChromium(page, '#separate-input')).toBe(updated)
  expect(await descriptionInChromium(page, '#grouped-input')).toBe(updated)
})
