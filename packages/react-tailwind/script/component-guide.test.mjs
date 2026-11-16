import assert from 'node:assert/strict'
import {test} from 'node:test'
import {readComponentGuide} from './component-guide.mjs'

function read(body) {
  const problems = []
  const sections = readComponentGuide(`# Button\n\nTriggers an action.\n\n${body}`, 'Button', problems)
  return {sections, problems}
}

test('preserves canonical examples, composition, styling, and API notes', () => {
  const {sections, problems} = read(
    '```tsx\nimport {Button} from "@primer/react-tailwind"\n;<Button>Save</Button>\n```\n\n' +
      '## Composition\nUse public parts.\n\n## Data attributes\nUse documented selectors.\n\n## Props\nNative props reach the button.',
  )
  assert.deepEqual(problems, [])
  assert.deepEqual(
    sections.map(section => section.heading),
    ['Usage', 'Composition', 'Data attributes', 'API notes'],
  )
  assert.match(sections[0].text, /<Button>Save<\/Button>/)
})

test('removes single and multiline Storybook blocks, not fenced JSX', () => {
  const {sections, problems} = read(
    '<Canvas of={Stories.Default} />\n\n<Controls\n  of={Stories.Playground}\n/>\n\n' +
      '## Usage\n```tsx\n<Button render={<CustomButton />} />\n```\n\n<ApiReference {...api} />',
  )
  assert.deepEqual(problems, [])
  assert.equal(sections.length, 1)
  assert.match(sections[0].text, /render={<CustomButton \/>}/)
  assert.doesNotMatch(sections[0].text, /Canvas|Controls|ApiReference/)
})

test('rejects import-only guidance', () => {
  const {problems} = read('```tsx\nimport {Button} from "@primer/react-tailwind"\n```')
  assert.match(problems.join('\n'), /needs a fenced usage example/)
})

test('accepts a multiline component example', () => {
  const {problems} = read('```tsx\n<Button\n  variant="primary"\n/>\n```')
  assert.deepEqual(problems, [])
})

test('reports unsupported MDX instead of silently omitting it', () => {
  const {problems} = read('```tsx\n<Button />\n```\n\n<ImportantAdvice />')
  assert.match(problems.join('\n'), /unsupported MDX/)
})

test('preserves long fences, nested code fences, and headings inside examples', () => {
  const {sections, problems} = read('````tsx\n<Button />\n## Not a section\n```\n````')
  assert.deepEqual(problems, [])
  assert.equal(sections.length, 1)
  assert.match(sections[0].text, /## Not a section\n```/)
})

test('maps cross-component guide links and removes repository-only relative links', () => {
  const {sections, problems} = read(
    '```tsx\n<Button />\n```\n\n## Composition\n' +
      'Read [Dialog](../Dialog/README.mdx#usage) and [alignment](./ALIGNMENT.md).',
  )
  assert.deepEqual(problems, [])
  assert.match(sections[1].text, /\[Dialog\]\(\.\/Dialog.md#usage\)/)
  assert.doesNotMatch(sections[1].text, /ALIGNMENT.md/)
})

test('leaves alignment to generated migration notes and drops empty sections', () => {
  const {sections, problems} = read(
    '```tsx\n<Button />\n```\n\n## Default\n<Canvas of={Stories.Default} />\n\n' +
      '## Alignment\nSee old source.\n\n## Accessibility\nProvide a name.',
  )
  assert.deepEqual(problems, [])
  assert.deepEqual(
    sections.map(section => section.heading),
    ['Usage', 'Accessibility'],
  )
})

test('reports unclosed code and Storybook fences', () => {
  assert.match(read('```tsx\n<Button />').problems.join('\n'), /unclosed code fence/)
  assert.match(read('<Canvas\n of={Stories.Default}').problems.join('\n'), /unclosed Storybook block/)
})

test('reports a missing component heading', () => {
  const problems = []
  assert.deepEqual(readComponentGuide('# Other\n', 'Button', problems), [])
  assert.match(problems.join('\n'), /no "# Button" heading/)
})
