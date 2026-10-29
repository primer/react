import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories = [
  {
    title: 'Default',
    id: 'components-navlist--default',
  },
  {
    title: 'With TrailingAction',
    id: 'components-navlist-features--with-trailing-action',
  },
  {
    title: 'With Title and Heading',
    id: 'components-navlist-dev--with-group-title-and-heading',
  },
  {
    title: 'With Group',
    id: 'components-navlist-features--with-group',
  },
  {
    title: 'With Sub Items',
    id: 'components-navlist-features--with-sub-items',
  },
  {
    title: 'With expand',
    id: 'components-navlist-features--with-expand',
  },
  {
    title: 'With group expand',
    id: 'components-navlist-features--with-group-expand',
  },
  {
    title: 'With Description',
    id: 'components-navlist-features--with-description',
  },
  {
    title: 'Without Divider',
    id: 'components-navlist-features--without-divider',
  },
]

test.describe('NavList', () => {
  for (const colorScheme of ['light', 'dark', 'light_high_contrast']) {
    test(`linked sub-nav parent keyboard interaction @avt ${colorScheme}`, async ({page}) => {
      await visit(page, {
        id: 'components-navlist-features--with-linked-sub-nav-parent',
        globals: {colorScheme},
      })

      const link = page.getByRole('link', {name: 'Overview', exact: true})
      const toggle = page.getByRole('button', {name: 'Toggle overview pages', exact: true})
      const subNav = page.getByRole('list', {name: 'Overview'})
      const initialUrl = page.url()

      await expect(link).toHaveAttribute('aria-current', 'page')
      await expect(toggle).toHaveAttribute('aria-expanded', 'false')
      await expect(subNav).toBeHidden()
      await expect(page).toHaveNoViolations()

      await link.focus()
      await page.keyboard.press('Tab')
      await expect(toggle).toBeFocused()
      await page.keyboard.press('Enter')
      await expect(toggle).toHaveAttribute('aria-expanded', 'true')
      await expect(subNav).toBeVisible()
      await expect(page).toHaveURL(initialUrl)
      await expect(page).toHaveNoViolations()

      await page.keyboard.press('Tab')
      await expect(page.getByRole('link', {name: 'Review requested'})).toBeFocused()
      await page.keyboard.press('Shift+Tab')
      await page.keyboard.press('Space')
      await expect(toggle).toBeFocused()
      await expect(toggle).toHaveAttribute('aria-expanded', 'false')
      await expect(subNav).toBeHidden()

      await page.keyboard.press('Shift+Tab')
      await expect(link).toBeFocused()
      await page.keyboard.press('Enter')
      await expect(page).toHaveURL(`${initialUrl}#`)
      await expect(toggle).toHaveAttribute('aria-expanded', 'false')
    })
  }

  for (const story of stories) {
    test.describe(story.title, () => {
      for (const theme of themes) {
        test(`default @vrt ${theme}`, async ({page}) => {
          await visit(page, {
            id: story.id,
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          await expect(page).toHaveScreenshot(`NavList.${story.title}.${theme}.png`)
        })
      }
    })
  }
})
