import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const variants = [
  {
    title: 'Default',
    id: 'experimental-components-issuelabel--default',
  },
  {
    title: 'Auburn',
    id: 'experimental-components-issuelabel-features--auburn',
  },
  {
    title: 'Blue',
    id: 'experimental-components-issuelabel-features--blue',
  },
  {
    title: 'Brown',
    id: 'experimental-components-issuelabel-features--brown',
  },
  {
    title: 'Coral',
    id: 'experimental-components-issuelabel-features--coral',
  },
  {
    title: 'Cyan',
    id: 'experimental-components-issuelabel-features--cyan',
  },
  {
    title: 'Gray',
    id: 'experimental-components-issuelabel-features--gray',
  },
  {
    title: 'Green',
    id: 'experimental-components-issuelabel-features--green',
  },
  {
    title: 'Indigo',
    id: 'experimental-components-issuelabel-features--indigo',
  },
  {
    title: 'Lemon',
    id: 'experimental-components-issuelabel-features--lemon',
  },
  {
    title: 'Lime',
    id: 'experimental-components-issuelabel-features--lime',
  },
  {
    title: 'Olive',
    id: 'experimental-components-issuelabel-features--olive',
  },
  {
    title: 'Orange',
    id: 'experimental-components-issuelabel-features--orange',
  },
  {
    title: 'Pine',
    id: 'experimental-components-issuelabel-features--pine',
  },
  {
    title: 'Pink',
    id: 'experimental-components-issuelabel-features--pink',
  },
  {
    title: 'Plum',
    id: 'experimental-components-issuelabel-features--plum',
  },
  {
    title: 'Purple',
    id: 'experimental-components-issuelabel-features--purple',
  },
  {
    title: 'Red',
    id: 'experimental-components-issuelabel-features--red',
  },
  {
    title: 'Teal',
    id: 'experimental-components-issuelabel-features--teal',
  },
  {
    title: 'Yellow',
    id: 'experimental-components-issuelabel-features--yellow',
  },
  {
    title: 'Button',
    id: 'experimental-components-issuelabel-features--as-button',
  },
  {
    title: 'Link',
    id: 'experimental-components-issuelabel-features--as-link',
  },
  {
    title: 'Group Of Labels',
    id: 'experimental-components-issuelabel-features--group-of-labels',
  },
  {
    title: 'Hex',
    id: 'experimental-components-issuelabel-features--hex-color',
  },
] as const

test.describe('IssueLabel', () => {
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
            expect(await page.screenshot()).toMatchSnapshot(`IssueLabel.${story.title}.${theme}.png`)
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
})
