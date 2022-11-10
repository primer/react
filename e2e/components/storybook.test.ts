import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'
import {stories} from '../../storybook-static/stories.json'

const components = new Map()

Object.values(stories)
  .filter(story => {
    return story.title.startsWith('Components') && !story.title.startsWith('Components/Button')
  })
  .filter(story => {
    return (
      !story.id.includes('fixtures') &&
      !story.id.includes('interactions') &&
      !story.id.includes('stress-test') &&
      !story.name.includes('Playground')
    )
  })
  .forEach(story => {
    const hierarchy = story.title.split('/').filter(segment => {
      const match = segment.toLowerCase()
      const skiplist = new Set(['examples', 'features', 'default'])

      return !skiplist.has(match)
    })
    const component = hierarchy[hierarchy.length - 1]
    if (!components.has(component)) {
      components.set(component, {stories: []})
    }
    components.get(component).stories.push(story)
  })

test.describe('Storybook', () => {
  for (const [key, component] of components) {
    test.describe(key, () => {
      for (const story of component.stories) {
        test.describe(story.name, () => {
          for (const theme of themes) {
            test(`${theme} @vrt`, async ({page}) => {
              await visit(page, {
                id: story.id,
                globals: {
                  colorScheme: theme
                }
              })

              // Default state
              expect(await page.screenshot()).toMatchSnapshot(`${key} ${story.name}.${theme}.png`)
            })
          }

          test('axe @aat', async ({page}) => {
            await visit(page, {
              id: story.id
            })
            await expect(page).toHaveNoViolations()
          })
        })
      }
    })
  }
})
