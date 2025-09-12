import css from '@styled-system/css'
import type {SxProp} from '@primer/react'

export const sx = (props: SxProp) => {
  return css(props.sx)
}

export type {SxProp}
