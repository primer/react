import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories = [
  {
    title: 'Default',
    id: 'components-branchname--default',
    focus: true,
  },
  {
    title: 'Not A Link',
    id: 'components-branchname-features--not-a-link',
    focus: false,
  },
  {
    // Note: the story was renamed to "With Leading Visual" but we keep the
    // snapshot title as "With A Branch Icon" so the VRT diff stays usable.
    title: 'With A Branch Icon',
    id: 'components-branchname-features--with-leading-visual',
    focus: false,
  },
  {
    title: 'Link Without Href',
    id: 'components-branchname-features--link-without-href',
    focus: true,
  },
  {
    title: 'No Props',
    id: 'components-branchname-features--no-props',
    focus: false,
  },
  {
    title: 'With Description',
    id: 'components-branchname-features--with-description',
    focus: true,
  },
  {
    title: 'With Trailing Action',
    id: 'components-branchname-features--with-trailing-action',
    focus: false,
  },
  {
    title: 'With Trailing Action Menu',
    id: 'components-branchname-features--with-trailing-action-menu',
    focus: false,
  },
  {
    title: 'Kitchen Sink',
    id: 'components-branchname-features--kitchen-sink',
    focus: false,
  },
] as const

test.describe('BranchName', () => {
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
            await expect(page).toHaveScreenshot(`BranchName.${story.title}.${theme}.png`)

            // Focus state
            if (story.focus) {
              await page.keyboard.press('Tab')
              await expect(page).toHaveScreenshot(`BranchName.${story.title}.${theme}.focus.png`)
            }
          })
        })
      }
    })
  }

  // Trailing action stories - focus states only in light theme
  test.describe('With Trailing Action', () => {
    test('focus states @vrt', async ({page}) => {
      await visit(page, {
        id: 'components-branchname-features--with-trailing-action',
        globals: {
          colorScheme: 'light',
        },
      })

      // Focus on branch name link
      await page.keyboard.press('Tab')
      await expect(page).toHaveScreenshot('BranchName.With Trailing Action.light.focus-link.png')

      // Focus on trailing action button
      await page.keyboard.press('Tab')
      await expect(page).toHaveScreenshot('BranchName.With Trailing Action.light.focus-button.png')
    })
  })

  test.describe('With Trailing Action Menu', () => {
    test('focus states @vrt', async ({page}) => {
      await visit(page, {
        id: 'components-branchname-features--with-trailing-action-menu',
        globals: {
          colorScheme: 'light',
        },
      })

      // Focus on branch name link
      await page.keyboard.press('Tab')
      await expect(page).toHaveScreenshot('BranchName.With Trailing Action Menu.light.focus-link.png')

      // Focus on trailing action button
      await page.keyboard.press('Tab')
      await expect(page).toHaveScreenshot('BranchName.With Trailing Action Menu.light.focus-button.png')

      // Open the menu
      await page.keyboard.press('Enter')
      await expect(page).toHaveScreenshot('BranchName.With Trailing Action Menu.light.menu-open.png')
    })
  })
})
