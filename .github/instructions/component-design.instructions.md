---
applyTo: 'packages/react/src/**/*.tsx'
---

# Component API design decisions

These rules apply when **creating or modifying React components** in `packages/react/src/`.

## Children vs. Data Props

When deciding how a component accepts its content:

- Use **children** when the component doesn't care about child structure, flexibility matters, or the pattern mirrors HTML (`<ul>` → `<li>`)
- Use **data props** when the component needs to iterate, sort, filter, or manipulate items before rendering, or when you want strict control over allowed content
- Do NOT combine both patterns for the same content — behavior becomes unpredictable

## React.Children and React.cloneElement

- Avoid `React.Children` or `React.cloneElement` in new code
- Use `useSlots` to detect and extract named children by type only when necessary
- Use React context to share state between parent and children
- Prefer data props when you need to iterate or manipulate items

## Compound Components

Use `<Parent.Child>` pattern when:

- The component has distinct named regions (header, body, footer)
- Consumers need flexible composition of sub-parts
- Sub-parts share context with the parent

Do NOT use when:

- The component is a simple wrapper/container
- No meaningful relationship between parent and children
- A data prop (`items={[...]}`) would be clearer

Implementation:

- Assemble via `Object.assign` in `index.ts`
- Coordinate with React context, not child inspection
- Use `useSlots` for type-based child detection
- Set `displayName` on all sub-components

## Polymorphism (the `as` prop)

Only add `as` when there is a clear use case:

- Component needs functionality from another component (e.g., `<Button as={ReactRouterLink}>`)
- Accessibility benefits from semantic element changes (e.g., ActionList items)

Narrow the `as` type to valid options. Do not add `as` to every component by default.

## Defaults and Escape Hatches

- A component with zero optional props should render a correct, accessible result
- Non-default prop values are first-class — fully tested and documented
- `className` and `style` are escape hatches; document that they "void the warranty"

## Deprecation

When deprecating a prop:

1. Add `@deprecated` to the TypeScript type
2. Document the deprecation and alternative
3. Add/extend an ESLint rule to warn against usage
4. Use the `warning()` helper for runtime dev warnings

When deprecating a component:

1. Add `@deprecated` annotation
2. Move to `src/deprecated/`, export from `@primer/react/deprecated`
3. Provide migration guide and codemods
4. Remove after ~6 months (major release)
