import {clsx} from 'clsx'
import styled from 'styled-components'
import {useProvidedRefOrCreate} from '../hooks'
import React, {useContext, useEffect, type ChangeEventHandler, type InputHTMLAttributes, type ReactElement} from 'react'
import sx, {type SxProp} from '../sx'
import useLayoutEffect from '../utils/useIsomorphicLayoutEffect'
import type {FormValidationStatus} from '../utils/types/FormValidationStatus'
import {CheckboxGroupContext} from '../CheckboxGroup/CheckboxGroupContext'
import getGlobalFocusStyles from '../internal/utils/getGlobalFocusStyles'
import {get} from '../constants'
import {sharedCheckboxAndRadioStyles} from '../internal/utils/sharedCheckboxAndRadioStyles'
import classes from './Checkbox.module.css'
import sharedClasses from './shared.module.css'
import {useFeatureFlag} from '../FeatureFlags'
import Box from '../Box'

export type CheckboxProps = {
  /**
   * Apply indeterminate visual appearance to the checkbox
   */
  indeterminate?: boolean
  /**
   * Apply inactive visual appearance to the checkbox
   */
  disabled?: boolean
  /**
   * Forward a ref to the underlying input element
   */
  ref?: React.RefObject<HTMLInputElement>
  /**
   * Indicates whether the checkbox must be checked
   */
  required?: boolean
  /**
   * Only used to inform ARIA attributes. Individual checkboxes do not have validation styles.
   */
  validationStatus?: FormValidationStatus
  /**
   * A unique value that is never shown to the user.
   * Used during form submission and to identify which checkbox inputs are selected
   */
  value?: string
} & Exclude<InputHTMLAttributes<HTMLInputElement>, 'value'> &
  SxProp

const StyledCheckbox = styled.input`
  ${sharedCheckboxAndRadioStyles};
  border-radius: ${get('radii.1')};
  transition:
    background-color,
    border-color 80ms cubic-bezier(0.33, 1, 0.68, 1); /* checked -> unchecked - add 120ms delay to fully see animation-out */

  &::before {
    width: var(--base-size-16, 16px);
    height: var(--base-size-16, 16px);
    visibility: hidden;
    content: '';
    background-color: ${get('colors.fg.onEmphasis')};
    transition: visibility 0s linear 230ms;
    clip-path: inset(var(--base-size-16, 16px) 0 0 0);
    mask-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOSIgdmlld0JveD0iMCAwIDEyIDkiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTEuNzgwMyAwLjIxOTYyNUMxMS45MjEgMC4zNjA0MjcgMTIgMC41NTEzMDUgMTIgMC43NTAzMTNDMTIgMC45NDkzMjEgMTEuOTIxIDEuMTQwMTkgMTEuNzgwMyAxLjI4MUw0LjUxODYgOC41NDA0MkM0LjM3Nzc1IDguNjgxIDQuMTg2ODIgOC43NiAzLjk4Nzc0IDguNzZDMy43ODg2NyA4Ljc2IDMuNTk3NzMgOC42ODEgMy40NTY4OSA4LjU0MDQyTDAuMjAxNjIyIDUuMjg2MkMwLjA2ODkyNzcgNS4xNDM4MyAtMC4wMDMzMDkwNSA0Ljk1NTU1IDAuMDAwMTE2NDkzIDQuNzYwOThDMC4wMDM1NTIwNSA0LjU2NjQzIDAuMDgyMzg5NCA0LjM4MDgxIDAuMjIwMDMyIDQuMjQzMjFDMC4zNTc2NjUgNC4xMDU2MiAwLjU0MzM1NSA0LjAyNjgxIDAuNzM3OTcgNC4wMjMzOEMwLjkzMjU4NCA0LjAxOTk0IDEuMTIwOTMgNC4wOTIxNyAxLjI2MzM0IDQuMjI0ODJMMy45ODc3NCA2Ljk0ODM1TDEwLjcxODYgMC4yMTk2MjVDMTAuODU5NSAwLjA3ODk5MjMgMTEuMDUwNCAwIDExLjI0OTUgMEMxMS40NDg1IDAgMTEuNjM5NSAwLjA3ODk5MjMgMTEuNzgwMyAwLjIxOTYyNVoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=');
    mask-size: 75%;
    mask-repeat: no-repeat;
    mask-position: center;

    animation: checkmarkOut 80ms cubic-bezier(0.65, 0, 0.35, 1) forwards;
  }

  &:checked,
  &:indeterminate {
    background: var(--control-checked-bgColor-rest, ${get('colors.accent.fg')});
    border-color: var(
      --control-checked-bgColor-rest,
      ${get('colors.accent.fg')}
    ); /* using bgColor here to avoid a border change in dark high contrast */

    &::before {
      animation: checkmarkIn 80ms cubic-bezier(0.65, 0, 0.35, 1) forwards 80ms;
    }
  }

  &:disabled {
    cursor: not-allowed;
  }

  &:checked {
    transition:
      background-color,
      border-color 80ms cubic-bezier(0.32, 0, 0.67, 0) 0ms;

    &::before {
      visibility: visible;
      transition: visibility 0s linear 0s;
    }

    &:disabled {
      background-color: var(--control-checked-bgColor-disabled, ${get('colors.fg.muted')});
      border-color: var(--control-checked-borderColor-disabled, ${get('colors.fg.muted')});
      opacity: 1;

      &::before {
        background-color: var(--control-checked-fgColor-disabled, ${get('colors.fg.onEmphasis')});
      }
    }

    /* Windows High Contrast mode */
    @media (forced-colors: active) {
      background-color: canvastext;
      border-color: canvastext;
    }
  }

  &:indeterminate {
    background: var(--control-checked-bgColor-rest, ${get('colors.accent.fg')});
    &::before {
      mask-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMiIgdmlld0JveD0iMCAwIDEwIDIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMCAxQzAgMC40NDc3MTUgMC40NDc3MTUgMCAxIDBIOUM5LjU1MjI5IDAgMTAgMC40NDc3MTUgMTAgMUMxMCAxLjU1MjI4IDkuNTUyMjkgMiA5IDJIMUMwLjQ0NzcxNSAyIDAgMS41NTIyOCAwIDFaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K');
      visibility: visible;
    }
  }

  ${getGlobalFocusStyles()};

  ${sx};

  @keyframes checkmarkIn {
    from {
      clip-path: inset(var(--base-size-16, 16px) 0 0 0);
    }

    to {
      clip-path: inset(0 0 0 0);
    }
  }

  @keyframes checkmarkOut {
    from {
      clip-path: inset(0 0 0 0);
    }

    to {
      clip-path: inset(var(--base-size-16, 16px) 0 0 0);
    }
  }
`

