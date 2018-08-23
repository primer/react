import React from 'react'
import {style} from  'styled-system'
import system from 'system-components/emotion'
import {default as defaultTheme} from './theme'

export {system as default}

export const COMMON = ['color', 'space']

export const TYPOGRAPHY = COMMON.concat(
  // typography props
  'fontFamily',
  'fontSize',
  'fontWeight',
  'lineHeight'
)

export const LAYOUT = COMMON.concat(
  // layout props
  'borders',
  'borderColor',
  'borderRadius',
  'boxShadow',
  'display',
  'size',
  'width',
  'height',
  'minWidth',
  'minHeight',
  'maxWidth',
  'maxHeight',
  'verticalAlign'
)

export const POSITION = [
  // position props
  'position',
  'zIndex',
  'top',
  'right',
  'bottom',
  'left'
]

export const FLEX_CONTAINER = LAYOUT.concat(
  // flex container props (display: flex)
  'alignContent',
  'alignItems',
  'flexWrap',
  'flex',
  'flexBasis',
  'flexDirection',
  'justifyContent',
  'order'
)

export const FLEX_ITEM = LAYOUT.concat(
  // flex container child props
  'justifySelf',
  'alignSelf'
)

/**
 * Defensively determine whether a component function or class is a "system
 * component" by checking its `systemComponent` flag or whether its
 * `defaultProps.blacklist` is an array.
 */
export function isSystemComponent(Component) {
  return (
    Component.systemComponent === true || (Component.defaultProps && Array.isArray(Component.defaultProps.blacklist))
  )
}

/**
 * Create a "system component" with the named props from styled-system.
 * The Component (first) argument can either be a React component (a function
 * or a class) or an object representing default props. To pass a custom
 * component with other default props, set the object's `is` key to the
 * component:
 *
 * ```js
 * const Wrapped = withSystemProps({is: Component, m: 2})
 * ```
 *
 * which is the equivalent of:
 *
 * ```js
 * const Wrapped = withSystemProps(Component)
 * Wrapped.defaultProps = {
 *   m: 2
 * }
 * ```
 */
export function withSystemProps(Component, props = COMMON) {
  if (isSystemComponent(Component)) {
    throw new Error(`${Component.name} is already a system component; can't call withSystemProps() on it`)
  }

  const component = typeof Component === 'object' ? Component : {is: Component}
  if (typeof component.is === 'function') {
    component.is = guardDoubleRender(component.is)
  }

  const Wrapped = system(component, ...props)
  Wrapped.displayName = Component.displayName
  Object.assign(Wrapped.propTypes, Component.propTypes)

  // Copy over non-system keys from components
  // eg. Tooltip.js => Tooltip.directions Tooltip.alignments
  for (const key of Object.keys(Component)) {
    if (!Wrapped.hasOwnProperty(key)) {
      Wrapped[key] = Component[key]
    }
  }

  return withDefaultTheme(Wrapped)
}

/**
 * Set the component's defaultProps.theme to our theme, and returns the
 * component.
 */
export function withDefaultTheme(Component, theme = defaultTheme) {
  if (Component.defaultProps) {
    Component.defaultProps.theme = theme
  } else {
    Component.defaultProps = {theme}
  }
  return Component
}

/**
 * Remove the named keys from a component's propTypes object (if present), and
 * return the component.
 */
export function withoutPropTypes(Component, props) {
  for (const prop of props) {
    delete Component.propTypes[prop]
  }
  return Component
}

export const listStyle = style({
  prop: 'listStyle',
  cssProperty: 'list-style',
  key: 'listStyles'
})

function guardDoubleRender(Component) {
  function render(props) {
    const {is, ...rest} = props
    if (is === Component || is === render) {
      return <Component {...rest} />
    } else {
      return <Component {...props} />
    }
  }
  return render
}
