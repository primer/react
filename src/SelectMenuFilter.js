import React, {useState, useContext} from 'react'
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
  const [searchTerm, setSearchTerm] = useState('')
  const menuContext = useContext(MenuContext)
  const handleChange = e => {
    setSearchTerm(e.target.value)
  }

  React.useEffect(() => {
    const results = menuContext.results.filter(item => {
      item.toLowerCase().includes(searchTerm)
    })
    menuContext.setResults(results)
  }, [searchTerm])
  return (
    <StyledForm theme={theme}>
      <TextInput width="100%" block type="text" value={searchTerm} onChange={handleChange} {...props} />
    </StyledForm>
  )
}

SelectMenuFilter.defaultProps = {
  theme
}

export default SelectMenuFilter
