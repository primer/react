# Public `data-component` and `data-slot` API for targeting component parts

📆 Date: 2026-02-20

## Status

| Stage          | State       |
| -------------- | ----------- |
| Status         | Proposed ❓ |
| Implementation |             |

## Context

Primer React uses [CSS Modules](https://github.com/css-modules/css-modules) for
styling. CSS Modules generate hashed class names (e.g.,
`prc-ActionList-Item-cBBI`) that are not stable across versions. This makes it
impossible for consumers to reliably target internal parts of a component for
style overrides using class selectors.

Consumers need the ability to target component parts for legitimate use cases:

- Customizing the appearance of specific parts (e.g., hiding a trailing visual,
  changing the font weight of a label)
- Querying parts of a component in JavaScript (e.g., finding all selected items
  in an action list)
- Writing integration tests that target stable selectors

The `data-component` attribute is already used internally across multiple
components (`Button`, `ActionList`, `PageHeader`, `UnderlineNav`, `Avatar`, and
others) for internal CSS targeting and DOM queries. However, the naming
convention is inconsistent:

| Pattern              | Examples                                         |
| -------------------- | ------------------------------------------------ |
| `ComponentName.Part` | `ActionList.Description`, `ActionList.Selection` |
| `PREFIX_Part`        | `PH_LeadingAction`, `PH_Title`, `PH_Navigation`  |
| `camelCase`          | `buttonContent`, `leadingVisual`, `text`         |
| `PascalCase`         | `Avatar`, `IconButton`, `SkeletonText`           |

Because `data-component` is not documented as a public API, values have changed
without notice and coverage is incomplete — many component parts have no
`data-component` attribute at all.

## Decision

Establish two **public, stable data attributes** for identifying components and
their parts in the DOM:

- **`data-component`** — identifies the root element of a component or
  sub-component.
- **`data-slot`** — identifies an inner structural part within a component.

### Naming convention

All values use PascalCase. The two attributes serve distinct roles:

```
data-component="ComponentName"     → root element of a component or sub-component
data-slot="PartName"               → inner part within a component
```

#### Rules

1. **Root components** get `data-component` with their React component name.

   ```html
   <ul data-component="ActionList"></ul>
   ```

2. **Public sub-components** get `data-component` matching the React API. If
   consumers write `<ActionList.Item>`, the DOM element gets
   `data-component="ActionList.Item"`.

   ```html
   <li data-component="ActionList.Item"></li>
   ```

   Note: a sub-component root uses `data-component`, not `data-slot`, because it
   is itself a component — it has its own props, its own identity, and may
   contain its own slots.

3. **Inner structural parts** (DOM elements that are not exposed as a
   sub-component but represent a meaningful part of the structure) get
   `data-slot` with a PascalCase name describing the part.

   ```html
   <span data-slot="Label">monalisa</span>
   <span data-slot="Content">...</span>
   <span data-slot="LeadingVisual"><img /></span>
   ```

   Slot names are **scoped to their parent component** — a `Label` slot inside
   `ActionList.Item` is distinct from a `Label` slot inside `Button` because
   they exist within different `data-component` boundaries.

4. **State and modifier attributes remain separate.** `data-component` and
   `data-slot` identify _what_ an element is. Existing attributes like
   `data-variant`, `data-size`, and `data-loading` describe the _state_ of that
   element. These concerns must not be mixed.

   ```html
   <li data-component="ActionList.Item" data-variant="danger" data-active="true">
     <span data-slot="Label">Delete file</span>
   </li>
   ```

### Relationship to CSS Modules and CSS Layers

`data-component` and `data-slot` complement the existing styling architecture:

- **CSS Modules** provide scoped class names for internal styling. Components
  continue to use CSS Module classes for their own styles.
- **CSS Layers** ([ADR-021](./adr-021-css-layers.md)) ensure that consumer
  overrides take precedence over component styles regardless of specificity.
- **`data-component` and `data-slot`** provide the stable selectors that
  consumers use to target components and their parts within those overrides.

Together, these three mechanisms give consumers a complete override path:

```css
/* Target a component */
[data-component='ActionList.Item'] {
  border-radius: 8px;
}

/* Target a slot within a component */
[data-component='ActionList.Item'] [data-slot='Label'] {
  font-weight: 600;
}
```

### Internal CSS usage

Components may use `data-slot` selectors in their own CSS Modules for targeting
child parts. This replaces ad-hoc patterns like bare `[data-component='text']`
with the standardized naming:

```css
/* ButtonBase.module.css */
& :where([data-slot='LeadingVisual']) {
  color: var(--button-leadingVisual-fgColor);
}
```

### Coverage requirements

Every component must provide:

- **`data-component`** on the root element of every component and public
  sub-component
- **`data-slot`** on every internal structural element that a consumer might
  reasonably need to target (labels, content wrappers, visual slots, action
  slots)

Elements that are purely for layout and have no semantic meaning (spacers,
wrappers that exist only for CSS grid/flex layout) do not require either
attribute.

### Testing requirements

The presence and values of `data-component` and `data-slot` attributes must be
covered by tests. This can be achieved through:

- Unit tests that assert the attributes are present on rendered elements
- Snapshot tests that capture the attribute values

Changing a `data-component` or `data-slot` value is a **breaking change** and
must follow the standard breaking change process.

### Migration

Existing `data-component` values must be migrated to the new convention. Inner
parts move from `data-component` to `data-slot` with simplified names (since
they are scoped to their parent component). This migration is a breaking change
and should be coordinated as part of a major release.

| Current attr     | Current value                           | New attr         | New value                   |
| ---------------- | --------------------------------------- | ---------------- | --------------------------- |
| `data-component` | `buttonContent`                         | `data-slot`      | `Content`                   |
| `data-component` | `text` (in Button)                      | `data-slot`      | `Label`                     |
| `data-component` | `leadingVisual` (in Button)             | `data-slot`      | `LeadingVisual`             |
| `data-component` | `trailingVisual` (in Button)            | `data-slot`      | `TrailingVisual`            |
| `data-component` | `trailingAction` (in Button)            | `data-slot`      | `TrailingAction`            |
| `data-component` | `ButtonCounter`                         | `data-slot`      | `Counter`                   |
| `data-component` | `PH_LeadingAction`                      | `data-slot`      | `LeadingAction`             |
| `data-component` | `PH_Breadcrumbs`                        | `data-slot`      | `Breadcrumbs`               |
| `data-component` | `PH_LeadingVisual`                      | `data-slot`      | `LeadingVisual`             |
| `data-component` | `PH_Title`                              | `data-slot`      | `Title`                     |
| `data-component` | `PH_TrailingVisual`                     | `data-slot`      | `TrailingVisual`            |
| `data-component` | `PH_TrailingAction`                     | `data-slot`      | `TrailingAction`            |
| `data-component` | `PH_Actions`                            | `data-slot`      | `Actions`                   |
| `data-component` | `PH_Navigation`                         | `data-slot`      | `Navigation`                |
| `data-component` | `TitleArea`                             | `data-slot`      | `TitleArea`                 |
| `data-component` | `GroupHeadingWrap`                      | `data-component` | `ActionList.GroupHeading`   |
| `data-component` | `ActionList.Item--DividerContainer`     | `data-slot`      | `SubContent`                |
| `data-component` | `icon` (in UnderlineTabbedInterface)    | `data-slot`      | `Icon`                      |
| `data-component` | `text` (in UnderlineTabbedInterface)    | `data-slot`      | `Label`                     |
| `data-component` | `counter` (in UnderlineTabbedInterface) | `data-slot`      | `Counter`                   |
| `data-component` | `multilineContainer`                    | `data-slot`      | `Container`                 |
| `data-component` | `input` (in TextInput)                  | `data-slot`      | `Input`                     |
| `data-component` | `AnchoredOverlay`                       | `data-component` | `AnchoredOverlay`           |
| `data-component` | `ActionBar.VerticalDivider`             | `data-component` | `ActionBar.VerticalDivider` |

Components that currently have no attributes on key parts must also be updated.

## Consequences

### Positive

- **Stable selectors for consumers.** Consumers can target any component with
  `[data-component="..."]` and any inner part with `[data-slot="..."]` — both
  are immune to CSS Module hash changes and version upgrades.
- **Clear separation.** `data-component` answers "which component is this?"
  while `data-slot` answers "which part of the component is this?" This makes
  the DOM self-documenting and avoids overloading a single attribute.
- **Consistent naming.** A single convention replaces four inconsistent patterns,
  making the codebase easier to learn and maintain.
- **Scoped slot names.** Because `data-slot` values are scoped to their parent
  `data-component`, names like `Label` or `LeadingVisual` can be reused across
  components without ambiguity.
- **Enables JavaScript queries.** Consumers and tests can use
  `querySelectorAll('[data-component="ActionList.Item"] [data-slot="Label"]')`
  reliably.
- **Complements CSS Layers.** Together with ADR-021, this gives consumers a
  complete, specificity-safe override mechanism.

### Negative

- **Breaking change for existing consumers.** Anyone currently relying on the
  undocumented `data-component` values (e.g., in CSS overrides or
  `querySelector` calls) will need to update when values are renamed. This must
  be coordinated in a major release.

## Alternatives

### 1. Stable class names alongside CSS Module classes

Add a non-hashed class name to every part (e.g.,
`className={clsx(classes.Item, 'ActionList-item')}`).

**Why not chosen:** Pollutes the global CSS namespace. Risk of collisions with
consumer or third-party styles. Requires consumers to understand which class
names are "stable" vs. which are CSS Module hashes. Data attributes are a
cleaner separation of concerns — class names for styling, data attributes for
identification.

### 2. CSS `::part()` pseudo-element

The `::part()` CSS pseudo-element allows styling of elements inside a shadow
DOM.

**Why not chosen:** Only works with Shadow DOM, which React does not use. Not
applicable to our architecture.

### 3. Do nothing — keep `data-component` as an internal implementation detail

Continue using `data-component` informally without guaranteeing stability.

**Why not chosen:** Consumers are already depending on these attributes for
overrides (as seen in SelectPanel story CSS). Without a stability guarantee,
any refactor can silently break consumer overrides. Formalizing the API
acknowledges the reality and provides a proper contract.
