import {expect, test, type Locator} from '@playwright/test'
import {visit} from '../test-helpers/storybook'

async function visualStyles(control: Locator) {
  return control.evaluate(element => {
    const style = getComputedStyle(element)
    return {
      backgroundColor: style.backgroundColor,
      borderColor: style.borderColor,
      borderRadius: style.borderRadius,
      borderWidth: style.borderWidth,
      boxShadow: style.boxShadow,
      color: style.color,
      height: style.height,
      outlineColor: style.outlineColor,
      outlineOffset: style.outlineOffset,
      outlineStyle: style.outlineStyle,
      outlineWidth: style.outlineWidth,
      padding: style.padding,
      width: style.width,
    }
  })
}

test.describe('React Tailwind native links and progress', () => {
  test('icon links keep native keyboard, modifier, middle-click, and context-menu behavior @aat', async ({
    context,
    page,
  }) => {
    await visit(page, {id: 'react-tailwind-components-iconlinkbutton-features--native-navigation'})
    const link = page.getByRole('link', {name: 'Go to destination'})
    await expect(link).toHaveAttribute('href', '#icon-link-destination')
    await expect(link).not.toHaveAttribute('role')
    await expect(page).toHaveNoViolations()

    await link.evaluate(element => {
      element.addEventListener('click', () => element.setAttribute('data-clicked', 'true'))
      element.addEventListener('contextmenu', event => {
        setTimeout(() => element.setAttribute('data-context-menu-cancelled', String(event.defaultPrevented)), 0)
      })
    })
    await link.focus()
    await expect(link).toBeFocused()
    await expect(
      page.locator('[data-component="Tooltip.Content"]').filter({hasText: 'Go to destination'}),
    ).toBeVisible()
    await page.keyboard.press('Space')
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0)
    await expect(link).not.toHaveAttribute('data-clicked')
    expect(new URL(page.url()).hash).toBe('')

    await page.evaluate(() => window.scrollTo(0, 0))
    await link.click({button: 'right'})
    await expect(link).toHaveAttribute('data-context-menu-cancelled', 'false')

    const modifierPage = context.waitForEvent('page')
    await link.click({modifiers: [process.platform === 'darwin' ? 'Meta' : 'Control']})
    const openedByModifier = await modifierPage
    await expect(openedByModifier).toHaveURL(/#icon-link-destination$/)
    await openedByModifier.close()

    const middlePage = context.waitForEvent('page')
    await link.click({button: 'middle'})
    const openedByMiddleClick = await middlePage
    await expect(openedByMiddleClick).toHaveURL(/#icon-link-destination$/)
    await openedByMiddleClick.close()

    await link.focus()
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/#icon-link-destination$/)
  })

  test('banner navigation actions retain native link keyboard behavior @aat', async ({page}) => {
    await visit(page, {id: 'react-tailwind-content-banner-features--with-link-actions'})
    await expect(page).toHaveNoViolations()
    const primary = page.getByRole('link', {name: 'Update'})
    const secondary = page.getByRole('link', {name: 'Details'})
    await expect(primary).toHaveAttribute('href', '#update')
    await expect(secondary).toHaveAttribute('href', '#details')
    await expect(primary).not.toHaveAttribute('role')
    await expect(secondary).not.toHaveAttribute('role')

    await primary.focus()
    await page.keyboard.press('Space')
    expect(new URL(page.url()).hash).toBe('')
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/#update$/)
    await secondary.focus()
    await page.keyboard.press('Space')
    await expect(page).toHaveURL(/#update$/)
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/#details$/)
  })

  test('router links receive native keyboard and modified navigation gestures', async ({context, page}) => {
    await visit(page, {id: 'react-tailwind-components-iconlinkbutton-features--router-navigation'})
    const link = page.getByRole('link', {name: 'Open project'})
    await expect(link).toHaveAttribute('href', '#project')
    await expect(link).toHaveAttribute('data-router-link')
    await link.focus()
    await page.keyboard.press('Space')
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0)
    await expect(page.getByRole('status')).toHaveText('Current path: /')

    await page.evaluate(() => window.scrollTo(0, 0))
    const modifierPage = context.waitForEvent('page')
    await link.click({modifiers: [process.platform === 'darwin' ? 'Meta' : 'Control']})
    const openedByModifier = await modifierPage
    await expect(openedByModifier).toHaveURL(/#project$/)
    await openedByModifier.close()
    await expect(page.getByRole('status')).toHaveText('Current path: /')

    const middlePage = context.waitForEvent('page')
    await link.click({button: 'middle'})
    const openedByMiddleClick = await middlePage
    await expect(openedByMiddleClick).toHaveURL(/#project$/)
    await openedByMiddleClick.close()
    await expect(page.getByRole('status')).toHaveText('Current path: /')

    await link.focus()
    await page.keyboard.press('Enter')
    await expect(page.getByRole('status')).toHaveText('Current path: #project')
    expect(new URL(page.url()).hash).toBe('')
  })

  test('rendered router descriptions coexist with own and enclosing tooltips @aat', async ({page}) => {
    await visit(page, {id: 'react-tailwind-components-iconlinkbutton-features--rendered-descriptions'})
    const own = page.getByRole('link', {name: 'Own tooltip settings'})
    const outer = page.getByRole('link', {name: 'Enclosing tooltip settings'})
    const callback = page.getByRole('link', {name: 'Callback tooltip settings'})
    const outerCallback = page.getByRole('link', {name: 'Enclosing callback settings'})
    for (const [link, href] of [
      [own, '#own-settings'],
      [outer, '#outer-settings'],
      [callback, '#callback-settings'],
      [outerCallback, '#outer-callback-settings'],
    ] as const) {
      await expect(link).toHaveAttribute('href', href)
      await expect(link).toHaveAttribute('data-router-link')
      await expect(link).toHaveAccessibleDescription('Existing context. Opens account settings.')
    }

    await own.focus()
    await expect(own).toBeFocused()
    await expect(page.getByTestId('own-ref')).toHaveText('Own ref: forwarded')
    await expect(
      page.locator('[data-component="Tooltip.Content"][data-open]').filter({hasText: 'Opens account settings.'}),
    ).toBeVisible()
    await outer.focus()
    await expect(outer).toBeFocused()
    await expect(page.getByTestId('outer-ref')).toHaveText('Outer ref: forwarded')
    await expect(
      page.locator('[data-component="Tooltip.Content"][data-open]').filter({hasText: 'Opens account settings.'}),
    ).toBeVisible()
    await expect(outer).toHaveAccessibleDescription('Existing context. Opens account settings.')
    await callback.focus()
    await expect(page.getByTestId('callback-ref')).toHaveText('Callback ref: forwarded')
    await outerCallback.focus()
    await expect(page.getByTestId('outer-callback-ref')).toHaveText('Outer callback ref: forwarded')
    await expect(outerCallback).toHaveAccessibleDescription('Existing context. Opens account settings.')
    await expect(page).toHaveNoViolations()
    await page.keyboard.press('Enter')
    await expect(page.getByRole('status')).toHaveText('Current path: #outer-callback-settings')
  })

  for (const theme of ['light', 'dark', 'light_high_contrast', 'dark_high_contrast']) {
    test(`icon links match icon-button styling in ${theme}`, async ({page}) => {
      await visit(page, {
        id: 'react-tailwind-components-iconlinkbutton-features--button-comparison',
        globals: {colorScheme: theme},
      })
      for (const variant of ['default', 'primary', 'danger', 'invisible']) {
        const button = page.getByRole('button', {name: `${variant} button`})
        const link = page.getByRole('link', {name: `${variant} link`})
        expect(await visualStyles(link)).toEqual(await visualStyles(button))

        await button.hover()
        const buttonHover = await visualStyles(button)
        await link.hover()
        expect(await visualStyles(link)).toEqual(buttonHover)
        await page.mouse.move(0, 0)

        await page.keyboard.press('Tab')
        await button.focus()
        const buttonFocus = await visualStyles(button)
        await link.focus()
        expect(await visualStyles(link)).toEqual(buttonFocus)
        await page.locator('body').click({position: {x: 1, y: 1}})
      }
    })
  }

  test('conditional segments render a named zero-valued fallback @aat', async ({page}) => {
    await visit(page, {id: 'react-tailwind-display-progressbar-features--conditional-segments'})
    const root = page.locator('[data-component="ProgressBar"]')
    const fallback = page.getByRole('progressbar', {name: 'Attachments', exact: true})
    await expect(fallback).toHaveAttribute('aria-valuenow', '0')
    await expect(fallback).toHaveAttribute('aria-valuetext', 'No attachments')
    await expect(root).not.toHaveAttribute('aria-valuetext')
    await expect(page).toHaveNoViolations()

    await page.getByRole('checkbox', {name: 'Show attachment segment'}).check()
    await expect(fallback).toHaveCount(0)
    const item = page.getByRole('progressbar', {name: 'Uploaded attachments'})
    await expect(item).toHaveAttribute('aria-valuenow', '40')
    await expect(root).not.toHaveAttribute('aria-valuetext')
    await page.getByRole('checkbox', {name: 'Show attachment segment'}).uncheck()
    await expect(fallback).toHaveAttribute('aria-valuenow', '0')
  })

  test('custom progress fill and the announced value can differ @aat', async ({page}) => {
    await visit(page, {id: 'react-tailwind-display-progressbar-features--custom-fill-with-empty-value'})
    const item = page.getByRole('progressbar', {name: 'Storage usage'})
    await expect(item).toHaveAttribute('aria-valuenow', '0')
    await expect(item).toHaveAttribute('aria-valuetext', '0% used')
    const styles = await item.evaluate(element => {
      const probe = document.createElement('span')
      probe.style.backgroundColor = 'var(--bgColor-neutral-muted)'
      element.append(probe)
      const result = {
        background: getComputedStyle(element).backgroundColor,
        expectedBackground: getComputedStyle(probe).backgroundColor,
        width: element.getBoundingClientRect().width,
        trackWidth: element.parentElement?.getBoundingClientRect().width,
      }
      probe.remove()
      return result
    })
    expect(styles.background).toBe(styles.expectedBackground)
    expect(styles.width).toBeCloseTo(styles.trackWidth ?? 0)
    await expect(page).toHaveNoViolations()
  })
})
