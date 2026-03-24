import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories: Array<{
  title: string
  id: string
  buttonName?: string
  skipOpen?: boolean
}> = [
  {
    title: 'Default',
    id: 'components-actionmenu--default',
  },
  {
    title: 'Inactive Items',
    id: 'components-actionmenu-features--inactive-items',
  },
  {
    title: 'Links And Actions',
    id: 'components-actionmenu-features--links-and-actions',
  },
  {
    title: 'Loading Items',
    id: 'components-actionmenu-features--loading-items',
  },
  {
    title: 'Multi Select',
    buttonName: 'Display',
    id: 'components-actionmenu-features--multi-select',
  },
  {
    title: 'Single Select',
    buttonName: 'Options: fast Forward',
    id: 'components-actionmenu-features--single-select',
  },
  {
    title: 'Controlled Menu',
    id: 'components-actionmenu-examples--controlled-menu',
  },
  {
    title: 'Custom Anchor',
    skipOpen: true,
    id: 'components-actionmenu-examples--custom-anchor',
  },
  {
    title: 'Custom Overlay Props',
    skipOpen: true,
    id: 'components-actionmenu-examples--custom-overlay-props',
  },
  {
    title: 'Groups And Descriptions',
    skipOpen: true,
    id: 'components-actionmenu-examples--groups-and-descriptions',
  },
  {
    title: 'Dev: With Css',
    id: 'components-actionmenu-dev--with-css',
  },
] as const

const featureFlagVariants = [
  {flagEnabled: false, suffix: ''},
  {flagEnabled: true, suffix: '.css-anchor-positioning'},
] as const

test.describe('ActionMenu', () => {
  for (const story of stories) {
    test.describe(story.title, () => {
      for (const theme of themes) {
        test.describe(theme, () => {
          for (const {flagEnabled, suffix} of featureFlagVariants) {
            test(`default @vrt${suffix}`, async ({page}) => {
              await visit(page, {
                id: story.id,
                globals: {
                  colorScheme: theme,
                  featureFlags: {
                    primer_react_css_anchor_positioning: flagEnabled,
                  },
                },
              })

              const buttonName = story.buttonName ?? 'Open menu'

              // Default state
              // Open state

              if (!story.skipOpen) {
                await page.locator('button', {hasText: buttonName}).waitFor()
                await page.getByRole('button', {name: buttonName}).click()
              }
              expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
                `ActionMenu.${story.title}.${theme}${suffix}.png`,
              )
            })
          }
        })
      }
    })
  }
})
