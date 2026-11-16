# BaseStyles

`BaseStyles` establishes Primer base typography and color variables for a subtree.

Import: `import {BaseStyles} from '@primer/react-tailwind'`. There is no supported BaseStyles component subpath.

Read [package guidance](../AGENTS.md) for shared setup and styling contracts.

## API notes

Native attributes, events, and the forwarded ref apply to the rendered root. `as` changes that element; a custom component must forward the supplied props and ref to its DOM element. `className` merges with the base typography classes. Caller `style` properties take precedence over this component's base styles.

## Usage

```tsx
import {BaseStyles} from '@primer/react-tailwind'
;<BaseStyles as="main">Repository settings</BaseStyles>
```

`as` selects the root element. Pair `BaseStyles` with `ThemeProvider` when the subtree needs a color scheme.

## Themes and portals

`BaseStyles` establishes typography and a default portal destination, not a theme context. Import the package stylesheet once and place it inside `ThemeProvider` for themed content. `color` sets the subtree's foreground color; use semantic CSS custom properties to retain theme behavior.

Floating parts normally use the nearest `BaseStyles` as their portal destination so that they inherit its styles. `Portal.Provider` or an explicit `container` can override that destination. When a portal is outside the themed subtree, the destination must provide the relevant theme attributes and variables; React context alone does not carry CSS inheritance.

## Data attributes

The root exposes `data-component="BaseStyles"` and `data-portal-root`. Prefer the public portal APIs to querying these attributes or depending on the internal portal DOM.
