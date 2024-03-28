# ADR 019: Responsive Values

## Status

| Stage    | Status |
| -------- | ------ |
| Approved |        |
| Adopted  |        |

## Context

- Responsive values, or props, allow users the ability to provide different
  values for a prop depending on the current screen size
- Responsive values can be accessed in JavaScript or CSS
- Responsive values in JS lead to layout shift in SSR due to the default values
  shifting
- There are a variety of ways to interact with responsive values in CSS and we
  would like to formalize them

## Decision

Authors should use data attributes to bridge between responsive values in
JavaScript and the corresponding styles in CSS. Authors should avoid using
JavaScript-driven mechanisms for controlling responsive values in order to
prevent layout shift during SSR.

For example, consider a `Stack` component that has a `gap` prop. This prop can
receive a plain value or one that is responsive. To support this, we should use
the following patterns:

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
  &[data-gap='none'] {
    /* ... */
  }

  &[data-gap='condensed'] {
    /* ... */
  }

  &[data-gap='normal'] {
    /* ... */
  }

  &[data-gap='spacious'] {
    /* ... */
  }

  // @custom-media --veiwportRange-narrow
  @media (max-width: calc(48rem - 0.02px)) {
    &[data-gap-narrow='none'] {
      /* ... */
    }

    &[data-gap-narrow='condensed'] {
      /* ... */
    }

    &[data-gap-narrow='normal'] {
      /* ... */
    }

    &[data-gap-narrow='spacious'] {
      /* ... */
    }
  }

  /* ... */
`
```

- Authoring
  - CSS
  - TypeScript
- Stories
- Helpers
  - data attributes
  - controls
- Types of values
  - Strings
  - Booleans
- Fallback

### Impact

- Use of the `useResponsiveValue` hook should be deprecated and discouraged
- Usage of `useResponsiveValue` should migrate to data attributes, ideally using
  the `getResponsiveAttributes` helper
- Storybook stories that use responsive values should follow the practices
  and format outlined above

## FAQ
