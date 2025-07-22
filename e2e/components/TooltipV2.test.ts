import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories = [
  {
    title: 'Default',
    id: 'components-tooltipv2--default',
    disableAnimations: true,
  },
  {
    title: 'Anchor Has Margin',
    id: 'components-tooltipv2-features--anchor-has-margin',
    disableAnimations: true,
  },
  {
    title: 'Calculated Direction',
    id: 'components-tooltipv2-features--calculated-direction',
  },
  {
    title: 'Icon Button With Description',
    id: 'components-tooltipv2-features--icon-button-with-description',
    disableAnimations: true,
  },
  {
    title: 'Label Type',
    id: 'components-tooltipv2-features--label-type',
    disableAnimations: true,
  },
  {
    title: 'Dev SX Props',
    id: 'components-tooltipv2-dev--default',
    disableAnimations: true,
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
            await page.emulateMedia({reducedMotion: 'reduce'})
            await expect(page).toHaveScreenshot(`TooltipV2.${story.title}.${theme}.png`)
          })
        })
      }
    })
  }
})
