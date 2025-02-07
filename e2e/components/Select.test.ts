import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories = [
  {
    id: 'components-select--default',
    title: 'Default',
  },
  {
    id: 'components-select-features--block',
    title: 'Block',
  },
  {
    id: 'components-select-features--disabled',
    title: 'Disabled',
  },
  {
    id: 'components-select-features--error',
    title: 'Error',
  },
  {
    id: 'components-select-features--large',
    title: 'Large',
  },
  {
    id: 'components-select-features--small',
    title: 'Small',
  },
  {
    id: 'components-select-features--success',
    title: 'Success',
  },
  {
    id: 'components-select-features--visually-hidden-label',
    title: 'Visually Hidden Label',
  },
  {
    id: 'components-select-features--with-caption',
    title: 'With Caption',
  },
  {
    id: 'components-select-features--with-option-groups',
    title: 'With Option Groups',
  },
  {
    id: 'components-select-features--with-placeholder-option',
    title: 'With Placeholder Option',
  },
] as const

test.describe('Select', () => {
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
            expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
              `Select.${story.title}.${theme}.png`,
            )
          })
        })
      }
    })
  }
})
