import {COMMON, LAYOUT, get, SystemLayoutProps, SystemCommonProps} from '../constants'
import defaultTheme from '../theme'
import sx, {SxProp} from '../sx'
import {XIcon} from '@primer/octicons-react'
import React, {forwardRef} from 'react'
import styled from 'styled-components'
import {ComponentProps} from '../utils/types'

type StyledButtonInternalProps = SystemCommonProps & SystemLayoutProps & SxProp

const StyledButton = styled.button<StyledButtonInternalProps>`
  border: none;
  padding: 0;
  background: transparent;
  outline: none;
  cursor: pointer;

  &:focus {
    box-shadow: ${get('buttons.close.shadow.focus')};
  }

  &:active {
    color: ${get('buttons.close.color.default')};
  }
  ${COMMON};
  ${LAYOUT};
  ${sx};
`

export type StyledButtonProps = ComponentProps<typeof StyledButton>

export const ButtonClose = forwardRef<HTMLButtonElement, StyledButtonProps>(({theme = defaultTheme, ...props}, ref) => {
  return (
    <StyledButton ref={ref} aria-label="Close" {...{theme, ...props}}>
      <XIcon />
    </StyledButton>
  )
})

export type ButtonCloseProps = ComponentProps<typeof ButtonClose>
