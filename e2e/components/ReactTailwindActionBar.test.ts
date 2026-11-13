import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'

test.describe('React Tailwind ActionBar overflow', () => {
  for (const strictMode of [false, true]) {
    test(`composes a SelectPanel at 30px without a render loop (StrictMode=${strictMode})`, async ({page}) => {
      const errors: string[] = []
      page.on('pageerror', error => errors.push(error.message))
      await visit(page, {
        id: 'react-tailwind-data-actionbar-features--select-panel-composition',
        args: {strictMode},
      })
      const toolbar = page.getByRole('toolbar', {name: 'Filters'})
      const more = toolbar.getByRole('button', {name: 'More items'})
      const projects = toolbar.getByRole('button', {name: 'Projects', exact: true})
      const labels = toolbar.getByRole('button', {name: 'Labels', exact: true})
      const popup = page.getByRole('dialog', {name: 'Filter by project'})
      const filter = popup.getByRole('combobox', {name: 'Filter items'})
      const resize = (width: number) =>
        toolbar.evaluate((element, value) => {
          element.style.width = `${value}px`
        }, width)
      await expect(page.getByTestId('project-selection')).toHaveText('bug')
      await expect(page.locator('[role="dialog"]')).toHaveCount(0)
      await expect(more).toBeVisible()
      await expect(projects).toHaveCount(0)
      for (let cycle = 0; cycle < 3; cycle++) {
        await more.focus()
        await page.keyboard.press('Enter')
        await page.keyboard.press('Home')
        await expect(page.getByRole('menuitem', {name: 'Projects'})).toBeFocused()
        await page.keyboard.press('Enter')
        await expect(filter).toBeFocused()
        await expect(popup.getByRole('option', {name: 'bug'})).toHaveAttribute('aria-selected', 'true')
        await page.keyboard.press('Escape')
        await expect(page.locator('[role="dialog"]')).toHaveCount(0)
        await expect(more).toBeFocused()
      }

      await resize(600)
      await expect(more).toHaveCount(0)
      await expect(projects).toBeFocused()
      await page.keyboard.press('ArrowRight')
      await expect(labels).toBeFocused()
      await page.keyboard.press('Home')
      await expect(projects).toBeFocused()
      await page.keyboard.press('End')
      await expect(labels).toBeFocused()
      await page.keyboard.press('Home')
      await page.keyboard.press('Enter')
      await expect(filter).toBeFocused()
      await resize(30)
      await expect(more).toBeVisible()
      await expect(filter).toBeFocused()
      await page.keyboard.press('Escape')
      await expect(page.locator('[role="dialog"]')).toHaveCount(0)
      await expect(more).toBeFocused()

      await more.click()
      await page.getByRole('menuitem', {name: 'Projects'}).click()
      await expect(filter).toBeFocused()
      await resize(600)
      await expect(more).toHaveCount(0)
      await expect(filter).toBeFocused()
      await page.keyboard.press('Escape')
      await expect(projects).toBeFocused()
      await expect(page.getByTestId('project-selection')).toHaveText('bug')
      expect(errors).toEqual([])
    })
  }

  for (const theme of ['light', 'dark', 'light_high_contrast', 'dark_high_contrast']) {
    test(`toolbar, overflow menu, and picker @aat ${theme}`, async ({page}) => {
      await page.setViewportSize({width: 1000, height: 800})
      await visit(page, {
        id: 'react-tailwind-data-actionbar-features--overflow-accessibility',
        globals: {colorScheme: theme},
      })
      const container = page.getByTestId('metadata-action-bar')
      await container.evaluate(element => {
        element.style.width = '900px'
      })
      await expect(page.getByRole('button', {name: 'More items'})).toHaveCount(0)
      await expect(page).toHaveNoViolations()

      await container.evaluate(element => {
        element.style.width = '64px'
      })
      await page.getByRole('button', {name: 'More items'}).click()
      await expect(page).toHaveNoViolations()
      await page.getByRole('menuitem', {name: 'Projects'}).click()
      await expect(page.getByRole('combobox', {name: 'Filter items'})).toBeFocused()
      await expect(page).toHaveNoViolations()
    })
  }

  test('hides clipped originals but exposes their overflow menu entries', async ({page}) => {
    await page.setViewportSize({width: 320, height: 800})
    await visit(page, {id: 'react-tailwind-data-actionbar-features--overflow-accessibility'})

    const toolbar = page.getByRole('toolbar', {name: 'Issue metadata'})
    const more = toolbar.getByRole('button', {name: 'More items'})
    await expect(more).toBeVisible()
    const originals = toolbar.locator('[data-overflowing]')
    await expect(originals.filter({hasText: 'Projects'})).toHaveAttribute('aria-hidden', 'true')
    for (const name of ['Author', 'Labels', 'Assignee', 'Projects', 'Milestone', 'Iteration', 'Settings']) {
      await expect(toolbar.getByRole('button', {name, exact: true})).toHaveCount(0)
    }
    const projects = toolbar.locator('[data-component="ActionBar.Button"]').filter({hasText: 'Projects'})
    await expect(projects).toBeDisabled()
    await expect(projects).not.toHaveAttribute('aria-disabled', 'false')
    const toolbarBounds = await toolbar.boundingBox()
    const projectBounds = await projects.boundingBox()
    expect(toolbarBounds).not.toBeNull()
    expect(projectBounds).not.toBeNull()
    expect(projectBounds!.y).toBeGreaterThanOrEqual(toolbarBounds!.y + toolbarBounds!.height)

    await more.click()
    const menu = page.getByRole('menu')
    for (const name of ['Author', 'Labels', 'Assignee', 'Projects', 'Milestone', 'Iteration', 'Settings']) {
      await expect(menu.getByRole('menuitem', {name, exact: true})).toBeVisible()
    }
    await expect(menu.getByRole('menuitem', {name: 'Labels'})).toHaveAttribute('aria-disabled', 'true')
  })

  test('moves focus into overflow and back when the focused action clips and fits', async ({page}) => {
    await page.setViewportSize({width: 1000, height: 800})
    await visit(page, {id: 'react-tailwind-data-actionbar-features--overflow-accessibility'})
    const container = page.getByTestId('metadata-action-bar')
    await container.evaluate(element => {
      element.style.width = '900px'
    })
    await expect(page.getByRole('button', {name: 'More items'})).toHaveCount(0)
    const projects = page.getByRole('button', {name: 'Projects', exact: true})
    await expect(projects).toBeVisible()
    await projects.focus()
    await expect(projects).toBeFocused()

    await container.evaluate(element => {
      element.style.width = '64px'
    })
    const more = page.getByRole('button', {name: 'More items'})
    await expect(more).toBeFocused()
    await expect(projects).toHaveCount(0)

    await container.evaluate(element => {
      element.style.width = '900px'
    })
    await expect(page.getByRole('button', {name: 'Projects', exact: true})).toBeFocused()
    await expect(more).toHaveCount(0)
  })

  test('anchors an overflowed picker to More and returns focus without stealing outside focus', async ({page}) => {
    await page.setViewportSize({width: 320, height: 800})
    await visit(page, {id: 'react-tailwind-data-actionbar-features--overflow-accessibility'})
    const more = page.getByRole('button', {name: 'More items'})
    const popup = page.getByRole('dialog', {name: 'Projects'})

    await more.click()
    await page.getByRole('menuitem', {name: 'Projects'}).click()
    await expect(popup.getByRole('combobox', {name: 'Filter items'})).toBeFocused()
    const moreBounds = await more.boundingBox()
    const popupBounds = await popup.boundingBox()
    expect(moreBounds).not.toBeNull()
    expect(popupBounds).not.toBeNull()
    expect(popupBounds!.y).toBeGreaterThanOrEqual(moreBounds!.y + moreBounds!.height)

    await page.keyboard.press('Escape')
    await expect(popup).toBeHidden()
    await expect(more).toBeFocused()

    await more.click()
    await page.getByRole('menuitem', {name: 'Projects'}).click()
    await popup.getByRole('option', {name: 'Roadmap'}).click()
    await expect(popup).toBeHidden()
    await expect(more).toBeFocused()

    await more.click()
    await page.getByRole('menuitem', {name: 'Projects'}).click()
    const outside = page.getByRole('button', {name: 'Outside target'})
    await outside.click()
    await expect(popup).toBeHidden()
    await expect(outside).toBeFocused()

    await more.click()
    await page.getByRole('menuitem', {name: 'Projects'}).click()
    await page.getByText('Outside content').click()
    await expect(popup).toBeHidden()
    await expect(more).not.toBeFocused()
  })

  test('restores focus after a declined outside close followed by a programmatic close', async ({page}) => {
    await page.setViewportSize({width: 320, height: 800})
    await visit(page, {id: 'react-tailwind-data-actionbar-features--guarded-overflow-picker'})
    const more = page.getByRole('button', {name: 'More items'})
    await more.click()
    await page.getByRole('menuitem', {name: 'Projects'}).click()

    const dialog = page.getByRole('dialog', {name: 'Projects'})
    await expect(dialog.getByRole('combobox', {name: 'Filter items'})).toBeFocused()
    await page.getByRole('button', {name: 'Outside target'}).click()
    await expect(page.getByText('Close request declined')).toBeVisible()
    await expect(dialog).toBeVisible()

    await dialog.getByRole('button', {name: 'Finish pending work'}).click()
    await expect(dialog).toBeHidden()
    await expect(more).toBeFocused()

    await more.click()
    await page.getByRole('menuitem', {name: 'Projects'}).click()
    await page.getByRole('button', {name: 'Outside target'}).click()
    const finishOutside = page.getByRole('button', {name: 'Finish outside'})
    await finishOutside.click()
    await expect(dialog).toBeHidden()
    await expect(finishOutside).toBeFocused()
  })

  test('keeps an open picker usable as its trigger moves into and out of overflow', async ({page}) => {
    await page.setViewportSize({width: 1000, height: 800})
    await visit(page, {id: 'react-tailwind-data-actionbar-features--overflow-accessibility'})
    const container = page.getByTestId('metadata-action-bar')
    const popup = page.getByRole('dialog', {name: 'Projects'})
    const filter = popup.getByRole('combobox', {name: 'Filter items'})
    const projects = page.getByRole('button', {name: 'Projects', exact: true})
    const more = page.getByRole('button', {name: 'More items'})
    const setWidth = (width: number) =>
      container.evaluate((element, value) => {
        element.style.width = `${value}px`
      }, width)

    await setWidth(900)
    await expect(more).toHaveCount(0)
    await projects.click()
    await expect(filter).toBeFocused()
    await setWidth(64)
    await expect(more).toBeVisible()
    await expect(filter).toBeFocused()
    await expect
      .poll(async () => {
        const [triggerBounds, popupBounds] = await Promise.all([more.boundingBox(), popup.boundingBox()])
        return (
          triggerBounds &&
          popupBounds &&
          popupBounds.y >= triggerBounds.y + triggerBounds.height &&
          popupBounds.x <= triggerBounds.x + triggerBounds.width &&
          popupBounds.x + popupBounds.width >= triggerBounds.x
        )
      })
      .toBe(true)
    await page.keyboard.press('Escape')
    await expect(more).toBeFocused()

    await more.click()
    await page.getByRole('menuitem', {name: 'Projects'}).click()
    await expect(filter).toBeFocused()
    await setWidth(900)
    await expect(more).toHaveCount(0)
    await expect(filter).toBeFocused()
    await page.keyboard.press('Escape')
    await expect(projects).toBeFocused()
  })

  test('keeps an open action menu usable when its trigger overflows', async ({page}) => {
    await page.setViewportSize({width: 1000, height: 800})
    await visit(page, {id: 'react-tailwind-data-actionbar-features--overflow-accessibility'})
    const container = page.getByTestId('metadata-action-bar')
    await container.evaluate(element => {
      element.style.width = '900px'
    })
    await expect(page.getByRole('button', {name: 'More items'})).toHaveCount(0)
    await page.getByRole('button', {name: 'Settings'}).click()
    const menu = page.getByRole('menu')
    await expect(menu.getByRole('menuitem', {name: 'Configure'})).toBeVisible()

    await container.evaluate(element => {
      element.style.width = '64px'
    })
    const more = page.getByRole('button', {name: 'More items'})
    await expect(more).toBeVisible()
    await expect(menu.getByRole('menuitem', {name: 'Configure'})).toBeVisible()
    await expect
      .poll(async () => {
        const [triggerBounds, menuBounds] = await Promise.all([more.boundingBox(), menu.boundingBox()])
        return (
          triggerBounds &&
          menuBounds &&
          menuBounds.y >= triggerBounds.y + triggerBounds.height &&
          menuBounds.x <= triggerBounds.x + triggerBounds.width &&
          menuBounds.x + menuBounds.width >= triggerBounds.x
        )
      })
      .toBe(true)
    await page.keyboard.press('Escape')
    await expect(more).toBeFocused()

    await container.evaluate(element => {
      element.style.width = '900px'
    })
    const settings = page.getByRole('button', {name: 'Settings'})
    await expect(settings).toBeVisible()
    await settings.click()
    await expect(menu.getByRole('menuitem', {name: 'Configure'})).toBeVisible()
    await container.evaluate(element => {
      element.style.width = '64px'
    })
    await expect(more).toBeVisible()
    await container.evaluate(element => {
      element.style.width = '900px'
    })
    await expect(more).toHaveCount(0)
    await expect(menu.getByRole('menuitem', {name: 'Configure'})).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(settings).toBeFocused()
  })
})
