import type React from 'react'
import {clsx} from 'clsx'
import TextInput from '../TextInput'
import type {TextInputProps} from '../TextInput'
import classes from './FilteredActionList.module.css'

export interface FilteredActionListInputProps extends Partial<Omit<TextInputProps, 'onChange' | 'onKeyDown'>> {
  inputRef: React.RefObject<HTMLInputElement | null>
  onInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onInputKeyPress?: React.KeyboardEventHandler<HTMLInputElement>
  onInputKeyDown?: React.KeyboardEventHandler<HTMLInputElement>
  placeholderText?: string
  listId: string
  inputDescriptionTextId: string
  loading: boolean
  fullScreenOnNarrow?: boolean
}

export function FilteredActionListInput({
  inputRef,
  value,
  onInputChange,
  onInputKeyPress,
  onInputKeyDown,
  placeholderText,
  listId,
  inputDescriptionTextId,
  loading,
  fullScreenOnNarrow,
  className,
  ...restTextInputProps
}: FilteredActionListInputProps): React.JSX.Element {
  return (
    <div className={classes.Header} data-component="FilteredActionList.Header">
      <TextInput
        // @ts-expect-error it needs a non nullable ref
        ref={inputRef}
        block
        width="auto"
        color="fg.default"
        value={value}
        onChange={onInputChange}
        onKeyPress={onInputKeyPress}
        onKeyDown={onInputKeyDown}
        placeholder={placeholderText}
        role="combobox"
        aria-expanded="true"
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
