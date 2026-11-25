import {describe, expect, it} from 'vitest'
import {renderExamples} from './render-examples'

describe('component examples Markdown', () => {
  it('renders Storybook stories as titled TSX code blocks', () => {
    expect(
      renderExamples({
        name: 'Button',
        importPath: '@primer/react',
        stories: [
          {id: 'components-button--default', code: '() => <Button>Button</Button>'},
          {id: 'components-button-features--with-primary-style', code: '() => <Button variant="primary">Save</Button>'},
        ],
      }),
    ).toEqual({
      fileName: 'docs/components/Button/examples.md',
      source: [
        '# Button examples',
        '',
        '## Default',
        '',
        '```tsx',
        '() => <Button>Button</Button>',
        '```',
        '',
        '## With Primary Style',
        '',
        '```tsx',
        '() => <Button variant="primary">Save</Button>',
        '```',
        '',
      ].join('\n'),
    })
  })

  it.each([
    ['@primer/react/deprecated', 'docs/deprecated/components/Widget/examples.md'],
    ['@primer/react/experimental', 'docs/experimental/components/Widget/examples.md'],
    ['@primer/react/next', 'docs/next/components/Widget/examples.md'],
  ])('supports the %s docs entrypoint', (importPath, fileName) => {
    expect(
      renderExamples({
        name: 'Widget',
        importPath,
        // eslint-disable-next-line github/unescaped-html-literal -- This is JSX source code in the fixture.
        stories: [{id: 'components-widget--default', code: '<Widget />'}],
      }),
    ).toMatchObject({fileName})
  })

  it('returns no file when a component has no stories with source', () => {
    expect(
      renderExamples({name: 'Widget', importPath: '@primer/react', stories: [{id: 'components-widget--default'}]}),
    ).toBeNull()
  })

  it('uses a longer fence when story code contains backticks', () => {
    expect(
      renderExamples({name: 'Widget', importPath: '@primer/react', stories: [{id: 'widget--default', code: '```'}]}),
    ).toMatchObject({source: '# Widget examples\n\n## Default\n\n````tsx\n```\n````\n'})
  })

  it('rejects unsafe output paths', () => {
    expect(() =>
      renderExamples({name: '../Widget', importPath: '@primer/react', stories: [{id: 'widget--default', code: ''}]}),
    ).toThrow('Unsafe component name')
  })
})
