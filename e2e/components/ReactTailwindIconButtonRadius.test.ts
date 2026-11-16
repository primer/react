import path from 'node:path'
import {expect, test} from '@playwright/test'
import {
  buildReactTailwindFixture,
  reactTailwindHostUtilities,
  reactTailwindPackageRoot,
} from '../test-helpers/react-tailwind-fixture'

let fixtureScript: string

test.beforeAll(async () => {
  fixtureScript = await buildReactTailwindFixture('script/icon-button-radius-browser.tsx')
})

for (const width of [320, 1280]) {
  for (const direction of ['ltr', 'rtl'] as const) {
    test(`a full radius replacement avoids the legacy utility collision at ${width}px (${direction}) @aat`, async ({
      page,
    }) => {
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
      await page.addStyleTag({path: reactTailwindHostUtilities})
      await page.addStyleTag({
        content: `
          /* Mirrors the responsive utility in @primer/css/utilities/borders.scss. */
          @media (min-width: 768px) {
            .rounded-md { border-radius: var(--borderRadius-medium, 6px) !important; }
          }
          .square-start {
            border-start-start-radius: 0;
            border-end-start-radius: 0;
          }
          .replacement-radius {
            border-radius: var(--borderRadius-medium, 6px);
            border-start-start-radius: 0;
            border-end-start-radius: 0;
          }
        `,
      })
      await page.addScriptTag({content: fixtureScript})

      const readRadii = (label: string) =>
        page.getByRole('button', {name: label}).evaluate(element => {
          const style = getComputedStyle(element)
          return {
            classes: element.className.split(/\s+/),
            startStart: style.borderStartStartRadius,
            endStart: style.borderEndStartRadius,
            startEnd: style.borderStartEndRadius,
            endEnd: style.borderEndEndRadius,
          }
        })

      // The package-owned `primer:rounded-md` class is not matched by the injected legacy `.rounded-md` rule.
      const cssOnly = await readRadii('CSS module only')
      expect(cssOnly.classes).toContain('primer:rounded-md')
      expect(cssOnly.classes).not.toContain('rounded-md')
      expect(cssOnly.startStart).toBe('0px')
      expect(cssOnly.endStart).toBe('0px')

      const partial = await readRadii('Partial utility')
      expect(partial.classes).toContain('primer:rounded-md')
      expect(partial.classes).not.toContain('rounded-md')
      expect(partial.startStart).toBe('0px')
      expect(partial.endStart).toBe('0px')

      const replacement = await readRadii('Full replacement')
      expect(replacement.classes).not.toContain('primer:rounded-md')
      expect(replacement.classes).not.toContain('rounded-md')
      expect(replacement.classes).toContain('rounded-none')
      expect(replacement.startStart).toBe('0px')
      expect(replacement.endStart).toBe('0px')
      expect(replacement.startEnd).toBe('6px')
      expect(replacement.endEnd).toBe('6px')
    })
  }
}
