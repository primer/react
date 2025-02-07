import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories = [
  {
    id: 'components-textinputwithtokens--default',
    title: 'Default',
  },
  {
    id: 'components-textinputwithtokens-features--with-leading-visual',
    title: 'With Leading Visual',
  },
  {
    id: 'components-textinputwithtokens-features--with-trailing-visual',
    title: 'With Trailing Visual',
  },
  {
    id: 'components-textinputwithtokens-features--max-height',
    title: 'Max Height',
  },
  {
    id: 'components-textinputwithtokens-features--prevent-tokens-from-wrapping',
    title: 'Prevent Tokens From Wrapping',
  },
  {
    id: 'components-textinputwithtokens-features--size',
    title: 'Size',
  },
  {
    id: 'components-textinputwithtokens-features--truncated',
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
            expect(await page.screenshot()).toMatchSnapshot(`TextInputWithTokens.${story.title}.${theme}.png`)
          })
        })
      }
    })
  }
})
