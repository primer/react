import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories = [
  {
    title: 'Default',
    id: 'components-checkbox--default',
  },
  {
    title: 'Disabled',
    id: 'components-checkbox-features--disabled',
  },
  {
    title: 'With Caption',
    id: 'components-checkbox-features--with-caption',
  },
  {
    title: 'With Leading Visual',
    id: 'components-checkbox-features--with-leading-visual',
  },
  {
    title: 'Indeterminate',
    id: 'components-checkbox-features--indeterminate',
  },
  {
    title: 'Visually Hidden',
    id: 'components-checkbox--playground',
    args: {
      visuallyHidden: true,
    },
  },
] as const

test.describe('Checkbox', () => {
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
              args: 'args' in story ? story.args : {},
            })

            // Default state
            expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
              `Checkbox.${story.title}.${theme}.png`,
            )

            // Focus state
            await page.keyboard.press('Tab')
            expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
              `Checkbox.${story.title}.focus.${theme}.png`,
            )
          })

          test('axe @aat', async ({page}) => {
            await visit(page, {
              id: story.id,
              globals: {
                colorScheme: theme,
              },
              args: 'args' in story ? story.args : {},
            })
            await expect(page).toHaveNoViolations()
          })
        })
      }
    })
  }
})
