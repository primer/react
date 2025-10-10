import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories = [
  {
    title: 'Default',
    id: 'components-toggleswitch--default',
  },
  {
    title: 'Checked',
    id: 'components-toggleswitch-features--checked',
  },
  {
    title: 'Checked Disabled',
    id: 'components-toggleswitch-features--checked-disabled',
  },
  {
    title: 'Controlled',
    id: 'components-toggleswitch-features--controlled',
  },
  {
    title: 'Disabled',
    id: 'components-toggleswitch-features--disabled',
  },
  {
    title: 'Label End',
    id: 'components-toggleswitch-features--label-end',
  },
  {
    title: 'Loading',
    id: 'components-toggleswitch-features--loading',
  },
  {
    title: 'Small',
    id: 'components-toggleswitch-features--small',
  },
  {
    title: 'With Caption',
    id: 'components-toggleswitch-features--with-caption',
  },
  {
    title: 'With Custom Labels',
    id: 'components-toggleswitch-features--with-custom-labels',
  },
] as const

test.describe('ToggleSwitch', () => {
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

            await expect(page).toHaveScreenshot(`ToggleSwitch.${story.title}.${theme}.png`)
          })
        })
      }
    })
  }
})
