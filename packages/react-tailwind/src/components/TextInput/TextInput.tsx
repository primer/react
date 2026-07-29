'use client'

import {AlertFillIcon} from '@primer/octicons-react'
import {cva} from 'class-variance-authority'
import React from 'react'
import {cn} from '../../internal/cn'
import type {ControlSize} from '../../utils/types'
import {getCharacterCountState} from '../../utils/characterCounter'
import {useFormControlForwardedProps} from '../FormControl/useFormControlForwardedProps'
import {AriaStatus} from '../LiveRegion'
import {Spinner} from '../Spinner'
import {VisuallyHidden} from '../VisuallyHidden'
import {TextInputAction} from './TextInputAction'

const inputVariants = cva(
  'inline-flex cursor-text items-stretch overflow-hidden align-middle text-default border border-[var(--control-borderColor-rest)] bg-default shadow-[var(--shadow-inset)] outline-none rounded-md data-[focused]:border-accent-emphasis data-[focused]:outline-2 data-[focused]:outline-offset-[-1px] data-[focused]:outline-focus data-[disabled]:cursor-not-allowed data-[disabled]:border-[var(--control-borderColor-disabled)] data-[disabled]:bg-[var(--control-bgColor-disabled)] data-[disabled]:text-disabled data-[disabled]:shadow-none data-[validation=error]:border-danger-emphasis data-[validation=error]:data-[focused]:border-[var(--control-borderColor-danger)] data-[validation=error]:data-[focused]:outline-[var(--control-borderColor-danger)] data-[validation=success]:border-success-emphasis',
  {
    variants: {
      block: {
        true: 'flex w-full self-stretch',
        false: 'inline-flex',
      },
      contrast: {
        true: 'bg-[var(--control-bgColor-contrast,var(--bgColor-inset))]',
        false: '',
      },
      monospace: {
        true: 'font-mono',
        false: '',
      },
      size: {
        small: 'min-h-7 py-[3px] text-xs leading-5 [--text-input-action-size:20px]',
        medium: 'min-h-8 text-sm leading-5 [--text-input-action-size:24px]',
        large: 'h-10 py-[10px] text-sm leading-5 [--text-input-action-size:28px]',
      },
    },
    defaultVariants: {block: false, contrast: false, monospace: false, size: 'medium'},
  },
)

export type TextInputVisual = React.ElementType | React.ReactNode

export interface TextInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'data-component'> {
  /** Stretches the input to fill the width of its container. */
  block?: boolean
  /** Shows a remaining-character count and announces when the limit is near. */
  characterLimit?: number
  /** Gives the input a filled background, for use on a matching surface. */
  contrast?: boolean
  /** Icon or text shown inside the input, before the value. */
  leadingVisual?: TextInputVisual
  /** Shows a spinner inside the input while a value is being resolved. */
  loading?: boolean
  /** Which end the spinner appears at, or `auto` to take the place of an existing visual. */
  loaderPosition?: 'auto' | 'leading' | 'trailing'
  /** Text announced to assistive technology while the input is loading. */
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
      className="flex shrink-0 self-center text-muted"
      data-component={`TextInput.${position}Visual`}
      id={slotId}
    >
      <span className="relative flex">
        {children !== undefined ? <span className={cn(loading && 'invisible')}>{renderVisual(children)}</span> : null}
        {loading ? (
          <Spinner
            aria-hidden="true"
            className={cn(children !== undefined && 'absolute inset-0 m-auto max-h-full max-w-full')}
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
    contrast = false,
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
  const [uncontrolledLength, setUncontrolledLength] = React.useState(() =>
    defaultValue === undefined ? 0 : String(defaultValue).length,
  )
  const leadingVisualId = React.useId()
  const trailingVisualId = React.useId()
  const loadingId = React.useId()
  const characterLimitId = React.useId()
  const forwardedProps = useFormControlForwardedProps(rest)
  const effectiveDisabled = disabled ?? forwardedProps.disabled
  const effectiveRequired = required ?? forwardedProps.required
  const currentLength = value === undefined ? uncontrolledLength : String(value).length
  const counter = characterLimit === undefined ? undefined : getCharacterCountState(currentLength, characterLimit)
  const effectiveValidation = counter?.isOverLimit || forwardedProps['aria-invalid'] ? 'error' : validationStatus
  const showLeadingLoader =
    loading && (loaderPosition === 'leading' || (loaderPosition === 'auto' && leadingVisual !== undefined))
  const showTrailingLoader = loading && (loaderPosition === 'trailing' || (loaderPosition === 'auto' && !leadingVisual))
  const hasLeading = leadingVisual !== undefined || showLeadingLoader
  const hasTrailing = trailingVisual !== undefined || showTrailingLoader
  const descriptionIds = [forwardedProps['aria-describedby']]
  if (leadingVisual !== undefined) descriptionIds.push(leadingVisualId)
  if (trailingVisual !== undefined) descriptionIds.push(trailingVisualId)
  if (loading) descriptionIds.push(loadingId)
  if (characterLimit !== undefined) descriptionIds.push(characterLimitId)
  const describedBy = descriptionIds.filter(Boolean).join(' ') || undefined

  const setInputRef = React.useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node
      if (typeof ref === 'function') ref(node)
      else if (ref) ref.current = node
    },
    [ref],
  )

  return (
    <>
      {/* The wrapper only redirects pointer clicks on its visual affordances to the native input. */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <span
        aria-busy={loading || undefined}
        className={cn(
          inputVariants({block, contrast, monospace, size}),
          hasLeading && (size === 'large' ? 'pl-3' : 'pl-2'),
          hasTrailing && !trailingAction && (size === 'large' ? 'pr-3' : 'pr-2'),
          className,
        )}
        data-block={block || undefined}
        data-component="TextInput"
        data-contrast={contrast || undefined}
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
          aria-required={effectiveRequired || undefined}
          className={cn(
            'm-0 w-full appearance-none border-0 bg-transparent [font-family:inherit] [font-size:inherit] text-[color:inherit] outline-none placeholder:text-muted disabled:cursor-not-allowed',
            !hasLeading && !hasTrailing && !trailingAction && 'px-3',
            hasLeading && !hasTrailing && !trailingAction && 'pr-2',
            !hasLeading && (hasTrailing || trailingAction) && 'pl-2',
          )}
          data-component="TextInput.Input"
          defaultValue={defaultValue}
          disabled={effectiveDisabled}
          onBlur={event => {
            setFocused(false)
            onBlur?.(event)
          }}
          onChange={event => {
            if (characterLimit !== undefined && value === undefined) setUncontrolledLength(event.target.value.length)
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
      {counter ? (
        <>
          <AriaStatus announceOnShow={false} className="sr-only" delayMs={500}>
            {counter.message}
          </AriaStatus>
          <VisuallyHidden id={characterLimitId}>
            You can enter up to {characterLimit} {characterLimit === 1 ? 'character' : 'characters'}
          </VisuallyHidden>
          <span
            aria-hidden="true"
            className={cn('flex items-center gap-1 text-xs text-muted', counter.isOverLimit && 'text-danger')}
            data-component="TextInput.CharacterCounter"
          >
            {counter.isOverLimit ? <AlertFillIcon size={16} /> : null}
            {counter.message}
          </span>
        </>
      ) : null}
    </>
  )
})

TextInputRoot.displayName = 'TextInput'

export const TextInput = Object.assign(TextInputRoot, {Action: TextInputAction})
