import styled from 'react-emotion'
import system from 'system-components/emotion'
import {default as defaultTheme} from './theme'

export {system as default}

export const COMMON = ['color', 'space']

export const TYPOGRAPHY = COMMON.concat('fontFamily', 'fontWeight', 'lineHeight')

export const LAYOUT = COMMON.concat(
  'borders',
  'borderColor',
  'borderRadius',
  'boxShadow',
  'display',
  'size',
  'width',
  'height',
  'maxWidth',
  'maxHeight',
  'minWidth',
  'minHeight'
)

export const POSITION = ['position', 'zIndex', 'top', 'right', 'bottom', 'left']

export const FLEX_CONTAINER = LAYOUT.concat(
  'alignItems',
  'justifyContent',
  'flexWrap',
  'flexDirection',
  'flex',
  'alignContent',
  'order',
  'flexBasis'
)

export const FLEX_ITEM = LAYOUT.concat('justifySelf', 'alignSelf')

export function withSystemProps(Component, props = COMMON) {
  const Wrapped = system({is: Component}, ...props)

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

export function withDefaultTheme(Component, theme = defaultTheme) {
  if (Component.defaultProps) {
    Component.defaultProps.theme = theme
  } else {
    Component.defaultProps = {theme}
  }
  return Component
}
