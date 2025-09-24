import {StateLabel as PrimerStateLabel, type StateLabelProps as PrimerStateLabelProps} from '@primer/react'
import {Box} from './Box'
import {forwardRef} from 'react'
import {type SxProp} from '../sx'

export type StateLabelProps = PrimerStateLabelProps & SxProp

export const StateLabel = forwardRef<HTMLSpanElement, StateLabelProps>(function StateLabel(props, ref) {
  return <Box as={PrimerStateLabel} ref={ref} {...props} />
})
