import {COMMON, LAYOUT, get, SystemLayoutProps, SystemCommonProps} from '../constants'
import defaultTheme from '../theme'
import sx, {SxProp} from '../sx'
import {XIcon} from '@primer/octicons-react'
import PropTypes from 'prop-types'
import React, {forwardRef} from 'react'
import styled from 'styled-components'
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

const ButtonClose = forwardRef<HTMLButtonElement, ComponentProps<typeof StyledButton>>(
  ({theme = defaultTheme, ...props}, ref) => {
    return (
      <StyledButton ref={ref} aria-label="Close" {...{theme, ...props}}>
        <XIcon />
      </StyledButton>
    )
  }
)

ButtonClose.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  ...COMMON.propTypes,
  ...LAYOUT.propTypes,
  ...sx.propTypes
}

export type ButtonCloseProps = ComponentProps<typeof ButtonClose>
export default ButtonClose
