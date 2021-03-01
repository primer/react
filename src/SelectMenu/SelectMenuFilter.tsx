import React, {forwardRef, useContext, useEffect, useRef} from 'react'
import styled from 'styled-components'
import {COMMON, get, SystemCommonProps} from '../constants'
import sx, {SxProp} from '../sx'
import TextInput, {TextInputProps} from '../TextInput'
import theme from '../theme'
import {ComponentProps} from '../utils/types'
import {MenuContext} from './SelectMenuContext'

const StyledForm = styled.form<SystemCommonProps & SxProp>`
  padding: ${get('space.3')};
  margin: 0;
  border-top: ${get('borderWidths.1')} solid ${get('colors.border.secondary')};
  background-color: ${get('colors.bg.canvas')};
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
SelectMenuFilter.displayName = 'SelectMenu.Filter'

export type SelectMenuFilterProps = ComponentProps<typeof SelectMenuFilter>
export default SelectMenuFilter
