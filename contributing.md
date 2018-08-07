# Contribution guidelines

## Tools we use

### Components
1. We use [emotion] to style our components, and [emotion-theming] as the theme provider.
1. We use style functions from [styled-system] whenever possible, and styled-systems' `style()` function to create new ones.
1. We use [system-components] to reduce the amount of boilerplate needed to implement styled-system functions.

## Component patterns
With a couple of exceptions, all components should be created by the `withSystemProps()` function from `src/system-props.js`. This function takes a "component-ish" value as its first argument, and an array of [system props](#system-props) as the second:

```jsx
import {withSystemProps, POSITION} from './system-props'

function Component(props) { 
  /* implementation */
}

export default withSystemProps(Component, POSITION)

// equivalent:
export default withSystemProps({is: Component}, POSITION)

// with more default props:
export default withSystemProps(
  {
    is: Component,
    m: 2
  },
  POSITION
)
```

Categories of system props are exported from `src/system-props`:

* `COMMON` includes color and spacing (margin and padding) props
* `TYPOGRAPHY` includes `COMMON` and font family, font weight, and line-height
* `POSITION` includes `COMMON` and positioning props
* `FLEX_CONTAINER` includes `COMMON` and flexbox props for containers
* `FLEX_ITEM` includes `COMMON` and flexbox props for items in a flex container

### Components with only system props
Components with only system props should be created by passing the default tag to `withSystemProps()`:

```jsx
import {withSystemProps, LAYOUT} from './system-props'

const Block = withSystemProps('div', LAYOUT)
```

### Primer CSS components
If you're just adding Primer CSS class names, you can pass the `className` prop to another component created with `withSystemProps()`, and it will be combined with any generated classes automatically:

```jsx
import Box from './Box'

function FancyBox({flashing, ...rest}) {
  return <Box className={flashing && 'Box--flashing'} {...rest} />
}

FancyBox.propTypes = {
  flashing: PropTypes.bool,
  // be sure to spread Box's prop-types
  ...Box.propTypes
}

FancyBox.defaultProps = {
  ...Box.defaultProps
}

// if you don't spread defaultProps from another system component,
// you will need to wrap the export in withDefaultTheme()
export default FancyBox
```

> **⚠️ If you use this pattern, passing the component to `withSystemProps()` should throw an error because system-components has an issue (_TODO: ref_) with calling the underlying component render function twice.**

With the above pattern, it's possible to control whether users may pass additional class names to your component. If you want to allow this, the `className` prop should be listed in `propTypes` and combined with your own classes using the [classnames] function:

```jsx
import classnames from 'classnames'
import Box from './Box'

export default function FancyBox({flashing, className, ...rest}) {
  const classes = classnames(className, flashing && 'Box--flashing')
  return <Box className={classes} {...rest} />
}

FancyBox.propTypes = {
  className: PropTypes.string,
  flashing: PropTypes.bool,
  ...Box.propTypes
}
```

Alternatively, you can create the component from scratch using `withSystemProps()`, and pass it the same system props:

```jsx
import classnames from 'classnames'
import {withSystemProps, LAYOUT} from './system-props'

function FancyBox({flashing, className, is: Tag, ...rest}) {
  return (
    <Tag
      className={classnames(className, flashing && 'Box--flashing')}
      {...rest}
    />
  )
}

FancyBox.propTypes = {
  flashing: PropTypes.bool
}

export default withSystemProps(FancyBox, LAYOUT)
```

In this case, you will need to deal explicitly with two props passed down from [emotion] and [system-components], respectively:

  * `className`: You _must_ render this prop, otherwise **your component will not be styled.**
  * `is`: This is what allows your component to render with arbitrary elements, and even other components. If you don't respect this prop, you should `delete Component.propTypes.is` to signal that it's not available.

## Glossary

### System props
System props are style functions that provide on or more props, and can be passed directly the return value of [emotion]'s `styled()` function:

```jsx
import {styled} from 'react-emotion'
import {space} from 'styled-system'
const SpaceDiv = styled('div')(space)
```

System props come with `propTypes` that can be mixed into your own with ES6 [spread syntax]:

```jsx
SpaceDiv.propTypes = {
  stellar: PropTypes.bool,
  ...space.propTypes
}
```

[classnames]: https://www.npmjs.com/package/classnames
[emotion]: https://emotion.sh/
[emotion-theming]: https://github.com/emotion-js/emotion/tree/master/packages/emotion-theming
[spread syntax]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
[styled-system]: https://jxnblk.com/styled-system/getting-started
[system-components]: https://jxnblk.com/styled-system/system-components
[table]: https://jxnblk.com/styled-system/table
