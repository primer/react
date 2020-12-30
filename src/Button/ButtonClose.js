import {COMMON, LAYOUT} from '../constants'
import theme from '../theme'
import sx from '../sx'
import {XIcon} from '@primer/octicons-react'
import React, {forwardRef} from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const StyledButton = styled.button`
  border: none;
  padding: 0;
  background: transparent;
  outline: none;
  cursor: pointer;

  &:focus {
    box-shadow: 0 0 0 3px rgba(139, 148, 158, 0.3);
  }
  ${COMMON};
  ${LAYOUT};
  ${sx};
`

const ButtonClose = forwardRef((props, ref) => {
  return (
    <StyledButton ref={ref} aria-label="Close" {...props}>
      <XIcon />
    </StyledButton>
  )
})

ButtonClose.defaultProps = {
  theme,
}

ButtonClose.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  ...COMMON.propTypes,
  ...LAYOUT.propTypes,
  ...sx.propTypes,
}

export default ButtonClose
