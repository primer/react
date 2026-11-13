import path from 'node:path'
import {expect, test, type Locator, type Page} from '@playwright/test'
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
        entry: path.join(packageRoot, 'script/selectpanel-nested-layer-browser.tsx'),
        formats: ['iife'],
        name: 'SelectPanelNestedLayerFixture',
      },
    },
  })
  const outputs = Array.isArray(result) ? result : [result]
  const script = outputs
    .flatMap(output => ('output' in output ? output.output : []))
    .find(file => file.type === 'chunk')
  if (!script) throw new Error('SelectPanel layer fixture build did not return a script')
  if (alternateBaseUi && !script.moduleIds.some(id => id.startsWith(`${alternateBaseUi}/`))) {
    throw new Error('The alternate Base UI package was not included in the fixture')
  }
  fixtureScript = script.code
})

async function setup(
  page: Page,
  mode: string,
  presentation = 'fullscreen',
  parent = 'reject',
  root = 'default',
  kind = 'panel',
) {
  await page.setViewportSize({width: 375, height: 667})
  await page.goto(`about:blank?mode=${mode}&presentation=${presentation}&parent=${parent}&root=${root}&kind=${kind}`)
  await page.evaluate(() => {
    document.documentElement.lang = 'en'
    const root = document.createElement('main')
    root.id = 'root'
    document.body.append(root)
  })
  await page.addStyleTag({path: path.join(packageRoot, 'dist/theme.css')})
  await page.addStyleTag({path: path.join(packageRoot, 'dist/styles.css')})
  await page.addStyleTag({
    content: ':root { --zIndex-modal: 400; --zIndex-popover: 500; } .raised-viewport { z-index: 501; }',
  })
  await page.addScriptTag({content: fixtureScript})
  await page.getByRole('button', {name: 'Parent picker'}).click()
  await page.getByRole('button', {name: 'Child picker'}).click()
}

async function receivesPointer(locator: Locator) {
  return locator.evaluate(element => {
    const bounds = element.getBoundingClientRect()
    const target = document.elementFromPoint(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2)
    return Boolean(target && element.contains(target))
  })
}

test('an inline fullscreen child can still be clipped by its anchored parent @aat', async ({page}) => {
  await setup(page, 'inline')
  const option = page.getByRole('dialog', {name: 'Child picker'}).getByRole('option', {name: 'Child option'})
  await expect(option).toBeVisible()
  await expect.poll(() => receivesPointer(option)).toBe(false)
})

for (const [mode, nestedReceivesPointer, backdropAboveParent] of [
  ['default', true, true],
  ['positioner', false, true],
  ['container', true, true],
] as const) {
  test(`nested popover hit testing with ${mode} layering @aat`, async ({page}) => {
    await setup(page, mode)
    const dialog = page.getByRole('dialog', {name: 'Child picker'})
    await expect.poll(() => receivesPointer(dialog.getByRole('option', {name: 'Child option'}))).toBe(true)
    await dialog.getByRole('button', {name: 'More details'}).click()
    const action = page.getByRole('button', {name: 'Nested action'})
    await expect(action).toBeVisible()
    await expect.poll(() => receivesPointer(action)).toBe(nestedReceivesPointer)
    if (nestedReceivesPointer) {
      await action.click()
      await expect(page.getByTestId('nested-actions')).toHaveText('1')
      await page.keyboard.press('Escape')
      await expect(action).toBeHidden()
      await expect(dialog.getByRole('button', {name: 'More details'})).toBeFocused()
      await page.keyboard.press('Escape')
      await expect(dialog).toBeHidden()
      await expect(page.getByRole('button', {name: 'Child picker'})).toBeFocused()
    }
  })

  test(`modal backdrop ordering with ${mode} layering @aat`, async ({page}) => {
    await setup(page, mode, 'modal')
    const result = await page
      .locator('[data-component="Popover.Positioner"]')
      .first()
      .evaluate(positioner => {
        const option = [...positioner.querySelectorAll('[data-component="SelectPanel.Item"]')].find(item =>
          item.textContent.includes('Parent option'),
        )
        if (!option) throw new Error('Missing parent option')
        const bounds = option.getBoundingClientRect()
        const elements = document.elementsFromPoint(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2)
        const backdrop = document.querySelector('[data-component="Dialog.Backdrop"]')
        return {
          backdropIndex: elements.findIndex(element => element === backdrop),
          parentIndex: elements.findIndex(element => positioner.contains(element)),
        }
      })
    expect(result.backdropIndex).toBeGreaterThanOrEqual(0)
    expect(result.parentIndex).toBeGreaterThanOrEqual(0)
    expect(result.backdropIndex < result.parentIndex).toBe(backdropAboveParent)
  })
}

