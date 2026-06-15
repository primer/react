class MenuElement extends HTMLElement {
  static defaultAttributes = {
    role: 'menu',
    tabindex: '0',
  }

  #activeElement: MenuItemElement | null = null

  constructor() {
    super()

    this.addEventListener('activate-menuitem', this.onActivateMenuItem)
    this.addEventListener('focus', this.onFocus)
    this.addEventListener('keydown', this.onKeyDown)
  }

  connectedCallback() {
    for (const [key, value] of Object.entries(MenuElement.defaultAttributes)) {
      if (!this.hasAttribute(key)) {
        this.setAttribute(key, value)
      }
    }
  }

  onFocus = () => {
    const item = getFirstItem(this)

    if (item) {
      this.visitItem(item)
      this.setAttribute('tabindex', '-1')
    }
  }

  onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      this.visitNextItem()
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      this.visitPreviousItem()
    } else if (event.key === 'Home') {
      event.preventDefault()
      this.visitFirstItem()
    } else if (event.key === 'End') {
      event.preventDefault()
      this.visitLastItem()
    } else if (event.key === 'Escape') {
      event.preventDefault()
      this.dispatchEvent(closeMenu('escape'))
    } else if (event.key === 'Tab') {
      this.dispatchEvent(closeMenu('tab'))
    } else if (isPrintableCharacter(event)) {
      const items = getMenuItems(this)
      const activeIndex = this.#activeElement ? items.indexOf(this.#activeElement) : -1
      const item = findNextItemByLabel(items, activeIndex, event.key)

      if (item) {
        event.preventDefault()
        this.visitItem(item)
      }
    }
  }

  onActivateMenuItem = (event: ActivateMenuItemEvent) => {
    this.dispatchEvent(
      new CustomEvent('action', {
        bubbles: true,
        composed: true,
        detail: {
          item: event.detail.item,
          value: event.detail.item.value,
        },
      }),
    )
  }

  visitNextItem() {
    const walker = getMenuItemWalker(this, this.#activeElement)
    const nextItem = getNextItem(walker)
    if (nextItem) {
      this.visitItem(nextItem)
    }
  }

  visitPreviousItem() {
    const walker = getMenuItemWalker(this, this.#activeElement)
    const previousItem = getPreviousItem(walker)
    if (previousItem) {
      this.visitItem(previousItem)
    }
  }

  visitFirstItem() {
    const firstItem = getFirstItem(this)
    if (firstItem) {
      this.visitItem(firstItem)
    }
  }

  visitLastItem() {
    const lastItem = getLastItem(this)
    if (lastItem) {
      this.visitItem(lastItem)
    }
  }

  visitItem(item: MenuItemElement) {
    if (this.#activeElement) {
      this.#activeElement.active = false
    }
    item.active = true
    this.#activeElement = item
    this.#activeElement.focus()
  }
}

function getMenuItems(root: ParentNode): Array<MenuItemElement> {
  return Array.from(root.querySelectorAll('ui-menuitem')).filter((item): item is MenuItemElement => {
    return item instanceof MenuItemElement && !item.disabled
  })
}

function getMenuItemWalker(root: MenuElement, activeElement: MenuItemElement | null): TreeWalker {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, {
    acceptNode(node) {
      if (node instanceof MenuItemElement) {
        if (node.disabled) {
          return NodeFilter.FILTER_SKIP
        }
        return NodeFilter.FILTER_ACCEPT
      }
      return NodeFilter.FILTER_SKIP
    },
  })

  if (activeElement) {
    walker.currentNode = activeElement
  }

  return walker
}

function getNextItem(walker: TreeWalker): MenuItemElement | null {
  const nextNode = walker.nextNode()
  if (nextNode instanceof MenuItemElement) {
    return nextNode
  }

  walker.currentNode = walker.root
  return walker.nextNode() instanceof MenuItemElement ? (walker.currentNode as MenuItemElement) : null
}

function getPreviousItem(walker: TreeWalker): MenuItemElement | null {
  const previousNode = walker.previousNode()
  if (previousNode instanceof MenuItemElement) {
    return previousNode
  }

  walker.currentNode = walker.root

  while (walker.previousNode()) {
    if (walker.currentNode instanceof MenuItemElement) {
      return walker.currentNode
    }
  }

  return null
}

