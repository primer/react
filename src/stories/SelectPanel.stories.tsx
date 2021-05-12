import {Meta} from '@storybook/react'
import React, {useCallback, useState} from 'react'
import {theme, ThemeProvider} from '..'
import {ItemInput} from '../ActionList/List'
import BaseStyles from '../BaseStyles'
import {DropdownButton} from '../DropdownMenu'
import {SelectPanel} from '../SelectPanel'
import {ItemProps} from '../ActionList'
import BorderBox from '../BorderBox'

const meta: Meta = {
  title: 'Composite components/SelectPanel',
  component: SelectPanel,
  decorators: [
    (Story: React.ComponentType): JSX.Element => {
      return (
        <ThemeProvider theme={theme}>
          <BaseStyles>
            <Story />
          </BaseStyles>
        </ThemeProvider>
      )
    }
  ],
  parameters: {
    controls: {
      disable: true
    }
  }
}
export default meta

function getColorCircle(color: string) {
  return function () {
    return <BorderBox bg={color} borderColor={color} padding={2} borderRadius={10} />
  }
}

export function LabelStory(): JSX.Element {
  const items = React.useMemo(
    (): ItemProps[] => [
      {leadingVisual: getColorCircle('#a2eeef'), text: 'enhancement', id: 1},
      {leadingVisual: getColorCircle('#d73a4a'), text: 'bug', id: 2},
      {leadingVisual: getColorCircle('#0cf478'), text: 'good first issue', id: 3},
      {leadingVisual: getColorCircle('#8dc6fc'), text: 'design', id: 4}
    ],
    []
  )
  const [selectedItems, setSelectedItems] = React.useState<ItemInput[]>([items[0], items[1]])
  const [filterValue, setFilterValue] = React.useState('')
  const filteredItems = items.filter(item => item.text?.toLowerCase().startsWith(filterValue.toLowerCase()))
  const onFilterChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setFilterValue(e.target.value), [])
  const [open, setOpen] = useState(false)
  const onOpen = useCallback(() => setOpen(true), [])
  const onClose = useCallback(() => setOpen(false), [])

  return (
    <>
      <h1>Label Select Panel</h1>
      <div id="">Please select labels that describe your issue:</div>
      <SelectPanel
        renderAnchor={({children, 'aria-labelledby': ariaLabelledBy, ...anchorProps}) => (
          <DropdownButton aria-labelledby={` ${ariaLabelledBy}`} {...anchorProps}>
            {children ?? 'Select Labels'}
          </DropdownButton>
        )}
        placeholderText="Filter Labels"
        open={open}
        onOpen={onOpen}
        onClose={onClose}
        items={filteredItems}
        selectedItems={selectedItems}
        onChange={setSelectedItems}
        filterValue={filterValue}
        onFilterChange={onFilterChange}
        selectionVariant="multiple"
      />
    </>
  )
}
LabelStory.storyName = 'Label Multi-Select'
