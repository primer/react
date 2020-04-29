import React, {useRef, useContext, useEffect} from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import {COMMON, get} from '../constants'
import theme from '../theme'
import TextInput from '../TextInput'
import {MenuContext} from './SelectMenuContext'
import sx from '../sx'

const StyledForm = styled.form`
  padding: ${get('space.3')};
  margin: 0;
  border-top: ${get('borderWidths.1')} solid ${get('colors.border.gray')};
  background-color: ${get('colors.white')};
  ${COMMON};

  @media (min-width: ${get('breakpoints.0')}) {
    padding: ${get('space.2')};
  }

  ${sx};
`

function SelectMenuFilter({theme, value, sx, ...rest}) {
  const inputRef = useRef(null)
  const {open} = useContext(MenuContext)

  // puts focus on the filter input when the menu is opened
  useEffect(() => {
    if (open) {
      inputRef.current.focus()
    }
  }, [open])

  return (
    <StyledForm theme={theme} sx={sx}>
      <TextInput theme={theme} ref={inputRef} width="100%" block value={value} {...rest} />
    </StyledForm>
  )
}

SelectMenuFilter.defaultProps = {
  theme
}

SelectMenuFilter.propTypes = {
  ...COMMON.propTypes,
  ...sx.propTypes,
  value: PropTypes.string
}

SelectMenuFilter.displayName = 'SelectMenu.Filter'

export default SelectMenuFilter
