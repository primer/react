import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories = [
  {
    title: 'Default',
    id: 'experimental-components-keybindinghint--default',
  },
  {
    title: 'Condensed',
    id: 'experimental-components-keybindinghint-features--condensed',
  },
  {
    title: 'Full',
    id: 'experimental-components-keybindinghint-features--full',
  },
  {
    title: 'Sequence Condensed',
    id: 'experimental-components-keybindinghint-features--sequence-condensed',
  },
  {
    title: 'Sequence Full',
    id: 'experimental-components-keybindinghint-features--sequence-full',
  },
  {
    title: 'On Emphasis',
    id: 'experimental-components-keybindinghint-features--on-emphasis',
  },
  {
    title: 'On Primary',
    id: 'experimental-components-keybindinghint-features--on-primary',
  },
  {
    title: 'Small',
    id: 'experimental-components-keybindinghint-features--small',
  },
] as const

test.describe('KeybindingHint', () => {
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
            await expect(page).toHaveScreenshot(`KeybindingHint.${story.title}.${theme}.png`)
          })
        })
      }

      test('axe @avt', async ({page}) => {
        await visit(page, {
          id: story.id,
        })

        await expect(page).toHaveNoViolations()
      })
    })
  }
})
