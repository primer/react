import fs from 'fs'
import glob from 'fast-glob'

// Components opted into the new story format
const components = ['TreeView']

const storyFiles = glob
  .sync('src/**/*.stories.tsx')
  .filter(file => components.some(component => file.includes(component)))
  .filter(file => !file.endsWith('.features.stories.tsx'))

for (const storyFile of storyFiles) {
  describe(`${storyFile}`, () => {
    const storyFileContents = fs.readFileSync(storyFile, 'utf8')

    test('exports a Default story', () => {
      expect(storyFileContents).toMatch(/export const Default/)
    })

    test('Default story does not use args', () => {
      expect(storyFileContents).not.toMatch(/Default\.args = /)
      expect(storyFileContents).not.toMatch(/Default\.argTypes = /)
    })
  })
}
