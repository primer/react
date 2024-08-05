import React, {useState, useRef} from 'react'
import type {Meta} from '@storybook/react'
import {Button} from '../Button'
import type {ItemInput, GroupedListProps} from '../deprecated/ActionList/List'
import {ActionList} from '../deprecated/ActionList'
import {SelectPanel} from './SelectPanel'
import {
  FilterIcon,
  GearIcon,
  NoteIcon,
  ProjectIcon,
  SearchIcon,
  TriangleDownIcon,
  TypographyIcon,
  VersionsIcon,
} from '@primer/octicons-react'

const meta = {
  title: 'Components/SelectPanel/Examples',
  component: SelectPanel,
} satisfies Meta<typeof SelectPanel>

export default meta

export const WithGroups = () => {
  //   const items2 = [
  //     {
  //       id: '1',
  //       key: 1,
  //       leadingVisual: TriangleDownIcon,
  //       text: 'Current attachments',
  //       groupId: '1',
  //     },
  //     {
  //       id: '2',
  //       key: 2,
  //       leadingVisual: TriangleDownIcon,
  //       text: 'Files',
  //       groupId: '2',
  //     },
  //     {
  //       id: '3',
  //       key: 3,
  //       leadingVisual: TriangleDownIcon,
  //       text: 'Symbols',
  //       groupId: '3',
  //     },
  //     {
  //       id: '4',
  //       key: 4,
  //       leadingVisual: TriangleDownIcon,
  //       text: 'Symbols',
  //       groupId: '3',
  //     },
  //     {
  //       id: '5',
  //       key: 5,
  //       leadingVisual: TriangleDownIcon,
  //       text: 'Symbols',
  //       groupId: '3',
  //     },
  //   ]

  const items: Array<ItemInput> = [
    {
      id: '1',
      key: 1,
      leadingVisual: SearchIcon,
      text: 'item 1',
      groupId: '1',
    },
    {
      id: '2',
      key: 2,
      leadingVisual: NoteIcon,
      text: 'Item 2',
      description: 'Some description',
      descriptionVariant: 'block',
      groupId: '1',
    },
    {
      id: '3',
      key: 3,
      leadingVisual: ProjectIcon,
      text: 'Item 3',
      description: 'Some description as well',
      descriptionVariant: 'block',
      groupId: '2',
    },
    {
      id: '4',
      key: 4,
      leadingVisual: FilterIcon,
      text: 'Item 4',
      groupId: '2',
    },
    {id: '5', key: 5, leadingVisual: FilterIcon, text: 'Save sort and filters to new view', groupId: '1'},
    {id: '6', key: 6, leadingVisual: GearIcon, text: 'View settings', groupId: '0'},
    {id: '7', key: 7, leadingVisual: TypographyIcon, text: 'Rename', groupId: '0'},
    {id: '8', key: 8, leadingVisual: VersionsIcon, text: 'Duplicate', groupId: '0'},
  ]
  const [selected, setSelected] = React.useState<ItemInput[]>([items[0], items[1]])
  const [filter, setFilter] = React.useState('')
  const filteredItems = items.filter(item => item.text?.toLowerCase().startsWith(filter.toLowerCase()))
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const groupMetadata: GroupedListProps['groupMetadata'] = [
    {groupId: '0', header: {title: 'Repos', variant: 'filled'}},
    {groupId: '1', header: {title: 'Live query', variant: 'filled'}},
    {groupId: '2', header: {title: 'Layout', variant: 'filled'}},
    // {groupId: '3', renderItem: props => <ActionList.Item style={{fontWeight: 'bold'}} {...props} />},
    // {
    //   groupId: '4',
    //   renderItem: ({leadingVisual: LeadingVisual, ...props}) => (
    //     <ActionList.Item
    //       {...props}
    //       leadingVisual={() => (
    //         <StyledDiv sx={{'&>svg': {fill: 'white'}}}>{LeadingVisual && <LeadingVisual></LeadingVisual>}</StyledDiv>
    //       )}
    //     />
    //   ),
    //   renderGroup: ({sx: sxProps, ...props}) => (
    //     <ActionList.Group {...props} sx={{...sxProps, backgroundColor: 'cornflowerblue', color: 'white'}} />
    //   ),
    // },
  ]

  const onSelectedChange = (newSelected: ItemInput[]) => {
    console.log({newSelected})
    setSelected(newSelected)
  }

  return (
    <>
      <h1>Multi Select Panel With Footer</h1>
      <SelectPanel
        variant="full"
        title="Attach files and symbols"
        subtitle="Choose which files and symbols you want to chat about. Use fewer references for more accurate responses."
        renderAnchor={({children, 'aria-labelledby': ariaLabelledBy, ...anchorProps}) => (
          <Button trailingAction={TriangleDownIcon} aria-labelledby={` ${ariaLabelledBy}`} {...anchorProps}>
            {children ?? 'Select Labels'}
          </Button>
        )}
        anchorRef={buttonRef}
        groupMetadata={groupMetadata}
        placeholderText="Filter things"
        open={open}
        onOpenChange={setOpen}
        items={filteredItems}
        selected={selected}
        onSelectedChange={onSelectedChange}
        onFilterChange={setFilter}
        showItemDividers={true}
        overlayProps={{width: 'large', height: 'xlarge'}}
      />
    </>
  )
}
