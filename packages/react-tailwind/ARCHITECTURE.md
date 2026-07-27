# Architecture

`@primer/react-tailwind` is an independent React 19 implementation of the non-deprecated Primer React component surface. It preserves recognizable Primer APIs and design language while replacing the styled-components and Primer-specific behavior layers with Tailwind v4, Primer design tokens, and Base UI primitives.

## Design priorities

Decisions follow this order:

1. Accessible, platform-correct behavior.
2. A coherent modern public API across the package.
3. Visual and interaction parity with the selected non-deprecated Primer React implementation.
4. Compatibility with legacy APIs that remain useful and consistent.

Deprecated styling APIs, inconsistent legacy behavior, and implementation details do not take precedence over the first three goals. Intentional differences are recorded per component in `ALIGNMENT.md`.

## Layers

### Public components

Public components live in `src/components/<ComponentName>`. Each directory owns its implementation, public exports, tests, stories, Storybook documentation, and alignment notes.

The root entry point groups exports by component family. The build also creates an explicit module-preserving entry for every component directory, enabling both root and `@primer/react-tailwind/<ComponentName>` imports without maintaining a second source implementation.

### Behavior primitives

Interactive components compose `@base-ui/react` primitives for keyboard navigation, focus management, dismissal, portals, floating positioning, collections, controlled state, and ARIA behavior. The Primer layer supplies the visual design and the package-specific public API; it does not recreate a second behavior system around Base UI.

Compound components follow familiar namespaces while using Base UI-oriented parts such as `Root`, `Trigger`, `Portal`, `Positioner`, `Popup` or `Content`, `Title`, `Description`, and `Close`. The `render` prop composes behavior onto an existing element without nesting interactive controls.

Presentational components remain normal React components. Package-private composition helpers live in `src/internal`, while deliberately public shared types live in `src/utils/types`.

### Shared composition

The package is a component system rather than a collection of isolated wrappers. Dependencies flow from focused primitives to compound components and then to higher-order patterns. Higher-order components compose package components such as buttons, action lists, form controls, overlays, text, and status primitives instead of reproducing their markup, variants, or behavior.

Shared internal layers own contracts that cross component families: class and variant composition, floating geometry, focus treatment, responsive values, form metadata, collection rows, and other repeated behavior. A shared layer must represent the same semantic and API contract in every consumer; visual similarity alone is not sufficient reason to abstract.

If a lower-level package component is nearly sufficient, its coherent contract may be extended with a part, prop, or internal capability needed for composition. Higher-order components should not bypass it or integrate Base UI independently just because a capability is missing. Extensions must remain meaningful to the primitive and must not expose one consumer's incidental implementation details.

This dependency direction keeps visual fixes, accessibility behavior, and API decisions consistent. The build rejects circular dependencies so a higher-order component cannot quietly become a lower-level primitive's dependency.

### Styling and tokens

Tailwind v4 generates component utilities from complete static classes in the source. `@primer/tailwind-config` and `@primer/primitives` provide the semantic design vocabulary; components do not duplicate the token source.

The shared `cn` helper combines conditional classes and resolves Tailwind conflicts. Closed variant sets use static maps or class-variance-authority. CSS custom properties carry runtime geometry or values that cannot be represented as a static variant.

An unknown utility is not an error in Tailwind; it simply produces no CSS, so a typo fails silently and survives review. `lint:tailwind` compiles every class found in the source and fails when one generates nothing, which catches both misspellings and utilities that the Primer configuration does not define. It also rejects hardcoded colors so presentation stays on Primer tokens.

The component build does not include Tailwind Preflight. `BaseStyles` provides the component-scoped normalization boundary, and `base.css` is an opt-in small global normalization stylesheet for applications that want the same box-sizing, body-margin, and table-collapse defaults outside `BaseStyles`.

## CSS delivery

The package supports two mutually exclusive modes:

### Compiled CSS

Applications import `@primer/react-tailwind/styles.css`. This contains the component utilities, Primer theme configuration, and package base rules, and requires no Tailwind tooling in the consumer.

### Host-generated Tailwind

Tailwind v4 applications import the package theme/config entry and add an explicit `@source` for the distributed modules. The host compiler then generates the utilities used by the package. Applications must not also import `styles.css`, which would duplicate component rules.

`theme.css` contains the Primer primitive token imports and color-scheme selection. `tailwind.css` is the convenience host-generation entry and includes a source directive for the distributed modules. The production package check validates that all CSS subpaths resolve and that clean Tailwind consumers discover classes through both explicit and convenience configuration.

## Themes

`ThemeProvider` supplies the Primer `data-color-mode`, `data-light-theme`, and `data-dark-theme` contract. Supported schemes are light, dark, light high contrast, and dark high contrast, with an automatic color mode based on `prefers-color-scheme`.

Components consume semantic variables rather than scheme-specific values. Interactive states must remain legible in forced colors, reduced motion, and high-contrast schemes.

## Public API policy

The machine-readable `api-inventory.json` is the inclusion boundary, validated against `api-inventory.schema.json`. It records the selected stable and experimental upstream sources, required root exports, intentional exclusions and their replacements, and upstream implementation utilities that are not part of this package's public contract.

The package:

