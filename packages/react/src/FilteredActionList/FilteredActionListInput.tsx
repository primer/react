import React from 'react'
import {clsx} from 'clsx'
import TextInput from '../TextInput'
import type {TextInputProps} from '../TextInput'
import classes from './FilteredActionList.module.css'
import {useMergedRefs} from '../hooks/useMergedRefs'

const DefaultInput = React.forwardRef<HTMLInputElement, TextInputProps>(function DefaultInput(props, ref) {
  return <TextInput {...props} ref={ref} />
})

export interface FilteredActionListInputProps extends Partial<Omit<TextInputProps, 'onChange' | 'onKeyDown'>> {
  InputComponent?: React.ComponentType<TextInputProps & React.RefAttributes<HTMLInputElement>>
  inputRef: React.Ref<HTMLInputElement | null>
  onInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onInputFocus?: React.FocusEventHandler<HTMLInputElement>
  onInputKeyPress?: React.KeyboardEventHandler<HTMLInputElement>
  onInputKeyDown?: React.KeyboardEventHandler<HTMLInputElement>
  placeholderText?: string
  /** ID of the rendered list. Omit it while the list is not rendered. */
  listId?: string
  inputDescriptionTextId: string
  loading: boolean
  fullScreenOnNarrow?: boolean
}

export function FilteredActionListInput({
  InputComponent = DefaultInput,
  inputRef,
  value,
  onInputChange,
  onInputFocus,
  onInputKeyPress,
  onInputKeyDown,
  placeholderText,
  listId,
  inputDescriptionTextId,
  loading,
  fullScreenOnNarrow,
  className,
  onFocus,
  ...restTextInputProps
}: FilteredActionListInputProps): React.JSX.Element {
  const ref = useMergedRefs<HTMLInputElement>(inputRef, undefined)
  return (
    <div className={classes.Header} data-component="FilteredActionList.Header">
      <InputComponent
        ref={ref}
        block
        width="auto"
        color="fg.default"
        value={value}
        onChange={onInputChange}
        onFocus={event => {
          onInputFocus?.(event)
          onFocus?.(event)
        }}
        onKeyPress={onInputKeyPress}
        onKeyDown={onInputKeyDown}
        placeholder={placeholderText}
        role="combobox"
        aria-expanded={listId !== undefined}
        aria-autocomplete="list"
        aria-controls={listId}
        aria-label={placeholderText}
        aria-describedby={inputDescriptionTextId}
        loaderPosition={'leading'}
        loading={loading}
        className={clsx(className, {[classes.FullScreenTextInput]: fullScreenOnNarrow})}
        {...restTextInputProps}
      />
    </div>
  )
}
