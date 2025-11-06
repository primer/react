# Architecture

This package mirrors components from `@primer/react` but optionally provides
support for `sx` and `styled-system` props to a component. Only components
that have downstream `sx` usage across GitHub are included in this package.

## Peer Dependency Version Range

The `@primer/react` peer dependency uses an explicit semver range to support:

1. All stable versions >= 38.0.0
2. Pre-release versions for currently published minor versions (38.0.x-rc, 38.1.x-rc)
3. Development versions (e.g., `0.0.0-<hash>`)

The pattern explicitly lists pre-release ranges due to semver semantics: pre-release
versions like `38.1.0-rc.1` are considered less than `38.1.0`, so they require
explicit ranges (e.g., `>=38.1.0-0 <38.1.0`) to be matched. The pattern covers
currently published minor versions and can be extended when new minor versions are
released.

## Overview

There are several ways a component is added to this package:

- A functional component
- A functional component with `forwardRef`
- A polymorphic functional component with `forwardRef`

The way we author the wrappers for these components will differ depending on
what type the component is originally.

### A functional component

```tsx
import {
  ExampleComponent as PrimerExampleComponent,
  type ExampleComponentProps as PrimerExampleComponentProps,
} from '@primer/react'

type ExampleComponentProps = PrimerExampleComponentProps & SxProp

function ExampleComponent(props: ExampleComponentProps) {
  return <Box as={PrimerExampleComponent} {...props} />
}

export {ExampleComponent}
```

### A functional component with `forwardRef`

```tsx
import {
  ExampleComponent as PrimerExampleComponent,
  type ExampleComponentProps as PrimerExampleComponentProps,
} from '@primer/react'
import {forwardRef} from 'react'

type ExampleComponentProps = PrimerExampleComponentProps & SxProp

const ExampleComponent = forwardRef<HTMLElement, ExampleComponentProps(function ExampleComponent(props, ref) {
  return <Box ref={ref} as={PrimerExampleComponent} {...props} />
});

export {ExampleComponent}
```

It's important that this signature matches the original component exactly,
including both the type of the `ref` and props.

### A polymorphic functional component with `forwardRef`

```tsx
import {
  ExampleComponent as PrimerExampleComponent,
  type ExampleComponentProps as PrimerExampleComponentProps,
} from '@primer/react'
import {forwardRef} from 'react'
import {ForwardRefComponent} from '../polymorphic'
import {sx} from '../sx'

type ExampleComponentProps = PrimerExampleComponentProps & SxProp

const ExampleComponent: ForwardRefComponent<'div', ExampleComponentProps> = styled(
  PrimerExampleComponent,
).withConfig<ExampleComponentProps>({
  shouldForwardProp: prop => prop !== 'sx',
})`
  ${sx}
`

export {ExampleComponent}
export type {ExampleComponentProps}
```

## Sub-components

Some components will include sub-components as a part of their properties. For
example, `SubNav` also includes `SubNav.Link`. When wrapping these components,
it's important to also wrap the sub-components so that these accessors
continue to work as expected.

```tsx
type SubNavProps = PrimerSubNavProps & SxProp

const SubNavImpl = forwardRef<HTMLElement, SubNavProps>(function SubNav(props, ref) {
  return <Box as={PrimerSubNav} ref={ref} {...props} />
})

type SubNavLinkProps = PrimerSubNavLinkProps & SxProp

const SubNavLink = forwardRef<HTMLAnchorElement, SubNavLinkProps>(function SubNavLink(props, ref) {
  return <Box as={PrimerSubNav.Link} ref={ref} {...props} />
})

const SubNav = Object.assign(SubNavImpl, {
  Link: SubNavLink,
})
```
