import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'

const stories = [
  {
    title: 'Default',
    id: 'components-heading--default',
  },
  {
    title: 'Small',
    id: 'components-heading-features--small',
  },
  {
    title: 'Medium',
    id: 'components-heading-features--medium',
  },
  {
    title: 'Large',
    id: 'components-heading-features--large',
  },
] as const

test.describe('Heading', () => {
  for (const story of stories) {
    test.describe(story.title, () => {
      test('default @vrt', async ({page}) => {
        await visit(page, {
          id: story.id,
          globals: {
            featureFlags: {
              primer_react_css_modules: true,
            },
          },
        })

        // Default state
        expect(await page.screenshot()).toMatchSnapshot(`Heading.${story.title}.png`)
      })

      test('default (styled-components) @vrt', async ({page}) => {
        await visit(page, {
          id: story.id,
        })

        // Default state
        expect(await page.screenshot()).toMatchSnapshot(`Heading.${story.title}.png`)
      })

      test('axe @aat', async ({page}) => {
        await visit(page, {
          id: story.id,
          globals: {
            featureFlags: {
              primer_react_css_modules: true,
            },
          },
        })
        await expect(page).toHaveNoViolations()
      })

      test('axe (styled-components) @aat', async ({page}) => {
        await visit(page, {
          id: story.id,
        })
        await expect(page).toHaveNoViolations()
      })
    })
  }
})
