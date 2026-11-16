import path from 'node:path'
import {expect, test} from '@playwright/test'
import {buildReactTailwindFixture, reactTailwindPackageRoot} from '../test-helpers/react-tailwind-fixture'

let fixtureScript: string

test.beforeAll(async () => {
  fixtureScript = await buildReactTailwindFixture('script/text-input-layout-browser.tsx')
})

for (const width of [200, 320, 1280]) {
  for (const direction of ['ltr', 'rtl'] as const) {
    test(`full-width inputs fit without a global reset at ${width}px (${direction}) @aat`, async ({page}) => {
      await page.setViewportSize({width, height: 720})
      await page.goto('about:blank')
      await page.evaluate(dir => {
        document.documentElement.lang = 'en'
        document.documentElement.dir = dir
        const root = document.createElement('div')
        root.id = 'root'
        document.body.append(root)
      }, direction)
      await page.addStyleTag({path: path.join(reactTailwindPackageRoot, 'dist/styles.css')})
      await page.addScriptTag({content: fixtureScript})

      for (const name of ['plain-small', 'leading-medium', 'visuals-large', 'action-medium']) {
        const wrapper = page.locator(`[data-case="${name}"] [data-component="TextInput"]`)
        const dimensions = await wrapper.evaluate(element => {
          const container = element.parentElement
          const input = element.querySelector('input')
          if (!container || !input) throw new Error('Expected a text input and container')
          const wrapperBounds = element.getBoundingClientRect()
          const containerBounds = container.getBoundingClientRect()
          const inputBounds = input.getBoundingClientRect()
          return {
            availableWidth: containerBounds.width,
            wrapperWidth: wrapperBounds.width,
            wrapperLeft: wrapperBounds.left,
            wrapperRight: wrapperBounds.right,
            inputLeft: inputBounds.left,
            inputRight: inputBounds.right,
            height: wrapperBounds.height,
          }
        })
        expect(Math.abs(dimensions.wrapperWidth - dimensions.availableWidth)).toBeLessThanOrEqual(0.5)
        expect(dimensions.inputLeft).toBeGreaterThanOrEqual(dimensions.wrapperLeft - 0.5)
        expect(dimensions.inputRight).toBeLessThanOrEqual(dimensions.wrapperRight + 0.5)
        if (name === 'visuals-large') expect(dimensions.height).toBe(40)
      }

      const intrinsic = page.locator('[data-case="intrinsic-large"] [data-component="TextInput"]')
      expect(await intrinsic.evaluate(element => element.getBoundingClientRect().height)).toBe(40)

      const input = page.getByRole('textbox', {name: 'Leading medium'})
      await input.fill('Primer')
      await expect(input).toHaveValue('Primer')
    })
  }
}
