import {test, expect} from '@playwright/test'
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
})
