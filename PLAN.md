# Octicon Symbol Manifest Plan

## Goal

Provide an SSR-safe way for applications to render one copy of each SVG symbol
they use without requiring effect-driven runtime registration.

The initial API should use an explicit configuration component:

```tsx
import {symbols} from 'virtual:primer-octicon-symbols'

;<OcticonSymbols symbols={symbols} />
```

The generated `symbols` array should contain only the symbols discovered by the
build integration.

## Recommended Architecture

### Package manifest

Publish a machine-readable manifest from `@primer/octicons-react-symbols` that
maps each icon component export to its symbol export and module:

```json
{
  "CheckIconReference": {
    "symbol": "CheckSymbol",
    "module": "@primer/octicons-react-symbols/CheckSymbol"
  }
}
```

This avoids depending on naming conventions and allows generated modules to use
per-icon imports.

### Source scanner

Parse configured source files with an AST and collect imports from supported
Octicon packages:

```tsx
import {CheckIconReference, XIconReference as CloseIcon} from '@primer/octicons-react-symbols'
```

Record the original imported names, regardless of local aliases. Do not use
regular expressions to analyze imports.

The scanner should support configurable `include` and `exclude` patterns so
applications can omit tests, stories, generated files, and other unrelated
source trees.

### Virtual module

Provide a Vite or Rollup plugin that intercepts:

```tsx
import {symbols} from 'virtual:primer-octicon-symbols'
```

The plugin should:

1. Scan source files during `buildStart`.
2. Resolve the public module ID to an internal `\0`-prefixed ID.
3. Generate a module with stable, sorted, per-icon symbol imports.
4. Export the imported symbols as an array.
5. Watch relevant source files and invalidate the virtual module during
   development.

The generated module should resemble:

```tsx
import {CheckSymbol} from '@primer/octicons-react-symbols/CheckSymbol'
import {XSymbol} from '@primer/octicons-react-symbols/XSymbol'

export const symbols = [CheckSymbol, XSymbol]
```

### Runtime component

`OcticonSymbols` should remain a presentational configuration component. It
should synchronously render the provided symbols and should not own a global
registry, subscribe to module-loading events, or register symbols through React
effects.

Each symbol should be represented by an `OcticonSymbol` object with `id` and
`definition` fields. The package should export `createOcticonSymbol` so
applications can define custom symbols using the same representation.

`OcticonSymbols` should provide its registered IDs through context. Nested
containers should render only symbols that were not already defined by an
ancestor while continuing to render their children normally.

Generated icon reference components should use the
`{IconName}IconReference` naming convention.

Symbol IDs should include a versioned or configurable prefix to avoid collisions
between package versions, microfrontends, and unrelated SVG sprites.

## Build-Time Constraints

A Babel transform cannot reliably collect imports from every module and then
populate a virtual module during the same build. The bundler may request the
virtual module before it has transformed the rest of the module graph.

The first implementation should therefore pre-scan configured source files
during `buildStart`. This may include icons imported by source files that are not
reachable from the current entrypoint, but it is deterministic and does not
depend on module evaluation order.

Potential later optimizations include:

- A separate code-generation pass that produces an exact manifest before the
  application build.
- Multiple manifests generated for explicitly configured entrypoints.
- Framework integrations that understand route boundaries.
- Per-chunk external SVG sprites emitted during `generateBundle`.

## Implementation Phases

### Phase 1: Static package API

- Add per-icon symbol exports.
- Add the machine-readable icon-to-symbol manifest.
- Ensure symbol exports are independently tree-shakeable.
- Export `OcticonSymbol` and `createOcticonSymbol`.
- Add `OcticonSymbols` with an explicit `symbols` prop.
- Deduplicate symbols provided by ancestor containers.
- Name generated reference components `{IconName}IconReference`.
- Define stable, collision-resistant symbol IDs.

### Phase 2: Vite and Rollup integration

- Implement AST-based source scanning.
- Implement the virtual module plugin.
- Add `include`, `exclude`, and package-source configuration.
- Add development watch and module invalidation behavior.
- Produce deterministic generated output.

### Phase 3: Validation

- Verify server and client output are identical.
- Verify symbols exist before their corresponding `<use>` elements are painted.
- Cover aliased imports, duplicate imports, re-exports, and unused imports.
- Cover multiple package versions and multiple sprite roots.
- Measure bundle size, DOM size, render time, and memory against inline SVG at
  realistic icon repetition counts.

### Phase 4: Advanced integrations

- Investigate route-level and entrypoint-level manifests.
- Investigate external sprites for cross-page browser caching.
- Evaluate Babel, SWC, and esbuild adapters that share the same scanner and
  manifest format.

## Alternatives

### Generated physical module

A pre-build command could write an inspectable module such as
`.generated/octicon-symbols.ts`. This is easier to cache, debug, and support
across bundlers than a virtual module. The virtual module plugin could initially
be a convenience layer over the same generator.

### External sprite assets

The bundler could emit an SVG asset and render references such as
`<use href="/assets/octicons.svg#check" />`. This enables browser caching across
pages but introduces CSP, cross-origin, deployment, Shadow DOM, and styling
tradeoffs.

## Initial Recommendation

Start with a physical generated module and a Vite/Rollup virtual-module wrapper
that both use the same AST scanner and package manifest. Keep symbol rendering
explicit in React. This provides predictable SSR behavior and a clear migration
path while leaving room for more exact route or chunk extraction later.
