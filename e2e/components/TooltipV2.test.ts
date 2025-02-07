import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories = [
  {
    title: 'Default',
    id: 'components-tooltipv2--default',
  },
  {
    title: 'Anchor Has Margin',
    id: 'components-tooltipv2-features--anchor-has-margin',
  },
  {
    title: 'Calculated Direction',
    id: 'components-tooltipv2-features--calculated-direction',
  },
  {
    title: 'Icon Button With Description',
    id: 'components-tooltipv2-features--icon-button-with-description',
  },
  {
    title: 'Label Type',
    id: 'components-tooltipv2-features--label-type',
  },
  {
    title: 'Dev SX Props',
    id: 'components-tooltipv2-dev--default',
  },
] as const

test.describe('TooltipV2', () => {
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
            await page.keyboard.press('Tab')
            expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
              `TooltipV2.${story.title}.${theme}.png`,
            )
          })
        })
      }
    })
  }
})
