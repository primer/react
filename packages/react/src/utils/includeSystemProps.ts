import {COMMON, TYPOGRAPHY, type SystemCommonProps, type SystemTypographyProps} from '../constants'
import type {SxProp} from '../sx'

const COMMON_PROP_NAMES = new Set(Object.keys(COMMON))
const TYPOGRAPHY_PROP_NAMES = new Set(Object.keys(TYPOGRAPHY))

const includesSystemProps = (props: SxProp) => {
  if (props.sx) {
    return true
  }

  return Object.keys(props).some(prop => {
    return TYPOGRAPHY_PROP_NAMES.has(prop) || COMMON_PROP_NAMES.has(prop)
  })
}

type TypographyAndCommonProp = SystemTypographyProps & SystemCommonProps

const getTypographyAndCommonProps = (props: TypographyAndCommonProp): TypographyAndCommonProp => {
  let typographyAndCommonProps = {} as TypographyAndCommonProp
  for (const prop of Object.keys(props)) {
    if (TYPOGRAPHY_PROP_NAMES.has(prop) || COMMON_PROP_NAMES.has(prop)) {
      const p = prop as keyof TypographyAndCommonProp
      typographyAndCommonProps = {...typographyAndCommonProps, [p]: props[p]}
    }
  }

  return typographyAndCommonProps
}

export {includesSystemProps, getTypographyAndCommonProps}
