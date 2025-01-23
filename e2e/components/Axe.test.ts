import {test, expect} from '@playwright/test'
import componentsConfig from '../../packages/react/generated/components.json'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

type Component = {
  stories: Array<{
    id: string
  }>
}

const {components} = componentsConfig

test.describe('@aat', () => {
  for (const [name, component] of Object.entries(components as Record<string, Component>)) {
    test.describe(name, () => {
      for (const story of component.stories) {
        for (const theme of themes) {
          test.describe(theme, () => {
            test(`${story.id}`, async ({page}) => {
              await visit(page, {
                id: story.id,
                globals: {
                  colorScheme: themes[0],
                },
              })
              await expect(page).toHaveNoViolations()
            })
          })
        }
      }
    })
  }
})
