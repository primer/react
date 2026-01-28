# CSS Layer Names

## Status

| Stage    | Status      |
| -------- | ----------- |
| Approved | 🚧          |
| Adopted  | <!-- ✅ --> |

## Context

As Primer begins making use of CSS Layers, we need to define the named groups
and order of the layers that we create. This will help to ensure a consistent
ordering of layers and make sure that our naming is consistent across libraries.

We have several areas that may be helpful to define explicit layers for:

- Primitives
- Octicons
- Components
- Resets
- Utilities
- Product

This ADR will determine the naming convention for CSS Layers and the order in
which they should be applied.

## Decision

Below is the list of CSS layers that we will use in Primer. They appear in the
order in which they should be applied.

- `base`: base styles that are applied to the document and the root element. This includes things like resets, typography, and
  global styles.
- `theme`: styles that are applied for theming. This layer includes `@primer/primitives`
- `icons`: styles that are applied to octicons
- `components`: styles that are applied to components
- `utilities`: an optional layer for utility classes in order to take precedence over earlier styles

All layers should exist within the `primer` namespace. For example:

```css
@layer primer.base {
  /* ... */
}

@layer primer.components.Button {
  /* ... */
}
```

Naming for these layers must use `camelCase`. The only exception would be for
the names of components which must use `PascalCase`.

### Where should the order of CSS layers be defined

The definition of CSS layers ordering is:

```css
@layer primer.base, primer.theme, primer.icons, primer.components, primer.utilities;
```

This file lives in `layer.css` which is imported by each entrypoint that `@primer/react` provides.

### Impact

This change will impact the following libraries:

- primer/css: styles in this library should be wrapped in either the utilities
  or icons layer.
- primer/primitives: styles in this library should be wrapped in the theme layer
- primer/octicons: styles in this library should be wrapped in the icons
  layer
- primer/react: styles in this library should be wrapped in the components layer
- primer/view_components: styles in this library should be wrapped in the components
  layer

## Unresolved questions

## Links & Resources

- [Tailwind CSS v4 Integration for Material UI](https://mui.com/material-ui/integrations/tailwindcss/tailwindcss-v4/)
- [Mantine CSS Layers](https://mantine.dev/styles/mantine-styles/#css-layers)