function getFirstItem(root: MenuElement): MenuItemElement | null {
  const walker = getMenuItemWalker(root, null)

  if (walker.currentNode instanceof MenuItemElement) {
    return walker.currentNode
  }

  while (walker.nextNode()) {
    if (walker.currentNode instanceof MenuItemElement) {
      return walker.currentNode
    }
  }

  return null
}

function getLastItem(root: MenuElement): MenuItemElement | null {
  const walker = getMenuItemWalker(root, null)

  walker.lastChild()
  if (walker.currentNode instanceof MenuItemElement) {
    return walker.currentNode
  }

  while (walker.previousNode()) {
    if (walker.currentNode instanceof MenuItemElement) {
      return walker.currentNode
    }
  }

  return null
}

function findNextItemByLabel(items: Array<MenuItemElement>, activeIndex: number, key: string) {
  const normalizedKey = key.toLocaleLowerCase()
  const orderedItems = [...items.slice(activeIndex + 1), ...items.slice(0, activeIndex + 1)]

  return orderedItems.find(item => item.textContent.trim().toLocaleLowerCase().startsWith(normalizedKey))
}

function isPrintableCharacter(event: KeyboardEvent) {
  return event.key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey && event.key !== ' '
}

type ActivateMenuItemEvent = CustomEvent<{item: MenuItemElement}>

function activateMenuItem(item: MenuItemElement): CustomEvent {
  return new CustomEvent('activate-menuitem', {
    detail: {
      item,
    },
    bubbles: true,
    composed: true,
  })
}

type MenuActionEvent = CustomEvent<{item: MenuItemElement; value: string | null}>

type CloseMenuEvent = CustomEvent<{reason: 'escape' | 'tab'}>

function closeMenu(reason: 'escape' | 'tab'): CustomEvent {
  return new CustomEvent('close-menu', {
    detail: {
      reason,
    },
    bubbles: true,
    composed: true,
  })
}

declare global {
  interface HTMLElementEventMap {
    'activate-menuitem': ActivateMenuItemEvent
    action: MenuActionEvent
    'close-menu': CloseMenuEvent
  }
}

class MenuItemElement extends HTMLElement {
  static defaultAttributes = {
    role: 'menuitem',
    tabindex: '-1',
  }

  static observedAttributes = ['active', 'disabled']

  constructor() {
    super()

    this.addEventListener('click', this.onClick)
    this.addEventListener('focus', this.onFocus)
    this.addEventListener('keydown', this.onKeyDown)
  }

  get active() {
    return this.hasAttribute('active') && this.getAttribute('tabindex') === '0'
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

  get disabled() {
    return this.hasAttribute('disabled') && this.getAttribute('aria-disabled') !== 'false'
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
    for (const [key, value] of Object.entries(MenuItemElement.defaultAttributes)) {
      if (!this.hasAttribute(key)) {
        this.setAttribute(key, value)
      }
    }

    this.active = this.hasAttribute('active')
    this.disabled = this.hasAttribute('disabled')
  }

  attributeChangedCallback(name: string) {
    if (name === 'active') {
      this.active = this.hasAttribute('active')
    } else if (name === 'disabled') {
      this.disabled = this.hasAttribute('disabled')
    }
  }

  onClick = () => {
    if (this.disabled) {
      return
    }

    this.dispatchEvent(activateMenuItem(this))
  }

  onFocus = () => {
    if (this.disabled) {
      return
    }

    const menu = this.closest('ui-menu')
    if (menu && menu instanceof MenuElement) {
      menu.visitItem(this)
    }
  }

  onKeyDown = (event: KeyboardEvent) => {
    if (this.disabled) {
      return
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      this.dispatchEvent(activateMenuItem(this))
    }
  }
}

// eslint-disable-next-line ssr-friendly/no-dom-globals-in-module-scope
customElements.define('ui-menu', MenuElement)
// eslint-disable-next-line ssr-friendly/no-dom-globals-in-module-scope
customElements.define('ui-menuitem', MenuItemElement)

declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'ui-menu': React.DetailedHTMLProps<React.HTMLAttributes<MenuElement>, MenuElement>
      'ui-menuitem': React.DetailedHTMLProps<React.HTMLAttributes<MenuItemElement>, MenuItemElement>
    }
  }
}
