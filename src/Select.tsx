import React from 'react'
import styled from 'styled-components'
import {get} from './constants'
import TextInputWrapper, {StyledWrapperProps} from './_TextInputWrapper'

type SelectProps = Omit<
  Omit<React.HTMLProps<HTMLSelectElement>, 'size'> & StyledWrapperProps,
  'multiple' | 'hasLeadingVisual' | 'hasTrailingVisual' | 'as'
>

const StyledSelect = styled.select`
  appearance: none;
  background-color: transparent;
  border: 0;
  color: currentColor;
  outline: none;
  width: 100%;

  /* colors the select input's placeholder text */
  &:invalid {
    color: ${get('colors.fg.subtle')};
  }

  /* For Firefox: reverts color of non-placeholder options in the dropdown */
  &:invalid option:not(:first-child) {
    color: ${get('colors.fg.default')};
  }
`

const ArrowIndicatorSVG: React.FC<{className?: string}> = ({className}) => (
  <svg width="16" height="16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="m4.074 9.427 3.396 3.396a.25.25 0 0 0 .354 0l3.396-3.396A.25.25 0 0 0 11.043 9H4.251a.25.25 0 0 0-.177.427ZM4.074 7.47 7.47 4.073a.25.25 0 0 1 .354 0L11.22 7.47a.25.25 0 0 1-.177.426H4.251a.25.25 0 0 1-.177-.426Z" />
  </svg>
)

const ArrowIndicator = styled(ArrowIndicatorSVG)`
  pointer-events: none;
  position: absolute;
  right: 4px;
  top: 50%;
  transform: translateY(-50%);
`

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({children, disabled, placeholder, size, required, ref: _propsRef, ...rest}: SelectProps, ref) => (
    <TextInputWrapper
      sx={{
        position: 'relative'
      }}
      size={size}
    >
      <StyledSelect
        ref={ref}
        required={required || Boolean(placeholder)}
        disabled={disabled}
        aria-required={required}
        aria-disabled={disabled}
        {...rest}
      >
        {placeholder && (
          <option value="" disabled={required} selected hidden={required}>
            {placeholder}
          </option>
        )}
        {children}
      </StyledSelect>
      <ArrowIndicator />
    </TextInputWrapper>
  )
)

const Option: React.FC<React.HTMLProps<HTMLOptionElement> & {value: string}> = props => <option {...props} />

const OptGroup: React.FC<React.HTMLProps<HTMLOptGroupElement>> = props => <optgroup {...props} />

export default Object.assign(Select, {
  Option,
  OptGroup
})
