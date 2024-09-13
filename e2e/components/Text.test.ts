import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'

const stories = [
  {
    title: 'Default',
    id: 'components-text--default',
  },
  {
    title: 'Small',
    id: 'components-text-features--size-small',
  },
  {
    title: 'Medium',
    id: 'components-text-features--size-medium',
  },
  {
    title: 'Large',
    id: 'components-text-features--size-large',
  },
  {
    title: 'LightWeight',
    id: 'components-text-features--light-weight',
  },
  {
    title: 'NormalWeight',
    id: 'components-text-features--normal-weight',
  },
  {
    title: 'MediumWeight',
    id: 'components-text-features--medium-weight',
  },
  {
    title: 'SemiboldWeight',
    id: 'components-text-features--semibold-weight',
  },
] as const

// only testing light theme because this component is only concerned with text size and weight

test.describe('Text', () => {
  for (const story of stories) {
    test.describe(story.title, () => {
      test('default @vrt', async ({page}) => {
        await visit(page, {
          id: story.id,
          globals: {
            featureFlags: {
              primer_react_css_modules_team: true,
            },
          },
        })

        // Default state
        expect(await page.screenshot()).toMatchSnapshot(`Text.${story.title}.png`)
      })

      test('default (styled-system) @vrt', async ({page}) => {
        await visit(page, {
          id: story.id,
          globals: {
            featureFlags: {
              primer_react_css_modules_team: false,
            },
          },
        })

        // Default state
        expect(await page.screenshot()).toMatchSnapshot(`Text.${story.title}.png`)
      })

      test('axe @aat', async ({page}) => {
        await visit(page, {
          id: story.id,
          globals: {
            featureFlags: {
              primer_react_css_modules_team: true,
            },
          },
        })
        await expect(page).toHaveNoViolations()
      })

      test('axe (styled-system) @aat', async ({page}) => {
        await visit(page, {
          id: story.id,
          globals: {
            featureFlags: {
              primer_react_css_modules_team: false,
            },
          },
        })
        await expect(page).toHaveNoViolations()
      })
    })
  }
})
