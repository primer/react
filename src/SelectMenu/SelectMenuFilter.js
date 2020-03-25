import React, {useRef, useContext, useEffect} from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import {COMMON, get} from '../constants'
import theme from '../theme'
import TextInput from '../TextInput'
import {MenuContext} from './SelectMenuContext'

const StyledForm = styled.form`
  padding: ${get('space.3')};
  margin: 0;
  border-top: ${get('borders.1')} ${get('colors.border.gray')};
  background-color: ${get('colors.white')};
  ${COMMON}

  @media (min-width: ${get('breakpoints.0')}) {
    padding: ${get('space.2')};
  }
`

function SelectMenuFilter(props) {
  const inputRef = useRef(null)
  const {open} = useContext(MenuContext)

  useEffect(() => {
    if (open) {
      inputRef.current.focus()
    }
  }, [open])
  return (
    <StyledForm theme={theme}>
      <TextInput ref={inputRef} width="100%" block value={props.value} onChange={onChange} {...props} />
    </StyledForm>
  )
}

SelectMenuFilter.defaultProps = {
  theme
}

SelectMenuFilter.propTypes = {
  ...COMMON.propTypes,
  value: PropTypes.string
}

export default SelectMenuFilter
