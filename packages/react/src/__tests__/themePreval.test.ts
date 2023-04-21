import fs from 'fs'
import path from 'path'

test('snapshot theme-preval.js', () => {
  // Snapshot test the build output of theme-preval.js to catch any unexpected changes
  const themePrevalFile = fs.readFileSync(path.resolve(__dirname, '../../lib/theme-preval.js'), 'utf8')
  expect(themePrevalFile).toMatchSnapshot()
})
