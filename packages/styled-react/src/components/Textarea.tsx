import {Textarea as PrimerTextarea, type TextareaProps as PrimerTextareaProps} from '@primer/react'
import styled from 'styled-components'
import {sx, type SxProp} from '../sx'
import type {ForwardRefComponent} from '../polymorphic'
import {forwardRef} from 'react'

type TextareaProps = PrimerTextareaProps & SxProp & {as?: React.ElementType}

const StyledTextarea = styled(PrimerTextarea).withConfig<TextareaProps>({
  shouldForwardProp: prop => prop !== 'sx',
})`
  ${sx}
` as ForwardRefComponent<'textarea', TextareaProps>

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({as, ...props}, ref) => {
  return <StyledTextarea {...props} {...(as ? {forwardedAs: as} : {})} ref={ref} />
}) as ForwardRefComponent<'textarea', TextareaProps>

export {Textarea, type TextareaProps}
