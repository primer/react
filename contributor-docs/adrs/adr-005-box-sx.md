# ADR 005: Using Box for building components

## Status

Proposed

## Context

There are multiple ways to create components within primer/react and composing components from primer/react.

The 2 popular methods are:

1.  Creating components with styled-components

    ```tsx
    const Avatar = styled.img.attrs<StyledAvatarProps>(props => ({
      height: props.size,
      width: props.size
    }))<StyledAvatarProps>`
      display: inline-block;
      overflow: hidden;
      line-height: ${get('lineHeights.condensedUltra')};
      border-radius: ${props => getBorderRadius(props)};
      ${sx}
    `
    ```

    <details>
      <summary>show full code example:</summary>

    ```tsx
    import styled from 'styled-components'
    import {get} from './constants'
    import sx, {SxProp} from './sx'
    import {ComponentProps} from './utils/types'

    // this component accepts sx prop
    type StyledAvatarProps = { ... } & SxProp

    export const Avatar = styled.img.attrs<StyledAvatarProps>(props => ({
      height: props.size,
      width: props.size
    }))<StyledAvatarProps>`
      display: inline-block;
      overflow: hidden;
      // get from theme with util
      line-height: ${get('lineHeights.condensedUltra')};
      // value can be a function
      border-radius: ${props => getBorderRadius(props)};
      // accepts sx prop
      ${sx}
    `

    // default props need to be defined after the component
    Avatar.defaultProps = {
      size: 20,
      alt: '',
      square: false
    }

    // border radius can come from a function
    const getBorderRadius = ({size, square}: StyledAvatarProps) => {
      if (square) {
        return size && size <= 24 ? '4px' : '6px'
      } else {
        return '50%'
      }
    }

    // types are exported with util
    export type AvatarProps = ComponentProps<typeof Avatar>
    ```

    Rendered output:

    ```html
    <!--
      render(<Avatar src="user.png" square size={24} />)
    
      notice the additional props that are passed down by styled-components
      because they resemble html attributes. className has Avatar in the name
    -->
    <img src="user.png" size="24" alt="" height="24" width="24" class="Avatar-sc-oifmh0-0 hHnZnB" />
    ```

    </details>

2.  Creating components with Box

    ```tsx
    const Avatar: React.FC<AvatarProps> = ({size = 20, alt = '', square = false, sx = {}, ...props}) => {
      const styles = {
        display: 'inline-block',
        overflow: 'hidden',
        lineHeight: 'condensedUltra',
        borderRadius: getBorderRadius({size, square})
      }

      return (
        <Box
          as="img"
          alt={alt}
          sx={merge(styles, sx as SxProp)} // styles needs to merge with props.sx
          {...props}
        />
      )
    }
    ```

    <details>
      <summary>show full code example:</summary>

    ```tsx
    import React from 'react'
    import Box from './Box'
    import {SxProp, merge} from './sx'

    // this component accepts sx prop (no need for util)
    export type AvatarProps = { ... } & SxProp

    // default props are defined on the component
    export const Avatar: React.FC<AvatarProps> = ({size = 20, alt = '', square = false, sx = {}, ...props}) => {
      const styles = {
        display: 'inline-block',
        overflow: 'hidden',
        // theme values used with styled-system
        lineHeight: 'condensedUltra',
        // value can be a function
        borderRadius: getBorderRadius({size, square})
      }

      return (
        <Box
          as="img"
          alt={alt}
          sx={merge(styles, sx as SxProp)} // styles needs to merge with props.sx
          {...props}
        />
      )
    }

    const getBorderRadius = ({size, square}: Pick<AvatarProps, 'size' | 'square'>) => {
      if (square) {
        return size && size <= 24 ? '4px' : '6px'
      } else {
        return '50%'
      }
    }

    export default Avatar
    ```

    ```html
    <!--
      render(<Avatar src="user.png" square size={24} />)
    
      notice that Avatar props were destructured out and not passed down
      to the html element.
      room for improvement: className does not have Avatar in name
      -->
    <img alt="" src="user.png" class="Box-sc-1gh2r6s-0 fduOtN" />
    ```

    </details>
      
&nbsp;
      
## Decision

Prefer using method #2: Creating components with Box for the following reasons:

- Better authoring experience with typescript. With Box, we can improve the API and autocomplete for consuming primitives.
- The styling library used used is an implementation detail and we should be able to replace it. (Avoid leaky abstractions)
- We have had issues with exporting types, we can increase confidence by keeping the exported types close to what we author.

&nbsp;

This conversation can be extended to overriding stlyes composing components and adding styles to them. We want to use the `sx` prop to add these styles.

For example, `ActionMenu.Button` uses the `Button` component but adds Menu specific styles to it:

```tsx
const MenuButton = ({sx = {}, ...props}) => {
  // additional styles for Button when used with ActionMenu
  const styles = {
    '[data-component=trailingIcon]': {marginX: -1}
  }

  return (
    <Anchor>
      <Button type="button" trailingIcon={TriangleDownIcon} sx={merge(styles, sx)} {...props} />
    </Anchor>
  )
}
```

See diff for moving Avatar from approach 1 to 2: https://github.com/primer/react/pull/2019/files?diff=split&w=0
