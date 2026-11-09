import type React from 'react'
import {
  SelectPanel,
  type SelectPanelItem,
  type SelectPanelMultipleProps,
  type SelectPanelProps,
  type SelectPanelSingleProps,
} from '@primer/react-tailwind'
import {SelectPanel as SubpathSelectPanel} from '@primer/react-tailwind/SelectPanel'

interface Repository {
  name: string
  stars: number
}

type RepositoryItem = SelectPanelItem & {id: number; source: Repository}

declare const repositories: RepositoryItem[]
declare const repository: RepositoryItem | undefined
declare const selectedRepositories: readonly RepositoryItem[]
declare const looseSelection: RepositoryItem | RepositoryItem[] | undefined
declare function readRepository(repository: Repository): void
declare const retainedProjects: SelectPanelItem[]
declare function setItems(items: SelectPanelItem[]): void

export const singleByDefault = (
  <SelectPanel
    items={repositories}
    selected={repository}
    onSelectedChange={next => {
      if (next) readRepository(next.source)
    }}
    title="Repository"
  />
)

export const multipleFromArray = (
  <SelectPanel
    items={repositories}
    selected={selectedRepositories}
    onSelectedChange={next => {
      for (const item of next) readRepository(item.source)
    }}
    title="Repositories"
  />
)

export const explicitModes = (
  <>
    <SelectPanel
      items={repositories}
      selected={repository}
      selectionVariant="single"
      onSelectedChange={next => next?.source.stars}
      title="Repository"
    />
    <SubpathSelectPanel
      items={repositories}
      selected={[]}
      selectionVariant="multiple"
      onSelectedChange={next => next.map(item => item.source.name)}
      title="Repositories"
    />
  </>
)

// Selected options may be wider than the current page of items, such as selections retained across async filtering.
export const retainedSelection = (
  <SelectPanel
    items={[{id: 'roadmap', text: 'Roadmap'}]}
    selected={retainedProjects}
    onSelectedChange={setItems}
    title="Projects"
  />
)

export const staticMembers = (
  <SelectPanel
    items={repositories}
    message={<SelectPanel.Message title="No repositories" />}
    onSelectedChange={next => next?.source.name}
    secondaryAction={<SelectPanel.SecondaryActionButton>Create</SelectPanel.SecondaryActionButton>}
    selected={undefined}
    title="Repository"
  />
)

const forwardedSingle: SelectPanelSingleProps<RepositoryItem> = {
  items: repositories,
  onSelectedChange: next => next?.source.name,
  selected: repository,
}
const forwardedMultiple: SelectPanelMultipleProps<RepositoryItem> = {
  items: repositories,
  onSelectedChange: next => next.map(item => item.source.name),
  selected: selectedRepositories,
}
const forwardedEither: SelectPanelProps<RepositoryItem>[] = [forwardedSingle, forwardedMultiple]
const componentProps: React.ComponentProps<typeof SelectPanel> = {items: [], onSelectedChange: setItems, selected: []}

export const forwarded = (
  <>
    <SelectPanel {...forwardedSingle} />
    <SelectPanel {...forwardedMultiple} />
    {forwardedEither.map((props, index) => (
      <SelectPanel key={index} {...props} />
    ))}
    <SelectPanel {...componentProps} />
  </>
)

export const singleWithArray = (
  // @ts-expect-error A single selection cannot be an array.
  <SelectPanel
    items={repositories}
    selected={selectedRepositories}
    selectionVariant="single"
    onSelectedChange={() => {}}
    title="Repository"
  />
)

export const multipleWithUndefined = (
  // @ts-expect-error Multiple selection requires an array, even when nothing is selected.
  <SelectPanel
    items={repositories}
    selected={undefined}
    selectionVariant="multiple"
    onSelectedChange={() => {}}
    title="Repositories"
  />
)

export const singleCallbackForArray = (
  // @ts-expect-error An array selection reports arrays, not one item.
  <SelectPanel
    items={repositories}
    selected={selectedRepositories}
    onSelectedChange={(_next: RepositoryItem | undefined) => {}}
    title="Repositories"
  />
)

export const multipleCallbackForItem = (
  // @ts-expect-error A single selection reports one item, not an array.
  <SelectPanel
    items={repositories}
    selected={repository}
    onSelectedChange={(_next: RepositoryItem[]) => {}}
    title="Repository"
  />
)

export const ambiguousSelection = (
  // @ts-expect-error A selection whose shape is decided at runtime must choose one mode.
  <SelectPanel items={repositories} selected={looseSelection} onSelectedChange={() => {}} title="Repository" />
)

export const missingCustomField = (
  <SelectPanel
    items={repositories}
    selected={repository}
    // @ts-expect-error Callback items keep the consumer item type.
    onSelectedChange={next => next?.source.missing}
    title="Repository"
  />
)

export const customRenderItem = (
  <SelectPanel
    items={repositories}
    renderItem={item => item.source.name}
    selected={repository}
    onSelectedChange={() => {}}
    title="Repository"
  />
)
