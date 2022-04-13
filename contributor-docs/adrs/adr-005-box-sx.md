# ADR 005: Use Box as a building block for all other components

## Status

Proposed

## Context

In Primer React and consuming applications, we use many different patterns for creating React components. Two common patterns are:

1. Creating components with styled-components

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

    [Show full code example →](https://github.com/primer/react/pull/2019/files?diff=split&w=0)

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

    [Show full code example →](https://github.com/primer/react/pull/2019/files?diff=split&w=0)

&nbsp;

## Decision

Prefer using method #2: Creating components with Box for the following reasons:

- Better authoring experience with typescript. With Box, we can improve the API and autocomplete for consuming primitives.
- The styling library (i.e. styled-components) becomes an implementation detail and can be changed later with minimal breaking changes for consumers. (Avoids leaky abstractions)
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
