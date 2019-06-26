import * as styledSystem from 'styled-system'
import systemPropTypes from '@styled-system/prop-types'
import themeGet from '@styled-system/theme-get'
import theme from './theme'

const {get: getKey, compose} = styledSystem

export const get = key => themeGet(key, getKey(theme, key))

export const COMMON = compose(
  styledSystem.space,
  styledSystem.color,
  styledSystem.display
)
COMMON.propTypes = {
  ...systemPropTypes.space,
  ...systemPropTypes.color
}
export const BORDER = compose(
  styledSystem.border,
  styledSystem.shadow
)
BORDER.propTypes = {
  ...systemPropTypes.border,
  ...systemPropTypes.shadow
}

// these are 1:1 with styled-system's API now,
// so you could consider dropping the abstraction
export const TYPOGRAPHY = styledSystem.typography
export const LAYOUT = styledSystem.layout
export const POSITION = styledSystem.position
export const FLEX = styledSystem.flexbox

TYPOGRAPHY.propTypes = systemPropTypes.typography
LAYOUT.propTypes = systemPropTypes.layout
POSITION.propTypes = systemPropTypes.position
FLEX.propTypes = systemPropTypes.flexbox
