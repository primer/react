import assert from 'node:assert/strict'
import {writeFile} from 'node:fs/promises'
import {createRequire} from 'node:module'
import {chromium, expect} from '@playwright/test'

const require = createRequire(import.meta.url)
const origin = process.env.STORYBOOK_URL || 'http://localhost:6018'
const browser = await chromium.launch({headless: true})
const results = []
const variants = ['before-workaround', 'primer-parts', 'raw-base-ui', 'primer-slash-command', 'raw-slash-command']
const themes = ['light', 'dark', 'light_high_contrast', 'dark_high_contrast']
const cases = themes.flatMap(theme => [320, 1024, 1440].map(width => ({theme, width})))
const errors = []

try {
  for (const variant of variants) {
    for (const {theme, width} of cases) {
      const page = await browser.newPage({viewport: {width, height: 768}})
      page.on('pageerror', error => errors.push(`${variant}/${theme}: ${error.message}`))
      const id = `react-tailwind-spikes-inlineautocomplete--${variant}`
      await page.goto(`${origin}/iframe.html?id=${id}&viewMode=story&globals=colorScheme:${theme}`)
      const slash = variant.includes('slash')
      const input = page.getByLabel(slash ? 'Command editor' : 'Comment editor', {exact: true})
      await expect(input).toBeVisible()
      // PrimerParts has a play function; wait for its deterministic final state before resetting.
      if (variant === 'primer-parts') await expect(input).toHaveValue('Hello @mona ')
      await input.fill(slash ? 'Hello /cl' : 'Hello @mo')
      const option = page.getByRole('option', {name: slash ? 'close' : 'mona', exact: true})
      await expect(option).toBeVisible()
      await expect(input).toHaveAttribute('role', 'combobox')
      await expect(input).toBeFocused()
      await expect.poll(() => input.getAttribute('aria-activedescendant')).toBeTruthy()
      const geometry = await input.evaluate(element => {
        const style = getComputedStyle(element)
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        context.font = style.font
        const rect = element.getBoundingClientRect()
        const active = document.getElementById(element.getAttribute('aria-activedescendant'))
        const popup = active.closest('[data-open][data-side]')
        const popupRect = popup.getBoundingClientRect()
        return {
          expectedX:
            rect.left +
            parseFloat(style.borderLeftWidth) +
            parseFloat(style.paddingLeft) +
            context.measureText(element.value).width,
          popupX: popupRect.left,
          popupY: popupRect.top,
          textareaTop: rect.top,
          textareaBottom: rect.bottom,
          inputColor: style.color,
          inputBackground: style.backgroundColor,
          inputFont: style.font,
          focusOutline: style.outlineStyle,
          optionColor: getComputedStyle(active).color,
          optionBackground: getComputedStyle(active).backgroundColor,
          optionHeight: active.getBoundingClientRect().height,
        }
      })
      // Base UI's default arrowPadding shifts even arrowless popups 5px around a zero-width anchor.
      assert.ok(Math.abs(geometry.popupX - (geometry.expectedX - 5)) <= 1, JSON.stringify(geometry))
      assert.ok(geometry.popupY > geometry.textareaTop && geometry.popupY < geometry.textareaBottom)
      assert.notEqual(geometry.focusOutline, 'none')
      assert.ok(geometry.optionHeight >= 24)
      await page.addScriptTag({path: require.resolve('axe-core/axe.min.js')})
      const axe = await page.evaluate(async () => {
        const result = await window.axe.run(document.body, {
          runOnly: {type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']},
        })
        const role = await window.axe.run(document.body, {runOnly: ['aria-allowed-role']})
        return {wcag: result.violations.map(item => item.id), role: role.violations.map(item => item.id)}
      })
      assert.deepEqual(axe.wcag, [])
      assert.deepEqual(axe.role, ['aria-allowed-role'])
      await input.press('Enter')
      await expect(input).toHaveValue(slash ? 'Hello ' : 'Hello @mona ')
      await expect(input).toBeFocused()
      if (slash) await expect(page.getByLabel('Last command')).toHaveText('close')
      if (!slash) {
        await input.fill('First line\n@mo')
        await expect(option).toBeVisible()
        const secondLineY = await option.evaluate(
          element => element.closest('[data-open][data-side]').getBoundingClientRect().top,
        )
        assert.ok(secondLineY > geometry.popupY + 10, 'Caret follows newline')
        await input.press('Home')
        const start = await input.evaluate(element => element.selectionStart)
        assert.equal(start, 11, 'Home stays native and moves to the start of the current line')
        await input.press('End')
        assert.equal(await input.evaluate(element => element.selectionStart), 14)
        await input.fill(`${'word '.repeat(30)}@mo`)
        await expect(option).toBeVisible()
        const wrappedY = await option.evaluate(
          element => element.closest('[data-open][data-side]').getBoundingClientRect().top,
        )
        assert.ok(wrappedY > secondLineY + 10, 'Caret follows soft wrapping')
        await input.fill(`${'line\n'.repeat(12)}@mo`)
        await expect(option).toBeVisible()
        const scroll = await input.evaluate(element => {
          element.scrollTop = element.scrollHeight
          element.dispatchEvent(new Event('scroll'))
          return element.scrollTop
        })
        assert.ok(scroll > 0)
        await expect
          .poll(() => option.evaluate(element => element.closest('[data-open][data-side]').getBoundingClientRect().top))
          .toBeLessThan(geometry.textareaBottom + 5)
        await input.fill('@mo')
        await input.press('Tab')
        await expect(input).toHaveValue('@mona ')
        await expect(input).toBeFocused()
        await input.fill('@mo')
        await input.press('Escape')
        await input.press('Escape')
        await expect(input).toHaveValue('@mo')
      }
      results.push({variant, theme, width, geometry, axe})
      await page.close()
    }
  }
  assert.deepEqual(errors, [], 'No Storybook runtime errors')
  // Compare rendered tokens/geometry, not just class spelling.
  for (const theme of themes) {
    const peers = results.filter(result => result.theme === theme && !result.variant.includes('slash'))
    for (const key of [
      'inputColor',
      'inputBackground',
      'inputFont',
      'optionColor',
      'optionBackground',
      'optionHeight',
    ]) {
      assert.equal(new Set(peers.map(peer => peer.geometry[key])).size, 1, `${theme}: ${key} parity`)
    }
  }
  if (process.env.SPIKE_RESULTS_FILE) await writeFile(process.env.SPIKE_RESULTS_FILE, JSON.stringify(results, null, 2))
  process.stdout.write(
    `Passed ${results.length} browser/theme cases; keyboard, caret, axe WCAG, and token parity checked.\n`,
  )
  process.stdout.write('Known axe best-practice warning retained: aria-allowed-role (textarea + combobox).\n')
} finally {
  await browser.close()
}
