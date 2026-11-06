---
applyTo: 'packages/react-tailwind/src/**/*.stories.tsx,packages/react-tailwind/src/**/README.mdx,packages/react-tailwind/src/**/ALIGNMENT.md'
---

# React Tailwind stories, docs, and alignment

## Storybook organization

- Use `React Tailwind/<Family>/<Component>` for core stories,
  `/Features` for isolated public behaviors, and `/Examples` for realistic
  compositions.
- Every configurable component has core `Default` and `Playground` stories.
  Keep the documentation page first, followed by Default, Playground, Features,
  and Examples in Storybook navigation and docs.
- Add controls for every important public prop that can be changed coherently in
  the Playground. Use explicit options for finite variants and hide internal,
  event-detail, or composition-only props that cannot produce a useful control.
- Keep `Default` representative and minimal. Put single-contract cases in
  Features and application-like compositions in Examples.
- Match the corresponding Primer React story name and visible fixture whenever
  a direct parity story exists so automated pairing remains deterministic.
- Add deterministic `play` functions only when the intended documented state
  requires interaction. Await the final visible or focus state and avoid timers
  or order-dependent global state.

## Component documentation

- Keep prose paragraphs on one source line. Do not manually or formatter-wrap prose to an arbitrary column width.
- Every public component has `README.mdx` with a live Default canvas, working
  Playground controls, import and composition guidance, controlled and
  uncontrolled behavior where applicable, accessibility, keyboard/events/state,
  and links to alignment decisions.
- Prop tables must resolve from the public component type. Do not maintain a
  hand-written prop list that can silently drift.
- Document supported behavior, not internal implementation trivia. Include
  exact semantics only when they are an intentional public contract.
- Show the preferred modern API first. Migration guidance belongs in
  `ALIGNMENT.md`, not in every usage example.

## Legacy from/to alignment

- Every `ALIGNMENT.md` has explicit **From (`@primer/react`)** and
  **To (`@primer/react-tailwind`)** sections.
- Cover the selected legacy source or promoted replacement, renamed or
  normalized props, omitted deprecated styling APIs, composition changes,
  semantics, callback differences, and unsupported behavior.
- Classify each difference as intentional, unsupported, or a parity gap. Fix
  clear bugs; do not document a bug as a permanent design decision.
- Keep notes concise and consumer-facing. Update them whenever the public API,
  rendered semantics, or compatibility decision changes.

## Validation

- Preview every changed story in the live Storybook.
- Run story interactions, runtime/console checks, accessibility checks, and
  strict visual/computed-style comparisons for changed states.
- Verify the production Storybook renders each README and its controls without
  relying on repository-only source resolution.
