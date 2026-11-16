import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories = [
  {
    title: 'Default',
    id: 'components-formcontrol--default',
  },
  {
    title: 'Custom Required',
    id: 'components-formcontrol-features--custom-required',
  },
  {
    title: 'Disabled Inputs',
    id: 'components-formcontrol-features--disabled-inputs',
  },
  {
    title: 'With Custom Input',
    id: 'components-formcontrol-features--with-custom-input',
  },
  {
    title: 'Single Input',
    id: 'components-formcontrol-features--single-input',
  },
  {
    title: 'Validation Example',
    id: 'components-formcontrol-features--validation-example',
  },
  {
    title: 'With Checkbox And Radio Inputs',
    id: 'components-formcontrol-features--with-checkbox-and-radio-inputs',
  },
  {
    title: 'With Complex Inputs',
    id: 'components-formcontrol-features--with-complex-inputs',
  },
  {
    title: 'With Leading Visual',
    id: 'components-formcontrol-features--with-leading-visual',
  },
  {
    title: 'With Select Panel',
    id: 'components-formcontrol-features--with-select-panel',
  },
  {
    title: 'With Caption',
    id: 'components-formcontrol-features--with-caption',
  },
  {
    title: 'With Caption And Disabled',
    id: 'components-formcontrol-features--with-caption-and-disabled',
  },
  {
    title: 'With Hidden Label',
    id: 'components-formcontrol-features--with-hidden-label',
  },
  {
    title: 'With Required Indicator',
    id: 'components-formcontrol-features--with-required-indicator',
  },
  {
    title: 'With Success Validation',
    id: 'components-formcontrol-features--with-success-validation',
  },
  {
    title: 'With Error Validation',
    id: 'components-formcontrol-features--with-error-validation',
  },
] as const

test.describe('FormControl', () => {
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
            expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
              `FormControl.${story.title}.${theme}.png`,
            )
          })
        })
      }
    })
  }
})
