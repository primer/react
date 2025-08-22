import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories = [
  {
    title: 'SkeletonAvatar Default',
    id: 'components-skeleton-skeletonavatar--default',
    disableAnimations: true,
  },
  {
    title: 'SkeletonAvatar In A Stack',
    id: 'components-skeleton-skeletonavatar-features--in-a-stack',
    disableAnimations: true,
  },

  {
    title: 'SkeletonAvatar Size',
    id: 'components-skeleton-skeletonavatar-features--size',
    disableAnimations: true,
  },
  {
    title: 'SkeletonAvatar Size Responsive',
    id: 'components-skeleton-skeletonavatar-features--size-responsive',
    disableAnimations: true,
  },
  {
    title: 'SkeletonAvatar Square',
    id: 'components-skeleton-skeletonavatar-features--square',
    disableAnimations: true,
  },
  {
    title: 'SkeletonBox Default',
    id: 'components-skeleton-skeletonbox--default',
    disableAnimations: true,
  },
  {
    title: 'SkeletonBox Custom Height',
    id: 'components-skeleton-skeletonbox-features--custom-height',
    disableAnimations: true,
  },
  {
    title: 'SkeletonBox Custom Width',
    id: 'components-skeleton-skeletonbox-features--custom-width',
    disableAnimations: true,
  },
  {
    title: 'SkeletonText Default',
    id: 'components-skeleton-skeletontext--default',
    disableAnimations: true,
  },
  {
    title: 'SkeletonText Body Large',
    id: 'components-skeleton-skeletontext-features--body-large',
    disableAnimations: true,
  },
  {
    title: 'SkeletonText Body Medium',
    id: 'components-skeleton-skeletontext-features--body-medium',
    disableAnimations: true,
  },
  {
    title: 'SkeletonText Body Small',
    id: 'components-skeleton-skeletontext-features--body-small',
    disableAnimations: true,
  },
  {
    title: 'SkeletonText Display',
    id: 'components-skeleton-skeletontext-features--display',
    disableAnimations: true,
  },
  {
    title: 'SkeletonText Subtitle',
    id: 'components-skeleton-skeletontext-features--subtitle',
    disableAnimations: true,
  },
  {
    title: 'SkeletonText Title Large',
    id: 'components-skeleton-skeletontext-features--title-large',
    disableAnimations: true,
  },
  {
    title: 'SkeletonText Title Medium',
    id: 'components-skeleton-skeletontext-features--title-medium',
    disableAnimations: true,
  },
  {
    title: 'SkeletonText Title Small',
    id: 'components-skeleton-skeletontext-features--title-small',
    disableAnimations: true,
  },
  {
    title: 'SkeletonText With Max Width',
    id: 'components-skeleton-skeletontext-features--with-max-width',
    disableAnimations: true,
  },
  {
    title: 'SkeletonText With Multiple Lines',
    id: 'components-skeleton-skeletontext-features--with-multiple-lines',
    disableAnimations: true,
  },
] as const

test.describe('Skeleton', () => {
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
          await expect(page).toHaveScreenshot(`Skeleton.${story.title}.${theme}.png`)
        })
      }
    })
  }
})
