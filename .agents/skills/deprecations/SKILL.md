---
name: deprecations
description: 'Use when: deprecating Primer React components or hooks. Covers source annotations, docs metadata, changesets, docs page updates, and validation for deprecations.'
---

# Deprecating components and hooks in Primer React

Use this skill when a task involves marking a public Primer React API as deprecated.

## What to update

### Source code

- Add a JSDoc `@deprecated` annotation to the exported component, hook, prop, or type following existing patterns nearby.
- Keep runtime behavior unchanged unless the task explicitly requires more than deprecation signaling.

### Docs metadata

- For components, mark the relevant `*.docs.json` file with `"status": "deprecated"`.
- For hooks, mark the relevant `*.hookDocs.json` file with `"status": "deprecated"`.
- If schema or build tooling does not yet support the docs metadata you need, update the corresponding schema/build files in `packages/react/script/*-json/`.

### Documentation content

- If the deprecated component has a docs page or JSON-backed docs content that supports deprecation guidance, add or update the deprecation guidance and recommended alternative.
- Follow `contributor-docs/deprecating-components.md`.

### Versioning

- Add a changeset for public API deprecations.
- Use the versioning guidance in `contributor-docs/versioning.md` to choose the correct bump.

## Validation

Prefer targeted validation first, then broader validation if needed:

- Format changed files with `npx prettier --write <paths>`
- Lint changed TypeScript files with `npx eslint --fix <paths>`
- Rebuild generated docs metadata when related schema or docs JSON changes:

```bash
npm run build:hooks.json -w @primer/react
```

```bash
npm run build:components.json -w @primer/react
```

- Run targeted tests for the affected API when available
- Run broader repository validation before finalizing if the change touches shared build tooling

## Common files

- `packages/react/src/**/*.docs.json`
- `packages/react/src/**/*.hookDocs.json`
- `packages/react/script/components-json/*`
- `packages/react/script/hooks-json/*`
- `contributor-docs/deprecating-components.md`
- `.changeset/*.md`
