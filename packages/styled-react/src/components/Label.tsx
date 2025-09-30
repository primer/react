import {type LabelProps as PrimerLabelProps, Label as PrimerLabel, Box} from '@primer/react'
import {type SxProp} from '../sx'
import {forwardRef} from 'react'
import type {ForwardRefComponent} from '../polymorphic'

type LabelProps = PrimerLabelProps & SxProp & {as?: React.ElementType}

const StyledLabel = forwardRef(function Label(props, ref) {
  return <Box as={PrimerLabel} ref={ref} {...props} />
}) as ForwardRefComponent<'span', LabelProps>

const Label = (({as, ...props}: LabelProps) => {
  return <StyledLabel {...props} {...(as ? {forwardedAs: as} : {})} />
}) as ForwardRefComponent<'span', LabelProps>

export {Label, type LabelProps}
