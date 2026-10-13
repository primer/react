import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'
import {viewports} from '../test-helpers/viewports'

const stories = [
  {
    title: 'Default',
    id: 'components-segmentedcontrol--default',
  },
  {
    title: 'Playground',
    id: 'components-segmentedcontrol--playground',
  },
  {
    title: 'Associated with a Label and Caption',
    id: 'components-segmentedcontrol-features--associated-with-a-label-and-caption',
  },
  {
    title: 'Fullwidth Narrow',
    id: 'components-segmentedcontrol-features--fullwidth-narrow',
  },
  {
    title: 'Fullwidth Regular',
    id: 'components-segmentedcontrol-features--fullwidth-regular',
  },
  {
    title: 'Variant Narrow Action Menu',
    id: 'components-segmentedcontrol-features--variant-narrow-action-menu',
  },
  {
    title: 'Variant Narrow Action Menu With Action',
    id: 'components-segmentedcontrol-features--variant-narrow-action-menu-with-action',
  },
  {
    title: 'Variant Narrow Hide Labels',
    id: 'components-segmentedcontrol-features--variant-narrow-hide-labels',
  },
  {
    title: 'Variant Subtle',
    id: 'components-segmentedcontrol-features--variant-subtle',
  },
  {
    title: 'Controlled',
    id: 'components-segmentedcontrol-features--controlled',
  },
  {
    title: 'Fullwidth',
    id: 'components-segmentedcontrol-features--fullwidth-all',
  },
  {
    title: 'Icon Only',
    id: 'components-segmentedcontrol-features--icon-only',
  },
  {
    title: 'With Icons',
    id: 'components-segmentedcontrol-features--with-icons',
  },
  {
    title: 'With Counter Labels',
    id: 'components-segmentedcontrol-features--with-counter-labels',
  },
  {
    title: 'SegmentedControlButton Playground',
    id: 'components-segmentedcontrol-segmentedcontrol-button--playground',
  },
  {
    title: 'SegmentedControlIconButton Playground',
    id: 'components-segmentedcontrol-segmentedcontrol-iconbutton--playground',
  },
  {
    title: 'Dev: With Css',
    id: 'components-segmentedcontrol-dev--with-css',
  },
  {
    title: 'With Disabled Buttons',
    id: 'components-segmentedcontrol-examples--with-disabled-buttons',
  },
  {
    title: 'Compact Toolbar',
    id: 'components-segmentedcontrol-features--compact-toolbar',
  },
  {
    title: 'Multiline Labels',
    id: 'components-segmentedcontrol-features--multiline-labels',
  },
] as const

test.describe('SegmentedControl', () => {
  test('small controls retain 28px with inherited typography @vrt', async ({page}) => {
    await visit(page, {id: 'components-segmentedcontrol-features--compact-toolbar'})
    const control = page.getByRole('list', {name: 'File view'})
    const buttons = control.getByRole('button')
    await expect(control).toHaveCSS('font-size', '14px')
    await expect(buttons.first()).toHaveCSS('line-height', '21px')

    for (const name of ['Code', 'Blame', 'Code']) {
      await control.getByRole('button', {name}).click()
      expect(await control.boundingBox()).toMatchObject({height: 28})
      expect(
        await buttons.evaluateAll(elements => elements.map(element => element.getBoundingClientRect().height)),
      ).toEqual([28, 28])
    }
  })

  test('multiline height and segment boxes stay stable across selection @vrt', async ({page}) => {
    await visit(page, {id: 'components-segmentedcontrol-features--multiline-labels'})
    await page
      .getByRole('list')
      .first()
      .evaluate(root => {
        root.parentElement!.style.width = '260px'
      })

    for (const variant of ['default', 'subtle']) {
      const control = page.getByRole('list', {name: `small ${variant}`, exact: true})
      const buttons = control.getByRole('button')
      const box = await control.boundingBox()
      const segments = await buttons.evaluateAll(elements =>
        elements.map(element => element.getBoundingClientRect().toJSON()),
      )
      expect(box?.height).toBeGreaterThan(28)

      for (const name of ['Code', 'Preview changes before publishing (5)']) {
        await control.getByRole('button', {name, exact: true}).click()
        expect(await control.boundingBox()).toEqual(box)
        expect(
          await buttons.evaluateAll(elements => elements.map(element => element.getBoundingClientRect().toJSON())),
        ).toEqual(segments)
      }
    }
  })

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

            if (story.title.includes('Narrow')) {
              // Set viewport to narrow
              await page.setViewportSize({width: viewports['primer.breakpoint.sm'], height: 768})
            }

            // Default state
            await expect(page).toHaveScreenshot(`SegmentedControl.${story.title}.${theme}.png`)

            if (story.title === 'Default') {
              // Focus state
              await page.keyboard.press('Tab')
              await expect(page).toHaveScreenshot(`SegmentedControl.${story.title}.${theme}.focus.png`)

              // Middle Button Focus state
              await page.keyboard.press('Tab')
              await page.keyboard.press('Enter')
              await page.keyboard.press('Shift+Tab')
              await expect(page).toHaveScreenshot(`SegmentedControl.${story.title}.${theme}.middle.selected.focus.png`)
            }

            if (story.title === 'Variant Narrow Action Menu With Action') {
              await page.setViewportSize({width: viewports['primer.breakpoint.xs'], height: 768})
              await page.locator('[data-component="ActionMenu.Button"]').click()
              await expect(page).toHaveScreenshot(`SegmentedControl.${story.title}.${theme}.menu.png`)
            }
          })
        })
      }
    })
  }
})
