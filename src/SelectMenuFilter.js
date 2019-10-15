import React from 'react'
import styled from 'styled-components'
import {COMMON, get} from './constants'
import theme from './theme'
import TextInput from './TextInput'

const StyledForm = styled.form`
  padding: ${get('space.3')}px;
  margin: 0;
  border-top: ${get('borders.1')} ${get('colors.borders.gray')};
  ${COMMON}

  @media (min-width: ${get('breakpoints.0')}) {
    padding: ${get('space.2')}px;
  }
`

const SelectMenuFilter = (props) => {
  return (
    <StyledForm>
      <TextInput width="100%" block type="text" {...props}/> 
    </StyledForm>
  )
}

SelectMenuFilter.defaultProps = {
  theme
}

export default SelectMenuFilter