import {test, expect, type Page} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories: Array<{title: string; id: string}> = [
  {
    title: 'Default',
    id: 'components-avatarstack--default',
  },
  {
    title: 'Playground',
    id: 'components-avatarstack--playground',
  },
  {
    title: 'Align Left',
    id: 'components-avatarstack-features--align-left',
  },
  {
    title: 'Align Right',
    id: 'components-avatarstack-features--align-right',
  },
  {
    title: 'Disable Expand On Hover',
    id: 'components-avatarstack-features--disable-expand-on-hover',
  },
  {
    title: 'Custom Size On Parent',
    id: 'components-avatarstack-features--custom-size-on-parent',
  },
  {
    title: 'Custom Size On Parent Responsive',
    id: 'components-avatarstack-features--custom-size-on-parent-responsive',
  },
  {
    title: 'Custom Size On Children',
    id: 'components-avatarstack-features--custom-size-on-children',
  },
  {
    title: 'Custom Size On Children Responsive',
    id: 'components-avatarstack-features--custom-size-on-children-responsive',
  },
  {
    title: 'With Link Wrappers',
    id: 'components-avatarstack-dev--with-link-wrappers',
  },
  {
    title: 'With Square Avatars',
    id: 'components-avatarstack-features--with-square-avatars',
  },
]

test.describe('AvatarStack', () => {
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

            await expect(page).toHaveScreenshot(`AvatarStack.${story.title}.${theme}.png`)
          })

          test('@aat', async ({page}) => {
            await visit(page, {
              id: story.id,
              globals: {
                colorScheme: theme,
              },
            })
            await expect(page).toHaveNoViolations({
              rules: {
                'color-contrast': {
                  enabled: theme !== 'dark_dimmed',
                },
              },
            })
          })
        })
      }
    })
  }

  const lastItem = (page: Page) => page.locator('.pc-AvatarItem').last()

  const describeTransition = (page: Page) =>
    lastItem(page).evaluate(element => {
      const {transitionDuration, transitionProperty} = getComputedStyle(element)
      return {transitionDuration, transitionProperty}
    })

  test.describe('reduced motion', () => {
    // `contextOptions` is what the root Playwright config uses to emulate
    // `prefers-reduced-motion`, so it is the option that has to be overridden.
    test.use({contextOptions: {reducedMotion: 'reduce'}})

    test('still expands on hover, without sliding the avatars @vrt', async ({page}) => {
      await visit(page, {
        id: 'components-avatarstack-features--align-left',
      })

      expect(await describeTransition(page)).toEqual({
        transitionDuration: '0s',
        transitionProperty: 'all',
      })

      const body = page.locator('[data-component="AvatarStack.Body"]')
      const collapsed = await lastItem(page).boundingBox()
      await body.hover()

      // The reveal itself is unchanged - the last avatar simply reaches its
      // expanded position in the same frame instead of over 200ms
      const expanded = await lastItem(page).boundingBox()
      expect(expanded).not.toBeNull()
      expect(collapsed).not.toBeNull()
      expect(expanded!.x).toBeGreaterThan(collapsed!.x)
      await expect(lastItem(page)).toBeVisible()
    })
  })

  test.describe('no preference for reduced motion', () => {
    test.use({contextOptions: {reducedMotion: 'no-preference'}})

    test('keeps the hover transition @vrt', async ({page}) => {
      await visit(page, {
        id: 'components-avatarstack-features--align-left',
      })

      const {transitionDuration, transitionProperty} = await describeTransition(page)
      expect(transitionProperty).toContain('margin')
      expect(transitionDuration).toBe('0.2s, 0.2s, 0.2s, 0.2s')
    })
  })
})
