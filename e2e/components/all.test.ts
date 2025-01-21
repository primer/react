import {test, expect} from '@playwright/test'
import {stories} from '../../packages/react/src/utils/testing'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

test.describe('axe @aat', () => {
  for (const {story} of stories) {
    for (const storyName of Object.keys(story)) {
      for (const theme of themes) {
        test.describe(theme, () => {
          test('axe @aat', async ({page}) => {
            await visit(page, {
              id: `${story.default.title.replace('/', '-').toLowerCase()}--${storyName
                .split(/(?=[A-Z])/)
                .join('-')
                .toLowerCase()}`,
              globals: {
                colorScheme: theme,
              },
            })
            await expect(page).toHaveNoViolations()
          })
        })
      }
    }
  }
})
