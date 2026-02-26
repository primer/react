# [ADR] Component tokens as CSS custom properties

📆 Date: 2026-02-26

## Status

| Stage          | State          |
| -------------- | -------------- |
| Status         | Proposed ❓    |
| Implementation | Not planned ⛔ |

## Context

Primer React components use design tokens from `@primer/primitives` for colors, spacing, typography, and borders. These tokens enforce consistency across the design system but make it difficult for consumers to customize the appearance of individual component instances without resorting to fragile CSS overrides targeting internal class names.

A common need is to restyle a component for a specific context — for example, rendering a `SegmentedControl` with accent colors to indicate a primary action area, or adjusting border radius to match a custom layout. Today, the only options are:

1. **Override internal CSS module class names** — brittle, breaks on refactors, and not part of the public API.
2. **Use inline styles on the component** — limited to properties exposed on the root element and cannot target internal elements like the selected state or hover states.
3. **Wrap in a themed provider** — too broad, affects all components in the subtree.

Component tokens solve this by exposing a stable set of CSS custom properties that consumers can set on a parent element or the component itself to customize its appearance.

## Decision

Every component should expose a set of **component tokens** as CSS custom properties. These tokens are the public styling API of the component and follow a consistent pattern across all components.

### Naming convention

Component tokens use the following naming pattern:

```
--{component-name}-{property}
--{component-name}-{variant}-{property}
```

Examples from `SegmentedControl`:

| Token                                     | Purpose                              |
| ----------------------------------------- | ------------------------------------ |
| `--segmented-control-bgColor`             | Track background color               |
| `--segmented-control-bgColor-hover`       | Track background on hover            |
| `--segmented-control-borderColor`         | Outer border color                   |
| `--segmented-control-borderRadius`        | Outer border radius                  |
| `--segmented-control-fgColor-icon`        | Icon color (default state)           |
| `--segmented-control-fontWeight`          | Text weight (default state)          |
| `--segmented-control-selected-bgColor`    | Selected segment background          |
| `--segmented-control-selected-fgColor`    | Selected segment text and icon color |
| `--segmented-control-selected-fontWeight` | Selected segment text weight         |

### What to tokenize

Expose tokens for visual properties that a consumer may reasonably need to customize:

- **Colors** — background, foreground (text), border, and icon colors for each distinct state (rest, hover, active, selected, disabled).
- **Border radius** — the outer shape of the component.
- **Font weight** — when the component uses non-standard weights (e.g., semibold for selected state).
- **Spacing** — internal padding values that affect the component's visual density, when they are not derived from a standard size primitive.

### What NOT to tokenize

Do not expose tokens for:

- **Layout properties** — `display`, `width`, `height`, `flex`, `position`. These are structural and changing them would break the component.
- **Focus styles** — outline color, offset, and box-shadow for focus states must remain consistent for accessibility.
- **Font size** — controlled by the `size` prop and design system typography scale.
- **Font family** — inherited from the page and should not vary per-component.
- **Cursor** — semantic (e.g., `pointer` for clickable, `not-allowed` for disabled) and should not be overridden.
- **Internal structural values** — z-index, pseudo-element positioning, transforms used for hit areas.

### Implementation pattern: `var()` with fallback

**Do not** define component tokens as custom properties on the component element itself. Setting a property on the element always wins over inherited values, which prevents consumers from overriding tokens from a parent element.

❌ **Wrong — blocks inheritance:**

```css
.SegmentedControl {
  --segmented-control-bgColor: var(--controlTrack-bgColor-rest);
  background-color: var(--segmented-control-bgColor);
}
```

With this pattern, setting `--segmented-control-bgColor` on a parent `<div>` has no effect because the component redefines it on its own element.

✅ **Correct — use `var()` with a fallback value:**

```css
.SegmentedControl {
  background-color: var(--segmented-control-bgColor, var(--controlTrack-bgColor-rest));
}
```

