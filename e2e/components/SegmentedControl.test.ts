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
    title: 'Constrained Label Overflow',
    id: 'components-segmentedcontrol-features--constrained-label-overflow',
  },
  {
    title: 'Constrained Label Overflow Stress Test',
    id: 'components-segmentedcontrol-features--constrained-label-overflow-stress-test',
  },
] as const

test.describe('SegmentedControl', () => {
  test('small controls retain 28px with inherited typography @vrt', async ({page}) => {
    await visit(page, {id: 'components-segmentedcontrol-features--compact-toolbar'})
    const control = page.getByRole('list', {name: 'File view'})
    const buttons = control.getByRole('button')
    await expect(control).toHaveCSS('font-size', '14px')
    await expect(buttons.first()).toHaveCSS('line-height', '21px')
    expect(
      await control
        .locator('.segmentedControl-text')
        .evaluateAll(elements => elements.every(element => element.scrollWidth <= element.clientWidth)),
    ).toBe(true)

    for (const name of ['Code', 'Blame', 'Code']) {
      await control.getByRole('button', {name}).click()
      expect(await control.boundingBox()).toMatchObject({height: 28})
      expect(
        await buttons.evaluateAll(elements => elements.map(element => element.getBoundingClientRect().height)),
      ).toEqual([28, 28])
    }
  })

  test('constraining one label keeps other labels readable @vrt', async ({page}) => {
    await visit(page, {id: 'components-segmentedcontrol-features--constrained-label-overflow'})

    for (const example of ['full label', 'constrained label']) {
      const control = page.getByRole('list', {name: `File view, ${example}`, exact: true})
      const buttons = control.getByRole('button')
      const box = await control.boundingBox()
      const segments = await buttons.evaluateAll(elements =>
        elements.map(element => element.getBoundingClientRect().toJSON()),
      )
      expect(box?.height).toBe(32)
      await expect(control.getByRole('button', {name: 'Preview changes', exact: true})).toHaveAccessibleName(
        'Preview changes',
      )

      for (const name of ['Code', 'Blame', 'Preview changes']) {
        await control.getByRole('button', {name, exact: true}).click()
        expect(
          await control.locator('.segmentedControl-text').evaluateAll(elements =>
            elements.map(element => {
              const range = document.createRange()
              range.selectNodeContents(element)
              return range.getBoundingClientRect().width > element.clientWidth + 0.5
            }),
          ),
        ).toEqual([example === 'constrained label', false, false])
        expect(await control.boundingBox()).toEqual(box)
        expect(
          await buttons.evaluateAll(elements => elements.map(element => element.getBoundingClientRect().toJSON())),
        ).toEqual(segments)
      }
    }
  })

  test('extremely constrained labels truncate without changing segment geometry @vrt', async ({page}) => {
    await visit(page, {id: 'components-segmentedcontrol-features--constrained-label-overflow-stress-test'})

    for (const size of ['small', 'medium']) {
      for (const variant of ['default', 'subtle']) {
        const control = page.getByRole('list', {name: `${size} ${variant}`, exact: true})
        const buttons = control.getByRole('button')
        const box = await control.boundingBox()
        const segments = await buttons.evaluateAll(elements =>
          elements.map(element => element.getBoundingClientRect().toJSON()),
        )
        const longLabel = control.locator('.segmentedControl-text').first()

        await expect(longLabel).toHaveCSS('overflow', 'hidden')
        await expect(longLabel).toHaveCSS('text-overflow', 'ellipsis')
        await expect(longLabel).toHaveCSS('white-space', 'nowrap')
        await expect(control).toHaveCSS('overflow-y', 'visible')
        expect(await longLabel.evaluate(element => element.scrollWidth > element.clientWidth)).toBe(true)
        await expect(control.getByRole('button', {name: 'Preview changes before publishing (5)'})).toHaveAccessibleName(
          'Preview changes before publishing (5)',
        )
        expect(box?.height).toBe(size === 'small' ? 28 : 32)

        for (const name of ['Code', 'Preview changes before publishing (5)']) {
          await control.getByRole('button', {name, exact: true}).click()
          expect(await control.boundingBox()).toEqual(box)
          expect(
            await buttons.evaluateAll(elements => elements.map(element => element.getBoundingClientRect().toJSON())),
          ).toEqual(segments)
        }
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
