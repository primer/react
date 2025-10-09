import {Text as PrimerText, type TextProps as PrimerTextProps} from '@primer/react'
import {sx, type SxProp} from '../sx'
import styled from 'styled-components'
import type React from 'react'
import {forwardRef} from 'react'
import type {ForwardRefComponent} from '../polymorphic'

// Create a base type without generics for styled-components
type BaseTextProps = {
  size?: 'large' | 'medium' | 'small'
  weight?: 'light' | 'normal' | 'medium' | 'semibold'
  className?: string
  children?: React.ReactNode
  as?: React.ElementType
} & SxProp &
  React.HTMLAttributes<HTMLElement>

// Generic type that matches PrimerText exactly
type TextProps<As extends React.ElementType = 'span'> = PrimerTextProps<As> & SxProp

const StyledText = styled(PrimerText).withConfig({
  shouldForwardProp: prop => (prop as keyof BaseTextProps) !== 'sx',
})<BaseTextProps>`
  ${sx}
`

const Text = forwardRef<HTMLElement, BaseTextProps>(({as, ...props}, ref) => {
  return <StyledText {...props} {...(as ? {forwardedAs: as} : {})} ref={ref} />
}) as ForwardRefComponent<'span', BaseTextProps>

export {Text, type TextProps}
