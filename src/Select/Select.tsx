import React from 'react'
import styled from 'styled-components'
import TextInputWrapper, {StyledWrapperProps} from '../internal/components/TextInputWrapper'

export type SelectProps = Omit<
  Omit<React.ComponentPropsWithoutRef<'select'>, 'size'> & Omit<StyledWrapperProps, 'variant'>,
  'multiple' | 'hasLeadingVisual' | 'hasTrailingVisual' | 'as'
>

const arrowRightOffset = '4px'

const StyledSelect = styled.select`
  appearance: none;
  border-radius: inherit;
  border: 0;
  color: currentColor;
  font-size: inherit;
  outline: none;
  width: 100%;

  /* Firefox hacks: */
  /* 1. Makes Firefox's native dropdown menu's background match the theme.

        background-color should be 'transparent', but Firefox uses the background-color on
        <select> to determine the background color used for the dropdown menu.

     2. Adds 1px margins to the <select> so the background color doesn't hide the focus outline created with an inset box-shadow.
  */
  background-color: inherit;
  margin-top: 1px;
  margin-left: 1px;
  margin-bottom: 1px;

  /* 2. Prevents visible overlap of partially transparent background colors.

     'colors.input.disabledBg' happens to be partially transparent in light mode, so we use a
     transparent background-color on a disabled <select>. */
  &:disabled {
    background-color: transparent;
  }

  /* 3. Maintain dark bg color in Firefox on Windows high-contrast mode

     Firefox makes the <select>'s background color white when setting 'background-color: transparent;' */
  @media screen and (forced-colors: active) {
    &:disabled {
      background-color: -moz-combobox;
    }
  }
`

const ArrowIndicatorSVG: React.FC<React.PropsWithChildren<{className?: string}>> = ({className}) => (
  <svg width="16" height="16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="m4.074 9.427 3.396 3.396a.25.25 0 0 0 .354 0l3.396-3.396A.25.25 0 0 0 11.043 9H4.251a.25.25 0 0 0-.177.427ZM4.074 7.47 7.47 4.073a.25.25 0 0 1 .354 0L11.22 7.47a.25.25 0 0 1-.177.426H4.251a.25.25 0 0 1-.177-.426Z" />
  </svg>
)

const ArrowIndicator = styled(ArrowIndicatorSVG)`
  pointer-events: none;
  position: absolute;
  right: ${arrowRightOffset};
  top: 50%;
  transform: translateY(-50%);
`

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({block, children, contrast, disabled, placeholder, size, required, validationStatus, ...rest}: SelectProps, ref) => (
    <TextInputWrapper
      sx={{
        overflow: 'hidden',
        position: 'relative',
        '@media screen and (forced-colors: active)': {
          svg: {
            fill: disabled ? 'GrayText' : 'FieldText',
          },
        },
      }}
      block={block}
      contrast={contrast}
      disabled={disabled}
      size={size}
      validationStatus={validationStatus}
    >
      <StyledSelect
        ref={ref}
        required={required}
        disabled={disabled}
        aria-invalid={validationStatus === 'error' ? 'true' : 'false'}
        data-hasplaceholder={Boolean(placeholder)}
        defaultValue={placeholder ?? undefined}
        {...rest}
      >
        {placeholder && (
          <option value="" disabled={required} hidden={required}>
            {placeholder}
          </option>
        )}
        {children}
      </StyledSelect>
      <ArrowIndicator />
    </TextInputWrapper>
  ),
)

const Option: React.FC<React.PropsWithChildren<React.HTMLProps<HTMLOptionElement> & {value: string}>> = props => (
  <option {...props} />
)

const OptGroup: React.FC<React.PropsWithChildren<React.HTMLProps<HTMLOptGroupElement>>> = props => (
  <optgroup {...props} />
)

export default Object.assign(Select, {
  Option,
  OptGroup,
})
