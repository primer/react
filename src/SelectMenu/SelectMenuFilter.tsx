import React, {useRef, useContext, forwardRef, useEffect} from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import {COMMON, get, SystemCommonProps} from '../constants'
import theme from '../theme'
import TextInput, {TextInputProps} from '../TextInput'
import {MenuContext} from './SelectMenuContext'
import sx, {SxProp} from '../sx'
import {ComponentProps} from '../utils/types'

const StyledForm = styled.form<SystemCommonProps & SxProp>`
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

type SelectMenuFilterInternalProps = {
  value?: string
} & TextInputProps

const SelectMenuFilter = forwardRef<HTMLInputElement, SelectMenuFilterInternalProps>(
  ({theme, value, sx, ...rest}, forwardedRef) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const ref = forwardedRef ?? inputRef
    const {open} = useContext(MenuContext)

    // puts focus on the filter input when the menu is opened
    useEffect(() => {
      if (open) {
        inputRef.current?.focus()
      }
    }, [open])

    return (
      <StyledForm theme={theme} sx={sx}>
        <TextInput theme={theme} ref={ref} width="100%" block value={value} {...rest} />
      </StyledForm>
    )
  }
)

SelectMenuFilter.defaultProps = {
  theme
}

SelectMenuFilter.propTypes = {
  ...COMMON.propTypes,
  ...sx.propTypes,
  value: PropTypes.string
}

SelectMenuFilter.displayName = 'SelectMenu.Filter'

export type SelectMenuFilterProps = ComponentProps<typeof SelectMenuFilter>
export default SelectMenuFilter
