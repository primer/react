---
name: component-docs
description: Use when migrating, reviewing, or validating typed Primer React component metadata in `.docs.ts`. Do not use for usage guides, Storybook-only changes, or component implementation.
---

# Typed component docs

## Review

1. Start with the package `exports` map. Follow the source entrypoints for `@primer/react` and its `/experimental`, `/deprecated`, and `/next` subpaths, including re-exports and aliases. Verify the public name and `importPath`; a folder, filename, or metadata import does not prove a public export. Follow every member in a qualified name to a public component, not just a matching prefix.
2. Use `defineComponent`. Keep the sibling `.docs.json` and legacy JSON loaders unchanged during coexistence unless a separate cutover is approved. Preserve identity (`id`, `name`, `status`, `importPath`), `a11yReviewed`, and authored values. Normalize only losslessly: extract story ID strings without losing order or content, retain meaningful defaults (including `''` when authored), and preserve text under legacy description keys. Don't guess or silently drop supported data; flag metadata that can't be represented faithfully.
3. Materialize `derive` fields as explicit typed metadata. The legacy resolver applies authored values over source-derived fields. Preserve that precedence, omit the `derive` key, and keep the explicit fields in sync with source. Explain intentional corrections with source evidence.
4. Verify prop type and requiredness against the actual public TypeScript signatures and overloads, including inherited props. A default value, a printed union with `undefined`, or a single overload does not establish optionality. Use exact relevant JSDoc when accurate; otherwise describe what the source does. Trace runtime defaults, destructuring, spreads, and ref handling before claiming behavior or forwarding. For polymorphic APIs, distinguish the default element from a custom `as` target. Check ref cleanup on unmount before claiming support for React 19 callback ref cleanup.
5. Use root or subcomponent `passthrough` only to document confirmed prop forwarding to the target, not as a substitute for prop or behavior documentation. Use `relatedTypes` for public config types, not fake subcomponents.
6. Call out every empty `props` section (root, subcomponent, or related type). Check the public type and applicable source, then report missing props as gaps or explain why the section intentionally has no props to document.

Report **legacy parity** and **public coverage** separately. A faithful migration can preserve a gap in the legacy docs. Report inherited gaps with source evidence rather than silently expanding API coverage.

## Validation

Run from the repo root. Build `@primer/doc-gen` before the first lint and after changing that workspace. The lint uses the built package and does not rebuild it. Pass one repo-relative or package-relative `.docs.ts` path to limit the check. With no path, the lint checks all typed docs in the package source tree.

```sh
npm run build -w @primer/doc-gen
npm run lint:component-docs -w @primer/react
npm run lint:component-docs -w @primer/react -- src/path/to/Component.docs.ts
```

- The lint is read-only. It reads literal `defineComponent` data without executing metadata or loading legacy JSON.
- `missing` and `invalid` findings exit nonzero. `unresolved` findings need manual review and do not fail the check on their own. Zero exit does not prove complete coverage.
- Doc-gen extracts prop types, JSDoc, and defaults from source. The lint verifies public exports and callable members, filters internal props, and reports only suggestions supported across the public signatures it can verify.
- The lint checks listed companion exports and related types. For a related type, it first verifies the type as a public export or named type exposed by a public prop, then passes that type to the shared doc-gen extractor. Doc-gen does not discover related types on its own.
- Review ambiguous overloads, index signatures, dependency props, and unlisted companion exports or related types manually. The lint does not flag stale rows or compare existing wording or type strings. Check runtime behavior, rendered targets, defaults without JSDoc, and legacy parity separately. `build:components.json` still reads legacy JSON.
