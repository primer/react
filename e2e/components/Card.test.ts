import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

test.describe('Card', () => {
  test.describe('Whole-card interactions', () => {
    test('custom composition keeps header and footer actions separate from whole-card navigation', async ({page}) => {
      await visit(page, {id: 'experimental-components-card-features--custom-content'})
      const card = page.locator('[data-component="Card"]').first()
      const pin = page.getByRole('button', {name: 'Pin primer/react', exact: true})
      await page.getByRole('link', {name: 'primer/react', exact: true}).focus()
      await page.keyboard.press('Tab')
      await expect(pin).toBeFocused()
      const pressed = await pin.getAttribute('aria-pressed')
      await pin.click()
      await expect(pin).toHaveAttribute('aria-pressed', pressed === 'true' ? 'false' : 'true')
      await expect(pin).toBeFocused()
      await expect(page).not.toHaveURL(/#primer\/react$/)
      const star = page.getByRole('button', {name: 'Star primer/react', exact: true})
      await page.keyboard.press('Tab')
      await expect(star).toBeFocused()
      await star.click()
      await expect(star).toBeFocused()
      await expect(page).not.toHaveURL(/#primer\/react$/)
      await page.getByRole('button', {name: 'More options for primer/react', exact: true}).click()
      await expect(page.getByRole('menuitem', {name: 'Repository settings'})).toBeVisible()
      await page.keyboard.press('Escape')
      await card.click({position: {x: 8, y: 8}})
      await expect(page).toHaveURL(/#primer\/react$/)
    })

    test('custom content fills equal-height cards and bottom-aligns footers', async ({page}) => {
      await visit(page, {id: 'experimental-components-card-features--custom-content'})
      const cards = page.locator('[data-component="Card"]')
      const bounds = await cards.evaluateAll(elements =>
        elements.map(element => {
          const card = element.getBoundingClientRect()
          const footer =
            element.querySelector('[data-component="Card.Metadata"]') ?? element.firstElementChild!.lastElementChild!
          return {height: card.height, width: card.width, bottom: footer.getBoundingClientRect().bottom}
        }),
      )
      expect(bounds[0].height).toBeCloseTo(bounds[1].height)
      expect(bounds[0].bottom).toBeCloseTo(bounds[1].bottom)
      expect(bounds[0].width).toBeLessThan(201)
      expect(bounds[1].width).toBeLessThan(201)
    })

    test('primary hover border follows the hit area without animating or changing resting shadow', async ({page}) => {
      await visit(page, {id: 'experimental-components-card-features--with-link'})
      const card = page.locator('[data-component="Card"]')
      const link = page.getByRole('link', {name: 'primer/react', exact: true})
      await card.hover({position: {x: 8, y: 8}})
      const styles = await link.evaluate(element => ({
        hover: getComputedStyle(element, '::after').outlineStyle,
        transform: getComputedStyle(element, '::after').transform,
        transition: getComputedStyle(element, '::after').transitionDuration,
      }))
      expect(styles.hover).toBe('solid')
      expect(styles.transform).toBe('none')
      expect(styles.transition).toBe('0s')
      await expect(card).toHaveCSS('box-shadow', 'none')
      await page.getByRole('button', {name: 'Star primer/react'}).hover()
      expect(await link.evaluate(element => getComputedStyle(element, '::after').outlineStyle)).toBe('none')
    })

    test('link hit area covers the card and secondary actions remain independent', async ({page}) => {
      await visit(page, {id: 'experimental-components-card-features--with-link'})
      const card = page.locator('[data-component="Card"]')
      const link = page.getByRole('link', {name: 'primer/react', exact: true})
      await page.getByRole('button', {name: 'Star primer/react'}).click()
      await expect(page.getByRole('button', {name: 'Star primer/react'})).toBeFocused()
      await expect(page).not.toHaveURL(/#primer-react$/)
      await page.getByRole('button', {name: 'More options for primer/react'}).click()
      await expect(page.getByRole('button', {name: 'More options for primer/react'})).toBeFocused()
      await expect(page).not.toHaveURL(/#primer-react$/)
      await card.click({position: {x: 8, y: 8}})
      await expect(page).toHaveURL(/#primer-react$/)
      await expect(link).toBeFocused()
    })

    for (const layout of ['default', 'compact']) {
      test(`button hit area and keyboard focus cover the ${layout} card`, async ({page}) => {
        await visit(page, {id: 'experimental-components-card-features--with-button'})
        const card = page.locator('[data-component="Card"]').first()
        await card.evaluate((element, value) => element.setAttribute('data-layout', value), layout)
        const button = page.getByRole('button', {name: 'Open repository details'})
        await button.evaluate(element => {
          element.setAttribute('data-activations', '0')
          element.addEventListener('click', () => {
            element.setAttribute('data-activations', String(Number(element.getAttribute('data-activations')) + 1))
          })
        })
        await card.click({position: {x: 8, y: 8}})
        await expect(button).toHaveAttribute('data-activations', '1')
        await button.press('Enter')
        await button.press('Space')
        await expect(button).toHaveAttribute('data-activations', '3')
        await expect(button).toBeFocused()
        const outline = await button.evaluate(element => {
          const style = getComputedStyle(element, '::after')
          return {width: style.outlineWidth, style: style.outlineStyle}
        })
        expect(outline).toEqual({width: '2px', style: 'solid'})
        const cardBounds = await card.boundingBox()
        const overlay = await button.evaluate(element => {
          const style = getComputedStyle(element, '::after')
          return {width: Number.parseFloat(style.width), height: Number.parseFloat(style.height)}
        })
        expect(overlay.width).toBeCloseTo(cardBounds!.width - 2)
        expect(overlay.height).toBeCloseTo(cardBounds!.height - 2)
      })
    }

    test('disabled button hit area does not activate', async ({page}) => {
      await visit(page, {id: 'experimental-components-card-features--with-button'})
      const button = page.getByRole('button', {name: 'Repository details unavailable'})
      await button.evaluate(element => {
        element.setAttribute('data-activated', 'false')
        element.addEventListener('click', () => {
          element.setAttribute('data-activated', 'true')
        })
      })
      const card = page.locator('[data-component="Card"]').last()
      const bounds = await card.boundingBox()
      await page.mouse.click(bounds!.x + 8, bounds!.y + 8)
      await expect(button).toBeDisabled()
      await expect(button).toHaveAttribute('data-activated', 'false')
      await card.hover({position: {x: 8, y: 8}})
      expect(await button.evaluate(element => getComputedStyle(element, '::after').outlineStyle)).toBe('none')
      await page.keyboard.press('Tab')
      await expect(button).not.toBeFocused()
    })

    test('button example starts closed and lets the user open and dismiss details', async ({page}) => {
      await visit(page, {id: 'experimental-components-card-features--with-button'})
      const details = page.getByRole('region', {name: 'Repository details'})
      await expect(details).toHaveCount(0)
      await page.getByRole('button', {name: 'Open repository details'}).click()
      await expect(details).toBeVisible()
      await page.getByRole('button', {name: 'Close repository details'}).click()
      await expect(details).toHaveCount(0)
    })

    for (const story of ['with-link', 'with-button', 'custom-content']) {
      test(`${story} accessibility @avt`, async ({page}) => {
        await visit(page, {id: `experimental-components-card-features--${story}`})
        await expect(page).toHaveNoViolations()
      })
    }
  })

  test.describe('Default', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'experimental-components-card--default',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`Card.Default.${theme}.png`)
        })
      })
    }
  })

  test.describe('With Image', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'experimental-components-card-features--with-image',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`Card.With Image.${theme}.png`)
        })
      })
    }
  })

  test.describe('With Metadata', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'experimental-components-card-features--with-metadata',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`Card.With Metadata.${theme}.png`)
        })
      })
    }
  })

  test.describe('Compact', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'experimental-components-card-features--compact',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`Card.Compact.${theme}.png`)
        })
      })
    }
  })
})
