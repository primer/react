/**
 * Mock data for the tabbed Branches / Tags SelectPanel stories.
 * Mirrors the real-world `github/github-ui` ref-selector use case.
 */

export interface Ref {
  id: string
  name: string
}

export const branches: Ref[] = [
  {id: 'branch-main', name: 'main'},
  {id: 'branch-develop', name: 'develop'},
  {id: 'branch-release-1', name: 'release/1.0'},
  {id: 'branch-release-2', name: 'release/2.0'},
  {id: 'branch-feat-tabs', name: 'feature/select-panel-tabs'},
  {id: 'branch-feat-async', name: 'feature/async-list'},
  {id: 'branch-fix-a11y', name: 'fix/listbox-roles'},
  {id: 'branch-fix-focus', name: 'fix/focus-return'},
  {id: 'branch-docs', name: 'docs/adr-024'},
  {id: 'branch-chore-deps', name: 'chore/bump-deps'},
]

export const tags: Ref[] = [
  {id: 'tag-v3-0-0', name: 'v3.0.0'},
  {id: 'tag-v2-5-1', name: 'v2.5.1'},
  {id: 'tag-v2-5-0', name: 'v2.5.0'},
  {id: 'tag-v2-4-0', name: 'v2.4.0'},
  {id: 'tag-v2-0-0', name: 'v2.0.0'},
  {id: 'tag-v1-9-0', name: 'v1.9.0'},
  {id: 'tag-v1-0-0', name: 'v1.0.0'},
  {id: 'tag-beta', name: 'v3.0.0-beta.1'},
]
