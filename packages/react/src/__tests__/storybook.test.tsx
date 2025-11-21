import fs from 'node:fs'
import path from 'node:path'
import {describe, expect, test} from 'vitest'
import glob from 'fast-glob'
import groupBy from 'lodash.groupby'

const ROOT_DIRECTORY = path.resolve(__dirname, '..', '..')

// Components opted into the new story format
// TODO: Remove this allowlist when all components use the new story format
const allowlist = [
  'ActionList',
  'ActionMenu',
  'AnchoredOverlay',
  'Autocomplete',
  'Avatar',
  'AvatarStack',
  'BranchName',
  'Blankslate',
  'Box',
  'Button',
  'Checkbox',
  'CheckboxGroup',
  'ConfirmationDialog',
  'CounterLabel',
  'DataTable',
  'Details',
  'Dialog',
  'Flash',
  'FormControl',
  'Header',
  'Heading',
  'IconButton',
  'FilteredActionList',
  'Link',
  'Octicon',
  'Pagehead',
  'Pagination',
  'ProgressBar',
  'Radio',
  'RadioGroup',
  'RelativeTime',
  'Select',
  'SegmentedControl',
  'Spinner',
  'StateLabel',
  'SubNav',
  'TabNav',
  'Textarea',
  'TextInput',
  'TextInputWithTokens',
  'Tooltip',
  'TreeView',
  'Timeline',
  'ToggleSwitch',
  'Token',
  'UnderlineNav2',
]

const defaultStoryArgTypesAllowList = ['Avatar']

const stories = await Promise.all(
  glob
    .sync('src/**/*.stories.tsx', {
      cwd: ROOT_DIRECTORY,
    })
    // Filter out deprecated stories
    .filter(file => !file.includes('deprecated'))
    .filter(file =>
      allowlist.some(
        component => file.includes(`/${component}.stories.tsx`) || file.includes(`/${component}.features.stories.tsx`),
      ),
    )
    .map(async file => {
      const filepath = path.join(ROOT_DIRECTORY, file)
      const type = path.basename(filepath, '.stories.tsx').endsWith('features') ? 'feature' : 'default'
      const name =
        type === 'feature' ? path.basename(file, '.features.stories.tsx') : path.basename(file, '.stories.tsx')

      return {
        name,
        story: await import(filepath),
        type,
        relativeFilepath: path.relative(ROOT_DIRECTORY, filepath),
      }
    }),
)

const components = Object.entries(
  groupBy(stories, ({name}) => {
    return name
  }),
)

describe.each(components)('%s', (_component, stories) => {
  for (const {story, type, relativeFilepath} of stories) {
    describe(`${story.default.title} (${relativeFilepath})`, () => {
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
        test('exports a Default story', () => {
          expect(story.Default).toBeDefined()
        })

        test('Default story does not have `args`', () => {
          expect(story.Default.args).not.toBeDefined()
        })

        test('Default story does not have `argTypes`', () => {
          if (!defaultStoryArgTypesAllowList.includes(_component)) {
            expect(story.Default.argTypes).not.toBeDefined()
          }
        })

        test('only exports Default and Playground stories', () => {
          for (const storyName of Object.keys(story)) {
            expect(/^Default$|^(.*)Playground$|^default$/.test(storyName)).toBe(true)
          }
        })
      }
    })
  }
})

const jsonFiles = glob
  .sync('src/**/*.docs.json', {
    cwd: ROOT_DIRECTORY,
  })
  .filter(filepath => {
    const name = path.basename(filepath, '.docs.json')
    return allowlist.includes(name)
  })

describe.each(jsonFiles)('%s', filepath => {
  test('has a corresponding .stories.tsx file', () => {
    const storyFilepath = path.join(ROOT_DIRECTORY, filepath.replace('.docs.json', '.stories.tsx'))
    expect(fs.existsSync(storyFilepath)).toBe(true)
  })
})
