import {get, COMMON, LAYOUT} from '../constants'
import theme from '../theme'
import {XIcon} from '@primer/octicons-react'
import React from 'react'
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
`

const ButtonClose = (props) => (
  <StyledButton aria-label="Close" {...props}>
    <XIcon />
  </StyledButton>
)

ButtonClose.defaultProps = {
  theme,
}

ButtonClose.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  ...COMMON.propTypes,
  ...LAYOUT.propTypes,
}

export default ButtonClose
