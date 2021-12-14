import React, {RefObject} from 'react'
import styled from 'styled-components'
import {get} from './constants'
import TextInputWrapper, {StyledWrapperProps} from './_TextInputWrapper'

type SelectProps = Omit<React.HTMLProps<HTMLSelectElement> & StyledWrapperProps, 'multiple' | 'size' | 'hasIcon' | 'as'>

const StyledSelect = styled(TextInputWrapper)<SelectProps>`
  appearance: none;
  background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0iIzU4NjA2OSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNC40MjcgOS40MjdsMy4zOTYgMy4zOTZhLjI1MS4yNTEgMCAwMC4zNTQgMGwzLjM5Ni0zLjM5NkEuMjUuMjUgMCAwMDExLjM5NiA5SDQuNjA0YS4yNS4yNSAwIDAwLS4xNzcuNDI3ek00LjQyMyA2LjQ3TDcuODIgMy4wNzJhLjI1LjI1IDAgMDEuMzU0IDBMMTEuNTcgNi40N2EuMjUuMjUgMCAwMS0uMTc3LjQyN0g0LjZhLjI1LjI1IDAgMDEtLjE3Ny0uNDI3eiIgLz48L3N2Zz4=);
  background-repeat: no-repeat;
  background-position: right 4px center;
  background-size: 16px;
  padding-right: 20px;
  cursor: pointer;

  /* colors the select input's placeholder text */
  &:invalid {
    color: ${get('colors.fg.subtle')};
  }

  /* For Firefox: reverts color of non-placeholder options in the dropdown */
  &:invalid option:not(:first-child) {
    color: ${get('colors.fg.default')};
  }
`

const Select: React.FC<SelectProps> = ({ref, children, disabled, placeholder, required, ...rest}) => (
  <StyledSelect
    as="select"
    ref={ref as RefObject<HTMLSelectElement>}
    required={required || Boolean(placeholder)}
    disabled={disabled}
    aria-required={required}
    aria-disabled={disabled}
    {...rest}
  >
    {placeholder ? (
      <option value="" disabled={required} selected hidden={required}>
        {placeholder}
      </option>
    ) : null}
    {children}
  </StyledSelect>
)

const Option: React.FC<React.HTMLProps<HTMLOptionElement> & {value: string}> = props => <option {...props} />

const Group: React.FC<React.HTMLProps<HTMLOptGroupElement>> = props => <optgroup {...props} />

export default Object.assign(Select, {
  Option,
  Group
})
