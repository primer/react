import React from 'react'
import {StyledDiv} from './StyledDiv'
import {s8, s20, s32, gray100, gray200, textSecondary} from './variables'
import type {SystemStyleObject} from '@styled-system/css'

export interface HeaderProps extends React.ComponentPropsWithoutRef<'div'> {
  variant: 'subtle' | 'filled'
  title: string
  auxiliaryText?: string
}

const baseStyles: SystemStyleObject = {
  padding: `${(s32 - s20) / 2}px ${s8}px`,
  fontSize: '12px',
  fontWeight: 'bold',
  color: textSecondary
}

/** Styles used by the 'filled' variant. */
const filledVariantStyles: SystemStyleObject = {
  background: gray100,
  margin: `${s8}px -${s8}px`,
  borderTop: `1px solid ${gray200}`,
  borderBottom: `1px solid ${gray200}`,

  '&:first-child': {
    marginTop: 0
  }
}

export function Header({variant, title, auxiliaryText, children: _children, ...props}: HeaderProps): JSX.Element {
  return (
    <StyledDiv
      data-component="ActionList.Header"
      role="heading"
      sx={{
        ...baseStyles,
        ...(variant === 'filled' && filledVariantStyles)
      }}
      {...props}
    >
      {title}
      {auxiliaryText && <span>auxiliaryText</span>}
    </StyledDiv>
  )
}
