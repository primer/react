import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories = [
  {
    title: 'Default',
    id: 'components-checkboxgroup--default',
  },
  {
    title: 'Caption',
    id: 'components-checkboxgroup-features--caption',
  },
  {
    title: 'Error',
    id: 'components-checkboxgroup-features--error',
  },
  {
    title: 'Success',
    id: 'components-checkboxgroup-features--success',
  },
  {
    title: 'Visually Hidden Label',
    id: 'components-checkboxgroup-features--visually-hidden-label',
  },
] as const

test.describe('CheckboxGroup', () => {
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

            // Default state
            expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
              `CheckboxGroup.${story.title}.${theme}.png`,
            )
          })
        })
      }
    })
  }
})
