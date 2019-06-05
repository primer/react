import * as styledSystem from 'styled-system'
import { compose } from 'styled-system'
import systemPropTypes from '@styled-system/prop-types'
import themeGet from '@styled-system/theme-get'
import theme from './theme'

const { get: getKey } = styledSystem

export const get = key => themeGet(key, getKey(theme, key))

export const COMMON = compose(
  styledSystem.space,
  styledSystem.color,
)
COMMON.propTypes = {
  ...systemPropTypes.space,
  ...systemPropTypes.color,
}
export const BORDER = compose(
  styledSystem.border,
  styledSystem.shadow,
)
BORDER.propTypes = {
  ...systemPropTypes.border,
  ...systemPropTypes.shadow,
}

// these are 1:1 with styled-system's API now,
// so you could consider dropping the abstraction
export const TYPOGRAPHY = styledSystem.typography
export const LAYOUT = styledSystem.layout
export const POSITION = styledSystem.position

TYPOGRAPHY.propTypes = systemPropTypes.typography
LAYOUT.propTypes = systemPropTypes.layout
POSITION.propTypes = systemPropTypes.position

// in styled-system v5, all flexbox properties are combined
// these *could* be kept in separate flex container and item prop sets, but would require some customization
export const FLEX_CONTAINER = styledSystem.flexbox
export const FLEX_ITEM = styledSystem.flexbox

FLEX_CONTAINER.propTypes = systemPropTypes.flexbox
FLEX_ITEM.propTypes = systemPropTypes.flexbox

// If you'd like to keep flex container and item props separate,
// the code below should work
/*
  export const FLEX_CONTAINER = styledSystem.system({
    flexBasis: true,
    flexDirection: true,
    flexWrap: true,
    alignContent: true,
    alignItems: true,
    justifyContent: true,
    justifyItems: true,
  })

  export const FLEX_ITEM = styledSystem.system({
    flex: true,
    justifySelf: true,
    alignSelf: true,
    order: true
  })
*/
