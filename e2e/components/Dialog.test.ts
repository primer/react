import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories = [
  {
    title: 'Default',
    id: 'components-dialog--default',
  },
  {
    title: 'Stress Test',
    id: 'components-dialog-features--stress-test',
  },
  {
    title: 'With Custom Renderers',
    id: 'components-dialog-features--with-custom-renderers',
  },
  {
    title: 'Position bottom',
    id: 'components-dialog-features--bottom-sheet-narrow',
  },
  {
    title: 'Position fullscreen',
    id: 'components-dialog-features--full-screen-narrow',
  },
  {
    title: 'Position sidesheet',
    id: 'components-dialog-features--side-sheet',
  },
  {
    title: 'With Direct Subcomponents',
    id: 'components-dialog-features--with-direct-subcomponents',
  },
  {
    title: 'Align top',
    id: 'components-dialog-features--align-top',
  },
  {
    title: 'Align bottom',
    id: 'components-dialog-features--align-bottom',
  },
] as const

test.describe('Dialog', () => {
  test('native modal focus and dismissal @avt', async ({page}) => {
    await visit(page, {id: 'components-dialog--default'})
    const trigger = page.getByRole('button', {name: 'Show dialog'})
    await trigger.press('Enter')
    const dialog = page.getByRole('dialog', {name: 'My Dialog', exact: true})
    await expect(dialog).toHaveJSProperty('open', true)
    await expect(page.locator('dialog:modal')).toHaveCount(1)
    await trigger.evaluate(element => {
      element.focus()
    })
    await expect(trigger).not.toBeFocused()

    // Focus a plain footer button so Escape exercises native cancel, not the close button's tooltip handler.
    await dialog.getByRole('button', {name: 'Delete the universe'}).focus()
    await page.keyboard.press('Escape')
    await expect(dialog).toHaveCount(0)
    await expect(trigger).toBeFocused()

    await trigger.press('Enter')
    await page.mouse.click(1, 1)
    await expect(dialog).toHaveCount(0)
    await expect(trigger).toBeFocused()
  })

  test('nested native dialogs dismiss independently @avt', async ({page}) => {
    await visit(page, {id: 'components-dialog--default'})
    await page.getByRole('button', {name: 'Show dialog'}).click()
    const outer = page.getByRole('dialog', {name: 'My Dialog', exact: true})
    const trigger = outer.getByRole('button', {name: 'Open Second Dialog'})
    await trigger.click()
    const inner = page.getByRole('dialog', {name: 'Inner dialog!'})
    await expect(page.locator('dialog:modal')).toHaveCount(2)
    await page.keyboard.press('Escape')
    await expect(inner).toHaveCount(0)
    await expect(outer).toBeVisible()
    await expect(trigger).toBeFocused()
    await expect(page.locator('dialog:modal')).toHaveCount(1)
  })

  test('portaled menu stays interactive above the modal @avt', async ({page}) => {
    await visit(page, {id: 'components-dialog-features--with-portaled-menu'})
    const dialog = page.getByRole('dialog', {name: 'Project settings'})
    await expect(dialog.getByText('Project archived')).toBeVisible()
    const trigger = dialog.getByRole('button', {name: 'Project actions'})
    await trigger.click()
    const item = dialog.getByRole('menuitem', {name: 'Archive project'})
    await expect(item).toBeFocused()
    await page.keyboard.press('Escape')
    await expect(item).toHaveCount(0)
    await expect(dialog).toBeVisible()
    await expect(trigger).toBeFocused()
    await trigger.click()
    await item.click()
    await expect(item).toHaveCount(0)
    await expect(page).toHaveNoViolations()
  })

  test('native modal accessibility @avt', async ({page}) => {
    await visit(page, {id: 'components-dialog--default'})
    await page.getByRole('button', {name: 'Show dialog'}).click()
    await expect(page).toHaveNoViolations()
  })

  for (const align of ['top', 'bottom']) {
    test(`native modal ${align} alignment`, async ({page}) => {
      await visit(page, {id: `components-dialog-features--align-${align}`})
      const dialog = page.getByRole('dialog')
      const bounds = await dialog.boundingBox()
      expect(bounds).not.toBeNull()
      expect(bounds!.height).toBeLessThan(704)
      expect(align === 'top' ? bounds!.y : 768 - bounds!.y - bounds!.height).toBe(64)
    })
  }

  for (const position of ['bottom-sheet', 'full-screen']) {
    test(`native modal narrow ${position}`, async ({page}) => {
      await page.setViewportSize({width: 390, height: 844})
      await visit(page, {id: `components-dialog-features--${position}-narrow`})
      const dialog = page.getByRole('dialog')
      const bounds = await dialog.boundingBox()
      expect(bounds).not.toBeNull()
      expect(bounds!.x).toBe(0)
      expect(bounds!.width).toBe(390)
      expect(bounds!.y + bounds!.height).toBeCloseTo(844, 1)
      if (position === 'full-screen') {
        expect(bounds!.y).toBe(0)
      }
    })
  }

  for (const story of stories) {
    test.describe(story.title, () => {
      for (const theme of themes) {
        test.describe(theme, () => {
          test('default @vrt', async ({page}) => {
            await visit(page, {
              id: story.id,
              globals: {
                colorScheme: theme,
              },
            })

            // Default state
            const isDialogOpen = await page.locator('role=dialog').isVisible()
            if (!isDialogOpen) {
              await page.getByRole('button', {name: 'Show dialog'}).click()
            }
            expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
              `Dialog.${story.title}.${theme}.png`,
            )
          })
        })
      }
    })
  }
})
