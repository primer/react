import {theme} from '@primer/react'
import systemPropTypes from '@styled-system/prop-types'
import themeGet from '@styled-system/theme-get'
import * as styledSystem from 'styled-system'

const {get: getKey, compose, system} = styledSystem

export const get = key => themeGet(key, getKey(theme, key))

const whiteSpace = system({
  whiteSpace: {
    property: 'whiteSpace',
    cssProperty: 'whiteSpace',
  },
})

export const TYPOGRAPHY = compose(styledSystem.typography, whiteSpace)

export const COMMON = compose(styledSystem.space, styledSystem.color, styledSystem.display)

export const BORDER = compose(styledSystem.border, styledSystem.shadow)

// these are 1:1 with styled-system's API now,
// so you could consider dropping the abstraction
export const LAYOUT = styledSystem.layout
export const POSITION = styledSystem.position
export const FLEX = styledSystem.flexbox
export const GRID = styledSystem.grid

TYPOGRAPHY.propTypes = systemPropTypes.typography
LAYOUT.propTypes = systemPropTypes.layout
POSITION.propTypes = systemPropTypes.position
FLEX.propTypes = systemPropTypes.flexbox
GRID.propTypes = systemPropTypes.grid
