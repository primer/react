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
    title: 'Dev: Constrained Controls',
    id: 'components-segmentedcontrol-dev--constrained-controls',
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
  test('truncated labels reveal their full text on hover and keyboard focus @vrt', async ({page}) => {
    await visit(page, {id: 'components-segmentedcontrol-features--constrained-label-overflow'})
    const control = page.getByRole('list', {name: 'File view, constrained label', exact: true})
    const button = control.getByRole('button', {name: 'Preview changes', exact: true})
    const tooltip = control.locator('[data-component="Tooltip"]').filter({hasText: /^Preview changes$/})
    const bounds = await button.boundingBox()

    await button.hover()
    await expect(tooltip).toBeVisible()
    await expect(button).toHaveAccessibleName('Preview changes')
    expect(await button.boundingBox()).toEqual(bounds)
    await page.keyboard.press('Escape')
    await expect(tooltip).toBeHidden()

    await page.mouse.move(0, 0)
    await page
      .getByRole('list', {name: 'File view, full label', exact: true})
      .getByRole('button', {name: 'Blame', exact: true})
      .focus()
    await page.keyboard.press('Tab')
    await expect(button).toBeFocused()
    await expect(tooltip).toBeVisible()
    await page.keyboard.press('Enter')
    await expect(button).toHaveAttribute('aria-pressed', 'true')
    await expect(button).toHaveAccessibleName('Preview changes')
    expect(await button.boundingBox()).toEqual(bounds)
    await page.keyboard.press('Escape')
    await expect(tooltip).toBeHidden()
    await expect(button).toBeFocused()
    await page.keyboard.press('Tab')
    await expect(control.getByRole('button', {name: 'Code', exact: true})).toBeFocused()
  })

  test('label reveal tracks container resizing without replacing the focused button @vrt', async ({page}) => {
    await visit(page, {id: 'components-segmentedcontrol-dev--constrained-controls'})
    const control = page.getByRole('list', {name: 'Text file view', exact: true})
    const container = control.locator('..')
    const button = control.getByRole('button', {name: 'Preview changes before publishing', exact: true})
    const tooltip = control.locator('[data-component="Tooltip"]').first()

    await container.evaluate(element => {
      element.style.width = '260px'
    })
    await expect(tooltip).toHaveText('Preview changes before publishing')
    await button.focus()
    await expect(button).toBeFocused()
    await expect(tooltip).toBeVisible()
    await container.evaluate(element => {
      element.style.width = '1024px'
    })
    await expect(tooltip).toBeHidden()
    await expect(button).toBeFocused()
    await expect(button).toHaveAccessibleName('Preview changes before publishing')
    await button.hover()
    await expect(tooltip).toBeHidden()
    await container.evaluate(element => {
      element.style.width = '260px'
    })
    await expect(tooltip).toHaveText('Preview changes before publishing')
    await control.getByRole('button', {name: 'Code', exact: true}).focus()
    await page.keyboard.press('Shift+Tab')
    await expect(tooltip).toBeVisible()
    await expect(tooltip).toHaveText('Preview changes before publishing')
    await expect(button).toBeFocused()
  })

  test('fitting labels do not reveal a tooltip on hover or keyboard focus @vrt', async ({page}) => {
    await visit(page, {id: 'components-segmentedcontrol-features--constrained-label-overflow'})
    const control = page.getByRole('list', {name: 'File view, full label', exact: true})
    const buttons = control.getByRole('button')

    for (const button of await buttons.all()) {
      await button.hover()
      await button.press('Tab')
      await page.keyboard.press('Shift+Tab')
      await expect(button).toBeFocused()
      await expect(control.locator('[data-component="Tooltip"]:visible')).toHaveCount(0)
    }
  })

  test('label reveal updates after text changes and remains available when aria-disabled @vrt', async ({page}) => {
    await visit(page, {id: 'components-segmentedcontrol-dev--changing-label'})
    const control = page.getByRole('list', {name: 'File view', exact: true})
    const labelInput = page.getByRole('textbox', {name: 'Segment label', exact: true})
    const button = control.getByRole('button').first()
    const tooltip = control.locator('[data-component="Tooltip"]').first()
    const bounds = await control.boundingBox()

    await button.hover()
    await expect(tooltip).toBeVisible()
    await expect(tooltip).toHaveText('Preview changes before publishing')
    await expect(button).toHaveAccessibleName('Preview changes before publishing (5)')
    await expect(button).toHaveAccessibleDescription('Choose a file view Preview changes before publishing')
    await control.getByRole('button', {name: 'Code', exact: true}).click()
    await page.getByRole('checkbox', {name: 'Disable first segment'}).check()
    await page.keyboard.press('Tab')
    await expect(button).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(tooltip).toBeVisible()
    await expect(button).toHaveAttribute('aria-disabled', 'true')
    await expect(button).toHaveAttribute('aria-pressed', 'false')

    await labelInput.fill('Files')
    await expect(tooltip).toBeEmpty()
    await page.getByRole('checkbox', {name: 'Disable first segment'}).press('Tab')
    await button.hover()
    await expect(tooltip).toBeHidden()
    await expect(button).toHaveAccessibleName('Files (5)')
    await expect(button).toHaveAccessibleDescription('Choose a file view')
    await labelInput.fill('Review all changes before publishing')
    await expect(tooltip).toHaveText('Review all changes before publishing')
    await page.getByRole('checkbox', {name: 'Disable first segment'}).press('Tab')
    await expect(tooltip).toBeVisible()
    await expect(tooltip).toHaveText('Review all changes before publishing')
    await expect(button).toHaveAccessibleName('Review all changes before publishing (5)')
    expect(await control.boundingBox()).toMatchObject({height: bounds?.height})
  })

  test('consumer callbacks still run for pointer focus and mouse-over capture @vrt', async ({page}) => {
    await visit(page, {id: 'components-segmentedcontrol-dev--changing-label'})
    await page.clock.install()
    await page.getByRole('textbox', {name: 'Segment label', exact: true}).fill('Files')
    const control = page.getByRole('list', {name: 'File view', exact: true})
    const button = control.getByRole('button', {name: 'Files (5)', exact: true})
    await expect(control.locator('[data-component="Tooltip"]').first()).toBeEmpty()
    await button.click()
    await expect(button).toBeFocused()
    await expect(page.getByRole('status', {name: 'Focus events'})).toHaveText('1')
    await expect(page.getByRole('status', {name: 'Mouse-over events'})).toHaveText(/^[1-9]\d*$/)
    await page.clock.runFor(100)
    await expect(page.getByRole('status', {name: 'Mouse-enter events'})).toHaveText('1')
    await expect(control.locator('[data-component="Tooltip"]:visible')).toHaveCount(0)
  })

  test('label reveal tracks selection-dependent font weight without a box resize @vrt', async ({page}) => {
    await visit(page, {id: 'components-segmentedcontrol-features--constrained-label-overflow'})
    const control = page.getByRole('list', {name: 'File view, constrained label', exact: true})
    const button = control.getByRole('button', {name: 'Preview changes', exact: true})
    const code = control.getByRole('button', {name: 'Code', exact: true})
    const label = button.locator('.segmentedControl-text')
    const tooltip = control.locator('[data-component="Tooltip"]').first()
    const selectedTextWidth = await label.evaluate(element => {
      const range = document.createRange()
      range.selectNodeContents(element)
      return range.getBoundingClientRect().width
    })
    await code.click()
    const normalTextWidth = await label.evaluate(element => {
      const range = document.createRange()
      range.selectNodeContents(element)
      return range.getBoundingClientRect().width
    })
    expect(selectedTextWidth - normalTextWidth).toBeGreaterThan(2)
    const availableTextWidth = Math.floor((normalTextWidth + selectedTextWidth) / 2)
    await button.evaluate((element, width) => {
      const text = element.querySelector('.segmentedControl-text')
      if (!(text instanceof HTMLElement)) throw new Error('Expected a segment label')
      const nonLabelWidth = element.getBoundingClientRect().width - text.getBoundingClientRect().width
      element.style.maxWidth = `${width + nonLabelWidth}px`
    }, availableTextWidth)
    await expect(tooltip).toBeEmpty()
    const labelBounds = await label.boundingBox()
    const buttonBounds = await button.boundingBox()

    await button.click()
    await expect(button).toHaveAttribute('aria-pressed', 'true')
    expect(await label.boundingBox()).toEqual(labelBounds)
    expect(await button.boundingBox()).toEqual(buttonBounds)
    await expect(tooltip).toHaveText('Preview changes')
    await button.press('Tab')
    await page.keyboard.press('Shift+Tab')
    await expect(tooltip).toBeVisible()
    await code.click()
    await expect(tooltip).toBeEmpty()
    expect(await label.boundingBox()).toEqual(labelBounds)
    expect(await button.boundingBox()).toEqual(buttonBounds)
    await button.hover()
    await expect(tooltip).toBeHidden()
  })

  for (const size of ['small', 'medium'] as const) {
    for (const variant of ['default', 'subtle'] as const) {
      for (const fullWidth of [undefined, false] as const) {
        const description = `${size} ${variant}, fullWidth ${fullWidth ?? 'omitted'}`
        const args = {size, appearance: variant, fullWidthMode: fullWidth === false ? 'explicit-false' : 'omitted'}

        test(`unequal labels preserve icons and counters (${description}) @vrt`, async ({page}) => {
          await visit(page, {
            id: 'components-segmentedcontrol-dev--constrained-controls',
            args: {...args, textContent: 'unequal-labels-with-visuals'},
          })
          const control = page.getByRole('list', {name: 'Text file view', exact: true})
          await expect(control).toHaveAttribute('data-size', size)
          await expect(control).toHaveAttribute('data-variant', variant)
          await expect(control.locator('svg')).toHaveCount(2)
          await expect(control.getByText('5', {exact: true})).toHaveCount(1)
          await expect(control.getByText('2', {exact: true})).toHaveCount(1)
          const buttons = control.getByRole('button')

          for (const width of [260, 360]) {
            await control.locator('..').evaluate((element, width) => {
              element.style.width = `${width}px`
            }, width)
            for (const index of [0, 1, 2]) {
              await buttons.nth(index).click()
              expect(await control.boundingBox()).toMatchObject({width, height: size === 'small' ? 28 : 32})
              const contained = await buttons.evaluateAll(buttons =>
                buttons.every(button => {
                  const bounds = button.getBoundingClientRect()
                  const content = button.querySelector('.segmentedControl-content')
                  if (!content) throw new Error('Expected segment content')
                  const visuals = [...content.children]
                    .filter(element => !element.classList.contains('segmentedControl-text'))
                    .flatMap(element => [element, ...element.querySelectorAll('*')])
                  return visuals.every(element => {
                    const rect = element.getBoundingClientRect()
                    return rect.left >= bounds.left - 0.5 && rect.right <= bounds.right + 0.5
                  })
                }),
              )
              expect(contained).toBe(true)
            }
          }
        })

        test(`auto-sized controls fit constrained parents (${description}) @vrt`, async ({page}) => {
          await visit(page, {id: 'components-segmentedcontrol-dev--constrained-controls', args})
          const control = page.getByRole('list', {name: 'Text file view', exact: true})
          const container = control.locator('..')
          const buttons = control.getByRole('button')
          if (fullWidth === false) {
            await expect(control).toHaveAttribute('data-full-width', 'false')
          } else {
            await expect(control).not.toHaveAttribute('data-full-width')
          }
          await expect(control).toHaveAttribute('data-size', size)
          await expect(control).toHaveAttribute('data-variant', variant)

          for (const display of ['block', 'flex', 'grid']) {
            await container.evaluate((element, layout) => {
              element.style.width = '260px'
              element.style.display = layout
            }, display)

            const box = await control.boundingBox()
            expect(box?.width).toBeLessThanOrEqual(260)
            expect(box?.height).toBe(size === 'small' ? 28 : 32)
            expect(
              await control
                .locator('.segmentedControl-text')
                .first()
                .evaluate(element => element.scrollWidth > element.clientWidth),
            ).toBe(true)
            await expect(buttons.first()).toHaveAccessibleName('Preview changes before publishing')

            for (const index of [1, 2, 0]) {
              await buttons.nth(index).click()
              expect(await control.boundingBox()).toEqual(box)
            }

            await container.evaluate(element => {
              element.style.width = '1024px'
            })
            if (display !== 'grid') {
              const roomyBox = await control.boundingBox()
              expect(roomyBox?.width).toBeGreaterThan(260)
              expect(roomyBox?.width).toBeLessThan(1024)
            }
            expect(
              await control
                .locator('.segmentedControl-text')
                .evaluateAll(elements => elements.every(element => element.scrollWidth <= element.clientWidth)),
            ).toBe(true)
          }
        })

        test(`constrained icon buttons do not overlap (${description}) @vrt`, async ({page}) => {
          await visit(page, {id: 'components-segmentedcontrol-dev--constrained-controls', args})

          for (const [name, width] of [
            ['Icon file view', 80],
            ['Mixed file view', 140],
          ] as const) {
            const control = page.getByRole('list', {name, exact: true})
            const buttons = control.getByRole('button')
            await expect(control).toHaveAttribute('data-size', size)
            await expect(control).toHaveAttribute('data-variant', variant)
            await control.evaluate((element, constrainedWidth) => {
              element.style.width = `${constrainedWidth}px`
            }, width)

            for (const index of [0, 1, 2]) {
              await buttons.nth(index).click()
              const iconDimensions = await control
                .locator('[data-component="SegmentedControl.IconButton"]')
                .evaluateAll(items =>
                  items.map(item => {
                    const button = item.querySelector('button')
                    if (!button) throw new Error('Expected an icon button')
                    return {
                      itemWidth: item.getBoundingClientRect().width,
                      buttonWidth: button.getBoundingClientRect().width,
                    }
                  }),
                )
              for (const {itemWidth, buttonWidth} of iconDimensions) {
                expect(buttonWidth).toBe(32)
                expect(itemWidth).toBeGreaterThanOrEqual(buttonWidth)
              }
              const bounds = await buttons.evaluateAll(elements =>
                elements.map(element => element.getBoundingClientRect().toJSON()),
              )
              for (let i = 0; i < bounds.length - 1; i++) {
                expect(bounds[i].right).toBeLessThanOrEqual(bounds[i + 1].left)
              }
              expect(await control.boundingBox()).toMatchObject({height: size === 'small' ? 28 : 32})
            }
          }
        })
      }
    }
  }

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
        await page.mouse.move(0, 0)
        await page.keyboard.press('Escape')
        await expect(control.locator('[data-component="Tooltip"]:visible')).toHaveCount(0)
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
