import {XIcon} from '@primer/octicons-react'
import React, {forwardRef} from 'react'
import styled from 'styled-components'
import {COMMON, get, LAYOUT, SystemCommonProps, SystemLayoutProps} from '../constants'
import sx, {SxProp} from '../sx'
import {ComponentProps} from '../utils/types'

type StyledButtonProps = SystemCommonProps & SystemLayoutProps & SxProp

const StyledButton = styled.button<StyledButtonProps>`
  border: none;
  padding: 0;
  background: transparent;
  outline: none;
  cursor: pointer;
  border-radius: ${get('radii.2')};

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

const ButtonClose = forwardRef<HTMLButtonElement, ComponentProps<typeof StyledButton>>((props, ref) => {
  return (
    <StyledButton ref={ref} aria-label="Close" {...props}>
      <XIcon />
    </StyledButton>
  )
})

export type ButtonCloseProps = ComponentProps<typeof ButtonClose>
export default ButtonClose
