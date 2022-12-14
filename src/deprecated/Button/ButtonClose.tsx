import {XIcon} from '@primer/octicons-react'
import React, {ComponentPropsWithRef} from 'react'
import styled from 'styled-components'
import {get} from '../../constants'
import sx, {SxProp} from '../../sx'

const ButtonClose = styled.button.attrs(props => {
  return {
    children: <XIcon />,
    'aria-label': props['aria-label'] ?? 'Close',
  }
})<SxProp & {children: never}>`
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

export type ButtonCloseProps = ComponentPropsWithRef<typeof ButtonClose>

export default ButtonClose
