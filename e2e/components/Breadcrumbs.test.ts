import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'
import {viewports} from '../test-helpers/viewports'

const stories = [
  {
    title: 'Default',
    id: 'components-breadcrumbs--default',
  },
] as const

test.describe('Breadcrumbs', () => {
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
            await expect(page).toHaveScreenshot(`Breadcrumbs.${story.title}.${theme}.png`)

            // Hover state
            await page.getByRole('link', {name: 'Home'}).hover()
            await expect(page).toHaveScreenshot(`Breadcrumbs.${story.title}.${theme}.hover.png`)

            // Focus state
            await page.keyboard.press('Tab')
            await expect(page).toHaveScreenshot(`Breadcrumbs.${story.title}.${theme}.focus.png`)
          })
        })
      }
    })
  }

  test.describe('Overflow Menu', () => {
    test('narrow viewport @vrt', async ({page}) => {
      await visit(page, {
        id: 'components-breadcrumbs-features--overflow-menu',
        globals: {
          colorScheme: 'light',
        },
      })

      await page.setViewportSize({width: viewports['primer.breakpoint.xs'] - 1, height: 768})
      await expect(page).toHaveScreenshot('Breadcrumbs.OverflowMenu.narrow.png')
    })

    test('wide viewport @vrt', async ({page}) => {
      await visit(page, {
        id: 'components-breadcrumbs-features--overflow-menu',
        globals: {
          colorScheme: 'light',
        },
      })

      await page.setViewportSize({width: viewports['primer.breakpoint.md'], height: 768})
      await expect(page).toHaveScreenshot('Breadcrumbs.OverflowMenu.wide.png')
    })
  })

  test.describe('Overflow Menu With Root', () => {
    test('narrow viewport @vrt', async ({page}) => {
      await visit(page, {
        id: 'components-breadcrumbs-features--overflow-menu-with-root',
        globals: {
          colorScheme: 'light',
        },
      })

      await page.setViewportSize({width: viewports['primer.breakpoint.xs'] - 1, height: 768})
      await expect(page).toHaveScreenshot('Breadcrumbs.OverflowMenuWithRoot.narrow.png')
    })
  })

  test.describe('Two Items With Overflow Menu', () => {
    test('narrow viewport @vrt', async ({page}) => {
      await visit(page, {
        id: 'components-breadcrumbs-features--two-items-with-overflow-menu',
        globals: {
          colorScheme: 'light',
        },
      })

      await page.setViewportSize({width: viewports['primer.breakpoint.xs'] - 1, height: 768})
      await expect(page).toHaveScreenshot('Breadcrumbs.TwoItemsOverflowMenu.narrow.png')
    })
  })

  test.describe('Two Items With Overflow Menu With Root', () => {
    test('narrow viewport @vrt', async ({page}) => {
      await visit(page, {
        id: 'components-breadcrumbs-features--two-items-with-overflow-menu-with-root',
        globals: {
          colorScheme: 'light',
        },
      })

      await page.setViewportSize({width: viewports['primer.breakpoint.xs'] - 1, height: 768})
      await expect(page).toHaveScreenshot('Breadcrumbs.TwoItemsOverflowMenuWithRoot.narrow.png')
    })
  })

  // Same baselines as above: the flagged implementation must match the current one pixel for pixel.
  test.describe('CSS overflow (primer_react_breadcrumbs_css_overflow)', () => {
    const scenarios = [
      {story: 'overflow-menu', width: viewports['primer.breakpoint.xs'] - 1, snapshot: 'OverflowMenu.narrow'},
      {story: 'overflow-menu', width: viewports['primer.breakpoint.md'], snapshot: 'OverflowMenu.wide'},
      {
        story: 'overflow-menu-with-root',
        width: viewports['primer.breakpoint.xs'] - 1,
        snapshot: 'OverflowMenuWithRoot.narrow',
      },
      {
        story: 'two-items-with-overflow-menu',
        width: viewports['primer.breakpoint.xs'] - 1,
        snapshot: 'TwoItemsOverflowMenu.narrow',
      },
      {
        story: 'two-items-with-overflow-menu-with-root',
        width: viewports['primer.breakpoint.xs'] - 1,
        snapshot: 'TwoItemsOverflowMenuWithRoot.narrow',
      },
    ]

    for (const {story, width, snapshot} of scenarios) {
      test.describe(snapshot, () => {
        test.beforeEach(async ({page}) => {
          await visit(page, {
            id: `components-breadcrumbs-features--${story}`,
            globals: {
              colorScheme: 'light',
              featureFlags: {primer_react_breadcrumbs_css_overflow: true},
            },
          })
          await page.setViewportSize({width, height: 768})
        })

        test('matches the current implementation @vrt', async ({page}) => {
          await expect(page).toHaveScreenshot(`Breadcrumbs.${snapshot}.png`)
        })

        test('axe @aat', async ({page}) => {
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })
})
