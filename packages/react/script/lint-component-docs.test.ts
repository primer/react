import {extractSourceProps} from '@primer/doc-gen'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import ts from 'typescript'
import {describe, expect, it, vi} from 'vitest'
import {lintSource, selectDocs} from './lint-component-docs'

const sourceRoot = fileURLToPath(new URL('../src', import.meta.url))
const entrypoint = path.join(sourceRoot, 'fixture-index.ts')
const metadata = path.join(sourceRoot, 'fixture.docs.ts')

function docs(props = '', subcomponents = '', relatedTypes = '') {
  return `export default defineComponent({
    id: 'fixture',
    name: 'Widget',
    status: 'stable',
    a11yReviewed: false,
    importPath: '@primer/react',
    stories: [],
    props: [${props}],
    subcomponents: [${subcomponents}],
    relatedTypes: [${relatedTypes}],
  })`
}

function lint(
  api: string,
  input: string,
  entry = "export {LocalWidget as Widget} from './fixture-api'",
  extractProps = extractSourceProps,
) {
  const files = new Map([
    [entrypoint, entry],
    [path.join(sourceRoot, 'fixture-api.ts'), api],
    [metadata, input],
    [
      path.join(sourceRoot, '../node_modules/@types/react/index.d.ts'),
      'export interface ReactElement { type: string; props: object; key: string }',
    ],
  ])
  const options: ts.CompilerOptions = {
    strict: true,
    noLib: true,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
  }
  const host = ts.createCompilerHost(options)
  host.fileExists = name => {
    return files.has(name)
  }
  host.directoryExists = name => {
    return [...files.keys()].some(file => file.startsWith(`${name}${path.sep}`))
  }
  host.readFile = name => {
    return files.get(name)
  }
  host.getSourceFile = (name, language) => {
    const text = files.get(name)
    return text === undefined ? undefined : ts.createSourceFile(name, text, language, true)
  }
  const program = ts.createProgram([...files.keys()], options, host)
  const source = program.getSourceFile(metadata)
  if (!source) {
    throw new Error('Missing fixture metadata')
  }
  return lintSource(program, source, new Map([['@primer/react', entrypoint]]), sourceRoot, extractProps)
}

const element = "import type {ReactElement as Element} from 'react';"
const simple = `${element}
  interface Props {
    /**
     * Enables the widget.
     * @default false
     */
    enabled?: boolean
    title: string
  }
  export declare function LocalWidget(props: Props): Element
`

