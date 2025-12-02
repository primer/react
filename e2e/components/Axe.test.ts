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
  'components-treeview-features--contain-intrinsic-size',
  'components-flash-features--with-icon-action-dismiss', // TODO: Remove once color-contrast issues have been resolved
  'components-flash-features--with-icon-and-action', // TODO: Remove once color-contrast issues have been resolved
  'components-filteredactionlist--default',
  // PageLayout performance tests - stress tests with many DOM elements
  'components-pagelayout-performance-tests--baseline-light',
  'components-pagelayout-performance-tests--medium-content',
  'components-pagelayout-performance-tests--heavy-content',
  'components-pagelayout-performance-tests--responsive-constraints-test',
  'components-pagelayout-performance-tests--keyboard-aria-test',
]

type Component = {
  name: string
  type: 'story' | 'docs'
}

const {entries} = componentsConfig

test.describe('Axe tests', () => {
  for (const [id, entry] of Object.entries(entries as Record<string, Component>)) {
    if (SKIPPED_TESTS.includes(id) || entry.type !== 'story') {
      continue
    }

    const {name} = entry
    // remove parentheses and slashes from the name to avoid playwright file issues
    // eslint-disable-next-line no-useless-escape
    const cleanedName = name.replaceAll(/[\(\)\/]/g, '')

    test.describe(id, () => {
      for (const theme of themes) {
        test.describe(theme, () => {
          test(`@aat ${cleanedName}`, async ({page}) => {
            await visit(page, {
              id,
              globals: {
                colorScheme: theme,
              },
            })
            await expect(page).toHaveNoViolations()
          })
        })
      }
    })
  }
})
