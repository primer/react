---
name: component-docs
description: 'Use when adding, updating, or reviewing a public React component exported from a published @primer/react entry point or its docs metadata. Do not use for internal-only implementations, story or demo helpers, hook-only docs, or changes that do not affect a public component contract or its metadata.'
---

# Primer React component docs

## Add or update metadata

- Every public React component exported from a published `@primer/react` entry point needs colocated typed metadata in a `*.docs.ts` file. Default-export a `defineComponent({...})` call. Follow the [schema](../../../packages/react/src/docs/components.ts) and use [Pagehead](../../../packages/react/src/Pagehead/Pagehead.docs.ts) for the file shape. Internal-only implementations and story or demo helpers do not need metadata.
- Add or update the metadata in the same change as any public API or behavior change. Read the exported types, JSDoc, and implementation before copying an existing entry.
- For each component-specific public prop, record its name, type, description, requiredness, and implemented default. Resolve props from inherited types, unions, intersections, and utility types; do not assume the local declaration lists the full API. Document derived props that are part of the component's contract, not every native attribute it forwards.
- Match descriptions to source and JSDoc. Check which props are required in each variant, and describe conditional requirements when one boolean cannot express them. Omit `defaultValue` when no default is documented. For a verified empty-string default, use a source literal such as `defaultValue: '""'`.
- Document public subcomponents exposed as properties of a parent component in the parent's `subcomponents` metadata, rather than making a separate file for each property. Keep their props in sync. Update the display name, status, import path, keywords, stories, and usage when the change affects them.
- Run `npm run docs:sync -w @primer/react` to generate or sync `props` and `subcomponents` from TypeScript, and `npm run docs:check -w @primer/react` to verify there is no metadata drift.
- When adding a sidecar, export it from [`src/docs/index.ts`](../../../packages/react/src/docs/index.ts) and, when applicable, from [`src/docs/experimental.ts`](../../../packages/react/src/docs/experimental.ts) or [`src/docs/deprecated.ts`](../../../packages/react/src/docs/deprecated.ts). When the status changes, update the filtered exports to match. [`src/docs/next.ts`](../../../packages/react/src/docs/next.ts) must export exactly the sidecars with `importPath: '@primer/react/next'`. Add or remove the Next export when the import path changes to or from `@primer/react/next`.
- Rolldown generates component Markdown from the typed sidecars. Keep the existing `*.docs.json` files: they still drive the existing schema generator.

## Source usage guidance

- For `usage.description`, `usage.bestPractices`, and `usage.anatomy`, check the official `primer.style` page for the exact component and variant. Verify redirects before applying guidance. Do not substitute docs for a successor or a similar component.
- Paraphrase supported guidance and cite the exact page or section in a `// Source:` comment beside the entry. For example, [Tooltip as a description](https://primer.style/product/components/tooltip/guidelines/#tooltip-as-a-description) supports keeping the tooltip brief and using it to supplement the control's label.
- Leave unsupported fields empty (`''` or `[]`). Do not infer recommended usage, anatomy, or required parts from code or stories.

## Review

- Check missing or stale metadata early and report it as a high-priority finding when it affects a public contract introduced or changed by the diff. Cite the affected prop, subcomponent, or behavior and explain the mismatch.
- Scope findings to the diff. Do not flag pre-existing migration gaps for contracts the change does not touch.