test('nested dialog layers work with a named parent portal root @aat', async ({page}) => {
  await setup(page, 'default', 'fullscreen', 'accept', 'named')
  const dialog = page.getByRole('dialog', {name: 'Child picker'})
  await dialog.getByRole('option', {name: 'Child option'}).click()
  await expect(page.getByTestId('selected')).toHaveText('Child option')
  await expect(page.getByRole('button', {name: 'Child option'})).toBeFocused()
  await expect(page.getByRole('option', {name: 'Parent option'})).toBeVisible()
})

test('a further modal stays above a popover within the child dialog @aat', async ({page}) => {
  await setup(page, 'default', 'fullscreen', 'accept')
  const child = page.getByRole('dialog', {name: 'Child picker'})
  await child.getByRole('button', {name: 'More details'}).click()
  await page.getByRole('button', {name: 'Open nested dialog'}).click()
  const nested = page.getByRole('dialog', {name: 'Nested dialog'})
  await nested.getByRole('button', {name: 'Close nested dialog'}).click()
  await expect(nested).toBeHidden()
  await expect(page.getByRole('button', {name: 'Open nested dialog'})).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(child.getByRole('button', {name: 'More details'})).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(child).toBeHidden()
  await expect(page.getByRole('button', {name: 'Child picker'})).toBeFocused()
})

for (const mode of ['default', 'container']) {
  test(`${mode} layering permits selection and restores the trigger @aat`, async ({page}) => {
    await setup(page, mode)
    const dialog = page.getByRole('dialog', {name: 'Child picker'})
    await expect(dialog.getByRole('combobox')).toBeFocused()
    await dialog.getByRole('option', {name: 'Child option'}).click()
    await expect(page.getByTestId('selected')).toHaveText('Child option')
    await expect(dialog).toBeHidden()
    await expect(page.getByRole('button', {name: 'Child option'})).toBeFocused()
    await expect(page.getByRole('option', {name: 'Parent option'})).toBeVisible()
  })

  test(`${mode} layering traps focus and restores the trigger on Escape @aat`, async ({page}) => {
    await setup(page, mode, 'fullscreen', 'accept')
    const dialog = page.getByRole('dialog', {name: 'Child picker'})
    await expect(dialog.getByRole('combobox')).toBeFocused()
    for (let count = 0; count < 6; count++) {
      await page.keyboard.press('Tab')
      await expect
        .poll(() => dialog.evaluate(element => element.contains(element.ownerDocument.activeElement)))
        .toBe(true)
    }
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await expect(page.getByRole('button', {name: 'Child picker'})).toBeFocused()
    await expect(page.getByRole('option', {name: 'Parent option'})).toBeVisible()
  })
}

for (const kind of ['dialog', 'confirmation'] as const) {
  test(`${kind} and its nested popover stay above an anchored picker @aat`, async ({page}) => {
    await setup(page, 'default', 'fullscreen', 'accept', 'default', kind)
    const dialog = page.getByRole(kind === 'dialog' ? 'dialog' : 'alertdialog', {name: 'Child picker'})
    const prefix = kind === 'dialog' ? 'Dialog' : 'ConfirmationDialog'
    await expect(page.locator(`[data-component="${prefix}.Backdrop"]`)).toHaveCSS('z-index', '500')
    await expect(page.locator(`[data-component="${prefix}.Viewport"]`)).toHaveCSS('z-index', '500')
    await dialog.getByRole('button', {name: 'More details'}).click()
    const action = page.getByRole('button', {name: 'Nested action'})
    await action.click()
    await expect(page.getByTestId('nested-actions')).toHaveText('1')
    await page.keyboard.press('Escape')
    await expect(action).toBeHidden()
    await expect(dialog.getByRole('button', {name: 'More details'})).toBeFocused()
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await expect(page.getByRole('button', {name: 'Child picker'})).toBeFocused()
    await expect(page.getByRole('option', {name: 'Parent option'})).toBeVisible()
  })
}
