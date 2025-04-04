import {TriangleDownIcon} from '@primer/octicons-react'
import type {Meta} from '@storybook/react'
import React, {useState} from 'react'

import Box from '../Box'
import {Button} from '../Button'
import {SelectPanel} from '.'
import type {ItemInput} from '../deprecated/ActionList/List'
import {FeatureFlags} from '../FeatureFlags'
import FormControl from '../FormControl'

const meta: Meta<typeof SelectPanel> = {
  title: 'Components/SelectPanel/Dev',
  component: SelectPanel,
} satisfies Meta<typeof SelectPanel>

export default meta

const NoResultsMessage = (filter: string): {variant: 'empty'; title: string; body: string} => {
  return {
    variant: 'empty',
    title: `No language found for \`${filter}\``,
    body: 'Adjust your search term to find other languages',
  }
}

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
  {
    leadingVisual: getColorCircle('#a2eeef'),
    text: 'enhancement',
    description: 'New feature or request',
    descriptionVariant: 'block',
    id: 1,
  },
  {
    leadingVisual: getColorCircle('#d73a4a'),
    text: 'bug',
    description: "Something isn't working",
    descriptionVariant: 'block',
    id: 2,
  },
  {
    leadingVisual: getColorCircle('#0cf478'),
    text: 'good first issue',
    description: 'Good for newcomers',
    descriptionVariant: 'block',
    id: 3,
  },
  {leadingVisual: getColorCircle('#ffd78e'), text: 'design', id: 4},
  {leadingVisual: getColorCircle('#ff0000'), text: 'blocker', id: 5},
  {leadingVisual: getColorCircle('#a4f287'), text: 'backend', id: 6},
  {leadingVisual: getColorCircle('#8dc6fc'), text: 'frontend', id: 7},
]

export const WithCss = () => {
  const [selected, setSelected] = useState<ItemInput[]>(items.slice(1, 3))
  const [filter, setFilter] = useState('')
  const filteredItems = items.filter(item => item.text?.toLowerCase().startsWith(filter.toLowerCase()))
  // design guidelines say to sort selected items first
  const selectedItemsSortedFirst = filteredItems.sort((a, b) => {
    const aIsSelected = selected.some(selectedItem => selectedItem.text === a.text)
    const bIsSelected = selected.some(selectedItem => selectedItem.text === b.text)
    if (aIsSelected && !bIsSelected) return -1
    if (!aIsSelected && bIsSelected) return 1
    return 0
  })
  const [open, setOpen] = useState(false)

  return (
    <FeatureFlags
      flags={{
        primer_react_css_modules_staff: true,
        primer_react_css_modules_ga: true,
      }}
    >
      <FormControl>
        <FormControl.Label>Labels</FormControl.Label>
        <SelectPanel
          title="Select labels"
          placeholder="Select labels" // button text when no items are selected
          subtitle="Use labels to organize issues and pull requests"
          renderAnchor={({children, ...anchorProps}) => (
            <Button trailingAction={TriangleDownIcon} {...anchorProps} aria-haspopup="dialog">
              {children}
            </Button>
          )}
          open={open}
          onOpenChange={setOpen}
          items={selectedItemsSortedFirst}
          selected={selected}
          onSelectedChange={setSelected}
          onFilterChange={setFilter}
          className="testCustomClassnameMono"
          message={selectedItemsSortedFirst.length === 0 ? NoResultsMessage(filter) : undefined}
        />
      </FormControl>
    </FeatureFlags>
  )
}

export const WithSx = () => {
  const [selected, setSelected] = useState<ItemInput[]>(items.slice(1, 3))
  const [filter, setFilter] = useState('')
  const filteredItems = items.filter(item => item.text?.toLowerCase().startsWith(filter.toLowerCase()))
  // design guidelines say to sort selected items first
  const selectedItemsSortedFirst = filteredItems.sort((a, b) => {
    const aIsSelected = selected.some(selectedItem => selectedItem.text === a.text)
    const bIsSelected = selected.some(selectedItem => selectedItem.text === b.text)
    if (aIsSelected && !bIsSelected) return -1
    if (!aIsSelected && bIsSelected) return 1
    return 0
  })
  const [open, setOpen] = useState(false)

  return (
    <FeatureFlags
      flags={{
        primer_react_css_modules_staff: true,
        primer_react_css_modules_ga: true,
      }}
    >
      <FormControl>
        <FormControl.Label>Labels</FormControl.Label>
        <SelectPanel
          title="Select labels"
          placeholder="Select labels" // button text when no items are selected
          subtitle="Use labels to organize issues and pull requests"
          renderAnchor={({children, ...anchorProps}) => (
            <Button trailingAction={TriangleDownIcon} {...anchorProps} aria-haspopup="dialog">
              {children}
            </Button>
          )}
          open={open}
          onOpenChange={setOpen}
          items={selectedItemsSortedFirst}
          selected={selected}
          onSelectedChange={setSelected}
          onFilterChange={setFilter}
          sx={{fontFamily: 'Times New Roman'}}
          message={selectedItemsSortedFirst.length === 0 ? NoResultsMessage(filter) : undefined}
        />
      </FormControl>
    </FeatureFlags>
  )
}

export const WithSxAndCSS = () => {
  const [selected, setSelected] = useState<ItemInput[]>(items.slice(1, 3))
  const [filter, setFilter] = useState('')
  const filteredItems = items.filter(item => item.text?.toLowerCase().startsWith(filter.toLowerCase()))
  // design guidelines say to sort selected items first
  const selectedItemsSortedFirst = filteredItems.sort((a, b) => {
    const aIsSelected = selected.some(selectedItem => selectedItem.text === a.text)
    const bIsSelected = selected.some(selectedItem => selectedItem.text === b.text)
    if (aIsSelected && !bIsSelected) return -1
    if (!aIsSelected && bIsSelected) return 1
    return 0
  })
  const [open, setOpen] = useState(false)

  return (
    <FeatureFlags
      flags={{
        primer_react_css_modules_staff: true,
        primer_react_css_modules_ga: true,
      }}
    >
      <FormControl>
        <FormControl.Label>Labels</FormControl.Label>
        <SelectPanel
          title="Select labels"
          placeholder="Select labels" // button text when no items are selected
          subtitle="Use labels to organize issues and pull requests"
          renderAnchor={({children, ...anchorProps}) => (
            <Button trailingAction={TriangleDownIcon} {...anchorProps} aria-haspopup="dialog">
              {children}
            </Button>
          )}
          open={open}
          onOpenChange={setOpen}
          items={selectedItemsSortedFirst}
          selected={selected}
          onSelectedChange={setSelected}
          onFilterChange={setFilter}
          sx={{fontFamily: 'Times New Roman'}}
          className="testCustomClassnameMono"
          message={selectedItemsSortedFirst.length === 0 ? NoResultsMessage(filter) : undefined}
        />
      </FormControl>
    </FeatureFlags>
  )
}
