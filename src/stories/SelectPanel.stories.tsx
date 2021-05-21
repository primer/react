import {Meta} from '@storybook/react'
import React, {useState} from 'react'
import {theme, ThemeProvider} from '..'
import {ItemInput} from '../ActionList/List'
import BaseStyles from '../BaseStyles'
import {DropdownButton} from '../DropdownMenu'
import {SelectPanel} from '../SelectPanel'
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

const items = [
  {leadingVisual: getColorCircle('#a2eeef'), text: 'enhancement', id: 1},
  {leadingVisual: getColorCircle('#d73a4a'), text: 'bug', id: 2},
  {leadingVisual: getColorCircle('#0cf478'), text: 'good first issue', id: 3},
  {leadingVisual: getColorCircle('#8dc6fc'), text: 'design', id: 4}
]

export function MultiSelectStory(): JSX.Element {
  const [selected, setSelected] = React.useState<ItemInput[]>([items[0], items[1]])
  const [filter, setFilter] = React.useState('')
  const filteredItems = items.filter(item => item.text.toLowerCase().startsWith(filter.toLowerCase()))
  const [open, setOpen] = useState(false)

  return (
    <>
      <h1>Multi Select Panel</h1>
      <div>Please select labels that describe your issue:</div>
      <SelectPanel
        renderAnchor={({children, 'aria-labelledby': ariaLabelledBy, ...anchorProps}) => (
          <DropdownButton aria-labelledby={` ${ariaLabelledBy}`} {...anchorProps}>
            {children ?? 'Select Labels'}
          </DropdownButton>
        )}
        placeholderText="Filter Labels"
        open={open}
        onOpenChange={setOpen}
        items={filteredItems}
        selected={selected}
        onSelectedChange={setSelected}
        onFilterChange={setFilter}
        showItemDividers={true}
      />
    </>
  )
}
MultiSelectStory.storyName = 'Multi Select'

export function SingleSelectStory(): JSX.Element {
  const [selected, setSelected] = React.useState<ItemInput | undefined>(items[0])
  const [filter, setFilter] = React.useState('')
  const filteredItems = items.filter(item => item.text.toLowerCase().startsWith(filter.toLowerCase()))
  const [open, setOpen] = useState(false)

  return (
    <>
      <h1>Single Select Panel</h1>
      <div>Please select a label that describe your issue:</div>
      <SelectPanel
        renderAnchor={({children, 'aria-labelledby': ariaLabelledBy, ...anchorProps}) => (
          <DropdownButton aria-labelledby={` ${ariaLabelledBy}`} {...anchorProps}>
            {children ?? 'Select Labels'}
          </DropdownButton>
        )}
        placeholderText="Filter Labels"
        open={open}
        onOpenChange={setOpen}
        items={filteredItems}
        selected={selected}
        onSelectedChange={setSelected}
        onFilterChange={setFilter}
        showItemDividers={true}
      />
    </>
  )
}
SingleSelectStory.storyName = 'Single Select'
