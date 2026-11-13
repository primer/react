'use client'

import {cva} from 'class-variance-authority'
import React from 'react'
import {CharacterCounter} from '../../internal/CharacterCounter'
import {useCharacterLimit} from '../../internal/useCharacterLimit'
import {cn} from '../../internal/cn'
import {markFormControlInput} from '../../internal/formControlParts'
import {joinIdRefs} from '../../internal/idRefs'
import {mergeRefs} from '../../internal/refs'
import type {ControlSize} from '../../utils/types'
import {useFormControlForwardedProps, useFormControlValidationStatus} from '../FormControl/useFormControlForwardedProps'
import {Spinner} from '../Spinner'
import {VisuallyHidden} from '../VisuallyHidden'
import {TextInputAction} from './TextInputAction'

const inputVariants = cva(
  'primer:box-border primer:inline-flex primer:cursor-text primer:items-stretch primer:overflow-hidden primer:align-middle primer:text-default primer:border-thin primer:border-[var(--control-borderColor-rest)] primer:bg-default primer:shadow-[var(--shadow-inset)] primer:rounded-md primer:data-[focused]:border-accent-emphasis primer:data-[focused]:outline-2 primer:data-[focused]:outline-offset-[-1px] primer:data-[focused]:outline-focus primer:data-[disabled]:cursor-not-allowed primer:data-[disabled]:border-[var(--control-borderColor-disabled)] primer:data-[disabled]:bg-[var(--control-bgColor-disabled)] primer:data-[disabled]:text-disabled primer:data-[disabled]:shadow-none primer:data-[validation=error]:border-danger-emphasis primer:data-[validation=error]:data-[focused]:border-[var(--control-borderColor-danger)] primer:data-[validation=error]:data-[focused]:outline-[var(--control-borderColor-danger)] primer:data-[validation=success]:border-[var(--bgColor-success-emphasis)]',
  {
    variants: {
      block: {
        true: 'primer:flex primer:w-full primer:self-stretch',
        false: 'primer:inline-flex',
      },
      monospace: {
        true: 'primer:font-mono',
        false: '',
      },
      size: {
        small: 'primer:min-h-7 primer:py-[3px] primer:text-xs primer:leading-5 primer:[--text-input-action-size:20px]',
        medium: 'primer:min-h-8 primer:text-sm primer:leading-5 primer:[--text-input-action-size:24px]',
        large: 'primer:h-10 primer:py-[10px] primer:text-sm primer:leading-5 primer:[--text-input-action-size:28px]',
      },
    },
    defaultVariants: {block: false, monospace: false, size: 'medium'},
  },
)

export type TextInputVisual = React.ElementType | React.ReactNode

export interface TextInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'data-component'> {
  /** Stretches the input to fill the width of its container. */
  block?: boolean
  /** Shows a remaining-character count and announces when the limit is near. */
  characterLimit?: number
  /** Icon or text shown inside the input, before the value. */
  leadingVisual?: TextInputVisual
  /** Shows a spinner inside the input while a value is being resolved. */
  loading?: boolean
  /** Which end the spinner appears at, or `auto` to take the place of an existing visual. */
  loaderPosition?: 'auto' | 'leading' | 'trailing'
  /** Text included in the input's accessible description while loading. */
  loaderText?: string
  /** Renders the value in a monospace face, for code or identifiers. */
  monospace?: boolean
  /** Height and text size of the input. */
  size?: ControlSize
  /** Interactive control shown at the end of the input, such as a clear button. */
  trailingAction?: React.ReactElement
  /** Icon or text shown inside the input, after the value. */
  trailingVisual?: TextInputVisual
  /** Marks the value invalid or confirmed, which sets the border colour and `aria-invalid`. */
  validationStatus?: 'error' | 'success'
}

function isVisualComponent(visual: TextInputVisual): visual is React.ElementType {
  return (
    typeof visual === 'function' ||
    (typeof visual === 'object' && visual !== null && !React.isValidElement(visual) && '$$typeof' in visual)
  )
}

function renderVisual(visual: TextInputVisual) {
  return isVisualComponent(visual) ? React.createElement(visual) : visual
}

interface VisualSlotProps {
  children?: TextInputVisual
  loading: boolean
  position: 'Leading' | 'Trailing'
  slotId: string
}

function VisualSlot({children, loading, position, slotId}: VisualSlotProps) {
  if (children === undefined && !loading) return null

  return (
    <span
      aria-hidden="true"
      className="primer:flex primer:shrink-0 primer:self-center primer:text-muted"
      data-component={`TextInput.${position}Visual`}
      id={slotId}
    >
      <span className="primer:relative primer:flex">
        {children !== undefined ? (
          <span className={cn(loading && 'primer:invisible')}>{renderVisual(children)}</span>
        ) : null}
        {loading ? (
          <Spinner
            aria-hidden="true"
            className={cn(
              children !== undefined &&
                'primer:absolute primer:inset-0 primer:m-auto primer:max-h-full primer:max-w-full',
            )}
            size="small"
            srText={null}
          />
        ) : null}
      </span>
    </span>
  )
}

