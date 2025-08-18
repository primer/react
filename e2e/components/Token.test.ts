import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories = [
  {
    title: 'Default',
    id: 'components-token--default',
  },
  {
    title: 'Dev Default',
    id: 'components-token-dev--dev-default',
  },
  {
    title: 'Small Token',
    id: 'components-token-features--small-token',
  },
  {
    title: 'Large Token',
    id: 'components-token-features--large-token',
  },
  {
    title: 'X Large Token',
    id: 'components-token-features--x-large-token',
  },
  {
    title: 'Token With Leading Visual',
    id: 'components-token-features--token-with-leading-visual',
  },
  {
    title: 'Token with onRemove fn',
    id: 'components-token-features--token-with-on-remove-fn',
  },
  {
    title: 'Default IssueLabelToken',
    id: 'components-token-features--default-issue-label-token',
  },
  {
    title: 'IssueLabelToken with onRemove fn',
    id: 'components-token-features--issue-label-token-with-on-remove-fn',
  },
]

test.describe('Token', () => {
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
            await expect(page).toHaveScreenshot(`Token.Default.${story.title}.${theme}.png`)
          })
        })
      }
    })
  }
})
