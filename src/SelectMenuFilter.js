import React, {useState, useContext, useEffect} from 'react'
import styled from 'styled-components'
import {COMMON, get} from './constants'
import theme from './theme'
import TextInput from './TextInput'
import {MenuContext} from './SelectMenuModal'

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
  const {setFilterText} = useContext(MenuContext)
  const [value, setValue] = useState(undefined)
  const onChange = ev => {
    setValue(ev.target.value)
  }
  useEffect(() => {
    setFilterText(value)
  }, [value])
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
