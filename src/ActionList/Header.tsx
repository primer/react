import React from 'react'
import {s8, s20, s32, gray100, gray200, textSecondary} from './private/variables'
import styled from 'styled-components'

export interface HeaderProps extends React.ComponentPropsWithoutRef<'div'> {
  variant: 'subtle' | 'filled'
  title: string
  auxiliaryText?: string
}

const StyledHeader = styled.div<{variant: HeaderProps['variant']}>`
  padding: ${(s32 - s20) / 2}px ${s8}px;
  font-size: 12px;
  font-weight: bold;
  color: ${textSecondary};

  ${({variant}) =>
    variant === 'filled' &&
    `
    background: ${gray100};
    margin: ${s8}px -${s8}px;
    border-top: 1px solid ${gray200};
    border-bottom: 1px solid ${gray200};
  
    &:first-child {
      margin-top: 0;
    }
  `}
`

export function Header({variant, title, auxiliaryText, children: _children, ...props}: HeaderProps): JSX.Element {
  return (
    <StyledHeader data-component="ActionList.Header" role="heading" variant={variant} {...props}>
      {title}
      {auxiliaryText && <span>auxiliaryText</span>}
    </StyledHeader>
  )
}
