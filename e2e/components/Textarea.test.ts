import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories = [
  {
    id: 'components-textarea--default',
    title: 'Default',
  },
  {
    id: 'components-textarea-features--block',
    title: 'Block',
  },
  {
    id: 'components-textarea-features--disabled',
    title: 'Disabled',
  },
  {
    id: 'components-textarea-features--error',
    title: 'Error',
  },
  {
    id: 'components-textarea-features--success',
    title: 'Success',
  },
  {
    id: 'components-textarea-features--visually-hidden-label',
    title: 'Visually Hidden Label',
  },
  {
    id: 'components-textarea-features--with-caption',
    title: 'With Caption',
  },
  {
    id: 'components-textarea-features--custom-height',
    title: 'Custom Height',
  },
  {
    id: 'components-textarea-features--custom-resize-behavior',
    title: 'Custom Resize Behavior',
  },
  {
    id: 'components-textarea-features--custom-width',
    title: 'Custom Width',
  },
  {
    id: 'components-textarea-features--with-character-limit',
    title: 'With Character Limit',
  },
  {
    id: 'components-textarea-features--with-character-limit-and-caption',
    title: 'With Character Limit and Caption',
  },
  {
    id: 'components-textarea-features--with-character-limit-exceeded',
    title: 'With Character Limit Exceeded',
  },
  {
    id: 'components-textarea-dev--dev-default',
    title: 'Dev Default',
  },
] as const

test.describe('Textarea', () => {
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
              `Textarea.${story.title}.${theme}.png`,
            )
          })
        })
      }
    })
  }
})
