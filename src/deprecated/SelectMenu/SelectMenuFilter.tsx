import React, {forwardRef, useContext, useEffect, useRef} from 'react'
import styled from 'styled-components'
import {get} from '../../constants'
import sx, {SxProp} from '../../sx'
import TextInput, {TextInputProps} from '../../TextInput'
import {ComponentProps} from '../../utils/types'
import {MenuContext} from './SelectMenuContext'

const StyledForm = styled.form<SxProp>`
  padding: ${get('space.3')};
  margin: 0;
  border-bottom: ${get('borderWidths.1')} solid ${get('colors.border.muted')};
  background-color: ${get('colors.canvas.overlay')};

  @media (min-width: ${get('breakpoints.0')}) {
    padding: ${get('space.2')};
  }

  ${sx};
`

type SelectMenuFilterInternalProps = {
  value?: string
} & TextInputProps

const SelectMenuFilter = forwardRef<HTMLInputElement, SelectMenuFilterInternalProps>(
  ({theme, value, sx: sxProp, ...rest}, forwardedRef) => {
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
      <StyledForm theme={theme} sx={sxProp}>
        <TextInput theme={theme} ref={ref} width="100%" block value={value} contrast {...rest} />
      </StyledForm>
    )
  }
)

SelectMenuFilter.displayName = 'SelectMenu.Filter'

export type SelectMenuFilterProps = ComponentProps<typeof SelectMenuFilter>
export default SelectMenuFilter
