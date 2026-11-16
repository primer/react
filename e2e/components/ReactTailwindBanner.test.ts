import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'

test.describe('React Tailwind compound Banner', () => {
  test('keeps short stacked actions content-sized with stretch alignment', async ({page}) => {
    await visit(page, {
      id: 'react-tailwind-content-banner-features--with-link-actions',
      args: {actionsLayout: 'stacked'},
    })
    const actions = page.locator('[data-component="Banner.Actions"]')
    await actions.evaluate(element => {
      element.style.alignSelf = 'stretch'
    })
    const geometry = await actions.evaluate(element => {
      const links = Array.from(element.querySelectorAll('a'))
      const row = element.firstElementChild
      if (!row || links.length !== 2) throw new Error('Expected two banner link actions')
      return {
        width: element.getBoundingClientRect().width,
        contentWidth:
          links.reduce((width, link) => width + link.getBoundingClientRect().width, 0) +
          Number.parseFloat(getComputedStyle(row).columnGap),
      }
    })
    expect(geometry.width).toBeCloseTo(geometry.contentWidth, 0)
  })

  for (const width of [200, 320]) {
    for (const direction of ['ltr', 'rtl']) {
      for (const layout of ['default', 'stacked']) {
        for (const singleAction of [false, true]) {
          test(`wraps ${singleAction ? 'one localized action' : 'two actions'} at ${width}px in ${direction} with ${layout} layout`, async ({
            page,
            browserName,
          }) => {
            await visit(page, {
              id: 'react-tailwind-content-banner-features--wrapping-link-actions',
              args: {
                actionsLayout: layout,
                ...(singleAction ? {secondaryAction: false} : {}),
              },
            })
            const container = page.getByTestId('banner-actions-container')
            await container.evaluate(
              (element, options) => {
                element.style.width = `${options.width}px`
                element.setAttribute('dir', options.direction)
              },
              {width, direction},
            )
            const banner = page.getByRole('region', {name: 'Security', exact: true})
            const primary = banner.getByRole('link', {
              name: 'Sicherheitseinstellungen für dieses Repository überprüfen',
              exact: true,
            })
            await expect(primary).toBeVisible()
            await expect(banner.getByRole('link')).toHaveCount(singleAction ? 1 : 2)

            const geometry = await banner.evaluate(element => {
              const actions = element.querySelector<HTMLElement>('[data-component="Banner.Actions"]')
              if (!actions?.parentElement) throw new Error('Expected banner actions and their layout container')
              const available = actions.parentElement.getBoundingClientRect()
              const bounds = actions.getBoundingClientRect()
              const links = Array.from(actions.querySelectorAll('a')).map(link => {
                const rect = link.getBoundingClientRect()
                const lines = new Set<number>()
                const walker = document.createTreeWalker(link, NodeFilter.SHOW_TEXT)
                for (let node = walker.nextNode(); node; node = walker.nextNode()) {
                  const range = document.createRange()
                  range.selectNodeContents(node)
                  for (const line of range.getClientRects()) lines.add(Math.round(line.top))
                }
                return {
                  left: rect.left,
                  right: rect.right,
                  top: rect.top,
                  bottom: rect.bottom,
                  clientWidth: link.clientWidth,
                  scrollWidth: link.scrollWidth,
                  lines: lines.size,
                }
              })
              return {
                clientWidth: element.clientWidth,
                scrollWidth: element.scrollWidth,
                availableLeft: available.left,
                availableRight: available.right,
                left: bounds.left,
                right: bounds.right,
                links,
              }
            })
            expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.clientWidth + 1)
            expect(geometry.left).toBeGreaterThanOrEqual(geometry.availableLeft - 1)
            expect(geometry.right).toBeLessThanOrEqual(geometry.availableRight + 1)
            for (const link of geometry.links) {
              expect(link.left).toBeGreaterThanOrEqual(geometry.left - 1)
              expect(link.right).toBeLessThanOrEqual(geometry.right + 1)
              expect(link.scrollWidth).toBeLessThanOrEqual(link.clientWidth + 1)
            }
            expect(geometry.links[0].lines).toBeGreaterThan(1)
            if (!singleAction) {
              expect(geometry.links[1].top).toBeGreaterThanOrEqual(geometry.links[0].bottom - 1)
            }
            await primary.focus()
            // Automated WebKit's default native-link traversal uses Option+Tab.
            await page.keyboard.press(browserName === 'webkit' ? 'Alt+Tab' : 'Tab')
            await expect(
              singleAction
                ? banner.getByRole('button', {name: 'Dismiss banner', exact: true})
                : banner.getByRole('link', {name: 'Learn more about private vulnerability reporting', exact: true}),
            ).toBeFocused()
          })
        }
      }
    }
  }

  for (const theme of ['light', 'dark', 'light_high_contrast', 'dark_high_contrast']) {
    test(`labels an alert with its composed title in ${theme} @aat`, async ({page}) => {
      await page.setViewportSize({width: 320, height: 400})
      await visit(page, {
        id: 'react-tailwind-content-banner-features--compound-alert',
        globals: {colorScheme: theme},
      })

      const alert = page.getByRole('alert', {name: 'Unable to save changes', exact: true})
      const title = alert.getByRole('heading', {name: 'Unable to save changes', level: 3})
      await expect(title).toHaveAttribute('id', /\S/)
      const titleId = await title.getAttribute('id')
      if (!titleId) throw new Error('The banner title has no ID')
      await expect(alert).toHaveAttribute('aria-labelledby', titleId)
      await expect(alert.getByText('Please try again.')).toBeVisible()
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320)
      await expect(page).toHaveNoViolations()
    })
  }
})