describe('typed component docs coverage', () => {
  it('uses the doc-gen extractor for a missing prop row and individual fields', () => {
    const extractProps = vi.fn(extractSourceProps)
    const input = docs("{name: 'title', description: 'Custom wording.', required: true}")
    const result = lint(simple, input, undefined, extractProps)
    expect(extractProps).toHaveReturnedWith(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'enabled',
          type: 'boolean',
          required: false,
          description: 'Enables the widget.',
          defaultValue: 'false',
        }),
      ]),
    )
    expect(result).toEqual([
      {
        kind: 'missing',
        subject: 'Widget.enabled',
        message:
          'Add prop {"name":"enabled","type":"boolean","required":false,"description":"Enables the widget.","defaultValue":"false"}.',
      },
      {kind: 'missing', subject: 'Widget.title.type', message: 'Add "string".'},
    ])
    expect(
      lint(
        simple,
        docs(
          "{name: 'enabled', type: 'boolean', required: false}," +
            "{name: 'title', type: 'string', description: 'Custom wording.', required: true}",
        ),
      ),
    ).toEqual([
      {kind: 'missing', subject: 'Widget.enabled.defaultValue', message: 'Add "false".'},
      {kind: 'missing', subject: 'Widget.enabled.description', message: 'Add "Enables the widget.".'},
    ])
  })

  it('excludes the explicit _private convention without hiding public underscore props', () => {
    const result = lint(
      `${element}
      interface Props {
        /** Private API for use internally only. */
        _privateDisableTooltip?: boolean
        /** @internal */
        internalToggle?: boolean
        _publicValue: string
      }
      export declare function LocalWidget(props: Props): Element`,
      docs(),
    )
    expect(result).toMatchObject([{kind: 'missing', subject: 'Widget._publicValue'}])
  })

  it('accepts complete authored metadata without comparing wording or formatting', () => {
    const result = lint(
      simple,
      docs(
        "{name: 'title', type: 'string', description: '', required: true}," +
          "{name: 'enabled', type: 'boolean', description: 'Whether the widget is on.', required: false, defaultValue: 'false'}",
      ),
    )
    expect(result).toEqual([])
  })

  it('reports variant-only props without guessing at requiredness', () => {
    const result = lint(
      `${element}
      export declare function LocalWidget(props: { common: string; href: string; active?: boolean }): Element
      export declare function LocalWidget(props: { common: string; active: boolean }): Element`,
      docs(),
    )
    expect(result.map(({kind, subject}) => [kind, subject])).toEqual([
      ['unresolved', 'Widget.active'],
      ['missing', 'Widget.common'],
      ['unresolved', 'Widget.href'],
    ])
  })

  it('checks nested callable members, listed companion exports, and named public prop types', () => {
    const result = lint(
      `${element}
      export interface Options { label: string }
      export declare function LocalWidget(props: { options: Options }): Element
      export declare namespace LocalWidget {
        const Child: ((props: { childProp: string }) => Element) & {
          Nested: (props: { nestedProp: string }) => Element
        }
        function Helper(): string
        /** @internal */
        const Internal: (props: { secret: string }) => Element
        function Similar(): { type: string; props: object; key: string }
      }
      export declare function Companion(props: { companionProp: string }): Element
      export declare function Unrelated(props: { ignore: string }): Element`,
      docs(
        "{name: 'options', type: 'Options', description: 'Options.', required: true}",
        "{name: 'Companion', displayName: 'Companion', props: []}",
        "{name: 'Options', props: []}",
      ),
      "export {LocalWidget as Widget, Companion, Unrelated} from './fixture-api'",
    )
    expect(result.map(({kind, subject}) => [kind, subject])).toEqual([
      ['missing', 'Companion.companionProp'],
      ['missing', 'Options.label'],
      ['missing', 'Widget.Child'],
      ['missing', 'Widget.Child.Nested'],
      ['missing', 'Widget.Child.Nested.nestedProp'],
      ['missing', 'Widget.Child.childProp'],
      ['unresolved', 'Widget.Helper'],
      ['unresolved', 'Widget.Similar'],
    ])
  })

  it('does not execute metadata or misidentify a type-only export as a component', () => {
    expect(lint(simple, 'export default defineComponent(loadDocs())')).toMatchObject([{kind: 'invalid'}])
    expect(lint(simple, docs(), "export type {LocalWidget as Widget} from './fixture-api'")).toMatchObject([
      {kind: 'unresolved', subject: 'Widget'},
    ])
  })

  it('selects all typed metadata or one supported relative path', () => {
    const file = 'src/live-region/AriaStatus.docs.ts'
    const selected = selectDocs([file])
    expect(selected).toHaveLength(1)
    expect(selectDocs([`packages/react/${file}`])).toEqual(selected)
    const all = selectDocs([])
    expect(all.length).toBeGreaterThan(1)
    expect(all).toContain(selected[0])
    expect(all).toEqual([...all].sort())
    expect(() => selectDocs([file.replace(/\.ts$/, '.json')])).toThrow('Unsupported docs path')
    expect(() => selectDocs([`../../${file}`])).toThrow('Unsupported docs path')
    expect(() => selectDocs(['src/missing.docs.ts'])).toThrow('No regular typed docs file')
    expect(() => selectDocs([file, file])).toThrow('Expected zero arguments or one')
  })

  it('validates guardrail ids, defaultBehaviors overriddenBy references, and usageGuidelines ordering', () => {
    const valid = `export default defineComponent({
      id: 'fixture',
      name: 'Widget',
      status: 'stable',
      a11yReviewed: false,
      importPath: '@primer/react',
      stories: [],
      props: [
        {name: 'title', type: 'string', description: 'Title.', required: true},
        {name: 'enabled', type: 'boolean', description: 'Enables the widget.', required: false, defaultValue: 'false'},
      ],
      subcomponents: [],
      builtInBehaviors: [{id: 'auto-focus', description: 'Manages focus.'}],
      defaultBehaviors: [{id: 'disabled-by-default', description: 'Off by default.', overriddenBy: ['enabled']}],
      usageGuidelines: [
        {id: 'prefer-title', guidance: 'do', check: 'review', description: 'Provide a clear title.'},
        {id: 'avoid-empty', guidance: 'dont', check: 'runtime', description: 'Do not pass empty titles.'},
      ],
    })`
    expect(lint(simple, valid)).toEqual([])

    const invalid = `export default defineComponent({
      id: 'fixture',
      name: 'Widget',
      status: 'stable',
      a11yReviewed: false,
      importPath: '@primer/react',
      stories: [],
      props: [
        {name: 'title', type: 'string', description: 'Title.', required: true},
        {name: 'enabled', type: 'boolean', description: 'Enables the widget.', required: false, defaultValue: 'false'},
      ],
      subcomponents: [],
      builtInBehaviors: [{id: 'dup-id', description: 'Behavior.'}],
      defaultBehaviors: [{id: 'dup-id', description: 'Default.', overriddenBy: ['renamedProp']}],
      usageGuidelines: [
        {id: 'dont-first', guidance: 'dont', check: 'runtime', description: 'Dont rule.'},
        {id: 'do-after-dont', guidance: 'do', check: 'invalid-check', description: 'Do rule.'},
      ],
    })`
    expect(lint(simple, invalid)).toEqual([
      {
        kind: 'invalid',
        subject: 'Widget.defaultBehaviors.dup-id',
        message: 'Duplicate guardrail id.',
      },
      {
        kind: 'invalid',
        subject: 'Widget.defaultBehaviors.dup-id.overriddenBy',
        message: 'Unknown prop reference "renamedProp".',
      },
      {
        kind: 'invalid',
        subject: 'Widget.usageGuidelines.do-after-dont',
        message: "Place 'do' guidelines before 'dont' guidelines.",
      },
      {
        kind: 'invalid',
        subject: 'Widget.usageGuidelines.do-after-dont.check',
        message: 'Expected "runtime" or "review".',
      },
    ])
  })
})
