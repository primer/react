import path from 'node:path'
import {expect, test, type Page} from '@playwright/test'
import {build} from 'vite'

const packageRoot = path.resolve(__dirname, '../../packages/react-tailwind')
const alternateBaseUi = process.env.BASE_UI_REACT_DIR
let fixtureScript: string

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
        entry: path.join(packageRoot, 'script/selectpanel-fullscreen-footer-browser.tsx'),
        formats: ['iife'],
        name: 'SelectPanelFullscreenFooterFixture',
      },
    },
  })
  const outputs = Array.isArray(result) ? result : [result]
  const script = outputs
    .flatMap(output => ('output' in output ? output.output : []))
    .find(file => file.type === 'chunk')
  if (!script) throw new Error('SelectPanel footer fixture build did not return a script')
  if (alternateBaseUi && !script.moduleIds.some(id => id.startsWith(`${alternateBaseUi}/`))) {
    throw new Error('The alternate Base UI package was not included in the fixture')
  }
  fixtureScript = script.code
})

async function setup(page: Page, query: string, width = 375, height = 667) {
  await page.setViewportSize({width, height})
  await page.goto(`about:blank?${query}`)
  await page.evaluate(() => {
    document.documentElement.lang = 'en'
    const root = document.createElement('main')
    root.id = 'root'
    document.body.append(root)
  })
  await page.addStyleTag({path: path.join(packageRoot, 'dist/theme.css')})
  await page.addStyleTag({path: path.join(packageRoot, 'dist/styles.css')})
  await page.addStyleTag({content: ':root { --zIndex-modal: 400; --zIndex-popover: 500; }'})
  await page.addScriptTag({content: fixtureScript})
  await page.locator('[data-component="SelectPanel.Trigger"]').click()
  await expect(page.getByRole('dialog', {name: 'Projects'})).toBeVisible()
}

for (const width of [320, 375]) {
  for (const [mode, actions, hasClose] of [
    ['multiple-cancel', ['Cancel', 'Save'], true],
    ['multiple', ['Save and close'], false],
    ['single-cancel', [], true],
    ['single', [], true],
  ] as const) {
    test(`${mode} shows the correct fullscreen actions at ${width}px @aat`, async ({page}) => {
      await setup(page, `mode=${mode}`, width)
      const dialog = page.getByRole('dialog', {name: 'Projects'})
      await expect(dialog).toHaveAttribute('aria-modal', 'true')
      await expect(dialog.getByRole('combobox', {name: 'Filter items'})).toBeFocused()
      for (const name of ['Cancel', 'Save', 'Save and close']) {
        const action = dialog.getByRole('button', {name, exact: true})
        if (actions.some(expected => expected === name)) {
          await expect(action).toBeVisible()
          const bounds = await action.boundingBox()
          expect(bounds?.width).toBeGreaterThanOrEqual(24)
          expect(bounds?.height).toBeGreaterThanOrEqual(24)
        } else {
          await expect(action).toHaveCount(0)
        }
      }
      await expect(dialog.getByRole('button', {name: 'Cancel and close'})).toHaveCount(hasClose ? 1 : 0)
      if (mode === 'multiple') {
        const footer = dialog.locator('[data-component="SelectPanel.Footer"]')
        const widthDifference = await footer.evaluate(element => {
          const button = element.querySelector('[data-component="SelectPanel.SaveAndCloseButton"]')
          if (!button) throw new Error('Missing Save and close button')
          const style = getComputedStyle(element)
          const contentWidth = element.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight)
          return Math.abs(button.getBoundingClientRect().width - contentWidth)
        })
        expect(widthDifference).toBeLessThanOrEqual(1)
      }
      await page.keyboard.press('Escape')
      await expect(dialog).toBeHidden()
      await expect(page.locator('[data-component="SelectPanel.Trigger"]')).toBeFocused()
    })
  }
}

test('fullscreen multiple selection saves and cancellation restores owner-managed state @aat', async ({page}) => {
  await setup(page, 'mode=multiple-cancel')
  const dialog = page.getByRole('dialog', {name: 'Projects'})
  await dialog.getByRole('option', {name: 'Mona'}).click()
  await expect(page.getByTestId('selected')).toHaveText('["Mona"]')
  await dialog.getByRole('combobox', {name: 'Filter items'}).focus()
  await page.keyboard.press('Tab')
  await expect(dialog.getByRole('button', {name: 'Cancel', exact: true})).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(dialog.getByRole('button', {name: 'Save', exact: true})).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(dialog).toBeHidden()
  await expect(page.locator('[data-component="SelectPanel.Trigger"]')).toBeFocused()
  await expect(page.getByTestId('events')).toContainText('close:selection')

  await page.locator('[data-component="SelectPanel.Trigger"]').click()
  await dialog.getByRole('option', {name: 'Hubot'}).click()
  await expect(page.getByTestId('selected')).toHaveText('["Mona","Hubot"]')
  await dialog.getByRole('button', {name: 'Cancel', exact: true}).click()
  await expect(dialog).toBeHidden()
  await expect(page.getByTestId('selected')).toHaveText('["Mona"]')
  await expect(page.getByTestId('events')).toContainText('close:cancel')
  await expect(page.locator('[data-component="SelectPanel.Trigger"]')).toBeFocused()
})

