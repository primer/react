import path from 'node:path'
import {expect, test} from '@playwright/test'
import {buildReactTailwindFixture, reactTailwindPackageRoot} from '../test-helpers/react-tailwind-fixture'

const packageRoot = reactTailwindPackageRoot
let fixtureScript: string

test.beforeAll(async () => {
  fixtureScript = await buildReactTailwindFixture('script/button-loading-browser.tsx', process.env.BASE_UI_REACT_DIR)
})

for (const [theme, direction, width] of [
  ['light', 'ltr', 320],
  ['dark', 'rtl', 768],
  ['light_high_contrast', 'ltr', 1440],
  ['dark_high_contrast', 'rtl', 320],
] as const) {
  test(`text-only loading controls resist host visibility and positioning utilities (${theme}, ${direction}) @aat`, async ({
    page,
  }) => {
    await page.setViewportSize({width, height: 800})
    await page.goto('about:blank?id=button-loading-fixture')
    await page.evaluate(
      ({colorMode, dir}) => {
        document.documentElement.lang = 'en'
        document.documentElement.dir = dir
        const mode = colorMode.startsWith('dark') ? 'dark' : 'light'
        document.documentElement.setAttribute('data-color-mode', mode)
        document.documentElement.setAttribute(`data-${mode}-theme`, colorMode)
        document.title = 'Loading buttons'
        const root = document.createElement('main')
        root.id = 'root'
        document.body.append(root)
      },
      {colorMode: theme, dir: direction},
    )
    await page.addStyleTag({path: path.join(packageRoot, 'dist/styles.css')})
    await page.addStyleTag({
      content: '.invisible { visibility: unset !important; } .absolute { position: static !important; }',
    })
    await page.addScriptTag({content: fixtureScript})

    for (const [testId, role, name, counter, description] of [
      ['action', 'button', 'Publish', 'action-count', 'Loading Saves the draft'],
      ['link', 'link', 'Documentation', 'link-count', 'Loading Opens the guide'],
    ] as const) {
      const control = page.getByTestId(testId)
      const idleWidth = await control.evaluate(element => element.getBoundingClientRect().width)
      await expect(control.locator('[role="status"]')).toHaveCount(0)
      await control.focus()
      await control.press('Enter')
      await expect(control).toBeFocused()
      await expect(control).not.toHaveAttribute('aria-busy')
      await expect(control).toHaveAttribute('aria-disabled', 'true')
      await expect(page.getByRole(role, {name})).toHaveAccessibleDescription(description)
      await expect(control.locator('[role="status"]')).toHaveText('Loading')

      const label = control.locator('[data-component="text"]')
      const spinner = control.locator('[data-component="leadingVisual"]')
      await expect(label).toHaveCSS('visibility', 'hidden')
      await expect(spinner).toHaveCSS('position', 'absolute')
      const geometry = await control.evaluate(element => {
        const labelRect = element.querySelector('[data-component="text"]')!.getBoundingClientRect()
        const spinnerRect = element.querySelector('[data-component="leadingVisual"]')!.getBoundingClientRect()
        return {
          width: element.getBoundingClientRect().width,
          labelCenter: labelRect.x + labelRect.width / 2,
          spinnerCenter: spinnerRect.x + spinnerRect.width / 2,
        }
      })
      expect(Math.abs(geometry.width - idleWidth)).toBeLessThan(0.5)
      expect(Math.abs(geometry.spinnerCenter - geometry.labelCenter)).toBeLessThan(0.5)

      await control.press('Enter')
      if (role === 'button') await control.press('Space')
      await control.dispatchEvent('click')
      await expect(page.getByTestId(counter)).toHaveText('1')

      await page.getByTestId('complete').dispatchEvent('click')
      await expect(control).toBeFocused()
      await expect(control).not.toHaveAttribute('aria-busy')
      await expect(control).not.toHaveAttribute('aria-disabled', 'true')
      await expect(label).toHaveCSS('visibility', 'visible')
      await expect(spinner).toHaveCount(0)
      await control.press('Enter')
      await expect(page.getByTestId(counter)).toHaveText('2')
    }

    for (const [testId, role, name, description, expectedMessages] of [
      ['external-action', 'button', 'Save settings', 'Saves the preferences', 'Saving settings'],
      ['external-link', 'link', 'Open guide', 'Opens the documentation', 'Saving settings, Opening guide'],
    ] as const) {
      const control = page.getByTestId(testId)
      await control.focus()
      await control.press('Enter')
      await expect(control).toBeFocused()
      await expect(control).toHaveAttribute('aria-disabled', 'true')
      await expect(control).not.toHaveAttribute('aria-busy')
      await expect(page.getByRole(role, {name})).toHaveAccessibleDescription(description)
      await expect(control.locator('[role="status"]')).toHaveCount(0)
      await expect(page.getByTestId('host-messages')).toHaveText(expectedMessages)
      await control.press('Enter')
      await expect(page.getByTestId('host-messages')).toHaveText(expectedMessages)
    }

    const shortIdle = await page.getByTestId('short-idle').evaluate(element => element.getBoundingClientRect().width)
    const shortLoading = await page
      .getByTestId('short-loading')
      .evaluate(element => element.getBoundingClientRect().width)
    expect(Math.abs(shortIdle - shortLoading)).toBeLessThan(0.5)
    await expect(page.getByTestId('with-visual').locator('[data-component="text"]')).toHaveCSS('visibility', 'visible')
    await expect(page.getByTestId('with-count').locator('[data-component="text"]')).toHaveCSS('visibility', 'visible')
    await expect(page.getByTestId('with-trailing-visual').locator('[data-component="text"]')).toHaveCSS(
      'visibility',
      'visible',
    )
    await expect(page.getByTestId('with-trailing-action').locator('[data-component="text"]')).toHaveCSS(
      'visibility',
      'visible',
    )
    await expect(page).toHaveNoViolations()
  })
}
