import {test, expect} from '@playwright/test'
// @ts-ignore since this file is generated in the ci to generate this file run npx build storybook in packages/react
import componentsConfig from '../../packages/react/storybook-static/index.json'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

/**
 * These stories should not be tested in the CI because they are stress-tests and
 * perform slowly
 */
const SKIPPED_TESTS = [
  'components-treeview-features--stress-test',
  'components-treeview-features--contain-intrinsic-size ',
]

type Component = {
  name: string
}

const {entries} = componentsConfig

test.describe('@aat', () => {
  for (const [id, entry] of Object.entries(entries as Record<string, Component>)) {
    const {name} = entry
    // remove parentheses and slashes from the name to avoid playwright file issues
    // eslint-disable-next-line no-useless-escape
    const cleanedName = name.replaceAll(/[\(\)\/]/g, '')

    test.describe(id, () => {
      for (const theme of themes) {
        test.describe(theme, () => {
          test(cleanedName, async ({page}) => {
            if (SKIPPED_TESTS.includes(id)) {
              return
            }

            await visit(page, {
              id,
              globals: {
                colorScheme: themes[0],
              },
            })
            await expect(page).toHaveNoViolations()
          })
        })
      }
    })
  }
})
