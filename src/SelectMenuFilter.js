import React from 'react'
import styled from 'styled-components'
import {COMMON, get} from './constants'
import theme from './theme'
import TextInput from './TextInput'

const StyledForm = styled.form`
  padding: ${get('space.3')};
  margin: 0;
  border-top: ${get('borders.1')} ${get('colors.borders.gray')};
  ${COMMON}

  @media (min-width: ${get('breakpoints.0')}) {
    padding: ${get('space.2')};
  }
`

const SelectMenuFilter = props => {
  return (
    <StyledForm theme={theme}>
      <TextInput width="100%" block {...props} />
    </StyledForm>
  )
}

SelectMenuFilter.defaultProps = {
  theme
}

export default SelectMenuFilter
