import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories: Array<{title: string; id: string}> = [
  {
    title: 'Default',
    id: 'experimental-components-underlinepanels--default',
  },
  {
    title: 'Dev Default',
    id: 'experimental-components-underlinepanels-dev--default',
  },
  {
    title: 'Labelled By External Element',
    id: 'experimental-components-underlinepanels-features--labelled-by-external-element',
  },
  {
    title: 'Selected Tab',
    id: 'experimental-components-underlinepanels-features--selected-tab',
  },
  {
    title: 'With Counters',
    id: 'experimental-components-underlinepanels-features--with-counters',
  },
  {
    title: 'With Counters In Loading State',
    id: 'experimental-components-underlinepanels-features--with-counters-in-loading-state',
  },
  {
    title: 'With Icons',
    id: 'experimental-components-underlinepanels-features--with-icons',
  },
  {
    title: 'With Icons Hidden On Narrow Screen',
    id: 'experimental-components-underlinepanels-features--with-icons-hidden-on-narrow-screen',
  },
]

test.describe('React Tailwind UnderlinePanels wrapper styling', () => {
  for (const theme of ['light', 'dark', 'light_high_contrast', 'dark_high_contrast']) {
    for (const [wrapperInset, padding] of [
      ['none', '0px'],
      ['primer', '16px'],
      ['legacy', '24px'],
    ] as const) {
      test(`${wrapperInset} wrapper overrides preserve keyboard tabs in ${theme} @aat`, async ({page}) => {
        await page.setViewportSize({width: 320, height: 800})
        await visit(page, {
          id: 'react-tailwind-navigation-underlinepanels-features--custom-list-wrapper',
          globals: {colorScheme: theme},
          args: {wrapperInset},
        })
        await page.addStyleTag({content: '.px-4 { padding-inline: 24px !important; }'})
        const list = page.getByRole('tablist', {name: 'Alert details'})
        const wrapper = list.locator('..')
        await expect(wrapper).not.toHaveClass(/(?:^|\s)(?:primer:)?px-4(?:\s|$)/)
        await expect(wrapper).toHaveCSS('padding-left', padding)
        await expect(wrapper).toHaveCSS('padding-right', padding)
        await expect(wrapper).toHaveCSS('padding-top', '0px')
        await expect(wrapper).toHaveCSS(
          'box-shadow',
          /^(none|rgba\(0, 0, 0, 0\) 0px 0px 0px 0px(?:, rgba\(0, 0, 0, 0\) 0px 0px 0px 0px)*)$/,
        )
        await expect(list).toHaveCSS('column-gap', '16px')
        await page.getByRole('tab', {name: 'Overview', exact: true}).focus()
        await page.keyboard.press('ArrowRight')
        await expect(page.getByRole('tab', {name: 'Activity', exact: true})).toBeFocused()
        await expect(page.getByRole('tab', {name: 'Activity', exact: true})).toHaveAttribute('aria-selected', 'true')
        await expect(page.getByRole('tabpanel')).toHaveCount(1)
        await expect(page.getByRole('tabpanel')).toHaveText('Alert activity')
        await page.keyboard.press('Home')
        await expect(page.getByRole('tab', {name: 'Overview', exact: true})).toBeFocused()
        await expect(page.getByRole('tab', {name: 'Overview', exact: true})).toHaveAttribute('aria-selected', 'true')
        await expect(page.getByRole('tabpanel')).toHaveCount(1)
        await expect(page.getByRole('tabpanel')).toHaveText('Alert overview')
        await expect(page).toHaveNoViolations()
      })
    }
  }
})

test.describe('React Tailwind UnderlinePanels manual overlay keyboard', () => {
  for (const strictMode of [false, true]) {
    for (const width of [320, 1280]) {
      test(`retains tab registry after reopening at ${width}px (StrictMode=${strictMode}) @aat`, async ({page}) => {
        await page.setViewportSize({width, height: 800})
        await visit(page, {
          id: 'react-tailwind-navigation-underlinepanels-features--in-overlay',
          args: {activationMode: 'manual', strictMode},
        })
        const trigger = page.getByRole('button', {name: 'Select ref type'})
        for (let cycle = 0; cycle < 3; cycle += 1) {
          await trigger.click()
          const branch = page.getByRole('tab', {name: 'Branches'})
          const tag = page.getByRole('tab', {name: 'Tags'})
          const current = cycle % 2 === 0 ? branch : tag
          const next = cycle % 2 === 0 ? tag : branch
          const forwardKey = cycle % 2 === 0 ? 'ArrowRight' : 'ArrowLeft'
          const backwardKey = cycle % 2 === 0 ? 'ArrowLeft' : 'ArrowRight'
          await expect(current).toBeFocused()
          await page.keyboard.press(forwardKey)
          await expect(next).toBeFocused()
          await expect(current).toHaveAttribute('aria-selected', 'true')
          await expect(current).toHaveAttribute('tabindex', '-1')
          await expect(next).toHaveAttribute('tabindex', '0')
          await page.keyboard.press('Enter')
          await expect(next).toHaveAttribute('aria-selected', 'true')
          await page.keyboard.press(backwardKey)
          await expect(current).toBeFocused()
          await expect(next).toHaveAttribute('aria-selected', 'true')
          await page.keyboard.press('End')
          await expect(tag).toBeFocused()
          await page.keyboard.press('Home')
          await expect(branch).toBeFocused()
          await expect(page).toHaveNoViolations()
          await page.keyboard.press('Escape')
          await expect(page.getByRole('tablist')).toHaveCount(0)
          await expect(trigger).toBeFocused()
        }
      })
    }
  }
})

test.describe('UnderlinePanels', () => {
  for (const story of stories) {
    test.describe(story.title, () => {
      for (const theme of themes) {
        test.describe(theme, () => {
          test('@vrt', async ({page}) => {
            await visit(page, {
              id: story.id,
              globals: {
                colorScheme: theme,
              },
            })

            await expect(page).toHaveScreenshot(`UnderlinePanels.${story.title}.${theme}.png`)
          })
        })
      }
    })
  }
})
