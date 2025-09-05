import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories = [
  {
    id: 'deprecated-components-textinputwithtokens--default',
    title: 'Default',
  },
  {
    id: 'deprecated-components-textinputwithtokens-features--with-leading-visual',
    title: 'With Leading Visual',
  },
  {
    id: 'deprecated-components-textinputwithtokens-features--with-trailing-visual',
    title: 'With Trailing Visual',
  },
  {
    id: 'deprecated-components-textinputwithtokens-features--max-height',
    title: 'Max Height',
  },
  {
    id: 'deprecated-components-textinputwithtokens-features--prevent-tokens-from-wrapping',
    title: 'Prevent Tokens From Wrapping',
  },
  {
    id: 'deprecated-components-textinputwithtokens-features--size',
    title: 'Size',
  },
  {
    id: 'deprecated-components-textinputwithtokens-features--truncated',
    title: 'Truncated',
  },
] as const

test.describe('TextInputWithTokens', () => {
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
            await expect(page).toHaveScreenshot(`TextInputWithTokens.${story.title}.${theme}.png`)
          })
        })
      }
    })
  }
})
