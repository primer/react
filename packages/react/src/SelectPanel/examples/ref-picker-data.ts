export type RefType = 'branches' | 'tags'

export type GitRef = {
  /** Unique id, used as the ActionList.Item key and selection identifier */
  id: string
  /** The ref name, e.g. `main` or `v1.2.3` */
  name: string
}

const branchNames = [
  'main',
  'develop',
  'release/8.0',
  'release/7.4',
  'feat/select-panel-tabs',
  'feat/ref-picker',
  'feat/action-list-virtualization',
  'fix/overlay-focus-trap',
  'fix/tooltip-aria-describedby',
  'chore/bump-deps',
  'docs/storybook-upgrade',
  'experiment/css-modules',
  'experiment/treeview-async',
  'hotfix/security-patch',
  'renovate/octicons',
  'spike/server-components',
  'wip/data-table-sorting',
  'wip/anchored-position',
  'staging',
  'production',
  'next',
  'canary',
  'jdoe/playground',
  'asmith/banner-redesign',
]

const tagNames = [
  'v8.0.0',
  'v8.0.0-rc.1',
  'v7.4.2',
  'v7.4.1',
  'v7.4.0',
  'v7.3.0',
  'v7.2.1',
  'v7.2.0',
  'v7.1.0',
  'v7.0.0',
  'v6.5.0',
  'v6.4.0',
  'v6.3.1',
  'v6.0.0',
  'v5.9.0',
  'v5.0.0',
  'v4.2.0',
  'v4.0.0',
  'v3.1.0',
  'v2.0.0',
  'v1.0.0',
  'latest',
  'stable',
  'nightly',
]

const toRefs = (names: ReadonlyArray<string>): GitRef[] => names.map(name => ({id: name, name}))

export const branches: GitRef[] = toRefs(branchNames)
export const tags: GitRef[] = toRefs(tagNames)

export const refData: Record<RefType, GitRef[]> = {
  branches,
  tags,
}
