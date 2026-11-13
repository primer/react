import {execFileSync} from 'node:child_process'
import {createRequire} from 'node:module'
import path from 'node:path'
import {expect, test} from '@playwright/test'
import {reactTailwindHostUtilities} from '../test-helpers/react-tailwind-fixture'

const styles = path.resolve(__dirname, '../../packages/react-tailwind/dist/styles.css')
const fixture = path.resolve(__dirname, '../../packages/react-tailwind/script/navlist-button-ssr.tsx')
const reactWorkspaceRequire = createRequire(path.resolve(__dirname, '../../packages/react/package.json'))
let markup: {unscoped: string; scoped: string; names: string}

test.beforeAll(() => {
  markup = JSON.parse(
    execFileSync(process.execPath, ['--import', reactWorkspaceRequire.resolve('tsx'), fixture], {encoding: 'utf8'}),
  )
})

for (const theme of ['light', 'dark', 'light_high_contrast', 'dark_high_contrast']) {
  test(`NavList button items match link presentation in ${theme} @aat`, async ({page}) => {
    test.setTimeout(30_000)
    const colorMode = theme.startsWith('dark') ? 'dark' : 'light'
    // The shared axe matcher reads a Storybook-style ID from the page URL.
    await page.goto('about:blank?id=navlist-button-fixture')

    for (const width of [320, 768, 1440]) {
      await page.setViewportSize({width, height: 900})
      for (const baseStyles of [false, true]) {
        await page.setContent(baseStyles ? markup.scoped : markup.unscoped)
        await page.evaluate(
          ({colorMode, theme}) => {
            document.documentElement.lang = 'en'
            document.documentElement.setAttribute('data-color-mode', colorMode)
            document.documentElement.setAttribute(`data-${colorMode}-theme`, theme)
            document.title = 'Settings'
            document.body.style.font = '16px Georgia'
            document.body.style.backgroundColor = 'var(--bgColor-default)'
            document.body.style.color = 'var(--fgColor-default)'
          },
          {colorMode, theme},
        )
        await page.addStyleTag({path: styles})
        await page.addStyleTag({path: reactTailwindHostUtilities})
        await page.addStyleTag({content: '.p-0 { padding: 0 !important; }'})

        const presentation = await page.locator('[data-component="NavList.Item"]').evaluateAll(items =>
          Object.fromEntries(
            items.map(item => {
              const style = getComputedStyle(item)
              const label = item.querySelector('[data-item-label]')
              const id = item.getAttribute('data-testid')
              if (!id || !label || !item.parentElement) throw new Error('NavList item is missing its ID, label, or row')
              const rect = item.getBoundingClientRect()
              const labelRect = label.getBoundingClientRect()
              return [
                id,
                {
                  background: style.backgroundColor,
                  border: style.borderTopWidth,
                  boxSizing: style.boxSizing,
                  color: style.color,
                  cursor: style.cursor,
                  font: style.fontFamily,
                  fontWeight: getComputedStyle(label).fontWeight,
                  height: rect.height,
                  labelX: labelRect.left - rect.left,
                  labelY: labelRect.top - rect.top,
                  rowBackground: getComputedStyle(item.parentElement).backgroundColor,
                  width: rect.width,
                },
              ]
            }),
          ),
        )

        expect(presentation.button).toEqual(presentation.link)
        expect(presentation['custom-button']).toEqual(presentation.link)
        expect(presentation['current-button']).toEqual(presentation['current-link'])
        expect(presentation['inactive-button']).toEqual(presentation['inactive-link'])
        expect(presentation.button).toMatchObject({
          background: 'rgba(0, 0, 0, 0)',
          border: '0px',
          font: 'Georgia',
          labelX: 8,
        })
        expect(presentation.button.height).toBeGreaterThanOrEqual(24)
        expect(presentation.button.width).toBeGreaterThanOrEqual(24)
        expect(presentation['current-button'].rowBackground).not.toBe(presentation.button.rowBackground)
        expect(presentation['inactive-button'].cursor).toBe('not-allowed')
        expect(presentation.override.boxSizing).toBe('border-box')
        expect(presentation.override.border).toBe('2px')
        expect(presentation.override.background).not.toBe('rgba(0, 0, 0, 0)')
        expect(presentation.override.font).not.toBe('Georgia')
        await expect(page.getByTestId('current-button')).toHaveAttribute('aria-current', 'page')
        await expect(page.getByTestId('inactive-button')).toHaveAttribute('aria-disabled', 'true')

        await page.keyboard.press('Tab')
        await expect(page.getByTestId('link')).toBeFocused()
        await page.keyboard.press('Tab')
        await expect(page.getByTestId('button')).toBeFocused()
        await expect(page.getByTestId('button')).toHaveCSS('outline-style', 'solid')
        await expect(page.getByTestId('button')).toHaveCSS('outline-width', '2px')
      }
    }

    await expect(page).toHaveNoViolations()
  })
}

test('NavList button focus remains visible in forced colors @aat', async ({page}) => {
  await page.emulateMedia({forcedColors: 'active'})
  await page.goto('about:blank?id=navlist-button-forced-colors')

  for (const baseStyles of [false, true]) {
    await page.setContent(baseStyles ? markup.scoped : markup.unscoped)
    await page.addStyleTag({path: styles})
    await page.addStyleTag({path: reactTailwindHostUtilities})
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')

    const button = page.getByTestId('button')
    await expect(button).toBeFocused()
    await expect(button).toHaveCSS('outline-style', 'solid')
    await expect(button).toHaveCSS('outline-width', '2px')
    const colors = await button.evaluate(element => ({
      outline: getComputedStyle(element).outlineColor,
      background: getComputedStyle(document.body).backgroundColor,
    }))
    expect(colors.outline).not.toBe(colors.background)
  }
})

test('NavList leading visuals and descriptions have distinct accessible names @aat', async ({page}) => {
  await page.goto('about:blank?id=navlist-leading-visual-fixture')
  await page.setContent(markup.names)
  await page.evaluate(() => {
    document.documentElement.lang = 'en'
    document.title = 'Deployments'
  })
  await page.addStyleTag({path: styles})
  await page.addStyleTag({path: reactTailwindHostUtilities})

  await expect(page.locator('a[href="#natural"]')).toHaveAccessibleName(/Done\s*Natural name/)
  const described = page.locator('a[href="#description"]')
  await expect(described).toHaveAccessibleName('Named by label')
  await expect(described).toHaveAccessibleDescription('Deployment details')
  const status = page.locator('a[href="#status"]')
  await expect(status).toHaveAccessibleName('Described status')
  await expect(status).toHaveAccessibleDescription('Done')
  await expect(page.locator('a[href="#explicit"]')).toHaveAccessibleName('Custom name')
  await expect(page).toHaveNoViolations()
})
