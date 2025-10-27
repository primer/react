/* eslint-disable primer-react/spread-props-first */
import {StateLabel as PrimerStateLabel, type StateLabelProps as PrimerStateLabelProps} from '@primer/react'
import {forwardRef} from 'react'
import {Box} from './Box'
import type {SxProp} from '../sx'

type StateLabelProps = PrimerStateLabelProps & SxProp

const StateLabel = forwardRef<HTMLSpanElement, StateLabelProps>(function StateLabel(props, ref) {
  return <Box as={PrimerStateLabel} ref={ref} {...props} />
})

export {StateLabel, type StateLabelProps}