The token is never defined by the component. It only references it with a fallback. If a consumer sets `--segmented-control-bgColor` on any ancestor element, that value is inherited and used. If not, the fallback kicks in.

For hardcoded fallback values (not from primitives), use the literal value directly:

```css
.Button {
  padding: var(--segmented-control-button-bg-inset, 4px);
}
```

### Documentation in CSS

List all available component tokens in a comment block at the top of the component's root selector:

```css
.SegmentedControl {
  /*
   * Component tokens – override these custom properties from a parent
   * element to customize the control:
   *
   * --segmented-control-bgColor
   * --segmented-control-bgColor-hover
   * --segmented-control-bgColor-active
   * --segmented-control-borderColor
   * --segmented-control-borderRadius
   * --segmented-control-selected-bgColor
   * --segmented-control-selected-borderColor
   * --segmented-control-selected-fgColor
   * --segmented-control-selected-fontWeight
   */

  background-color: var(--segmented-control-bgColor, var(--controlTrack-bgColor-rest));
  /* ... */
}
```

### Consumer usage

Consumers override tokens by setting them on a parent element or via inline styles:

```tsx
<div
  style={
    {
      '--segmented-control-bgColor': 'var(--bgColor-accent-muted)',
      '--segmented-control-selected-bgColor': 'var(--bgColor-accent-emphasis)',
      '--segmented-control-selected-fgColor': 'var(--fgColor-onEmphasis)',
    } as React.CSSProperties
  }
>
  <SegmentedControl aria-label="File view">
    <SegmentedControl.Button defaultSelected>Preview</SegmentedControl.Button>
    <SegmentedControl.Button>Raw</SegmentedControl.Button>
  </SegmentedControl>
</div>
```

Consumers should prefer using Primer primitive values (e.g., `var(--bgColor-accent-emphasis)`) over hardcoded colors to maintain theme compatibility.

## Consequences

### Positive

- **Stable public API** — consumers can customize components without depending on internal class names.
- **Inheritance-friendly** — tokens set on a parent cascade down, enabling contextual theming.
- **Backward compatible** — existing components continue to work unchanged; tokens are purely additive.
- **Self-documenting** — the comment block in each component's CSS file serves as the token reference.
- **Theme-safe** — fallback values ensure the component always looks correct even if no tokens are set.

### Negative

- **Repeated fallback values** — the same fallback (e.g., `var(--controlTrack-bgColor-rest)`) may appear in multiple places within a component's CSS, since tokens are not defined centrally on the element.
- **Stylelint noise** — component tokens trigger `primer/colors` and `primer/borders` lint rules because they are not recognized Primer primitives. Each usage requires a `stylelint-disable` comment.
- **API surface** — once a token is documented and adopted, renaming or removing it is a breaking change per our [versioning policy](../versioning.md#a-component-changes-its-usage-of-a-css-custom-property).

## Alternatives

### Define tokens on the component element with explicit assignment

```css
.SegmentedControl {
  --segmented-control-bgColor: var(--controlTrack-bgColor-rest);
  background-color: var(--segmented-control-bgColor);
}
```

This is simpler to read and avoids repeated fallbacks, but **blocks CSS inheritance**. Tokens set on a parent element would be overridden by the component's own definition. This was the initial implementation for `SegmentedControl` and was rejected because the Storybook demo showed that parent overrides had no effect.

### Use `@property` registration with `inherits: true`

The CSS `@property` rule could register tokens with default values while preserving inheritance:

```css
@property --segmented-control-bgColor {
  syntax: '<color>';
  inherits: true;
  initial-value: transparent;
}
```

This was not chosen because `@property` has limited browser support for complex fallback chains (e.g., referencing other custom properties as initial values is not supported), and it adds complexity for minimal benefit over the `var()` fallback pattern.

### Expose a `style` prop for each sub-element

Instead of CSS custom properties, components could accept style objects for internal elements (e.g., `selectedStyle`, `hoverStyle`). This was rejected because it couples styling to the React API, does not support CSS inheritance, and significantly increases the prop surface of every component.
