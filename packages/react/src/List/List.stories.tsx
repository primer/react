import {Fragment, useEffect, useMemo, useRef, useState, type ReactNode} from 'react'
import {List, Item, Label, Description, Leading, Trailing, Selection} from '../List'
import {AriaStatus} from '../live-region'
import {Root as PopoverRoot, Trigger as PopoverTrigger, Popover as PopoverContent} from './Popover'
import {useListbox} from './useListbox'
import {useMenu} from './useMenu'
import {useTree, type TreeItem} from './useTree'
import './listbox-element'
import './tree-element'
import {Button} from '../Button'

export default {
  title: 'Components/List/Features',
}

export const WithLabel = () => {
  return (
    <>
      <List>
        <Item>
          <Label>Item 1</Label>
        </Item>
        <Item>
          <Label>Item 2</Label>
        </Item>
        <Item>
          <Label>Item 3</Label>
        </Item>
      </List>
    </>
  )
}

export const WithDescription = () => {
  return (
    <>
      <List>
        <Item>
          <Label>Item 1</Label>
          <Description>This is the description for item 1</Description>
        </Item>
        <Item>
          <Label>Item 2</Label>
          <Description>This is the description for item 2</Description>
        </Item>
        <Item>
          <Label>Item 3</Label>
          <Description>This is the description for item 3</Description>
        </Item>
      </List>
    </>
  )
}

export const WithBlockDescription = () => {
  return (
    <>
      <List layout="block">
        <Item>
          <Label>Item 1</Label>
          <Description>This is the description for item 1</Description>
        </Item>
        <Item>
          <Label>Item 2</Label>
          <Description>This is the description for item 2</Description>
        </Item>
        <Item>
          <Label>Item 3</Label>
          <Description>This is the description for item 3</Description>
        </Item>
      </List>
    </>
  )
}

export const WithLeading = () => {
  return (
    <>
      <List>
        <Item>
          <Leading>🔥</Leading>
          <Label>Item 1</Label>
          <Description>This is the description for item 1</Description>
        </Item>
        <Item>
          <Leading>🔥</Leading>
          <Label>Item 2</Label>
          <Description>This is the description for item 2</Description>
        </Item>
        <Item>
          <Leading>🔥</Leading>
          <Label>Item 3</Label>
          <Description>This is the description for item 3</Description>
        </Item>
      </List>
      <List layout="block">
        <Item>
          <Leading>🔥</Leading>
          <Label>Item 1</Label>
          <Description>This is the description for item 1</Description>
        </Item>
        <Item>
          <Leading>🔥</Leading>
          <Label>Item 2</Label>
          <Description>This is the description for item 2</Description>
        </Item>
        <Item>
          <Leading>🔥</Leading>
          <Label>Item 3</Label>
          <Description>This is the description for item 3</Description>
        </Item>
      </List>
    </>
  )
}

export const WithTrailing = () => {
  return (
    <>
      <List>
        <Item>
          <Label>Item 1</Label>
          <Description>This is the description for item 1</Description>
          <Trailing>🔥</Trailing>
        </Item>
        <Item>
          <Label>Item 2</Label>
          <Description>This is the description for item 2</Description>
          <Trailing>🔥</Trailing>
        </Item>
        <Item>
          <Label>Item 3</Label>
          <Description>This is the description for item 3</Description>
          <Trailing>🔥</Trailing>
        </Item>
      </List>
      <List layout="block">
        <Item>
          <Label>Item 1</Label>
          <Description>This is the description for item 1</Description>
          <Trailing>🔥</Trailing>
        </Item>
        <Item>
          <Label>Item 2</Label>
          <Description>This is the description for item 2</Description>
          <Trailing>🔥</Trailing>
        </Item>
        <Item>
          <Label>Item 3</Label>
          <Description>This is the description for item 3</Description>
          <Trailing>🔥</Trailing>
        </Item>
      </List>
    </>
  )
}

export const WithLeadingAndTrailing = () => {
  return (
    <>
      <List showDividers>
        <Item>
          <Leading>🔥</Leading>
          <Label>Item 1</Label>
          <Description>This is the description for item 1</Description>
          <Trailing>🔥</Trailing>
        </Item>
        <Item>
          <Leading>🔥</Leading>
          <Label>Item 2</Label>
          <Description>This is the description for item 2</Description>
          <Trailing>🔥</Trailing>
        </Item>
        <Item>
          <Leading>🔥</Leading>
          <Label>Item 3</Label>
          <Description>This is the description for item 3</Description>
          <Trailing>🔥</Trailing>
        </Item>
      </List>
      <List layout="block" showDividers>
        <Item>
          <Leading>🔥</Leading>
          <Label>Item 1</Label>
          <Description>This is the description for item 1</Description>
          <Trailing>🔥</Trailing>
        </Item>
        <Item>
          <Leading>🔥</Leading>
          <Label>Item 2</Label>
          <Description>This is the description for item 2</Description>
          <Trailing>🔥</Trailing>
        </Item>
        <Item>
          <Leading>🔥</Leading>
          <Label>Item 3</Label>
          <Description>This is the description for item 3</Description>
          <Trailing>🔥</Trailing>
        </Item>
      </List>
    </>
  )
}

