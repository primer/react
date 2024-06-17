import {test, expect} from '@playwright/test'
import {visit} from '../../test-helpers/storybook'
import {themes} from '../../test-helpers/themes'

const variants = [
  {
    title: 'Default',
    id: 'drafts-components-label--default',
  },
  {
    title: 'Auburn',
    id: 'drafts-components-label-features--auburn',
  },
  {
    title: 'Blue',
    id: 'drafts-components-label-features--blue',
  },
  {
    title: 'Brown',
    id: 'drafts-components-label-features--brown',
  },
  {
    title: 'Coral',
    id: 'drafts-components-label-features--coral',
  },
  {
    title: 'Cyan',
    id: 'drafts-components-label-features--cyan',
  },
  {
    title: 'Gray',
    id: 'drafts-components-label-features--gray',
  },
  {
    title: 'Green',
    id: 'drafts-components-label-features--green',
  },
  {
    title: 'Indigo',
    id: 'drafts-components-label-features--indigo',
  },
  {
    title: 'Lemon',
    id: 'drafts-components-label-features--lemon',
  },
  {
    title: 'Lime',
    id: 'drafts-components-label-features--lime',
  },
  {
    title: 'Olive',
    id: 'drafts-components-label-features--olive',
  },
  {
    title: 'Orange',
    id: 'drafts-components-label-features--orange',
  },
  {
    title: 'Pine',
    id: 'drafts-components-label-features--pine',
  },
  {
    title: 'Pink',
    id: 'drafts-components-label-features--pink',
  },
  {
    title: 'Plum',
    id: 'drafts-components-label-features--plum',
  },
  {
    title: 'Purple',
    id: 'drafts-components-label-features--purple',
  },
  {
    title: 'Red',
    id: 'drafts-components-label-features--red',
  },
  {
    title: 'Teal',
    id: 'drafts-components-label-features--teal',
  },
  {
    title: 'Yellow',
    id: 'drafts-components-label-features--yellow',
  },
] as const

const sizes = [
  {
    title: 'Size: Large',
    id: 'drafts-components-label-features--size-large',
  },
  {
    title: 'Size: Small',
    id: 'drafts-components-label-features--size-small',
  },
] as const

test.describe('Label', () => {
  for (const story of variants) {
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

            await page.setViewportSize({
              width: 320,
              height: 320,
            })

            // Default state
            expect(await page.screenshot()).toMatchSnapshot(`Label.${story.title}.${theme}.png`)
          })

          test('axe @aat', async ({page}) => {
            await visit(page, {
              id: story.id,
              globals: {
                colorScheme: theme,
              },
            })
            await expect(page).toHaveNoViolations()
          })
        })
      }
    })
  }

  for (const story of sizes) {
    test.describe(story.title, () => {
      test('default @vrt', async ({page}) => {
        await visit(page, {
          id: story.id,
        })

        await page.setViewportSize({
          width: 320,
          height: 320,
        })

        // Default state
        expect(await page.screenshot()).toMatchSnapshot(`Label.${story.title}.png`)
      })

      test('axe @aat', async ({page}) => {
        await visit(page, {
          id: story.id,
        })
        await expect(page).toHaveNoViolations()
      })
    })
  }
})
