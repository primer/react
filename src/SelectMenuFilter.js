import React, {useState, useContext, useEffect} from 'react'
import styled from 'styled-components'
import {COMMON, get} from './constants'
import theme from './theme'
import TextInput from './TextInput'
import {MenuContext} from './SelectMenuModal'
import useFilter from './hooks/FilterHook'

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
  const [value, onChange] = useFilter()
  return (
    <StyledForm theme={theme}>
      <TextInput width="100%" block value={value} onChange={onChange} {...props} />
    </StyledForm>
  )
}

SelectMenuFilter.defaultProps = {
  theme
}

export default SelectMenuFilter
