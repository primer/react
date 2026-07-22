import {describe, expect, it} from 'vitest'
import {
  buildComposition,
  type CompositionSource,
  type DocumentedComponent,
} from '../../script/components-json/composition'

const components: Array<DocumentedComponent> = [
  {
    name: 'ActionMenu',
    props: [{name: 'children', type: 'React.ReactElement[]', required: true}],
    sourcePath: 'src/ActionMenu/ActionMenu.docs.json',
    subcomponents: [
      {name: 'ActionMenu.Button', props: []},
      {name: 'ActionMenu.Overlay', props: []},
    ],
  },
  {
    name: 'ActionList',
    props: [{name: 'children', type: 'ActionList.Item[] | ActionList.Divider[]', required: true}],
    sourcePath: 'src/ActionList/ActionList.docs.json',
    subcomponents: [
      {name: 'ActionList.Item', props: []},
      {name: 'ActionList.Divider', props: []},
    ],
  },
]

const sourceCode = html`
  <ActionMenu>
    <ActionMenu.Button />
    <ActionMenu.Overlay>
      <ActionList>
        <ActionList.Item />
        <ActionList.Divider />
        <ActionList.Item />
      </ActionList>
    </ActionMenu.Overlay>
  </ActionMenu>
`

describe('component composition metadata', () => {
  it('derives documented child-type contracts separately from observed JSX relationships', () => {
    const composition = buildComposition(components, sources(), source => sourceCodeByPath[source])

    expect(composition.apiParentChild).toEqual([
      {
        parent: 'ActionList',
        child: 'ActionList.Divider',
        required: true,
        source: {
          path: 'src/ActionList/ActionList.docs.json',
          prop: 'children',
          type: 'ActionList.Item[] | ActionList.Divider[]',
        },
      },
      {
        parent: 'ActionList',
        child: 'ActionList.Item',
        required: true,
        source: {
          path: 'src/ActionList/ActionList.docs.json',
          prop: 'children',
          type: 'ActionList.Item[] | ActionList.Divider[]',
        },
      },
    ])
    expect(composition.observed.parentChild).toContainEqual(
      expect.objectContaining({
        parent: 'ActionMenu',
        child: 'ActionMenu.Overlay',
        occurrences: 3,
        sourceCount: 2,
        confidence: 'medium',
      }),
    )
  })

  it('counts occurrences while deduplicating source provenance and emits stable ordering', () => {
    const composition = buildComposition(components, sources(), source => sourceCodeByPath[source])
    const secondComposition = buildComposition(components, [...sources()].reverse(), source => sourceCodeByPath[source])

    expect(composition).toEqual(secondComposition)
    expect(composition.observed.adjacentSibling).toContainEqual({
      parent: 'ActionList',
      previous: 'ActionList.Item',
      next: 'ActionList.Divider',
      occurrences: 3,
      sourceCount: 2,
      confidence: 'medium',
      sources: [
        {kind: 'story', path: 'src/ActionMenu/ActionMenu.stories.tsx'},
        {kind: 'test', path: 'src/ActionMenu/ActionMenu.test.tsx'},
      ],
    })
  })
})

function sources(): Array<CompositionSource> {
  return [
    {kind: 'test', path: 'src/ActionMenu/ActionMenu.test.tsx'},
    {kind: 'story', path: 'src/ActionMenu/ActionMenu.stories.tsx'},
    {kind: 'story', path: 'src/ActionMenu/ActionMenu.stories.tsx'},
  ]
}

const sourceCodeByPath: Record<string, string> = {
  'src/ActionMenu/ActionMenu.stories.tsx': sourceCode,
  'src/ActionMenu/ActionMenu.test.tsx': `<>${sourceCode}${sourceCode}</>`,
}

function html(strings: TemplateStringsArray): string {
  return strings.join('')
}
