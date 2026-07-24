import fs from 'node:fs'
import {processDocsFile} from '@primer/doc-gen'
import {describe, expect, it} from 'vitest'
import {
  buildComposition,
  getCompositionSources,
  type CompositionMetadata,
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
      <ActionList selectionVariant="single">
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
        childrenPropRequired: true,
        source: {
          path: 'src/ActionList/ActionList.docs.json',
          prop: 'children',
          type: 'ActionList.Item[] | ActionList.Divider[]',
        },
      },
      {
        parent: 'ActionList',
        child: 'ActionList.Item',
        childrenPropRequired: true,
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
    expect(composition.apiSubcomponents).toContainEqual({
      parent: 'ActionMenu',
      subcomponent: 'ActionMenu.Overlay',
      source: {path: 'src/ActionMenu/ActionMenu.docs.json'},
    })
    expect(
      composition.apiSubcomponents.filter(
        relationship => relationship.parent === 'ActionMenu' && relationship.subcomponent === 'ActionMenu.Overlay',
      ),
    ).toHaveLength(1)
    expect(composition.observed.variants).toContainEqual(
      expect.objectContaining({
        component: 'ActionList',
        prop: 'selectionVariant',
        value: 'single',
        occurrences: 3,
        sourceCount: 2,
        confidence: 'medium',
      }),
    )
    expect(composition.observed.relatedComponents).toContainEqual(
      expect.objectContaining({
        first: 'ActionList.Divider',
        second: 'ActionList.Item',
        relationshipKinds: ['adjacentSibling'],
        occurrences: 6,
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

  it('omits observations that do not meet the source threshold', () => {
    const composition = buildComposition(
      components,
      [{kind: 'story', path: 'src/ActionMenu/ActionMenu.stories.tsx'}],
      source => sourceCodeByPath[source],
    )

    expect(composition.observed).toEqual({
      parentChild: [],
      adjacentSibling: [],
      variants: [],
      relatedComponents: [],
    })
  })

  it('derives composition evidence across public component families without component-specific rules', () => {
    const composition = buildFamilyComposition()

    expect(composition.derivation.sourceKinds).toEqual(['example', 'implementation', 'story', 'test'])
    expect(composition.sourceSummary.sourceUnitsByKind.implementation).toBeGreaterThan(0)

    expect(composition.apiParentChild).toEqual(
      expect.arrayContaining([
        expect.objectContaining({parent: 'ActionList', child: 'ActionList.Group', childrenPropRequired: true}),
        expect.objectContaining({parent: 'FormControl', child: 'TextInput', childrenPropRequired: true}),
        expect.objectContaining({parent: 'UnderlineNav', child: 'UnderlineNav.Item', childrenPropRequired: true}),
      ]),
    )
    expect(composition.apiSubcomponents).toEqual(
      expect.arrayContaining([
        {parent: 'ActionMenu', subcomponent: 'ActionMenu.Overlay', source: {path: familyDocsFiles[1]}},
        {parent: 'NavList', subcomponent: 'NavList.Item', source: {path: familyDocsFiles[4]}},
        {parent: 'Dialog', subcomponent: 'Dialog.Body', source: {path: familyDocsFiles[5]}},
        {parent: 'SelectPanel', subcomponent: 'SelectPanel.SearchInput', source: {path: familyDocsFiles[9]}},
      ]),
    )
    expect(composition.observed.parentChild).toEqual(
      expect.arrayContaining([
        expect.objectContaining({parent: 'ActionMenu.Overlay', child: 'ActionList', confidence: 'high'}),
        expect.objectContaining({parent: 'FormControl', child: 'TextInput', confidence: 'high'}),
        expect.objectContaining({parent: 'NavList', child: 'NavList.Item', confidence: 'high'}),
        expect.objectContaining({parent: 'UnderlineNav', child: 'UnderlineNav.Item', confidence: 'high'}),
        expect.objectContaining({parent: 'AnchoredOverlay', child: 'ActionList', confidence: 'medium'}),
        expect.objectContaining({parent: 'PageLayout', child: 'PageLayout.Content', confidence: 'high'}),
      ]),
    )
    expect(composition.observed.variants).toEqual(
      expect.arrayContaining([
        expect.objectContaining({component: 'ActionList', prop: 'selectionVariant', value: 'single'}),
        expect.objectContaining({component: 'SelectPanel', prop: 'variant', value: 'modal'}),
      ]),
    )
    expect(composition.observed.adjacentSibling).toContainEqual(
      expect.objectContaining({
        parent: 'UnderlineNav',
        previous: 'UnderlineNav.Item',
        next: 'UnderlineNav.Item',
        confidence: 'high',
      }),
    )
    expect(composition.observed.relatedComponents).toContainEqual(
      expect.objectContaining({first: 'ActionList', second: 'ActionMenu.Overlay', confidence: 'high'}),
    )

    const actionMenuRelation = composition.observed.parentChild.find(
      relation => relation.parent === 'ActionMenu.Overlay' && relation.child === 'ActionList',
    )
    expect(actionMenuRelation?.sources).toEqual(
      expect.arrayContaining([expect.objectContaining({kind: 'implementation'})]),
    )
    expect(composition.apiSubcomponents).toHaveLength(
      new Set(composition.apiSubcomponents.map(relation => `${relation.parent}\0${relation.subcomponent}`)).size,
    )
    expect(composition.observed.parentChild).not.toContainEqual(expect.objectContaining({parent: 'ConfirmationDialog'}))
  })

  it('includes composition metadata in the generated package artifact', async () => {
    await import('../../script/components-json/build')

    const artifact = JSON.parse(fs.readFileSync('generated/components.json', 'utf8')) as {
      composition: CompositionMetadata
      schemaVersion: number
    }
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8')) as {
      exports: Record<string, string>
      files: Array<string>
    }

    expect(artifact.schemaVersion).toBe(2)
    expect(artifact.composition.schemaVersion).toBe(1)
    expect(artifact.composition.apiSubcomponents).toContainEqual(
      expect.objectContaining({parent: 'ActionMenu', subcomponent: 'ActionMenu.Overlay'}),
    )
    expect(artifact.composition.observed.parentChild).toContainEqual(
      expect.objectContaining({parent: 'ActionMenu.Overlay', child: 'ActionList'}),
    )
    expect(packageJson.files).toContain('generated')
    expect(packageJson.exports['./generated/components.json']).toBe('./generated/components.json')
  }, 20_000)
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

const familyDocsFiles = [
  'src/ActionList/ActionList.docs.json',
  'src/ActionMenu/ActionMenu.docs.json',
  'src/FormControl/FormControl.docs.json',
  'src/TextInput/TextInput.docs.json',
  'src/NavList/NavList.docs.json',
  'src/Dialog/Dialog.docs.json',
  'src/ConfirmationDialog/ConfirmationDialog.docs.json',
  'src/UnderlineNav/UnderlineNav.docs.json',
  'src/SelectPanel/SelectPanel.docs.json',
  'src/experimental/SelectPanel2/SelectPanel.docs.json',
  'src/AnchoredOverlay/AnchoredOverlay.docs.json',
  'src/Autocomplete/Autocomplete.docs.json',
  'src/PageLayout/PageLayout.docs.json',
  'src/PageHeader/PageHeader.docs.json',
]

function buildFamilyComposition(): CompositionMetadata {
  const documentedComponents = familyDocsFiles.map(sourcePath => {
    const component = processDocsFile(sourcePath) as Omit<DocumentedComponent, 'sourcePath'>
    return {...component, sourcePath}
  })

  return buildComposition(documentedComponents, getCompositionSources(familyDocsFiles))
}

function html(strings: TemplateStringsArray): string {
  return strings.join('')
}
