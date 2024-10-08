import {TriangleDownIcon} from '@primer/octicons-react'
import type {Meta} from '@storybook/react'
import React, {useState} from 'react'

import Box from '../Box'
import {Button} from '../Button'
import {SelectPanel} from '../SelectPanel'
import type {ItemInput} from '../deprecated/ActionList/List'

const meta = {
  title: 'Components/SelectPanel',
  component: SelectPanel,
} satisfies Meta<typeof SelectPanel>

export default meta

function getColorCircle(color: string) {
  return function () {
    return (
      <Box
        sx={{
          backgroundColor: color,
          borderColor: color,
          width: 14,
          height: 14,
          borderRadius: 10,
          margin: 'auto',
          borderWidth: '1px',
          borderStyle: 'solid',
        }}
      />
    )
  }
}

const items: ItemInput[] = [
  {leadingVisual: getColorCircle('#a2eeef'), text: 'enhancement', description: 'New feature or request', id: 1},
  {leadingVisual: getColorCircle('#d73a4a'), text: 'bug', description: "Something isn't working", id: 2},
  {leadingVisual: getColorCircle('#0cf478'), text: 'good first issue', description: 'Good for newcomers', id: 3},
  {leadingVisual: getColorCircle('#ffd78e'), text: 'design', id: 4},
  {leadingVisual: getColorCircle('#ff0000'), text: 'blocker', id: 5},
  {leadingVisual: getColorCircle('#a4f287'), text: 'backend', id: 6},
  {leadingVisual: getColorCircle('#8dc6fc'), text: 'frontend', id: 7},
].map(item => ({...item, descriptionVariant: 'block'}))

export const Default = () => {
  const [selected, setSelected] = React.useState<ItemInput[]>([items[0], items[1]])
  const [filter, setFilter] = React.useState('')
  const filteredItems = items.filter(item => item.text?.toLowerCase().startsWith(filter.toLowerCase()))
  const [open, setOpen] = useState(false)

  return (
    <>
      <h1>Multi Select Panel</h1>
      <SelectPanel
        title="Select labels"
        subtitle="Use labels to organize issues and pull requests"
        renderAnchor={({children, 'aria-labelledby': ariaLabelledBy, ...anchorProps}) => (
          <Button
            trailingAction={TriangleDownIcon}
            aria-labelledby={` ${ariaLabelledBy}`}
            {...anchorProps}
            aria-haspopup="dialog"
          >
            {children ?? 'Select Labels'}
          </Button>
        )}
        open={open}
        onOpenChange={setOpen}
        items={filteredItems}
        selected={selected}
        onSelectedChange={setSelected}
        onFilterChange={setFilter}
      />
    </>
  )
}
