import {Select as PrimerSelect, type SelectProps as PrimerSelectProps} from '@primer/react'
import {sx, type SxProp} from '../sx'
import type {ForwardRefComponent} from '../polymorphic'
import styled from 'styled-components'

type SelectProps = PrimerSelectProps & SxProp & {as?: React.ElementType}

const StyledSelect: ForwardRefComponent<'select', SelectProps> = styled(PrimerSelect).withConfig({
  shouldForwardProp: prop => (prop as keyof SelectProps) !== 'sx',
})<SelectProps>`
  ${sx}
`
const Select = ({as, ...props}: SelectProps) => {
  return <StyledSelect {...props} {...(as ? {forwardedAs: as as React.ElementType} : {})} />
}

export {Select, type SelectProps}
