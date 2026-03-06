import path from 'node:path'
import {test, expect} from '@playwright/test'
import {getStories, visit} from '../../test-helpers/storybook'

const stories = getStories(path.resolve(__dirname, '../../../packages/styled-react/src/components/Button.stories.tsx'))

test.describe('Button (@primer/styled-react)', () => {
  for (const story of stories) {
    test.describe(story.title, () => {
      test(`default @vrt`, async ({page}) => {
        await visit(page, {
          id: story.id,
          storybook: 'styled-react',
        })

        // Default state
        await expect(page.getByTestId('screenshot')).toHaveScreenshot(`Button.${story.title}.png`)
      })
    })
  }
})
