import {useMemo, useState, type KeyboardEvent} from 'react'

type TreeItem = {
  label: string
  parentValue?: string
  value: string
}

type UseTreeOptions<T extends TreeItem> = {
  defaultActiveValue: string
  defaultExpandedValues?: Array<string>
  defaultSelectedValues?: Array<string>
  items: Array<T>
  onChange?: ({selectedValues}: {selectedValues: Array<string>}) => void
}

function useTree<T extends TreeItem>({
  defaultActiveValue,
  defaultExpandedValues = [],
  defaultSelectedValues = [],
  items,
  onChange,
}: UseTreeOptions<T>) {
  const [active, setActive] = useState(defaultActiveValue)
  const [expandedValues, setExpandedValues] = useState(defaultExpandedValues)
  const [selectedValues, setSelectedValues] = useState(defaultSelectedValues)

  const visibleItems = useMemo(() => {
    const nextItems: Array<T> = []

    function visit(parentValue?: string) {
      for (const item of getChildren(items, parentValue)) {
        nextItems.push(item)
        if (expandedValues.includes(item.value)) {
          visit(item.value)
        }
      }
    }

    visit()
    return nextItems
  }, [expandedValues, items])

  function updateSelectedValues(nextSelectedValues: Array<string>) {
    setSelectedValues(nextSelectedValues)
    if (onChange) {
      onChange({selectedValues: nextSelectedValues})
    }
  }

  function toggleItem(value: string) {
    const nextSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter(selectedValue => selectedValue !== value)
      : [...selectedValues, value]
    updateSelectedValues(nextSelectedValues)
  }

  function expandItem(value: string) {
    setExpandedValues(current => (current.includes(value) ? current : [...current, value]))
  }

  function collapseItem(value: string) {
    setExpandedValues(current => current.filter(expandedValue => expandedValue !== value))
  }

  function focusTreeItem(root: HTMLElement, value: string) {
    const item = getTreeItemElements(root).find(element => element.getAttribute('data-tree-value') === value)
    item?.focus()
  }

  function focusTreeItemAtIndex(root: HTMLElement, index: number) {
    const item = visibleItems.at(index)
    if (item) {
      focusTreeItem(root, item.value)
    }
  }

  function getTreeProps() {
    return {
      'aria-multiselectable': true,
      role: 'tree',
      onKeyDown(event: KeyboardEvent<HTMLElement>) {
        const activeIndex = visibleItems.findIndex(item => item.value === active)
        if (activeIndex === -1) {
          return
        }
        const activeItem = visibleItems[activeIndex]

        if (event.key === 'ArrowDown') {
          event.preventDefault()
          focusTreeItemAtIndex(event.currentTarget, Math.min(activeIndex + 1, visibleItems.length - 1))
        } else if (event.key === 'ArrowUp') {
          event.preventDefault()
          focusTreeItemAtIndex(event.currentTarget, Math.max(activeIndex - 1, 0))
        } else if (event.key === 'Home') {
          event.preventDefault()
          focusTreeItemAtIndex(event.currentTarget, 0)
        } else if (event.key === 'End') {
          event.preventDefault()
          focusTreeItemAtIndex(event.currentTarget, visibleItems.length - 1)
        } else if (event.key === 'ArrowRight') {
          const children = getChildren(items, activeItem.value)
          if (children.length === 0) {
            return
          }

          event.preventDefault()
          if (expandedValues.includes(activeItem.value)) {
            focusTreeItem(event.currentTarget, children[0].value)
          } else {
            expandItem(activeItem.value)
          }
        } else if (event.key === 'ArrowLeft') {
          event.preventDefault()
          if (expandedValues.includes(activeItem.value)) {
            collapseItem(activeItem.value)
          } else if (activeItem.parentValue) {
            focusTreeItem(event.currentTarget, activeItem.parentValue)
          }
        } else if (event.key === ' ') {
          event.preventDefault()
          toggleItem(activeItem.value)
        } else if (event.key === '*') {
          event.preventDefault()
          const siblings = getChildren(items, activeItem.parentValue)
          setExpandedValues(current => {
            const next = new Set(current)
            for (const sibling of siblings) {
              if (getChildren(items, sibling.value).length > 0) {
                next.add(sibling.value)
              }
            }
            return Array.from(next)
          })
        } else if (isPrintableCharacter(event)) {
          const nextItem = findNextItemByLabel(visibleItems, activeIndex, event.key)
          if (nextItem) {
            event.preventDefault()
            focusTreeItem(event.currentTarget, nextItem.value)
          }
        }
      },
    }
  }

  function getTreeItemProps({item}: {item: TreeItem}) {
    const children = getChildren(items, item.value)
    const siblings = getChildren(items, item.parentValue)
    const selected = selectedValues.includes(item.value)

    return {
      'aria-expanded': children.length > 0 ? expandedValues.includes(item.value) : undefined,
      'aria-level': getLevel(items, item),
      'aria-posinset': siblings.findIndex(sibling => sibling.value === item.value) + 1,
      'aria-selected': selected,
      'aria-setsize': siblings.length,
      'data-active': active === item.value,
      'data-tree-value': item.value,
      role: 'treeitem',
      tabIndex: active === item.value ? 0 : -1,
      value: item.value,
      onClick() {
        toggleItem(item.value)
      },
      onFocus() {
        setActive(item.value)
      },
    }
  }

  return {
    getTreeItemProps,
    getTreeProps,
    selectedValues,
    visibleItems,
  }
}

function getChildren<T extends TreeItem>(items: Array<T>, parentValue?: string) {
  return items.filter(item => item.parentValue === parentValue)
}

function getLevel<T extends TreeItem>(items: Array<T>, item: T) {
  let level = 1
  let parentValue = item.parentValue

  while (parentValue) {
    const parent = items.find(candidate => candidate.value === parentValue)
    if (!parent) {
      break
    }
    level += 1
    parentValue = parent.parentValue
  }

  return level
}

function getTreeItemElements(root: HTMLElement) {
  return Array.from(root.querySelectorAll('[role="treeitem"]')).filter((item): item is HTMLElement => {
    return item instanceof HTMLElement && item.getAttribute('aria-disabled') !== 'true'
  })
}

function findNextItemByLabel<T extends TreeItem>(items: Array<T>, activeIndex: number, key: string) {
  const normalizedKey = key.toLocaleLowerCase()
  const orderedItems = [...items.slice(activeIndex + 1), ...items.slice(0, activeIndex + 1)]

  return orderedItems.find(item => item.label.toLocaleLowerCase().startsWith(normalizedKey))
}

function isPrintableCharacter(event: KeyboardEvent<HTMLElement>) {
  return event.key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey && event.key !== ' '
}

export {useTree}
export type {TreeItem}