/**
 * An accessible, native checkbox component
 */
const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      checked,
      className,
      defaultChecked,
      indeterminate,
      disabled,
      onChange,
      sx: sxProp,
      required,
      validationStatus,
      value,
      ...rest
    },
    ref,
  ): ReactElement => {
    const enabled = useFeatureFlag('primer_react_css_modules_ga')
    const checkboxRef = useProvidedRefOrCreate(ref as React.RefObject<HTMLInputElement>)
    const checkboxGroupContext = useContext(CheckboxGroupContext)
    const handleOnChange: ChangeEventHandler<HTMLInputElement> = e => {
      checkboxGroupContext.onChange && checkboxGroupContext.onChange(e)
      onChange && onChange(e)
    }
    const inputProps = {
      type: 'checkbox',
      disabled,
      ref: checkboxRef,
      checked: indeterminate ? false : checked,
      defaultChecked,
      required,
      ['aria-required']: required ? ('true' as const) : ('false' as const),
      ['aria-invalid']: validationStatus === 'error' ? ('true' as const) : ('false' as const),
      onChange: handleOnChange,
      value,
      name: value,
      ...rest,
    }

    useLayoutEffect(() => {
      if (checkboxRef.current) {
        checkboxRef.current.indeterminate = indeterminate || false
      }
    }, [indeterminate, checked, checkboxRef])

    useEffect(() => {
      const {current: checkbox} = checkboxRef
      if (!checkbox) {
        return
      }

      if (indeterminate) {
        checkbox.setAttribute('aria-checked', 'mixed')
      } else {
        checkbox.setAttribute('aria-checked', checkbox.checked ? 'true' : 'false')
      }
    })

    if (enabled) {
      if (sxProp) {
        return (
          <Box
            as="input"
            {...inputProps}
            className={clsx(className, sharedClasses.Input, classes.Checkbox)}
            sx={sxProp}
          />
        )
      }
      return <input {...inputProps} className={clsx(className, sharedClasses.Input, classes.Checkbox)} />
    }

    return <StyledCheckbox {...inputProps} className={className} sx={sxProp} />
  },
)

Checkbox.displayName = 'Checkbox'

export default Checkbox
