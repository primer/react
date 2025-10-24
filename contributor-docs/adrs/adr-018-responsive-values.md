# Responsive Values

## Status

| Stage    | Status |
| -------- | ------ |
| Approved | ✅     |
| Adopted  | 🚧     |

## Context

There are situations where a component prop can support a value or a "responsive
value" that results in the value changing depending on the viewport size. For
example:

```tsx
// Value
<Stack gap="condensed" />

// Responsive value
<Stack gap={{ narrow: 'condensed', regular: 'normal', wide: 'spacious' />
```

Typically, a responsive value will support all of our named breakpoints: narrow,
regular, and wide. Authors can use a hook called `useResponsiveValue` to support
resolving the value of a prop based on the current viewport size. The
implementation of this hook uses [`matchMedia`](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia)
which, unfortunately, has a downside: the value of a prop may shift when the
component is server-side rendered. If the prop is used for styles or layout, then this will lead to a layout shift
when the component hydrates and the viewport size is different than the fallback
size on the server.

As a result, we would like to offer a paved path for providing responsive props
in a way that will not lead to layout shift during server-side rendering.

## Decision

Authors should use data attributes to bridge between responsive values in
JavaScript and the corresponding styles in CSS. Authors should avoid using
JavaScript-driven mechanisms for controlling responsive values in order to
prevent layout shift during SSR.

For example, consider a `Stack` component that has a `gap` prop. This prop can
receive a plain value or one that is a responsive value. To support this,
authors should use the following patterns:

```tsx
type GapScale = 'none' | 'condensed' | 'normal' | 'spacious'

type StackProps = React.PropsWithChildren<{
  // Responsive props should be a union of the value of the prop plus
  // `ResponsiveValue` over that value
  gap?: GapScale | ResponsiveValue<GapScale>
}>

function Stack({children, gap}: StackProps) {
  // The `getResponsiveAttributes` helper is useful for adding the corresponding
  // `data-*` attributes to the container for the compnoent.
  //
  // In this case, it will add `data-gap` and `data-gap-{breakpoint}` attributes
  // with the corresponding value set
  return <StyledStack {...getResponsiveAttributes('gap', gap)}>{children}</StyledStack>
}

const StyledStack = styled.div`
  &[data-gap='none'],
  &[data-gap-narrow='none'] {
    /* ... */
  }

  &[data-gap='condensed'],
  &[data-gap-narrow='condensed'] {
    /* ... */
  }

  /* ... */

  // @custom-media --viewportRange-regular
  @media (min-width: 768px) {
    &[data-gap-regular='none'] {
      /* ... */
    }

    &[data-gap-regular='condensed'] {
      /* ... */
    }

    /* ... */
  }

  // @custom-media --viewportRange-wide
  @media (min-width: 1400px) {
    &[data-gap-wide='none'] {
      /* ... */
    }

    &[data-gap-wide='condensed'] {
      /* ... */
    }

    /* ... */
  }
`
```

By default, this approach uses the following conventions:

- Props which may have responsive values should have a value that is
  serializable, ideally as a `string` or `boolean`
- Props will be provided on the component as a data attribute, using the format:
  `data-{propName}`
- For responsive values, the breakpoint name will be appended to the data
  attribute name specified above. For example: `data-{propName}-{breakpoint}`

Data attributes will act as a bridge between JavaScript and CSS. In CSS, authors
should use these data attributes to apply styles based on the value of the
attribute per-breakpoint.

> [!NOTE]
> There is a utility named `getResponsiveAttributes` that can be used to generate
> the corresponding `data-*` attributes for the props which may have responsive
> values.

### Storybook

When authoring playgrounds for components that have responsive values, use
the following strategy for writing controls:

- Provide a control for the plain value of the prop, for example `gap`
- For each supported responsive value, provide a control with the name of the
  breakpoint appended to the prop name, for example:
  - `gapNarrow`
  - `gapNormal`
  - `gapWide`
- Use the `getRespnosiveControlValues` helper to resolve between the plain and
  responsive value for the prop. By default, this helper will pass along a
  responsive value if one is defined. If none are defined, the plain value will
  be used

### Impact

- Use of the `useResponsiveValue` hook is discouraged in cases where layout is
  dependent on the value of a prop
- Usage of `useResponsiveValue` should migrate to data attributes, ideally using
  the `getResponsiveAttributes` helper
- Storybook stories that use responsive values should follow the practices
  and format outlined above

The following components are impacted by this ADR:

- `PageHeader`
- `PageLayout`
- `SplitPageLayout`
- `SegmentedControl`
- `SelectPanel2`
- `Hidden`

## FAQ
