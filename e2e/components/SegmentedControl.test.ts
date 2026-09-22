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
    title: 'Multiline Labels',
    id: 'components-segmentedcontrol-features--multiline-labels',
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
] as const

test.describe('SegmentedControl', () => {
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

  test('multiline labels grow to the tallest segment', async ({page}) => {
    await visit(page, {
      id: 'components-segmentedcontrol-features--multiline-labels',
    })

    const multilineCases = [
      {testId: 'multiline-default-medium', minimumHeight: 32},
      {testId: 'multiline-default-small', minimumHeight: 28},
      {testId: 'multiline-subtle-medium', minimumHeight: 32},
      {testId: 'multiline-subtle-small', minimumHeight: 28},
    ]

    for (const {testId, minimumHeight} of multilineCases) {
      const layout = await page
        .getByTestId(testId)
        .locator('[data-component="SegmentedControl"]')
        .evaluate(control => {
          const buttons = [...control.querySelectorAll<HTMLButtonElement>('button')]
          const buttonHeights = buttons.map(button => button.getBoundingClientRect().height)
          const contents = [...control.querySelectorAll<HTMLElement>('.segmentedControl-content')]
          const selectedButton = control.querySelector<HTMLButtonElement>('button[aria-pressed="true"]')
          const selectedContent = selectedButton?.querySelector<HTMLElement>('.segmentedControl-content')

          return {
            controlHeight: control.getBoundingClientRect().height,
            buttonHeightSpread: Math.max(...buttonHeights) - Math.min(...buttonHeights),
            contentFits: contents.every(content => content.scrollHeight <= content.clientHeight + 1),
            selectedContentHeight: selectedContent?.getBoundingClientRect().height,
            selectedButtonHeight: selectedButton?.getBoundingClientRect().height,
          }
        })

      expect(layout.controlHeight).toBeGreaterThan(minimumHeight)
      expect(layout.buttonHeightSpread).toBeLessThanOrEqual(0.5)
      expect(layout.contentFits).toBe(true)
      expect(layout.selectedContentHeight).toBeDefined()
      expect(layout.selectedButtonHeight).toBeDefined()
      expect(layout.selectedContentHeight ?? 0).toBeCloseTo(layout.selectedButtonHeight ?? 0, 1)
    }
  })

  test('single-line labels preserve the existing control heights', async ({page}) => {
    await visit(page, {
      id: 'components-segmentedcontrol-features--multiline-labels',
    })

    const singleLineCases = [
      {testId: 'single-line-default-medium', height: 32},
      {testId: 'single-line-default-small', height: 28},
      {testId: 'single-line-subtle-medium', height: 32},
      {testId: 'single-line-subtle-small', height: 28},
    ]

    for (const {testId, height} of singleLineCases) {
      const controlHeight = await page
        .getByTestId(testId)
        .locator('[data-component="SegmentedControl"]')
        .evaluate(control => control.getBoundingClientRect().height)

      expect(controlHeight).toBe(height)
    }
  })

  test('multiline labels reflow at 320px and preserve enlarged and spaced text', async ({page}) => {
    await page.setViewportSize({width: 320, height: 768})
    await visit(page, {
      id: 'components-segmentedcontrol-features--multiline-labels',
    })

    const control = page.getByTestId('multiline-default-medium').locator('[data-component="SegmentedControl"]')
    const hasHorizontalPageOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    )

    await control.evaluate(element => {
      const htmlElement = element as HTMLElement
      htmlElement.style.setProperty('--text-body-size-medium', '28px')
      htmlElement.style.lineHeight = '1.5'
      htmlElement.style.letterSpacing = '0.12em'
      htmlElement.style.wordSpacing = '0.16em'
    })

    const contentFits = await control.evaluate(element =>
      [...element.querySelectorAll<HTMLElement>('.segmentedControl-content')].every(
        content => content.scrollHeight <= content.clientHeight + 1,
      ),
    )

    expect(hasHorizontalPageOverflow).toBe(false)
    expect(contentFits).toBe(true)
  })
})
