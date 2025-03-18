import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories = [
  {
    title: 'Default',
    id: 'components-dialog--default',
  },
  {
    title: 'Stress Test',
    id: 'components-dialog-features--stress-test',
  },
  {
    title: 'With Custom Renderers',
    id: 'components-dialog-features--with-custom-renderers',
  },
  {
    title: 'Position bottom',
    id: 'components-dialog-features--bottom-sheet-narrow',
  },
  {
    title: 'Position fullscreen',
    id: 'components-dialog-features--full-screen-narrow',
  },
  {
    title: 'Position sidesheet',
    id: 'components-dialog-features--side-sheet',
  },
  {
    title: 'Dev: With Css',
    id: 'components-dialog-dev--with-css',
  },
  {
    title: 'Dev: With Sx',
    id: 'components-dialog-dev--with-sx',
  },
  {
    title: 'Dev: With Sx And Css',
    id: 'components-dialog-dev--with-sx-and-css',
  },
] as const

test.describe('Dialog', () => {
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
            const isDialogOpen = await page.locator('role=dialog').isVisible()
            if (!isDialogOpen) {
              await page.getByRole('button', {name: 'Show dialog'}).click()
            }
            expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
              `Dialog.${story.title}.${theme}.png`,
            )
          })
        })
      }
    })
  }
})
