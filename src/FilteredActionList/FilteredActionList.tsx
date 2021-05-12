import React from 'react'
import {GroupedListProps, ListPropsBase} from '../ActionList/List'
import TextInput from '../TextInput'
import Box from '../Box'
import SelectMenu from '../SelectMenu'
import {ActionList} from '../ActionList'

export interface FilteredActionListProps extends Partial<Omit<GroupedListProps, keyof ListPropsBase>>, ListPropsBase {
  loading?: boolean
  placeholderText: string
  filterValue: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => unknown
}

export function FilteredActionList({
  loading = false,
  placeholderText,
  filterValue,
  onChange,
  items,
  ...listProps
}: FilteredActionListProps): JSX.Element {
  return (
    <>
      <TextInput
        block
        width="auto"
        color="text.primary"
        defaultValue={filterValue}
        onChange={onChange}
        placeholder={placeholderText}
        aria-label={placeholderText}
        mx={2}
        my={2}
        contrast
      />
      <Box flexGrow={1} overflow="auto">
        {loading ? <SelectMenu.LoadingAnimation /> : <ActionList items={items} {...listProps} role="listbox" />}
      </Box>
    </>
  )
}

FilteredActionList.displayName = 'FilteredActionList'