- promotes selected non-deprecated experimental or V2 replacements under stable base names;
- does not export experimental, V2, deprecated, or legacy aliases;
- omits `sx` and styled-system props in favor of `className`, semantic CSS variables, variants, state attributes, and `render`;
- uses consistent controlled and uncontrolled state conventions;
- forwards public root refs and valid DOM props to the same element; and
- shares size, positioning, responsive, and component types where they represent a package-wide contract.

Primer viewport ranges map to Tailwind statically: narrow uses unprefixed base utilities below `md`, regular uses `md:`, and wide uses `2xl:`. Primer React's compiled custom media and `@primer/tailwind-config` both place that wide range at 87.5rem / 1400px; the unrelated `lg` breakpoint at 63.25rem is not the Primer wide viewport range.

### Shared vocabulary

The same idea uses the same name everywhere, even where an upstream component named it differently:

- Sizes are `small`, `medium`, and `large`. `ControlSize` covers interactive controls; `AvatarSize`, `TokenSize`, and `TextSize` cover scales with their own semantics. No component names its middle size `normal` or `default`.
- The neutral variant is `default`.
- Floating parts describe placement with `FloatingSide` and `FloatingAlignment`.
- Compound parts discover their children through `flattenChildren`, so authors can group parts in fragments anywhere in the package.
- Every compound component that identifies a child by role also accepts an element prop of the same name for that region. `PageLayout` takes `header`, `sidebar`, and `footer`; `ActionList.Item` takes `leadingVisual`, `trailingVisual`, `description`, and `trailingAction`. The prop wins over a matching child. `src/internal/regions.ts` resolves every region in one render-phase pass, and `RegionProps<Names>` declares the props so each component's signature reads the same.

Region props exist because identity matching cannot see through a consumer's wrapper. A wrapper around `PageLayout.Sidebar` is a different component type, so the parent cannot recognize it; passing it as `sidebar={<MySidebar />}` always works. Resolution happens during render rather than through effect-based registration, so it produces the same markup on the server as in the browser.

Components that scan a uniform collection rather than named regions — `SegmentedControl`, `Breadcrumbs`, `LabelGroup`, `AvatarStack` — have no region props, because a prop there would only duplicate `children`.

Where an upstream API is deliberately preserved instead of normalized, the component's `ALIGNMENT.md` says so. Notable preserved exceptions are `Pagination`'s event-first `onPageChange(event, page)`, `SelectPanel`'s `onOpenChange(open, gesture)`, and the opposing `SelectPanel.disableFullscreenOnNarrow` and `FilteredActionList.fullScreenOnNarrow` booleans.

Before adding a direct Base UI integration, a component must check whether an existing package primitive can expose the required behavior. Before adding a helper, it must check `src/internal`, shared variants, and public utility types.

Every component's `ALIGNMENT.md` explains the legacy source and the modern replacement, including normalized props, composition or semantic changes, unsupported behavior, and open parity gaps.

## Agent-facing documentation

`AGENTS.md` is the authored guidance for coding agents and LLMs that generate code against this package. It exists because guidance written for `@primer/react` is frequently wrong here, most often by reaching for `sx`, `Box`, or a deprecated name.

`llms.txt` is generated from `AGENTS.md`, each component's `README.mdx` intent paragraph, each `ALIGNMENT.md` migration notes, and the API inventory's exclusions. Nothing in it is authored twice, so it cannot drift from the documentation it summarizes. The generator fails when a component has no intent paragraph, which keeps new components from shipping without one, and a check task fails when the committed file is stale.

## React 19 and React Compiler

React 19 and React DOM 19 are the only peer targets. Rolldown applies `babel-plugin-react-compiler` with target 19 to all TypeScript runtime modules, preserves module-level directives, and fails the build on circular dependencies.

Server-safe and presentational modules remain usable during SSR. Interactive modules retain `'use client'` where their hooks or Base UI primitives require a client boundary. Browser-dependent behavior must be guarded or event-driven so server markup remains deterministic.

## Package output

Rolldown emits ESM and declarations with the source module structure preserved. All dependencies and peer dependencies remain external, keeping application React ownership and package tree shaking intact. The public package includes:

- the root module and component subpath modules;
- TypeScript declarations;
- compiled, component, theme, Tailwind, and optional base CSS entries;
- the API inventory; and
- the package README and this architecture document.

## Storybook and parity

The repository Storybook renders the existing Primer React and React Tailwind stories together during development. That shared host is a comparison tool, not a runtime dependency.

Each configurable component provides Default and Playground stories, focused Features stories, realistic Examples, and a `README.mdx` documentation page. Direct parity stories preserve upstream names and fixtures so Playwright can pair them deterministically. Interactive stories use `play` functions only when the documented screenshot state requires interaction.

The parity audit uses isolated pages, bounded browser contexts, component-root screenshots, public-part geometry, computed styles, and separate runtime errors. It compares matching interaction states before expanding checks across themes and responsive viewports.

## Validation boundaries

Changes are not complete when source code compiles. The package gates cover:

- API inventory and built exports;
- component behavior and accessibility tests;
- TypeScript and React Compiler checks;
- ESM, declarations, directives, and circular dependencies;
- static Tailwind class discovery and generated CSS;
- root and component subpath imports from a packed React 19 consumer;
- SSR without browser globals;
- Storybook docs, controls, interaction tests, and runtime errors; and
- visual and computed-style parity in supported schemes and viewports.

These boundaries keep the implementation independent from repository-only resolution and make differences from the legacy package explicit rather than accidental.
