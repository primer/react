import {styles, compose, get as getKey, themeGet} from 'styled-system'
import theme from './theme'

export const get = key => themeGet(key, getKey(theme, key))

export const COMMON_LIST = ['color', 'space']

export const BORDER_LIST = ['borders', 'borderColor', 'boxShadow', 'borderRadius']

export const TYPOGRAPHY_LIST = [
  // typography props
  'fontFamily',
  'fontSize',
  'fontStyle',
  'fontWeight',
  'lineHeight',
  'textAlign'
]

export const LAYOUT_LIST = [
  // layout props
  'display',
  'size',
  'width',
  'height',
  'minWidth',
  'minHeight',
  'maxWidth',
  'maxHeight',
  'overflow',
  'verticalAlign'
]

export const POSITION_LIST = [
  // position props
  'position',
  'zIndex',
  'top',
  'right',
  'bottom',
  'left'
]

export const FLEX_CONTAINER_LIST = [
  // flex container props (display: flex)
  'flexBasis',
  'flexDirection',
  'flexWrap',
  'alignContent',
  'alignItems',
  'justifyContent',
  'justifyItems',
  'order'
]

export const FLEX_ITEM_LIST = [
  // flex container child props
  'flex',
  'justifySelf',
  'alignSelf'
]

export const COMMON = composeList(COMMON_LIST)
export const BORDER = composeList(BORDER_LIST)
export const TYPOGRAPHY = composeList(TYPOGRAPHY_LIST)
export const LAYOUT = composeList(LAYOUT_LIST)
export const POSITION = composeList(POSITION_LIST)
export const FLEX_CONTAINER = composeList(FLEX_CONTAINER_LIST)
export const FLEX_ITEM = composeList(FLEX_ITEM_LIST)

function composeList(list) {
  return compose(...list.map(name => styles[name]))
}
