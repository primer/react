import {micromark} from 'micromark'
import {gfmTable, gfmTableHtml} from 'micromark-extension-gfm-table'
import {rolldown, type Plugin} from 'rolldown'
import {describe, expect, it} from 'vitest'
import {docs} from './docs-plugin'

function metadata(name: string, entrypoint = '@primer/react', props: unknown = [], extra = {}) {
  return `export default defineComponent(${JSON.stringify({name, importPath: entrypoint, props, subcomponents: [], ...extra})})`
}

async function bundle(modules: Record<string, string>, plugin?: Plugin) {
  const files = new Map(Object.entries(modules))
  const input = '\0entry'
  files.set(
    input,
    Object.keys(modules)
      .map((id, index) => {
        return `export {default as Component${index}} from ${JSON.stringify(id)}`
      })
      .join('\n'),
  )
  const fixtures: Plugin = {
    name: 'fixtures',
    resolveId(id) {
      return files.has(id) ? id : null
    },
    load(id) {
      return files.get(id)
    },
  }
  const build = await rolldown({
    input,
    plugins: plugin ? [fixtures, plugin] : [fixtures],
  })
  try {
    const result = await build.generate({format: 'esm'})
    return result.output
  } finally {
    await build.close()
  }
}

describe('component props Markdown', () => {
  it('emits one canonical asset per metadata module without changing generated JS', async () => {
    const tooltip = '\0TooltipV2.docs.ts'
    const files = {
      [tooltip]: metadata('Tooltip', '@primer/react/next'),
      '\0Tooltip.docs.ts': metadata('Tooltip', '@primer/react/deprecated'),
      '\0KeybindingHint.docs.ts': metadata('KeybindingHint', '@primer/react/experimental'),
      '\0Button.docs.ts': `throw new Error('Build must not execute metadata')\n${metadata('Button')}`,
      '\0alias.ts': `export {default} from ${JSON.stringify(tooltip)}`,
      '\0not-metadata.ts': 'export default "unchanged"',
    }
    const output = await bundle(files, docs())
    const baseline = await bundle(files)
    expect(
      output
        .filter(file => file.type === 'asset')
        .map(asset => asset.fileName)
        .sort(),
    ).toEqual([
      'docs/components/Button/props.md',
      'docs/deprecated/components/Tooltip/props.md',
      'docs/experimental/components/KeybindingHint/props.md',
      'docs/next/components/Tooltip/props.md',
    ])
    expect(output.filter(file => file.type === 'chunk').map(chunk => chunk.code)).toEqual(
      baseline.filter(file => file.type === 'chunk').map(chunk => chunk.code),
    )
  })

  it('preserves ordered rows, duplicates, passthrough, explicit defaults and Markdown syntax', async () => {
    const first = {
      name: 'children',
      type: 'Array<A | `B`>',
      required: false,
      defaultValue: '',
      description: 'Render <div> or `<a>` | fallback.\r\nSecond line.',
    }
    const second = {
      name: 'children',
      type: 'string',
      required: true,
      description: 'Fallback.',
    }
    const output = await bundle(
      {
        '\0Button.docs.ts': metadata('Button', '@primer/react', [first, second], {
          passthrough: {element: 'button', url: 'https://example.com/button#attributes'},
          subcomponents: [{name: 'Button.Icon', props: []}],
          relatedTypes: [{name: 'ButtonOptions', props: [second]}],
        }),
        '\0Heading.docs.ts': metadata('Heading'),
      },
      docs(),
    )
    const button = output.find(asset => asset.fileName === 'docs/components/Button/props.md')
    expect(button).toMatchObject({
      type: 'asset',
      source: [
        '# Button props',
        '',
        'Accepts additional props for [`button`](<https://example.com/button#attributes>).',
        '',
        '| Prop | Type | Required | Default | Description |',
        '| --- | --- | --- | --- | --- |',
        "| `children` | ``Array<A \\| `B`>`` | No | `''` | Render &lt;div&gt; or `<a>` \\| fallback.<br>Second line. |",
        '| `children` | `string` | Yes |  | Fallback. |',
        '',
        '## Subcomponents',
        '',
        '### `Button.Icon`',
        '',
        'No props are documented.',
        '',
        '## Related types',
        '',
        '### `ButtonOptions`',
        '',
        '| Prop | Type | Required | Default | Description |',
        '| --- | --- | --- | --- | --- |',
        '| `children` | `string` | Yes |  | Fallback. |',
        '',
      ].join('\n'),
    })
    expect(output.find(asset => asset.fileName === 'docs/components/Heading/props.md')).toMatchObject({
      source: '# Heading props\n\nNo props are documented.\n',
    })
  })

  it('rejects case-insensitive collisions between distinct modules', async () => {
    await expect(
      bundle({'\0A.docs.ts': metadata('Widget'), '\0B.docs.ts': metadata('WIDGET')}, docs()),
    ).rejects.toThrow('Conflicting props documentation path docs/components/WIDGET/props.md')
  })

  it('renders literal backslash-pipes, escaped backticks, and code newlines in the intended GFM cells', async () => {
    const output = await bundle(
      {
        '\0Widget.docs.ts': metadata('Widget', '@primer/react', [
          {
            name: 'pattern',
            type: String.raw`A\|B`,
            required: true,
            defaultValue: String.raw`C\\|D`,
            description: [
              'Use `one\r\ntwo | three` or `left\\|right`.',
              '\\`literal first',
              '\\`literal second.',
              'Even \\\\`code\nspan\\`.',
              'Runs \\``wrap\nhere` and ``keep ` tick\nintact``.',
            ].join('\n'),
          },
        ]),
      },
      docs(),
    )
    const asset = output.find(file => file.fileName === 'docs/components/Widget/props.md')
    if (asset?.type !== 'asset' || typeof asset.source !== 'string') {
      throw new Error('Missing props Markdown')
    }
    const html = micromark(asset.source, {
      extensions: [gfmTable()],
      htmlExtensions: [gfmTableHtml()],
      allowDangerousHtml: true,
    })
    expect(html.match(/<td>.*?<\/td>/g)).toEqual([
      // eslint-disable-next-line github/unescaped-html-literal -- Expected renderer output.
      '<td><code>pattern</code></td>',
      // eslint-disable-next-line github/unescaped-html-literal -- Expected renderer output.
      String.raw`<td><code>A\|B</code></td>`,
      // eslint-disable-next-line github/unescaped-html-literal -- Expected renderer output.
      '<td>Yes</td>',
      // eslint-disable-next-line github/unescaped-html-literal -- Expected renderer output.
      String.raw`<td><code>C\\|D</code></td>`,
      // eslint-disable-next-line github/unescaped-html-literal -- Expected renderer output.
      '<td>Use <code>one two | three</code> or <code>left\\|right</code>.<br>`literal first<br>`literal second.' +
        // eslint-disable-next-line github/unescaped-html-literal -- Expected renderer output.
        '<br>Even \\<code>code span\\</code>.<br>Runs `<code>wrap here</code> and <code>keep ` tick intact</code>.</td>',
    ])
  })

  it.each([
    [metadata('../Widget'), 'Unsafe component name'],
    [metadata('Widget', '@primer/react/../../escape'), 'Unsupported component importPath'],
    ['export default defineComponent(loadMetadata())', 'Unsupported metadata expression'],
  ])('rejects unsafe output paths or nonliteral metadata', async (code, message) => {
    await expect(bundle({'\0Widget.docs.ts': code}, docs())).rejects.toThrow(message)
  })
})
