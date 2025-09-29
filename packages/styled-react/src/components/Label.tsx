import {type LabelProps as PrimerLabelProps, Label as PrimerLabel, Box} from '@primer/react'
import {type SxProp} from '../sx'
import {forwardRef} from 'react'
import type {ForwardRefComponent} from '../polymorphic'

type LabelProps = PrimerLabelProps & SxProp

const Label = forwardRef(function Label(props, ref) {
  return <Box as={PrimerLabel} ref={ref} {...props} />
}) as ForwardRefComponent<'span', LabelProps>

export {Label, type LabelProps}