export const WithDividers = () => {
  return (
    <>
      <List showDividers layout="block">
        <Item>
          <Label>Item 1</Label>
          <Description>This is the description for item 1</Description>
        </Item>
        <Item>
          <Label>Item 2</Label>
          <Description>This is the description for item 2</Description>
        </Item>
        <Item>
          <Label>Item 3</Label>
          <Description>This is the description for item 3</Description>
        </Item>
      </List>
    </>
  )
}

export const WithDisabled = () => {
  return (
    <>
      <List>
        <Item>
          <Label>Enabled item</Label>
          <Description>This item can be selected</Description>
        </Item>
        <Item disabled>
          <Label>Disabled</Label>
          <Description>This item is unavailable</Description>
        </Item>
      </List>
    </>
  )
}

export const WithSelection = () => {
  const [selected, setSelected] = useState<string | null>(null)
  const items = [
    {
      id: 0,
      label: 'Option 1',
      description: 'This is the description for option 1',
      value: 'option-1',
    },
    {
      id: 1,
      label: 'Option 2',
      description: 'This is the description for option 2',
      value: 'option-2',
    },
    {
      id: 2,
      label: 'Option 3',
      description: 'This is the description for option 3',
      value: 'option-3',
    },
  ]
  const {getListboxProps, getOptionProps} = useListbox({
    onChange({value}) {
      setSelected(value)
    },
  })

  return (
    <>
      <List {...getListboxProps()} layout="block">
        {items.map(item => {
          return (
            <Item {...getOptionProps({value: item.value})} key={item.id}>
              <Leading>
                <Selection selected={selected === item.value} />
              </Leading>
              <Label>{item.label}</Label>
              <Description>{item.description}</Description>
            </Item>
          )
        })}
      </List>
    </>
  )
}

export const WithCustomElementSelection = () => {
  const [selected, setSelected] = useState<string | null>(null)
  const ref = useRef<HTMLElement | null>(null)
  const items = [
    {
      id: 0,
      label: 'Option 1',
      description: 'This is the description for option 1',
      value: 'option-1',
    },
    {
      id: 1,
      label: 'Option 2',
      description: 'This is the description for option 2',
      value: 'option-2',
    },
    {
      id: 2,
      label: 'Option 3',
      description: 'This is the description for option 3',
      value: 'option-3',
    },
  ]

  useEffect(() => {
    const {current: listbox} = ref
    if (!listbox) {
      return
    }

    function onChange(event: Event) {
      if (event instanceof CustomEvent) {
        setSelected(event.detail.value)
      }
    }

    listbox.addEventListener('change', onChange)

    return () => {
      listbox.removeEventListener('change', onChange)
    }
  }, [])

  return (
    <>
      <List ref={ref} as="ui-listbox" layout="block">
        {items.map(item => {
          return (
            <Item as="ui-option" key={item.id} value={item.value}>
              <Leading>
                <Selection selected={selected === item.value} />
              </Leading>
              <Label>{item.label}</Label>
              <Description>{item.description}</Description>
            </Item>
          )
        })}
      </List>
    </>
  )
}

type StoryTreeItem = TreeItem & {
  description: string
  id: number
}

const treeItems: Array<StoryTreeItem> = [
  {
    id: 0,
    label: 'src',
    description: 'Source files for @primer/react',
    value: 'src',
  },
  {
    id: 1,
    label: 'ActionList',
    description: 'Action list components and behaviors',
    parentValue: 'src',
    value: 'action-list',
  },
  {
    id: 2,
    label: 'List',
    description: 'Composable list primitives',
    parentValue: 'src',
    value: 'list',
  },
  {
    id: 3,
    label: 'SelectPanel',
    description: 'Panel selection patterns',
    parentValue: 'src',
    value: 'select-panel',
  },
  {
    id: 4,
    label: 'docs',
    description: 'Contributor documentation',
    value: 'docs',
  },
  {
    id: 5,
    label: 'Contributing',
    description: 'Guidelines for contributing to Primer React',
    parentValue: 'docs',
    value: 'contributing',
  },
  {
    id: 6,
    label: 'Versioning',
    description: 'Release and changeset guidance',
    parentValue: 'docs',
    value: 'versioning',
  },
]

function groupTreeItemsByParent(items: Array<StoryTreeItem>) {
  const itemsByParentValue = new Map<string | undefined, Array<StoryTreeItem>>()

  for (const item of items) {
    const children = itemsByParentValue.get(item.parentValue)
    if (children) {
      children.push(item)
    } else {
      itemsByParentValue.set(item.parentValue, [item])
    }
  }

  return itemsByParentValue
}

const treeItemsByParentValue = groupTreeItemsByParent(treeItems)