test('a secondary action remains available beside Save and close on narrow screens @aat', async ({page}) => {
  await setup(page, 'mode=multiple&secondary=true', 320)
  const dialog = page.getByRole('dialog', {name: 'Projects'})
  const secondary = dialog.getByRole('button', {name: 'Allow close'})
  const save = dialog.getByRole('button', {name: 'Save and close'})
  await expect(secondary).toBeVisible()
  await expect(save).toBeVisible()
  const secondaryBounds = await secondary.boundingBox()
  const saveBounds = await save.boundingBox()
  if (!secondaryBounds || !saveBounds) throw new Error('Missing footer action bounds')
  expect(secondaryBounds.x + secondaryBounds.width).toBeLessThanOrEqual(saveBounds.x)
  expect(saveBounds.x + saveBounds.width).toBeLessThanOrEqual(320)
  await save.click()
  await expect(dialog).toBeHidden()
  await expect(page.locator('[data-component="SelectPanel.Trigger"]')).toBeFocused()
})

test('fullscreen actions remain usable at a short, narrow viewport with enlarged text @aat', async ({page}) => {
  await setup(page, 'mode=multiple-cancel', 320, 256)
  await page.addStyleTag({content: 'html { font-size: 200%; }'})
  const dialog = page.getByRole('dialog', {name: 'Projects'})
  const option = dialog.getByRole('option', {name: 'Mona'})
  await option.scrollIntoViewIfNeeded()
  await option.click()
  await expect(page.getByTestId('selected')).toHaveText('["Mona"]')
  const save = dialog.getByRole('button', {name: 'Save', exact: true})
  await save.scrollIntoViewIfNeeded()
  const bounds = await save.boundingBox()
  if (!bounds) throw new Error('Missing Save button bounds')
  expect(bounds.x).toBeGreaterThanOrEqual(0)
  expect(bounds.x + bounds.width).toBeLessThanOrEqual(320)
  expect(bounds.y).toBeGreaterThanOrEqual(0)
  expect(bounds.y + bounds.height).toBeLessThanOrEqual(256)
  await save.click()
  await expect(dialog).toBeHidden()
  await expect(page.locator('[data-component="SelectPanel.Trigger"]')).toBeFocused()
})

test('fullscreen single selection closes immediately without requesting cancellation @aat', async ({page}) => {
  await setup(page, 'mode=single-cancel')
  const dialog = page.getByRole('dialog', {name: 'Projects'})
  await dialog.getByRole('option', {name: 'Mona'}).click()
  await expect(page.getByTestId('selected')).toHaveText('["Mona"]')
  await expect(page.getByTestId('events')).toContainText('close:selection')
  await expect(page.getByTestId('events')).not.toContainText('"cancel"')
  await expect(dialog).toBeHidden()
  await expect(page.locator('[data-component="SelectPanel.Trigger"]')).toBeFocused()
})

test('a rejected close retains focus in the fullscreen picker until a later accepted close @aat', async ({page}) => {
  await setup(page, 'mode=multiple-cancel&reject=true&secondary=true')
  const dialog = page.getByRole('dialog', {name: 'Projects'})
  const save = dialog.getByRole('button', {name: 'Save', exact: true})
  await save.focus()
  await page.keyboard.press('Enter')
  await expect(page.getByTestId('events')).toContainText('close:selection')
  await expect(dialog).toBeVisible()
  await expect(save).toBeFocused()
  const cancel = dialog.getByRole('button', {name: 'Cancel', exact: true})
  await cancel.focus()
  await page.keyboard.press('Space')
  await expect(page.getByTestId('events')).toContainText('close:cancel')
  await expect(dialog).toBeVisible()
  await expect(cancel).toBeFocused()
  await dialog.getByRole('button', {name: 'Allow close'}).click()
  await save.click()
  await expect(dialog).toBeHidden()
  await expect(page.locator('[data-component="SelectPanel.Trigger"]')).toBeFocused()
})

for (const query of ['mode=multiple-cancel&flag=off', 'mode=multiple-cancel&opt-out=true']) {
  test(`narrow anchored picker does not gain automatic footer actions: ${query} @aat`, async ({page}) => {
    await setup(page, query)
    const dialog = page.getByRole('dialog', {name: 'Projects'})
    await expect(dialog).toHaveAttribute('data-component', 'Popover.Popup')
    await expect(dialog.locator('[data-component="SelectPanel.Footer"]')).toHaveCount(0)
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await expect(page.locator('[data-component="SelectPanel.Trigger"]')).toBeFocused()
  })
}

for (const width of [375, 1024]) {
  test(`single modal selection remains deferred until Save at ${width}px @aat`, async ({page}) => {
    await setup(page, 'mode=modal-single', width)
    const dialog = page.getByRole('dialog', {name: 'Projects'})
    await dialog.getByRole('option', {name: 'Mona'}).click()
    await expect(page.getByTestId('selected')).toHaveText('[]')
    await dialog.getByRole('button', {name: 'Save', exact: true}).click()
    await expect(page.getByTestId('selected')).toHaveText('["Mona"]')
    await expect(dialog).toBeHidden()
    await expect(page.locator('[data-component="SelectPanel.Trigger"]')).toBeFocused()
  })
}
