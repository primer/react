import type React from 'react'
import {clsx} from 'clsx'
import TextInput from '../TextInput'
import type {TextInputProps} from '../TextInput'
import classes from './FilteredActionList.module.css'

export interface FilteredActionLsitInputProps extends Partial<Omit<TextInputProps, 'onChange'>> {
  inputRef: React.RefObject<HTMLInputElement | null>
  filterValue: string
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onInputKeyPress: React.KeyboardEventHandler<HTMLInputElement>
  onInputKeyDown: React.KeyboardEventHandler<HTMLInputElement>
  usingRovingTabindex: boolean
  placeholderText?: string
  listId: string
  inputDescriptionTextId: string
  loading: boolean
  fullScreenOnNarrow?: boolean
}

export function FilteredActionListInput({
  inputRef,
  filterValue,
  onInputChange,
  onInputKeyPress,
  onInputKeyDown,
  usingRovingTabindex,
  placeholderText,
  listId,
  inputDescriptionTextId,
  loading,
  fullScreenOnNarrow,
  className,
  ...restTextInputProps
}: FilteredActionLsitInputProps): React.JSX.Element {
  return (
    <div className={classes.Header}>
      <TextInput
        // @ts-expect-error it needs a non nullable ref
        ref={inputRef}
        block
        width="auto"
        color="fg.default"
        value={filterValue}
        onChange={onInputChange}
        onKeyPress={onInputKeyPress}
        onKeyDown={usingRovingTabindex ? onInputKeyDown : undefined}
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
