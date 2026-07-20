---
name: component-spec
description: |
  Use when creating a new component; adding, changing, or removing a feature; or
  evaluating a change to a component in order to make sure everything is in sync
---

# Component Spec

A component spec documents the intended consumer-facing contract for a Primer
component. It covers the component's features, semantic markup, behavior, public
API relationships, and accessibility requirements.

All components that are publicly exported from Primer must have a component
spec. Spec files must be kept up-to-date as functionality is added, updated, or
removed. Spec files must be complete and accurate because they are used to
generate documentation for Primer components.

Before changing a component, read its local component spec. Update the spec when
a change adds, updates, or removes a feature or changes its markup, behavior,
public API contract, or accessibility requirements.

When referencing a component spec from source, tests, or Storybook feature
stories, link to the relevant heading in the local `SPEC.md` file.

`SPEC.md` files may be broken up for larger components. Instead of a single
file, a component may have a `spec` folder with a `README.md` file as the index
and a separate Markdown file for each feature. Link to the relevant heading or
feature file when using this format.

## Organization

Organize specs around consumer-facing features. Every component has at least one
feature, even if its only feature is named `Default`.

Feature sections may include:

- `Markup` for semantic structure and stable element or attribute relationships
- `Behavior` for state, interactions, callbacks, and other runtime requirements
- `Public API` for relationships or constraints that cannot be represented in
  `*.docs.json`
- `Accessibility` for requirements specific to that feature

Only include subsections that are relevant to the feature.

Keep every heading unique within its Markdown file so the spec passes
`npm run lint:md`. In a single-file spec, qualify subsection headings with the
feature name, such as `#### Actions behavior` or
`#### Dismissal accessibility`. Feature files in a split spec may use generic
subsection headings because each feature has its own file.

### Public API

Do not repeat information that can be represented in `*.docs.json`. Prop names,
types, defaults, individual prop descriptions, deprecations, exports, and
subcomponent inventories belong in docs metadata.

Use `Public API` sections for contracts that cannot be understood by reading an
individual prop definition, including:

- relationships between props
- precedence or conflicts between options
- controlled and uncontrolled state requirements
- event ordering or cancellation behavior
- ref targets
- prop forwarding targets

### Accessibility

Use the top-level `Accessibility` section for broad considerations that apply to
the component as a whole. For a simple component, this section may contain all
of its accessibility requirements.

For complex behavior or interactions, place accessibility requirements beside
the relevant feature or behavior so the semantic, keyboard, focus, and
announcement requirements remain in context.

Classify motion and reduced-motion requirements as accessibility requirements.

Distinguish defaults provided by the component from responsibilities left to
consumers. Prefer safe component defaults when the component can reliably
provide them, rather than documenting avoidable consumer work.

### Markup

Document the semantic contract rather than unstable implementation details.
Include elements, roles, attributes, and relationships that consumers or
assistive technologies depend on.

Include an HTML code block in each markup section to show the rendered
structure. The code block should contain the stable semantic elements,
attributes, and relationships that form the public contract. Use comments to
explain optional or conditional parts. Omit unstable wrappers, internal
elements, and CSS class names from the code block.

Name an exact HTML element only when that element's semantics are important,
when accessibility behavior depends on it, or when it is intentionally a stable
part of the public contract. For example, distinguishing a button from a link or
documenting a heading level is useful; naming an incidental presentational
wrapper is not. Do not require exact CSS classes, internal wrappers, or
implementation-specific DOM unless they are intentionally part of the public
contract.

### Behavior

Document behavior that the component actively implements or coordinates. Do not
list the absence of unrelated automatic behavior, such as stating that a
component does not announce itself or does not reorder children, unless
consumers might reasonably expect that behavior from the component pattern or
the distinction is necessary to prevent misuse.

### Presentation and layout

Do not create features or requirements that merely restate visual props such as
border, size, width, or spacing, or that describe generic CSS implementation.
Include presentation or responsive behavior only when it changes composition,
visibility, interaction, semantics, or another consumer-facing contract that
callers need to understand.

### Normative language

Use these uppercase terms for declarative requirements:

- `MUST` and `MUST NOT` for required or prohibited behavior
- `SHOULD` and `SHOULD NOT` for expected behavior where documented exceptions
  may exist
- `MAY` for explicitly permitted behavior

Explanatory prose does not need normative language.

## Keeping specs in sync

Tests and Storybook feature stories should link directly to the spec heading
that describes the behavior or feature they cover. Only feature stories should
define `spec` parameters; Playground and other non-feature stories should not
include spec references. Do not add requirement IDs or a verification section
to the spec.

Keep feature headings unique and stable because tests and feature stories may
link to their generated Markdown anchors.

For example, a test may link to a feature:

```tsx
/**
 * @see ./SPEC.md#delayed-appearance
 */
it('waits before rendering', () => {
  // ...
})
```

A Storybook feature story may link to one or more features through parameters:

```tsx
WithDelay.parameters = {
  spec: ['./SPEC.md#delayed-appearance'],
}
```

Generic repository requirements, such as support for server rendering, do not
need dedicated sections in each component spec.

Run `npm run lint:md` after adding or updating component specs.

## Templates

Read and use the appropriate template before authoring a component spec:

- Use [`templates/SPEC.md`](./templates/SPEC.md) for a component whose features
  fit clearly in one file.
- Use the templates in [`templates/spec`](./templates/spec) when a component
  needs separate files for its features:
  - [`README.md`](./templates/spec/README.md) is the spec index.
  - [`default.md`](./templates/spec/default.md) contains the default feature.
  - [`feature.md`](./templates/spec/feature.md) is copied and renamed for each
    additional feature.

Only keep template sections that apply to the component or feature.
