import fs from 'fs'
import glob from 'fast-glob'
import groupBy from 'lodash.groupby'

// Components opted into the new story format
const components = ['TreeView']

const storyPaths = glob.sync('src/**/*.stories.tsx')

const storyPathsByComponent = groupBy(
  storyPaths.filter(path => components.some(component => path.includes(component))),
  path => path.split('/').slice(0, -1).join('/')
)

for (const [component, componentStoryFiles] of Object.entries(storyPathsByComponent)) {
  describe(`${component}`, () => {
    const defaultStoryPath = componentStoryFiles.find(path => /\/\w+\.stories\.tsx$/.test(path))
    const featuresStoryPath = componentStoryFiles.find(path => /\/\w+\.features\.stories\.tsx$/.test(path))

    if (defaultStoryPath) {
      const defaultStoryFilename = defaultStoryPath.split('/').slice(-1)[0]
      const defaultStoryContents = fs.readFileSync(defaultStoryPath, 'utf8')

      describe(`${defaultStoryFilename}`, () => {
        test('title follows naming convention ("Components/<name>")', () => {
          // Matches:
          // - title: 'Components/TreeView'
          // Does not match:
          // -  title: 'Component/TreeView/Features'
          // -  title: 'TreeView'
          expect(defaultStoryContents).toMatch(/title: 'Components\/\w+'/)
        })

        test('exports a "Default" story', () => {
          expect(defaultStoryContents).toMatch(/export const Default/)
        })

        test('"Default" story does not use args', () => {
          expect(defaultStoryContents).not.toMatch(/Default\.args = /)
          expect(defaultStoryContents).not.toMatch(/Default\.argTypes = /)
        })
      })
    }

    if (featuresStoryPath) {
      const featuresStoryFilename = featuresStoryPath.split('/').slice(-1)[0]
      const featuresStoryContents = fs.readFileSync(featuresStoryPath, 'utf8')

      describe(`${featuresStoryFilename}`, () => {
        test('title follows naming convention ("Components/<name>/Features")', () => {
          // Matches:
          // - title: 'Components/TreeView/Features'
          // Does not match:
          // -  title: 'Component/TreeView'
          // -  title: 'TreeView'
          expect(featuresStoryContents).toMatch(/title: 'Components\/\w+\/Features'/)
        })
      })
    }
  })
}
