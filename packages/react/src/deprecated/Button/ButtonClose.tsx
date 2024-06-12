import {XIcon} from '@primer/octicons-react'
import React, {forwardRef} from 'react'
import styled from 'styled-components'
import {get} from '../../constants'
import type {SxProp} from '../../sx'
import sx from '../../sx'
import type {ComponentProps} from '../../utils/types'

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

const ButtonClose = forwardRef<
  HTMLButtonElement,
  // Include {theme?: any} in the intersection as it mirrors the generated type
  // from styled-components
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  React.ButtonHTMLAttributes<HTMLButtonElement> & {theme?: any} & SxProp
>((props, ref) => {
  return (
    <StyledButton ref={ref} aria-label="Close" {...props}>
      <XIcon />
    </StyledButton>
  )
})

export type ButtonCloseProps = ComponentProps<typeof ButtonClose>
export default ButtonClose