/** A native text input with Primer field styling and composable inner visuals. */
const TextInputRoot = React.forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
  {
    block = false,
    characterLimit,
    className,
    defaultValue,
    disabled,
    leadingVisual,
    loaderPosition = 'auto',
    loaderText = 'Loading',
    loading = false,
    monospace = false,
    onBlur,
    onChange,
    onFocus,
    required,
    size = 'medium',
    trailingAction,
    trailingVisual,
    validationStatus,
    value,
    ...rest
  },
  ref,
) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [focused, setFocused] = React.useState(false)
  const leadingVisualId = React.useId()
  const trailingVisualId = React.useId()
  const loadingId = React.useId()
  const {characterLimitId, counter, onValueChange} = useCharacterLimit({characterLimit, defaultValue, value})
  const forwardedProps = useFormControlForwardedProps(rest)
  // Composite inputs (e.g. `Autocomplete.Input` rendering through Base UI) keep their own marker on
  // the native input, matching upstream; the prop is intentionally absent from the public type.
  const inputDataComponent = (rest as {'data-component'?: string})['data-component'] ?? 'TextInput.Input'
  const effectiveDisabled = disabled ?? forwardedProps.disabled
  const effectiveRequired = required ?? forwardedProps.required
  const fieldValidationStatus = useFormControlValidationStatus()
  const effectiveValidation =
    counter?.isOverLimit || forwardedProps['aria-invalid'] ? 'error' : (validationStatus ?? fieldValidationStatus)
  const showLeadingLoader =
    loading && (loaderPosition === 'leading' || (loaderPosition === 'auto' && leadingVisual !== undefined))
  const showTrailingLoader = loading && (loaderPosition === 'trailing' || (loaderPosition === 'auto' && !leadingVisual))
  const hasLeading = leadingVisual !== undefined || showLeadingLoader
  const hasTrailing = trailingVisual !== undefined || showTrailingLoader
  const describedBy = joinIdRefs(
    forwardedProps['aria-describedby'],
    leadingVisual !== undefined && leadingVisualId,
    trailingVisual !== undefined && trailingVisualId,
    loading && loadingId,
    characterLimitId,
  )

  const setInputRef = React.useMemo(() => mergeRefs(inputRef, ref), [ref])

  return (
    <>
      {/* The wrapper only redirects pointer clicks on its visual affordances to the native input. */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <span
        className={cn(
          inputVariants({block, monospace, size}),
          // Match upstream: every inner part except the last is separated by 8px.
          'primer:[&>:not(:last-child)]:mr-2',
          hasLeading && (size === 'large' ? 'primer:pl-3' : 'primer:pl-2'),
          hasTrailing && !trailingAction && (size === 'large' ? 'primer:pr-3' : 'primer:pr-2'),
          className,
        )}
        data-block={block || undefined}
        data-component="TextInput"
        data-disabled={effectiveDisabled || undefined}
        data-focused={focused || undefined}
        data-leading-visual={hasLeading || undefined}
        data-monospace={monospace || undefined}
        data-size={size}
        data-trailing-action={trailingAction ? true : undefined}
        data-trailing-visual={hasTrailing || undefined}
        data-validation={effectiveValidation}
        onClick={event => {
          if (event.target !== inputRef.current || !['date', 'time', 'datetime-local'].includes(rest.type ?? 'text')) {
            inputRef.current?.focus()
          }
        }}
      >
        <VisualSlot loading={showLeadingLoader} position="Leading" slotId={leadingVisualId}>
          {leadingVisual}
        </VisualSlot>
        <input
          {...forwardedProps}
          ref={setInputRef}
          aria-describedby={describedBy}
          aria-invalid={effectiveValidation === 'error' ? true : forwardedProps['aria-invalid']}
          aria-required={forwardedProps['aria-required'] ?? (effectiveRequired || undefined)}
          className={cn(
            'primer:m-0 primer:w-full primer:appearance-none primer:border-0 primer:bg-transparent primer:px-0 primer:[font-family:inherit] primer:[font-size:inherit] primer:text-[color:inherit] primer:outline-none primer:placeholder:text-muted primer:disabled:cursor-not-allowed',
            !hasLeading && !hasTrailing && !trailingAction && 'primer:px-3',
            hasLeading && !hasTrailing && !trailingAction && 'primer:pr-2',
            !hasLeading && (hasTrailing || trailingAction) && 'primer:pl-2',
          )}
          data-component={inputDataComponent}
          defaultValue={defaultValue}
          disabled={effectiveDisabled}
          onBlur={event => {
            setFocused(false)
            onBlur?.(event)
          }}
          onChange={event => {
            onValueChange(event.target.value)
            onChange?.(event)
          }}
          onFocus={event => {
            setFocused(true)
            onFocus?.(event)
          }}
          required={effectiveRequired}
          value={value}
        />
        {loading ? <VisuallyHidden id={loadingId}>{loaderText}</VisuallyHidden> : null}
        <VisualSlot loading={showTrailingLoader} position="Trailing" slotId={trailingVisualId}>
          {trailingVisual}
        </VisualSlot>
        {trailingAction}
      </span>
      {counter && characterLimit !== undefined && characterLimitId ? (
        <CharacterCounter
          characterLimit={characterLimit}
          counter={counter}
          data-component="TextInput.CharacterCounter"
          id={characterLimitId}
        />
      ) : null}
    </>
  )
})

TextInputRoot.displayName = 'TextInput'

export const TextInput = Object.assign(TextInputRoot, {Action: TextInputAction})

markFormControlInput(TextInput)
