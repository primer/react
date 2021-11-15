import styled, {css} from 'styled-components'
import React, {InputHTMLAttributes, HTMLAttributes, ReactElement, useEffect, useRef} from 'react'
import {Text, TextProps} from './'
import sx, {BetterSystemStyleObject as SxProps} from './sx'
import {IconProps, CheckIcon, DashIcon} from '@primer/octicons-react'
import {COMMON, get} from './constants'

export type Checkbox = {
  /**
   * Checkbox is checked
   */
  checked?: boolean

  /**
   * Optional callback for when the checkbox is clicked
   */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  /**
   * An adjacent label for the checkbox
   */
  label?: string

  /**
   * Apply disabled state for the checkbox
   */
  disabled?: boolean

  /**
   * Force container to take up full width of parent
   */
  block?: boolean
  /**
   * Apply indeterminate state for the checkbox
   */
  indeterminate?: boolean

  /**
   * Custom styling
   */
  sx?: SxProps
} & Pick<InputHTMLAttributes<HTMLInputElement>, 'disabled' | 'id' | 'name'>

type CheckboxIcon = {
  checked?: boolean
  disabled?: boolean
} & IconProps

type Label = {
  checked?: boolean
  disabled?: boolean
} & TextProps

type Container = {
  block?: boolean
  labelText?: string
  sx?: SxProps
} & HTMLAttributes<HTMLDivElement>

const StyledComponentContainer = styled.div<Container>`
  display: inline-block;
  align-items: center;

  ${props =>
    props.labelText &&
    css`
      display: inline-flex;
      margin-right: ${get('space.3')};
    `}

  ${props =>
    props.block &&
    css`
      display: flex;

      &:only-of-type {
        margin-bottom: ${get('space.1')};
      }
    `}

  ${COMMON}
  ${sx}
`

const ScreenReaderCheckbox = styled.input.attrs({type: 'checkbox'})`
  position: absolute;
  clip: rect(1px, 1px, 1px, 1px);
  padding: 0;
  border: 0;
  height: 1px;
  width: 1px;
  overflow: hidden;
`

const StyledCheckbox = styled.label<Checkbox>`
  height: 20px;
  width: 20px;
  background: ${get('colors.canvas.subtle')};
  display: block;
  border: 2px solid ${get('colors.border.default')};
  border-radius: 4px;
  cursor: pointer;
  user-select: none;

  &:focus-within {
    border-color: ${get('colors.accent.emphasis')};
    outline: 3px solid ${get('colors.accent.muted')};
  }

  &:only-of-type {
    margin-right: ${get('space.1')};
  }

  ${props =>
    props.checked &&
    css`
      background-color: ${get('colors.accent.fg')};
      border-color: ${get('colors.accent.emphasis')};
    `}

  ${props =>
    props.disabled &&
    css`
      cursor: not-allowed;
      background-color: ${get('colors.border.muted')}; // FIXME: use disabled color
      border-color: ${get('colors.border.muted')};
    `}
`

const StyledCheckIcon = styled(CheckIcon)<CheckboxIcon>`
  fill: ${get('colors.fg.onEmphasis')};
  display: block !important;
  pointer-events: none;

  ${props =>
    props.disabled &&
    css`
      fill: ${get('colors.neutral.emphasis')};
    `}
`

const StyledDashIcon = styled(DashIcon)<CheckboxIcon>`
  fill: ${get('colors.fg.onEmphasis')};
  display: block !important;
  pointer-events: none;

  ${props =>
    props.disabled &&
    css`
      fill: ${get('colors.neutral.emphasis')};
    `}
`

const StyledLabel = styled(Text)<Label>`
  font-weight: bold;
  padding-left: ${get('space.2')};
  font-size: ${get('fontSizes.1')};
  cursor: pointer;
  color: ${get('colors.fg.default')};
  user-select: none;

  ${props =>
    props.disabled &&
    css`
      color: ${get('colors.fg.subtle')};
      cursor: not-allowed;
    `}
`

export function Checkbox({
  id = (Math.random() + 1).toString(36).substring(7),
  name,
  checked = false,
  indeterminate = false,
  disabled,
  onChange,
  label,
  block
}: Checkbox): ReactElement {
  const [checkedState, setCheckedState] = React.useState(checked)
  const checkboxRef = useRef<HTMLInputElement>(null)

  const inputElement = checkboxRef.current

  const labelValue = label && label.length > 0 ? label : undefined

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (!checked && !onChange) {
      return setCheckedState(false)
    }

    if (!indeterminate) {
      setCheckedState(event.target.checked)
      if (onChange) onChange(event)
    }
  }

  useEffect(() => {
    if (inputElement) {
      inputElement.indeterminate = indeterminate
    }

    if (indeterminate) {
      setCheckedState(false)
    }
  }, [indeterminate, checkedState, inputElement])

  return (
    <StyledComponentContainer block={block} labelText={labelValue} sx={sx}>
      <StyledCheckbox checked={indeterminate || checkedState} disabled={disabled}>
        <ScreenReaderCheckbox
          ref={checkboxRef}
          id={id}
          name={name}
          checked={checkedState}
          type="checkbox"
          disabled={disabled}
          onChange={handleChange}
          aria-checked={indeterminate ? 'mixed' : checkedState}
        />
        {indeterminate && <StyledDashIcon disabled={disabled} />}
        {checkedState && !indeterminate && <StyledCheckIcon disabled={disabled} />}
      </StyledCheckbox>
      {label && (
        <StyledLabel id={`${id}-text-label`} as="label" htmlFor={id} disabled={disabled}>
          {label}
        </StyledLabel>
      )}
    </StyledComponentContainer>
  )
}
