import path from 'node:path'
import glob from 'fast-glob'

const ROOT_DIRECTORY = path.resolve(__dirname, '..', '..')
// Components opted into the new story format
const components = ['TreeView']
const stories = glob
  .sync('src/**/*.stories.tsx', {
    cwd: ROOT_DIRECTORY
  })
  .filter(file => components.some(component => file.includes(component)))
  .filter(file => !file.endsWith('.features.stories.tsx'))
  .map(file => {
    const filepath = path.join(ROOT_DIRECTORY, file)
    return [path.basename(file, '.stories.tsx'), require(filepath)]
  })

describe.each(stories)('%s', (_component, story) => {
  it('should have a `Default` story', () => {
    expect(story.Default).toBeDefined()
  })

  it('should not set `args` on the `Default` story', () => {
    expect(story.Default.args).not.toBeDefined()
  })

  it('should not set `argTypes` on the `Default` story', () => {
    expect(story.Default.argTypes).not.toBeDefined()
  })
})
