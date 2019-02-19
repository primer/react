import React from 'react'
import {styles, compose, get as getKey, themeGet} from 'styled-system'
import theme from './theme'

export const get = key => themeGet(key, getKey(theme, key))

export const COMMON = compose(
  styles.color,
  styles.space
)

export const BORDER = compose(
  styles.borders,
  styles.borderColor,
  styles.boxShadow,
  styles.borderRadius
)

export const TYPOGRAPHY = compose(
  styles.fontFamily,
  styles.fontSize,
  styles.fontStyle,
  styles.fontWeight,
  styles.lineHeight,
  styles.textAlign
)

export const LAYOUT = compose(
  styles.display,
  styles.size,
  styles.width,
  styles.height,
  styles.minWidth,
  styles.minHeight,
  styles.maxWidth,
  styles.maxHeight,
  styles.overflow,
  styles.verticalAlign
)

export const POSITION = compose(
  styles.position,
  styles.zIndex,
  styles.top,
  styles.right,
  styles.bottom,
  styles.left
)

export const FLEX_CONTAINER = compose(
  styles.flexBasis,
  styles.flexDirection,
  styles.flexWrap,
  styles.alignContent,
  styles.alignItems,
  styles.justifyContent,
  styles.justifyItems
)

export const FLEX_ITEM = compose(
  styles.flex,
  styles.justifySelf,
  styles.alignSelf,
  styles.order
)

// These lists are just used to generate docs

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

export const Base = ({is: Tag = 'div', theme, ...rest}) => <Tag {...rest} />
