import {test} from '@playwright/test'
import {visit} from '../test-helpers/storybook'

const stressTests = [
  {component: 'ActionList', testName: 'Single select', id: 'stresstests-components-actionlist--single-select'},
  {component: 'Pagination', testName: 'Page update', id: 'stresstests-components-pagination--page-update'},
  {component: 'Button', testName: 'Label update', id: 'stresstests-components-button--label-update'},
  {component: 'Button', testName: 'Count update', id: 'stresstests-components-button--count-update'},
  {component: 'TreeView', testName: 'Current update', id: 'stresstests-components-treeview--current-update'},
]

for (const {component, testName, id} of stressTests) {
  test.describe(`${component} Stress Tests`, () => {
    test(`${testName} @stress-test`, async ({page}, testInfo) => {
      await visit(page, {id})
      await page.getByTestId('start').click()
      const result = await page.getByTestId('result').textContent()
      await testInfo.attach('stress-test-result', {
        body: JSON.stringify({id, duration: result}),
        contentType: 'application/json',
      })
    })
  })
}
