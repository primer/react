import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories = [
  {
    title: 'Default',
    id: 'components-branchname--default',
    focus: true,
  },
  {
    title: 'Not A Link',
    id: 'components-branchname-features--not-a-link',
    focus: false,
  },
  {
    title: 'With A Branch Icon',
    id: 'components-branchname-features--with-branch-icon',
    focus: false,
  },
] as const

test.describe('BranchName', () => {
  for (const story of stories) {
    test.describe(story.title, () => {
      for (const theme of themes) {
        test.describe(theme, () => {
          test('default @vrt', async ({page}) => {
            await visit(page, {
              id: story.id,
              globals: {
                colorScheme: theme,
                primer_react_css_modules_team: true,
              },
            })

            // Default state
            expect(await page.screenshot()).toMatchSnapshot(`BranchName.${story.title}.${theme}.png`)

            // Focus state
            if (story.focus) {
              await page.keyboard.press('Tab')
              expect(await page.screenshot()).toMatchSnapshot(`BranchName.${story.title}.${theme}.focus.png`)
            }
          })

          test('default (styled-components) @vrt', async ({page}) => {
            await visit(page, {
              id: story.id,
              globals: {
                colorScheme: theme,
                primer_react_css_modules_team: false,
              },
            })

            // Default state
            expect(await page.screenshot()).toMatchSnapshot(`BranchName.${story.title}.${theme}.png`)

            // Focus state
            if (story.focus) {
              await page.keyboard.press('Tab')
              expect(await page.screenshot()).toMatchSnapshot(`BranchName.${story.title}.${theme}.focus.png`)
            }
          })

          test('axe @aat', async ({page}) => {
            await visit(page, {
              id: story.id,
              globals: {
                colorScheme: theme,
                primer_react_css_modules_team: true,
              },
            })
            await expect(page).toHaveNoViolations()
          })

          test('axe (styled-components) @aat', async ({page}) => {
            await visit(page, {
              id: story.id,
              globals: {
                colorScheme: theme,
                primer_react_css_modules_team: false,
              },
            })
            await expect(page).toHaveNoViolations()
          })
        })
      }
    })
  }
})
