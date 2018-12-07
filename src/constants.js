import React from 'react'
import {styles, compose} from 'styled-system'

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
  styles.justifyItems,
  styles.order
)

export const FLEX_ITEM = compose(
  styles.flex,
  styles.justifySelf,
  styles.alignSelf
)

export const Base = ({is: Tag, theme, ...rest}) => <Tag {...rest} /> //eslint-disable-line no-unused-vars
