import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories = [
  {
    title: 'Playground',
    id: 'components-linkbutton--playground',
  },
  {
    title: 'Danger',
    id: 'components-linkbutton-features--danger',
  },
  {
    title: 'Default',
    id: 'components-linkbutton--default',
  },
  {
    title: 'Invisible',
    id: 'components-linkbutton-features--invisible',
  },
  {
    title: 'Link',
    id: 'components-linkbutton-features--link',
  },
  {
    title: 'Large',
    id: 'components-linkbutton-features--large',
  },
  {
    title: 'Leading Visual',
    id: 'components-linkbutton-features--leading-visual',
  },
  {
    title: 'Medium',
    id: 'components-linkbutton-features--medium',
  },
  {
    title: 'Primary',
    id: 'components-linkbutton-features--primary',
  },
  {
    title: 'Small',
    id: 'components-linkbutton-features--small',
  },
  {
    title: 'Trailing Visual',
    id: 'components-linkbutton-features--trailing-visual',
  },
  {
    title: 'With React Router',
    id: 'components-linkbutton-features--with-react-router',
  },
] as const

test.describe('LinkButton', () => {
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
            await expect(page).toHaveScreenshot(`LinkButton.${story.title}.${theme}.png`)
          })
        })
      }
    })
  }
})
