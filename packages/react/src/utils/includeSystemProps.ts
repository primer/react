import {COMMON, TYPOGRAPHY} from '../constants'
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

export {includesSystemProps}
