import {XIcon} from '@primer/octicons-react'
import React, {forwardRef} from 'react'
import styled from 'styled-components'
import {get} from '../../constants'
import sx, {SxProp} from '../../sx'
import {ComponentProps} from '../../utils/types'

const StyledButton = styled.button<SxProp>`
  border: none;
  padding: 0;
  background: transparent;
  cursor: pointer;
  border-radius: ${get('radii.2')};
  color: ${get('colors.fg.muted')};

  &:focus {
    outline: solid 2px ${get('colors.accent.fg')};
  }

  &:hover {
    color: ${get('colors.accent.fg')};
  }
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
