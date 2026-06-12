class TreeElement extends HTMLElement {
  static defaultAttributes = {
    role: 'tree',
  }

  #activeItem: TreeItemElement | null = null
  #selectedItems = new Set<TreeItemElement>()

  constructor() {
    super()

    this.addEventListener('toggle-select-treeitem', this.onToggleSelectTreeItem)
    this.addEventListener('keydown', this.onKeyDown)
  }

  connectedCallback() {
    for (const [key, value] of Object.entries(TreeElement.defaultAttributes)) {
      if (!this.hasAttribute(key)) {
        this.setAttribute(key, value)
      }
    }

    for (const item of getTreeItems(this)) {
      if (item.selected) {
        this.#selectedItems.add(item)
      }
    }

    this.updateTreeItems()

    const visibleItems = getVisibleTreeItems(this)
    const activeItem = visibleItems.find(item => item.active) ?? visibleItems.at(0)
    if (activeItem) {
      this.visitItem(activeItem)
    }
  }

  visitItem = (item: TreeItemElement) => {
    if (item.disabled || item.hidden) {
      return
    }

    if (this.#activeItem) {
      this.#activeItem.active = false
    }

    this.#activeItem = item
    this.#activeItem.active = true
    this.#activeItem.focus()
  }

  onKeyDown = (event: KeyboardEvent) => {
    const activeItem = this.#activeItem
    if (!activeItem) {
      return
    }

    const visibleItems = getVisibleTreeItems(this)
    const activeIndex = visibleItems.indexOf(activeItem)

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      this.visitItem(visibleItems[Math.min(activeIndex + 1, visibleItems.length - 1)])
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      this.visitItem(visibleItems[Math.max(activeIndex - 1, 0)])
    } else if (event.key === 'Home') {
      event.preventDefault()
      this.visitItem(visibleItems[0])
    } else if (event.key === 'End') {
      event.preventDefault()
      this.visitItem(visibleItems[visibleItems.length - 1])
    } else if (event.key === 'ArrowRight') {
      const children = getChildren(this, activeItem.value)
      if (children.length === 0) {
        return
      }

      event.preventDefault()
      if (activeItem.expanded) {
        this.visitItem(children[0])
      } else {
        activeItem.expanded = true
        this.updateTreeItems()
      }
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      if (activeItem.expanded) {
        activeItem.expanded = false
        this.updateTreeItems()
      } else if (activeItem.parentValue) {
        const parent = findItemByValue(this, activeItem.parentValue)
        if (parent) {
          this.visitItem(parent)
        }
      }
    } else if (event.key === '*') {
      event.preventDefault()
      for (const sibling of getChildren(this, activeItem.parentValue)) {
        if (getChildren(this, sibling.value).length > 0) {
          sibling.expanded = true
        }
      }
      this.updateTreeItems()
    } else if (isPrintableCharacter(event)) {
      const nextItem = findNextItemByLabel(visibleItems, activeIndex, event.key)
      if (nextItem) {
        event.preventDefault()
        this.visitItem(nextItem)
      }
    }
  }

  onToggleSelectTreeItem = (event: ToggleSelectTreeItemEvent) => {
    if (this.#selectedItems.has(event.detail.item)) {
      this.unselectItem(event.detail.item)
    } else {
      this.selectItem(event.detail.item)
    }
  }

  selectItem(item: TreeItemElement) {
    this.#selectedItems.add(item)
    item.selected = true
    this.dispatchChangeEvent()
  }

  unselectItem(item: TreeItemElement) {
    this.#selectedItems.delete(item)
    item.selected = false
    this.dispatchChangeEvent()
  }

  updateTreeItems() {
    for (const item of getTreeItems(this)) {
      const children = getChildren(this, item.value)
      const siblings = getChildren(this, item.parentValue)

      item.hidden = !isVisible(this, item)
      item.setAttribute('aria-level', String(getLevel(this, item)))
      item.setAttribute('aria-posinset', String(siblings.indexOf(item) + 1))
      item.setAttribute('aria-setsize', String(siblings.length))

      if (children.length > 0) {
        item.setAttribute('aria-expanded', item.expanded ? 'true' : 'false')
      } else {
        item.removeAttribute('aria-expanded')
      }
    }
  }

  dispatchChangeEvent() {
    this.dispatchEvent(
      new CustomEvent('change', {
        bubbles: true,
        composed: true,
        detail: {
          items: Array.from(this.#selectedItems),
          selectedValues: Array.from(this.#selectedItems, item => item.value).filter(value => value !== null),
        },
      }),
    )
  }
}

function getTreeItems(root: ParentNode): Array<TreeItemElement> {
  return Array.from(root.querySelectorAll('ui-treeitem')).filter((item): item is TreeItemElement => {
    return item instanceof TreeItemElement && !item.disabled
  })
}

function getVisibleTreeItems(root: ParentNode): Array<TreeItemElement> {
  return getTreeItems(root).filter(item => !item.hidden)
}

function getChildren(root: ParentNode, parentValue: string | null): Array<TreeItemElement> {
  return getTreeItems(root).filter(item => item.parentValue === parentValue)
}

function findItemByValue(root: ParentNode, value: string): TreeItemElement | undefined {
  return getTreeItems(root).find(item => item.value === value)
}

function isVisible(root: ParentNode, item: TreeItemElement) {
  let parentValue = item.parentValue

  while (parentValue) {
    const parent = findItemByValue(root, parentValue)
    if (!parent || !parent.expanded) {
      return false
    }
    parentValue = parent.parentValue
  }

  return true
}

function getLevel(root: ParentNode, item: TreeItemElement) {
  let level = 1
  let parentValue = item.parentValue

  while (parentValue) {
    const parent = findItemByValue(root, parentValue)
    if (!parent) {
      break
    }
    level += 1
    parentValue = parent.parentValue
  }

  return level
}

function findNextItemByLabel(items: Array<TreeItemElement>, activeIndex: number, key: string) {
  const normalizedKey = key.toLocaleLowerCase()
  const orderedItems = [...items.slice(activeIndex + 1), ...items.slice(0, activeIndex + 1)]

  return orderedItems.find(item => item.textContent.trim().toLocaleLowerCase().startsWith(normalizedKey))
}

function isPrintableCharacter(event: KeyboardEvent) {
  return event.key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey && event.key !== ' '
}

type ToggleSelectTreeItemEvent = CustomEvent<{item: TreeItemElement}>

function toggleSelectTreeItem(item: TreeItemElement): CustomEvent {
  return new CustomEvent('toggle-select-treeitem', {
    detail: {
      item,
    },
    bubbles: true,
    composed: true,
  })
}

declare global {
  interface HTMLElementEventMap {
    'toggle-select-treeitem': ToggleSelectTreeItemEvent
  }
}

class TreeItemElement extends HTMLElement {
  static defaultAttributes = {
    role: 'treeitem',
    tabindex: '-1',
  }

  static observedAttributes = ['active', 'expanded', 'disabled', 'selected']

  constructor() {
    super()

    this.addEventListener('click', this.onClick)
    this.addEventListener('focus', this.onFocus)
    this.addEventListener('keydown', this.onKeyDown)
  }

  get active() {
    return this.hasAttribute('active')
  }

  set active(isActive) {
    if (isActive) {
      this.setAttribute('active', '')
      this.setAttribute('tabindex', '0')
    } else {
      this.removeAttribute('active')
      this.setAttribute('tabindex', '-1')
    }
  }

  get expanded() {
    return this.hasAttribute('expanded') && this.getAttribute('aria-expanded') === 'true'
  }

  set expanded(isExpanded) {
    if (isExpanded) {
      this.setAttribute('expanded', '')
      this.setAttribute('aria-expanded', 'true')
    } else {
      this.removeAttribute('expanded')
      this.setAttribute('aria-expanded', 'false')
    }
  }

  get disabled() {
    return this.hasAttribute('disabled') && this.getAttribute('aria-disabled') === 'true'
  }

  set disabled(isDisabled) {
    if (isDisabled) {
      this.setAttribute('disabled', '')
      this.setAttribute('aria-disabled', 'true')
    } else {
      this.removeAttribute('disabled')
      this.setAttribute('aria-disabled', 'false')
    }
  }

  get parentValue() {
    return this.getAttribute('data-parent-value')
  }

  get selected() {
    return this.hasAttribute('selected') && this.getAttribute('aria-selected') === 'true'
  }

  set selected(isSelected) {
    if (isSelected) {
      this.setAttribute('selected', '')
      this.setAttribute('aria-selected', 'true')
    } else {
      this.removeAttribute('selected')
      this.setAttribute('aria-selected', 'false')
    }
  }

  get value() {
    return this.getAttribute('value')
  }

  set value(newValue) {
    if (newValue !== null) {
      this.setAttribute('value', newValue)
    } else {
      this.removeAttribute('value')
    }
  }

  connectedCallback() {
    for (const [key, value] of Object.entries(TreeItemElement.defaultAttributes)) {
      if (!this.hasAttribute(key)) {
        this.setAttribute(key, value)
      }
    }

    this.active = this.hasAttribute('active')
    this.expanded = this.hasAttribute('expanded')
    this.disabled = this.hasAttribute('disabled')
    this.selected = this.hasAttribute('selected')
  }

  attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null) {
    if (name === 'active') {
      this.active = newValue !== null && newValue === ''
    } else if (name === 'expanded') {
      this.expanded = newValue !== null && newValue === ''
    } else if (name === 'disabled') {
      this.disabled = newValue !== null && newValue === ''
    } else if (name === 'selected') {
      this.selected = newValue !== null && newValue === ''
    }
  }

  onClick = () => {
    if (this.disabled) {
      return
    }

    this.dispatchEvent(toggleSelectTreeItem(this))
  }

  onFocus = () => {
    if (this.disabled) {
      return
    }

    const tree = this.closest('ui-tree')
    if (tree && tree instanceof TreeElement) {
      tree.visitItem(this)
    }
  }

  onKeyDown = (event: KeyboardEvent) => {
    if (this.disabled) {
      return
    }

    if (event.key === ' ') {
      event.preventDefault()
      this.dispatchEvent(toggleSelectTreeItem(this))
    }
  }
}

// eslint-disable-next-line ssr-friendly/no-dom-globals-in-module-scope
customElements.define('ui-tree', TreeElement)
// eslint-disable-next-line ssr-friendly/no-dom-globals-in-module-scope
customElements.define('ui-treeitem', TreeItemElement)

declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'ui-tree': React.DetailedHTMLProps<React.HTMLAttributes<TreeElement>, TreeElement>
      'ui-treeitem': React.DetailedHTMLProps<React.HTMLAttributes<TreeItemElement>, TreeItemElement>
    }
  }
}
