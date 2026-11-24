import assert from 'node:assert/strict'
import {spawnSync} from 'node:child_process'
import {mkdtempSync, rmdirSync, unlinkSync, writeFileSync} from 'node:fs'
import {tmpdir} from 'node:os'
import path from 'node:path'
import {test} from 'node:test'
import {fileURLToPath} from 'node:url'
import {lintStory} from './lint-storybook.mts'

const componentStory = `
  const meta = {title: 'Components/Button', component: Button} satisfies Meta<typeof Button>
  export default meta
  export const Default = () => <Button>Button</Button>
  export const Playground = {args: {disabled: false}, render: args => <Button {...args} />}
`

test('accepts CSF object stories with inferred controls and typed metadata', () => {
  assert.deepEqual(lintStory('Button.stories.tsx', componentStory), [])
})

test('accepts function stories, local export aliases, and assigned argTypes', () => {
  assert.deepEqual(
    lintStory(
      'Button.stories.tsx',
      `
        const meta = ({title: 'Components/Button'} as Meta)
        export default meta
        function Basic() { return <Button /> }
        const Playground = Template.bind({})
        Playground.argTypes = {disabled: {control: 'boolean'}}
        export {Basic as Default, Playground}
      `,
    ),
    [],
  )
})

test('checks category file/title pairs without requiring Default or Playground', () => {
  for (const category of ['features', 'examples', 'dev']) {
    const label = category[0].toUpperCase() + category.slice(1)
    assert.deepEqual(
      lintStory(`Button.${category}.stories.tsx`, `export default {title: 'Components/Button/${label}'}`),
      [],
    )
    assert.match(
      lintStory(`Button.${category}.stories.tsx`, `export default {title: 'Components/Button/Wrong'}`).join('\n'),
      new RegExp(`Components/Button/${label}`),
    )
  }
})

test('preserves title prefixes, nested groups, split categories, and dev-only stress tests', () => {
  for (const prefix of ['Experimental/', 'Deprecated/', 'Private/']) {
    assert.deepEqual(
      lintStory('Button.stories.tsx', componentStory.replace('Components/Button', `${prefix}Components/Button`)),
      [],
    )
  }
  assert.deepEqual(
    lintStory('Button.stories.tsx', componentStory.replace('Components/Button', 'Components/Group/Button')),
    [],
  )
  assert.deepEqual(
    lintStory('Button.loading.features.stories.tsx', `export default {title: 'Components/Button/Features/Loading'}`),
    [],
  )
  assert.deepEqual(
    lintStory('Button.stress.dev.stories.tsx', `export default {title: 'StressTests/Components/Button'}`),
    [],
  )
  assert.match(
    lintStory('Button.stress.stories.tsx', `export default {title: 'StressTests/Components/Button'}`).join('\n'),
    /Use title/,
  )
})

test('reports missing exports, unreadable metadata, and non-TSX filenames', () => {
  assert.deepEqual(lintStory('Button.stories.tsx', `export default {title: 'Components/Button'}`), [
    'Component stories must export Default.',
    'Component stories must export Playground.',
  ])
  for (const source of ['export default makeMeta()', `export default {title: 'Components/Other'}`]) {
    assert.match(lintStory('Button.features.stories.tsx', source).join('\n'), /Use title/)
  }
  assert.match(lintStory('Button.stories.jsx', componentStory).join('\n'), /stories.tsx/)
})

