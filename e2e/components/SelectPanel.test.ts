import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'
import {matrix} from '../test-helpers/matrix'

const scenarios = matrix({
  theme: themes,
  story: [
    {id: 'components-selectpanel--default', name: 'Default'},
    {id: 'components-selectpanel-features--single-select', name: 'Single Select'},
    {id: 'components-selectpanel-features--with-external-anchor', name: 'External Anchor'},
    {id: 'components-selectpanel-features--with-footer', name: 'With Footer'},
    {id: 'components-selectpanel-features--with-groups', name: 'With Groups'},
    {id: 'components-selectpanel-features--with-item-dividers', name: 'With Item Dividers'},
    {
      id: 'components-selectpanel-features--with-placeholder-for-seach-input',
      name: 'With Placeholder for Search Input',
    },
    {id: 'components-selectpanel-features--with-placeholder-select', name: 'With Placeholder Select'},
    {id: 'components-selectpanel-examples--above-tall-body', name: 'Above Tall Body'},
    {id: 'components-selectpanel-examples--height-variantions-and-scroll', name: 'Height Variantions and Scroll'},
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
    },
  ],
})

test.describe('SelectPanel', () => {
  for (const scenario of scenarios) {
    const name = scenario.story.name
    const theme = scenario.theme

    const globals = {
      colorScheme: scenario.theme,
    }

    test(`${name} @vrt ${theme}`, async ({page}) => {
      await visit(page, {id: scenario.story.id, globals})

      // Open select panel
      await page.keyboard.press('Tab')
      await page.keyboard.press('Enter')
      expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(`SelectPanel.${name}.${theme}.png`)
    })

    test(`${name} axe @aat ${theme}`, async ({page}) => {
      await visit(page, {id: scenario.story.id, globals})
      await expect(page).toHaveNoViolations()
    })
  }
})