const menuItems = [
  {
    id: 0,
    label: 'Copy link',
    value: 'copy-link',
  },
  {
    id: 1,
    label: 'Quote reply',
    value: 'quote-reply',
  },
  {
    id: 2,
    label: 'Reference in new issue',
    value: 'reference-in-new-issue',
  },
  {
    id: 3,
    label: 'Delete',
    value: 'delete',
    variant: 'danger',
  },
]

function TreeItemGroup({children}: {children: ReactNode}) {
  return (
    <div role="group" style={{display: 'contents'}}>
      {children}
    </div>
  )
}

export const WithTreeSelection = () => {
  const {getTreeItemProps, getTreeProps, selectedValues, visibleItems} = useTree({
    defaultActiveValue: treeItems[0].value,
    defaultExpandedValues: [treeItems[0].value],
    defaultSelectedValues: [treeItems[1].value, treeItems[2].value],
    items: treeItems,
  })
  const visibleItemsByParentValue = useMemo(() => groupTreeItemsByParent(visibleItems), [visibleItems])

  function renderTreeItem(item: StoryTreeItem) {
    const selected = selectedValues.includes(item.value)
    const visibleChildren = visibleItemsByParentValue.get(item.value) ?? []

    return (
      <Fragment key={item.id}>
        <Item {...getTreeItemProps({item})}>
          <Leading>
            <Selection selected={selected} variant="multiple" />
          </Leading>
          <Label>{item.label}</Label>
          <Description>{item.description}</Description>
        </Item>
        {visibleChildren.length > 0 ? <TreeItemGroup>{visibleChildren.map(renderTreeItem)}</TreeItemGroup> : null}
      </Fragment>
    )
  }
  const visibleRootItems = visibleItemsByParentValue.get(undefined) ?? []

  return (
    <>
      <List {...getTreeProps()} layout="block">
        {visibleRootItems.map(renderTreeItem)}
      </List>
    </>
  )
}

export const WithCustomElementTreeSelection = () => {
  const [selectedValues, setSelectedValues] = useState<Array<string>>([treeItems[1].value, treeItems[2].value])
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const {current: tree} = ref
    if (!tree) {
      return
    }

    function onChange(event: Event) {
      if (event instanceof CustomEvent) {
        setSelectedValues(event.detail.selectedValues)
      }
    }

    tree.addEventListener('change', onChange)

    return () => {
      tree.removeEventListener('change', onChange)
    }
  }, [])

  function renderTreeItem(item: StoryTreeItem) {
    const selected = selectedValues.includes(item.value)
    const children = treeItemsByParentValue.get(item.value) ?? []
    const expanded = item.value === 'src'

    return (
      <Fragment key={item.id}>
        <Item
          active={item.value === treeItems[0].value ? '' : undefined}
          aria-expanded={children.length > 0 ? expanded : undefined}
          as="ui-treeitem"
          data-parent-value={item.parentValue}
          expanded={expanded ? '' : undefined}
          selected={selected ? '' : undefined}
          value={item.value}
        >
          <Leading>
            <Selection selected={selected} variant="multiple" />
          </Leading>
          <Label>{item.label}</Label>
          <Description>{item.description}</Description>
        </Item>
        {children.length > 0 ? <TreeItemGroup>{children.map(renderTreeItem)}</TreeItemGroup> : null}
      </Fragment>
    )
  }

  return (
    <>
      <List ref={ref} as="ui-tree" aria-multiselectable="true" layout="block">
        {(treeItemsByParentValue.get(undefined) ?? []).map(renderTreeItem)}
      </List>
    </>
  )
}

export const WithMenu = () => {
  const [lastAction, setLastAction] = useState<string | null>(null)
  const {getMenuItemProps, getMenuProps, getMenuTriggerProps, getPopoverProps} = useMenu({
    defaultActiveValue: menuItems[0].value,
    menuId: 'list-menu',
    triggerId: 'list-menu-trigger',
    onAction({value}) {
      setLastAction(value)
    },
  })

  return (
    <>
      <PopoverRoot>
        <PopoverTrigger {...getMenuTriggerProps()} as={Button}>
          Show menu
        </PopoverTrigger>
        <PopoverContent {...getPopoverProps()}>
          <List {...getMenuProps()} aria-label="Message actions" showDividers>
            {menuItems.map(item => {
              return (
                <Item {...getMenuItemProps({value: item.value})} data-variant={item.variant} key={item.id}>
                  <Label>{item.label}</Label>
                </Item>
              )
            })}
          </List>
        </PopoverContent>
      </PopoverRoot>
      <AriaStatus>{lastAction ? `Last action: ${lastAction}` : null}</AriaStatus>
    </>
  )
}

// export const Group = () => {
//   return 'hi'
// }
//
// export const Disabled = () => {
//   return 'hi'
// }
//
// export const Async = () => {
//   return 'hi'
// }
//
// export const Truncation = () => {
//   return 'hi'
// }
