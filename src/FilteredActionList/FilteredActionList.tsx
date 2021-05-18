import React, {useCallback} from 'react'
import {GroupedListProps, ListPropsBase} from '../ActionList/List'
import TextInput, {TextInputProps} from '../TextInput'
import Box from '../Box'
import {ActionList} from '../ActionList'
import Spinner from '../Spinner'

export interface FilteredActionListProps extends Partial<Omit<GroupedListProps, keyof ListPropsBase>>, ListPropsBase {
  loading?: boolean
  placeholderText: string
  onFilterChange: (value: string, e: React.ChangeEvent<HTMLInputElement>) => void
  textInputProps?: Partial<Omit<TextInputProps, 'onChange'>>
}

export function FilteredActionList({
  loading = false,
  placeholderText,
  onFilterChange,
  items,
  textInputProps,
  ...listProps
}: FilteredActionListProps): JSX.Element {
  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      onFilterChange(value, e)
    },
    [onFilterChange]
  )

  return (
    <>
      <TextInput
        block
        width="auto"
        color="text.primary"
        onChange={onInputChange}
        placeholder={placeholderText}
        aria-label={placeholderText}
        {...textInputProps}
      />
      <Box flexGrow={1} overflow="auto">
        {loading ? (
          <Box width="100%" display="flex" flexDirection="row" justifyContent="center" pt={6} pb={7}>
            <Spinner />
          </Box>
        ) : (
          <ActionList items={items} {...listProps} role="listbox" />
        )}
      </Box>
    </>
  )
}

FilteredActionList.displayName = 'FilteredActionList'