test('requires usable controls, not just an empty or disabled configuration', () => {
  const cases = [
    {args: '{}'},
    {args: '{disabled: false}', extra: 'parameters: {controls: {disable: true}}'},
    {args: '{disabled: false}', extra: 'parameters: {controls: {include: []}}'},
    {args: '{disabled: false}', extra: 'parameters: {controls: {exclude: ["disabled"]}}'},
    {args: '{disabled: false}', extra: 'parameters: {controls: {exclude: /disabled/}}'},
    {args: '{disabled: false}', extra: 'argTypes: {disabled: {control: false}}'},
    {args: '{disabled: false}', extra: 'argTypes: {disabled: {control: null}}'},
    {args: '{}', extra: 'argTypes: {}'},
    {args: '{disabled: false}', extra: 'argTypes: {disabled: {control: {}}}'},
    {args: '{disabled: false}', extra: 'argTypes: {disabled: {control: "boolean", table: {disable: true}}}'},
  ]
  for (const {args, extra = ''} of cases) {
    const source = componentStory.replace('args: {disabled: false}', `args: ${args}${extra ? `, ${extra}` : ''}`)
    assert.match(lintStory('Button.stories.tsx', source).join('\n'), /Playground must expose controls/)
  }
  assert.match(
    lintStory(
      'Button.stories.tsx',
      componentStory.replace('component: Button', 'component: Button, parameters: {controls: {disable: true}}'),
    ).join('\n'),
    /Playground must expose controls/,
  )
})

test('accepts explicit controls on meta and does not mistake nested story titles for metadata', () => {
  const source = `
    const meta = {title: 'Components/Button', argTypes: {disabled: {control: {type: 'boolean'}}}}
    export default meta
    export function Default() { return <Button title="Example" /> }
    export const Playground = {args: {title: 'Not the CSF title'}}
  `
  assert.deepEqual(lintStory('Button.stories.tsx', source), [])
})

test('merges meta/story controls and lets Playground re-enable controls', () => {
  assert.deepEqual(
    lintStory(
      'Button.stories.tsx',
      `
        export default {
          title: 'Components/Button',
          parameters: {controls: {disable: true}},
          argTypes: {disabled: {control: 'boolean'}}
        }
        export const Default = () => <Button />
        export const Playground = {
          parameters: {controls: {disable: false}},
          argTypes: {title: {control: false}}
        }
      `,
    ),
    [],
  )
})

test('accepts controls inferred from argTypes.type and applies include filters', () => {
  const source = `
    export default {title: 'Components/Button', parameters: {controls: {include: /^disabled$/}}}
    export const Default = () => <Button />
    export const Playground = {argTypes: {disabled: {type: 'boolean'}}}
  `
  assert.deepEqual(lintStory('Button.stories.tsx', source), [])
  assert.match(
    lintStory('Button.stories.tsx', source.replace('/^disabled$/', '["other"]')).join('\n'),
    /Playground must expose controls/,
  )
})

test('does not accept component-name substrings or unclassified split files', () => {
  assert.match(
    lintStory('Button.features.stories.tsx', `export default {title: 'Components/NotButton/Features/Loading'}`).join(
      '\n',
    ),
    /Use title/,
  )
  assert.match(lintStory('Button.loading.stories.tsx', componentStory).join('\n'), /Split stories/)
})

test('does not apply component conventions to non-component namespaces', () => {
  for (const title of ['Behaviors/Portal', 'Hooks/useFocusTrap', 'Octicons/Customization']) {
    assert.deepEqual(lintStory('Example.stories.tsx', `export default {title: '${title}'}`), [])
  }
})

test('CLI reports violations and unmatched patterns with a nonzero exit status', () => {
  const directory = mkdtempSync(path.join(tmpdir(), 'primer-storybook-lint-'))
  const filename = path.join(directory, 'Button.stories.tsx')
  const script = fileURLToPath(new URL('./lint-storybook.mts', import.meta.url))
  const run = (...args: string[]) => spawnSync(process.execPath, [script, ...args], {encoding: 'utf8'})
  try {
    writeFileSync(filename, componentStory)
    const passing = run(filename)
    assert.equal(passing.status, 0, passing.stderr)
    assert.match(passing.stdout, /Checked 1 story files; 0 convention violations/)

    writeFileSync(filename, `export default {title: 'Components/Button'}`)
    const failing = run(filename)
    assert.equal(failing.status, 1)
    assert.match(failing.stderr, /Component stories must export Playground/)

    const unmatched = run(path.join(directory, 'Missing.stories.tsx'))
    assert.equal(unmatched.status, 1)
    assert.match(unmatched.stderr, /No story files matched/)

    const help = run('--help')
    assert.equal(help.status, 0)
    assert.match(help.stdout, /Usage:/)
  } finally {
    unlinkSync(filename)
    rmdirSync(directory)
  }
})
