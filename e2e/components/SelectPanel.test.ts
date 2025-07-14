import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'
import {matrix} from '../test-helpers/matrix'

const scenarios = matrix({
  theme: themes,
  modernActionList: [false, true],
  story: [
    {id: 'components-selectpanel--default', name: 'Default'},
    {id: 'components-selectpanel-features--single-select', name: 'Single Select'},
    {id: 'components-selectpanel-features--with-external-anchor', name: 'External Anchor'},
    {id: 'components-selectpanel-features--with-secondary-action', name: 'With Footer'},
    {id: 'components-selectpanel-features--with-groups', name: 'With Groups'},
    {id: 'components-selectpanel-features--with-item-dividers', name: 'With Item Dividers'},
    {id: 'components-selectpanel-features--with-label-internally', name: 'With Label Internally'},
    {id: 'components-selectpanel-features--with-label-visually-hidden', name: 'With Label Visually Hidden'},
    {id: 'components-selectpanel-features--multi-select-modal', name: 'Multi Select Modal'},
    {id: 'components-selectpanel-features--single-select-modal', name: 'Single Select Modal'},
    {
      id: 'components-selectpanel-features--with-placeholder-for-search-input',
      name: 'With Placeholder for Search Input',
    },
    {id: 'components-selectpanel-examples--above-tall-body', name: 'Above Tall Body'},
    {id: 'components-selectpanel-examples--height-variations-and-scroll', name: 'Height Variations and Scroll'},
    {
      id: 'components-selectpanel-examples--height-initial-with-overflowing-items-story',
      name: 'Height Initial with Overflowing Items',
    },
    {
      id: 'components-selectpanel-examples--height-initial-with-underflowing-items-story',
      name: 'Height Initial with Underflowing Items',
    },
    {
      id: 'components-selectpanel-examples--height-initial-with-underflowing-items-after-fetch',
      name: 'Height Initial with Underflowing Items After Fetch',
      visual: false,
    },
    {
      id: 'components-selectpanel-dev--with-css',
      name: 'With Css',
    },
    {
      id: 'components-selectpanel-dev--with-sx',
      name: 'With Sx',
    },
    {
      id: 'components-selectpanel-dev--with-sx-and-css',
      name: 'With Sx and Css',
    },
  ],
})

test.describe('SelectPanel', () => {
  for (const scenario of scenarios) {
    const name = scenario.story.name
    const theme = scenario.theme
    const flag = scenario.modernActionList ? `.modern-action-list--${scenario.modernActionList}` : ''

    const globals = {
      colorScheme: scenario.theme,
      featureFlags: {primer_react_select_panel_with_modern_action_list: scenario.modernActionList},
    }

    if (scenario.story.visual !== false) {
      test(`${name} @vrt ${theme} ${flag}`, async ({page}) => {
        await visit(page, {id: scenario.story.id, globals})

        // Open select panel
        const isPanelOpen = await page.isVisible('[role="listbox"]')
        if (!isPanelOpen) {
          await page.keyboard.press('Tab')
          await page.keyboard.press('Enter')
        }
        expect(await page.screenshot({animations: 'disabled', caret: 'initial'})).toMatchSnapshot(
          `SelectPanel.${name}.${theme}${flag}.png`,
        )
      })
    }

    test(`${name} axe @aat ${theme} ${flag}`, async ({page}) => {
      await visit(page, {id: scenario.story.id, globals})
      await expect(page).toHaveNoViolations({
        rules: {
          'color-contrast': {
            enabled: false,
          },
        },
      })
    })
  }

  test(`Default @vrt forced-colors .modern-action-list--true`, async ({page}) => {
    await visit(page, {
      id: 'components-selectpanel--default',
      globals: {featureFlags: {primer_react_select_panel_with_modern_action_list: true}},
    })

    // Open select panel
    const isPanelOpen = await page.isVisible('[role="listbox"]')
    if (!isPanelOpen) {
      await page.keyboard.press('Tab')
      await page.keyboard.press('Enter')
    }

    // windows high contrast mode: light
    await page.emulateMedia({forcedColors: 'active', colorScheme: 'light'})
    await page.getByRole('listbox').waitFor({state: 'visible'})
    await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(255, 255, 255)')

    expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
      `SelectPanel-Default-forced-colors-light-modern-action-list--true.png`,
    )

    // windows high contrast mode: dark
    await page.emulateMedia({forcedColors: 'active', colorScheme: 'dark'})
    await page.getByRole('listbox').waitFor({state: 'visible'})
    await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(0, 0, 0)')

    expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
      `SelectPanel-Default-forced-colors-dark-modern-action-list--true.png`,
    )
  })

  test(`Default @vrt responsive width .modern-action-list--true .fullscreen-on-narrow--true`, async ({page}) => {
    await visit(page, {
      id: 'components-selectpanel--default',
      globals: {
        featureFlags: {
          primer_react_select_panel_with_modern_action_list: true,
          primer_react_select_panel_fullscreen_on_narrow: true,
        },
      },
    })

    await page.setViewportSize({width: 767, height: 767})

    // Open select panel
    const isPanelOpen = await page.isVisible('[role="listbox"]')
    if (!isPanelOpen) {
      await page.keyboard.press('Tab')
      await page.keyboard.press('Enter')
    }

    expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
      `SelectPanel-Default-responsive-width-light-modern-action-list--true-full-screen-on-narrow--true.png`,
    )
  })

  test(`Default @vrt with notice`, async ({page}) => {
    await visit(page, {
      id: 'components-selectpanel-features--with-notice',
      globals: {
        featureFlags: {
          primer_react_select_panel_with_modern_action_list: true,
        },
      },
    })

    // Open select panel
    const isPanelOpen = await page.isVisible('[role="listbox"]')
    if (!isPanelOpen) {
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')
      await page.keyboard.press('Enter')
    }

    expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
      `SelectPanel-features--with-notice-light-modern-action-list--true.png`,
    )
  })
})
