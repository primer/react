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

  test.describe('Preserve Animation On Sibling Update', () => {
    test.beforeEach(async ({page}) => {
      await visit(page, {id: 'components-navlist-dev--preserve-animation-on-sibling-update'})
    })

    test('keeps a focused link and its running animation when a sibling updates @aat', async ({page}) => {
      const link = page.getByRole('link', {name: 'Add unit tests for parser'})
      await link.focus()
      const startTime = await link.locator('svg').evaluate(icon => icon.getAnimations()[0]?.startTime ?? null)

      await page.keyboard.press('u')

      await expect(page.getByText('Working')).toHaveCount(2)
      await expect(link).toBeFocused()
      expect(await link.locator('svg').evaluate(icon => icon.getAnimations()[0]?.startTime ?? null)).toBe(startTime)
    })
  })
})
