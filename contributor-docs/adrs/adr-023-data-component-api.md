# Public `data-component` API for targeting component parts

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

Establish `data-component` as a **public, stable API** for identifying component
parts in the DOM. Every DOM element that represents a component or a meaningful
structural part of a component must include a `data-component` attribute.

### Naming convention

Values follow **dot notation mirroring the React component API**, using
PascalCase throughout:

```
data-component="ComponentName"              → root element
data-component="ComponentName.PartName"     → sub-component or internal part
```

#### Rules

1. **Root components** use their React component name in PascalCase.

   ```html
   <ul data-component="ActionList"></ul>
   ```

2. **Public sub-components** use dot notation matching the React API. If
   consumers write `<ActionList.Item>`, the DOM element gets
   `data-component="ActionList.Item"`.

   ```html
   <li data-component="ActionList.Item"></li>
   ```

3. **Internal structural parts** (DOM elements that are not exposed as a
   sub-component but represent a meaningful part of the structure) use the parent
   component name followed by a PascalCase part name in dot notation.

   ```html
   <span data-component="ActionList.ItemLabel">
     <span data-component="ActionList.ItemContent">
       <span data-component="Button.Content"></span>
     </span>
   </span>
   ```

4. **State and modifier attributes remain separate.** The `data-component`
   attribute identifies _what_ a part is. Existing attributes like
   `data-variant`, `data-size`, and `data-loading` describe the _state_ of that
   part. These concerns must not be mixed.

   ```html
   <li data-component="ActionList.Item" data-variant="danger" data-active="true"></li>
   ```

### Relationship to CSS Modules and CSS Layers

`data-component` complements the existing styling architecture:

- **CSS Modules** provide scoped class names for internal styling. Components
  continue to use CSS Module classes for their own styles.
- **CSS Layers** ([ADR-021](./adr-021-css-layers.md)) ensure that consumer
  overrides take precedence over component styles regardless of specificity.
- **`data-component`** provides the stable selectors that consumers use to
  target parts within those overrides.

Together, these three mechanisms give consumers a complete override path:

```css
/* Consumer override — wins over component styles thanks to CSS layers */
[data-component='ActionList.ItemLabel'] {
  font-weight: 600;
}
```

### Internal CSS usage

Components may use `data-component` selectors in their own CSS Modules for
targeting child parts. This replaces ad-hoc patterns like bare `[data-component='text']` with the
standardized naming:

```css
/* ButtonBase.module.css */
& :where([data-component='Button.LeadingVisual']) {
  color: var(--button-leadingVisual-fgColor);
}
```

### Coverage requirements

Every component must provide `data-component` on:

1. The root element
2. Every public sub-component element
3. Every internal structural element that a consumer might reasonably need to
   target (labels, content wrappers, visual slots, action slots)

Elements that are purely for layout and have no semantic meaning (spacers,
wrappers that exist only for CSS grid/flex layout) do not require
`data-component`.

### Testing requirements

The presence and value of `data-component` attributes must be covered by tests.
This can be achieved through:

- Unit tests that assert `data-component` is present on rendered elements
- Snapshot tests that capture the attribute values

Changing a `data-component` value is a **breaking change** and must follow the
standard breaking change process.

### Migration

Existing `data-component` values must be migrated to the new convention. This
migration is a breaking change and should be coordinated as part of a major
release. The following values need to change:

| Current value                           | New value                   |
| --------------------------------------- | --------------------------- |
| `buttonContent`                         | `Button.Content`            |
| `text` (in Button)                      | `Button.Label`              |
| `leadingVisual` (in Button)             | `Button.LeadingVisual`      |
| `trailingVisual` (in Button)            | `Button.TrailingVisual`     |
| `trailingAction` (in Button)            | `Button.TrailingAction`     |
| `ButtonCounter`                         | `Button.Counter`            |
| `PH_LeadingAction`                      | `PageHeader.LeadingAction`  |
| `PH_Breadcrumbs`                        | `PageHeader.Breadcrumbs`    |
| `PH_LeadingVisual`                      | `PageHeader.LeadingVisual`  |
| `PH_Title`                              | `PageHeader.Title`          |
| `PH_TrailingVisual`                     | `PageHeader.TrailingVisual` |
| `PH_TrailingAction`                     | `PageHeader.TrailingAction` |
| `PH_Actions`                            | `PageHeader.Actions`        |
| `PH_Navigation`                         | `PageHeader.Navigation`     |
| `TitleArea`                             | `PageHeader.TitleArea`      |
| `GroupHeadingWrap`                      | `ActionList.GroupHeading`   |
| `ActionList.Item--DividerContainer`     | `ActionList.ItemSubContent` |
| `icon` (in UnderlineTabbedInterface)    | `UnderlineNav.Icon`         |
| `text` (in UnderlineTabbedInterface)    | `UnderlineNav.Label`        |
| `counter` (in UnderlineTabbedInterface) | `UnderlineNav.Counter`      |
| `multilineContainer`                    | `SkeletonText.Container`    |
| `input` (in TextInput)                  | `TextInput.Input`           |
| `AnchoredOverlay` (no dot)              | `AnchoredOverlay`           |
| `ActionBar.VerticalDivider`             | `ActionBar.VerticalDivider` |

Components that currently have no `data-component` on key parts must also be
updated to add them.

## Consequences

### Positive

- **Stable selectors for consumers.** Consumers can target any part of a
  component using `[data-component="..."]` selectors that are immune to CSS
  Module hash changes and version upgrades.
- **Consistent naming.** A single convention replaces four inconsistent patterns,
  making the codebase easier to learn and maintain.
- **Self-documenting.** Inspecting any element in DevTools immediately reveals
  what component and part it belongs to — the values map directly to the React
  API.
- **Enables JavaScript queries.** Consumers and tests can use
  `querySelectorAll('[data-component="ActionList.Item"]')` reliably.
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
