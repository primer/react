import path from 'node:path'
import glob from 'fast-glob'
import groupBy from 'lodash.groupby'

const ROOT_DIRECTORY = path.resolve(__dirname, '..', '..')
// Components opted into the new story format
const allowlist = ['TreeView']
const stories = glob
  .sync('src/**/*.stories.tsx', {
    cwd: ROOT_DIRECTORY
  })
  .filter(file => allowlist.some(component => file.includes(component)))
  .map(file => {
    const filepath = path.join(ROOT_DIRECTORY, file)
    const type = path.basename(filepath, '.stories.tsx').endsWith('features') ? 'feature' : 'default'
    const name = type === 'feature' ? path.basename(file, '.features.stories.tsx') : path.basename(file, '.stories.tsx')

    return [name, require(filepath), type]
  })

const components = Object.entries(
  groupBy(stories, ([name]) => {
    return name
  })
)

describe.each(components)('%s', (_component, stories) => {
  for (const [, story, type] of stories) {
    describe(`${story.default.title}`, () => {
      test('title follows naming convention', () => {
        // Matches:
        // - title: 'Components/TreeView'
        // Does not match:
        // -  title: 'Component/TreeView/Features'
        // -  title: 'TreeView'
        const defaultTitlePattern = /Components\/\w+/

        // Matches:
        // - title: 'Components/TreeView/Features'
        // Does not match:
        // -  title: 'Component/TreeView'
        // -  title: 'TreeView'
        const featureTitlePattern = /Components\/\w+\/Features/

        expect(story.default.title).toMatch(type === 'default' ? defaultTitlePattern : featureTitlePattern)
      })

      if (type === 'default') {
        test('exports a "Default" story', () => {
          expect(story.Default).toBeDefined()
        })

        test('"Default" story does not use args', () => {
          expect(story.Default.args).not.toBeDefined()
        })

        test('"Default" story does not set `argTypes` on the `Default` story', () => {
          expect(story.Default.argTypes).not.toBeDefined()
        })
      }
    })
  }
})
