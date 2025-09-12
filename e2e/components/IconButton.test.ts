import {test, expect, type Page} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories = [
  {
    title: 'Playground',
    id: 'components-iconbutton--playground',
  },
  {
    title: 'Danger',
    id: 'components-iconbutton-features--danger',
  },
  {
    title: 'Default',
    id: 'components-iconbutton--default',
  },
  {
    title: 'Disabled',
    id: 'components-iconbutton-features--disabled',
  },
  {
    title: 'Invisible',
    id: 'components-iconbutton-features--invisible',
  },
  {
    title: 'Large',
    id: 'components-iconbutton-features--large',
  },
  {
    title: 'Medium',
    id: 'components-iconbutton-features--medium',
  },
  {
    title: 'Primary',
    id: 'components-iconbutton-features--primary',
  },
  {
    title: 'Small',
    id: 'components-iconbutton-features--small',
  },
  {
    title: 'Keybinding Hint',
    id: 'components-iconbutton-features--keybinding-hint',
    disableAnimations: true,
    async setup(page: Page) {
      await page.keyboard.press('Tab') // focus on icon button
      await page.getByText('Bold').waitFor({
        state: 'visible',
      })
    },
  },
  {
    title: 'Keybinding Hint on Description',
    id: 'components-iconbutton-features--keybinding-hint-on-description',
    disableAnimations: true,
    async setup(page: Page) {
      await page.keyboard.press('Tab') // focus on icon button
      await page.getByText('You have unread notifications').waitFor({
        state: 'visible',
      })
    },
  },
  {
    title: 'Flex',
    id: 'components-iconbutton-dev--icon-button-within-flex-container',
  },
] as const

test.describe('IconButton', () => {
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

            if ('setup' in story) {
              await story.setup(page)
            }

            // Default state
            expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
              `IconButton.${story.title}.${theme}.png`,
            )
          })
        })
      }
    })
  }
})
