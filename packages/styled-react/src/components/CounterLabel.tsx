/* eslint-disable primer-react/spread-props-first */
import {CounterLabel as PrimerCounterLabel, type CounterLabelProps as PrimerCounterLabelProps} from '@primer/react'
import {Box} from './Box'
import {forwardRef} from 'react'
import {type SxProp} from '../sx'

export type CounterLabelProps = PrimerCounterLabelProps & SxProp

export const CounterLabel = forwardRef<HTMLSpanElement, CounterLabelProps>(function CounterLabel(props, ref) {
  return <Box as={PrimerCounterLabel} ref={ref} {...props} />
})
