import {type LabelProps as PrimerLabelProps, Label as PrimerLabel} from '@primer/react'
import {sx, type SxProp} from '../sx'
import {forwardRef} from 'react'
import type {ForwardRefComponent} from '../polymorphic'
import styled from 'styled-components'

type LabelProps = PrimerLabelProps & SxProp & {as?: React.ElementType}

const StyledLabel: ForwardRefComponent<'span', LabelProps> = styled(PrimerLabel).withConfig({
  shouldForwardProp: prop => (prop as keyof LabelProps) !== 'sx',
})<LabelProps>`
  ${sx}
`

const Label = forwardRef<HTMLElement, LabelProps>(({as, ...props}, ref) => {
  return <StyledLabel {...props} {...(as ? {forwardedAs: as} : {})} ref={ref} />
}) as ForwardRefComponent<'span', LabelProps>

// @ts-ignore -- TS doesn't know about the __SLOT__ property
Label.__SLOT__ = PrimerLabel.__SLOT__

export {Label, type LabelProps}
