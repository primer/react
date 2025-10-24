import {StateLabel as PrimerStateLabel, type StateLabelProps as PrimerStateLabelProps} from '@primer/react'
import {forwardRef} from 'react'
import {Box} from './Box'
import type {SxProp} from '../sx'

type StateLabelProps = PrimerStateLabelProps & SxProp

const StateLabel = forwardRef<HTMLSpanElement, StateLabelProps>(function StateLabel(props, ref) {
  return <Box {...props} as={PrimerStateLabel} ref={ref} />
})

export {StateLabel, type StateLabelProps}
