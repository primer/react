---
name: changesets
description: 'Use when: adding changesets to pull requests, determining semver bump types, versioning packages, or preparing releases. Covers changeset file format, semver guidance, when changesets are required, and the release pipeline.'
---

# Changesets in Primer React

This repository uses [Changesets](https://github.com/changesets/changesets) to manage versioning and changelogs. Every pull request that changes the public API or runtime behavior of a package must include a changeset file.

## What is a changeset?

A changeset is a markdown file in the `.changeset/` directory that describes:

1. **Which package** is affected (e.g., `@primer/react`)
2. **What semver bump** to apply (`patch`, `minor`, or `major`)
3. **A human-readable description** of the change (used in the changelog)

## File format

Changeset files live in `.changeset/` and have a random name with a `.md` extension. The file uses YAML frontmatter to specify the package and bump type, followed by a description:

```markdown
---
'@primer/react': patch
---

ActionMenu: Fix focus management when menu is closed with Escape key
```

The description becomes a single line item in the public changelog and release
notes, so keep it **terse**. Follow this pattern:

- Start with the component or module name followed by a colon
- Use **one or two sentences** describing WHAT changed at a high level
- Write from the consumer's perspective — focus on the consumer-facing impact
- Do **not** include implementation details, file paths, CSS selector or symbol
  names, internal rationale, or before/after explanations
- Do **not** use nested bullet lists or multi-paragraph walkthroughs. If a change
  has several distinct parts, split it into
  [separate changesets](#multiple-changesets-in-one-pr) instead

### Writing good descriptions

Aim for a description a consumer can scan in a few seconds.

**Good** — terse and consumer-facing:

```markdown
UnderlinePanels: Improve rendering performance when toggling tab icons
```

**Avoid** — verbose, implementation-focused, multi-clause:

```markdown
UnderlinePanels: Eliminate the empty-tablist frame on mount and the cascading
re-render when icons toggle. Tabs and panels are now derived in render
(previously stored in state synced via `useEffect`), the list width is kept in a
ref instead of state, and `iconsVisible` / `loadingCounters` flow to each tab
via context — combined with `React.memo(Tab)`...
```

The "Avoid" example reads like a commit message or PR body. Save that level of
detail for the pull request description; the changeset should summarize the
consumer-facing effect only.

## How to create a changeset

### Option 1: Interactive CLI

Run `npx changeset` and follow the prompts to select the package, bump type, and enter a description.

### Option 2: Manually create a file

Create a new file in `.changeset/` with a unique name (e.g., `.changeset/my-change-description.md`):

```markdown
---
'@primer/react': minor
---

Avatar: Add `square` variant for non-user avatars
```

Use lowercase kebab-case for the filename. The name is arbitrary but should be descriptive.

## Choosing the correct semver bump

Use this quick reference to determine the bump type. For the full decision table with detailed examples, see `contributor-docs/versioning.md`.

### `patch` — Bug fixes and internal corrections

- Fix a bug in component behavior
- Fix a styling issue
- Fix a TypeScript type that was incorrect
- Internal refactor that does not change the public API

### `minor` — New features and non-breaking additions

- Add a new component
- Add a new prop to an existing component
- Broaden the type of an existing prop (e.g., `string` → `string | number`)
- Deprecate a component or prop
- Add a new export
- Add a `data-component` attribute
- Add a dependency

### `major` — Breaking changes

- Remove a component
- Remove a prop
- Narrow the type of a prop (e.g., `string` → `'a' | 'b'`)
- Change the element that props are spread onto
- Broaden the element type in an event handler
- Remove or rename a `data-component` attribute
- Bump a dependency to a new major version

## When a changeset is NOT needed

Skip the changeset for changes that do not affect the published package:

- Documentation-only changes (markdown files, docs site content)
- Test-only changes (adding or updating tests)
- CI/infrastructure changes (GitHub Actions, scripts, config files)
- Storybook stories that don't change component source
- Dev dependency updates
- Changes to `examples/` or `e2e/` directories

When a changeset is not needed, add the `skip changeset` label to the pull request. This bypasses the CI check that requires a changeset to be present.

## Multiple changesets in one PR

If a PR introduces multiple distinct changes, add a **separate changeset file for each**. For example, if you fix a bug in `Button` and add a new prop to `ActionMenu`, create two changeset files — one `patch` for the fix and one `minor` for the new prop.

## Release pipeline

Understanding the release pipeline helps explain why changesets are required:

1. **On PR creation**: `changeset-bot` comments on the PR indicating whether valid changesets are present. If your change requires a changeset and none is found, the bot will flag it.
2. **On merge to `main`**: The `changesets/action` GitHub Action automatically creates or updates a "Version Packages" release PR that bumps version numbers, updates `CHANGELOG.md`, and shows release notes.
3. **On merging the release PR**: The action publishes the new version to npm and creates a GitHub Release.

## Common files

- `.changeset/*.md` — Changeset files (one per change)
- `.changeset/config.json` — Changesets configuration
- `contributor-docs/versioning.md` — Detailed semver bump guidance
- `contributor-docs/CONTRIBUTING.md` — Contributing guidelines including changeset instructions
