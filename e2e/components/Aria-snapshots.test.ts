import {test, expect} from '@playwright/test'
// @ts-ignore since this file is generated in the ci to generate this file run npm run build:storybook in packages/react
import componentsConfig from '../../packages/react/storybook-static/index.json'
import {visit} from '../test-helpers/storybook'

/**
 * These stories should not be tested in the CI because they are stress-tests and
 * perform slowly
 */
const SKIPPED_TESTS = [
  'components-treeview-features--stress-test',
  'components-treeview-features--contain-intrinsic-size',
  'components-filteredactionlist--default',
]

type Component = {
  name: string
}

const {entries} = componentsConfig

test.describe('ARIA snapshots', () => {
  for (const [id] of Object.entries(entries as Record<string, Component>)) {
    if (SKIPPED_TESTS.includes(id)) {
      continue
    }

    test(`@aria-snapshots for ${id}`, async ({page}) => {
      await visit(page, {id})
      const defaultScreenshot = await page.locator('.story-wrap').ariaSnapshot()
      expect(defaultScreenshot).toMatchSnapshot([`${id}`, 'aria-snapshot.yml'])
    })
  }
})