class MenuElement extends HTMLElement {
  static defaultAttributes = {
    role: 'menu',
    tabindex: '0',
  }

  #activeElement: MenuItemElement | null = null

  constructor() {
    super()

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
    }
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

function getMenuItemWalker(root: MenuElement, activeElement: MenuItemElement | null): TreeWalker {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, {
    acceptNode(node) {
      if (node instanceof MenuItemElement) {
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
  if (nextNode instanceof MenuItemElement && !nextNode.disabled) {
    return nextNode
  }

  walker.currentNode = walker.root
  return walker.nextNode() instanceof MenuItemElement ? (walker.currentNode as MenuItemElement) : null
}

function getPreviousItem(walker: TreeWalker): MenuItemElement | null {
  const previousNode = walker.previousNode()
  if (previousNode instanceof MenuItemElement && !previousNode.disabled) {
    return previousNode
  }

  walker.currentNode = walker.root

  while (walker.previousNode()) {
    if (walker.currentNode instanceof MenuItemElement && !walker.currentNode.disabled) {
      return walker.currentNode
    }
  }

  return null
}

function getFirstItem(root: MenuElement): MenuItemElement | null {
  const walker = getMenuItemWalker(root, null)

  if (walker.currentNode instanceof MenuItemElement && !walker.currentNode.disabled) {
    return walker.currentNode
  }

  while (walker.nextNode()) {
    if (walker.currentNode instanceof MenuItemElement && !walker.currentNode.disabled) {
      return walker.currentNode
    }
  }

  return null
}

function getLastItem(root: MenuElement): MenuItemElement | null {
  const walker = getMenuItemWalker(root, null)

  walker.lastChild()
  if (walker.currentNode instanceof MenuItemElement && !walker.currentNode.disabled) {
    return walker.currentNode
  }

  while (walker.previousNode()) {
    if (walker.currentNode instanceof MenuItemElement && !walker.currentNode.disabled) {
      return walker.currentNode
    }
  }

  return null
}

class MenuItemElement extends HTMLElement {
  static defaultAttributes = {
    role: 'menuitem',
    tabindex: '-1',
  }

  static observedAttributes = ['active', 'disabled']

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
    return this.getAttribute('aria-disabled') !== 'false'
  }

  set disabled(isDisabled) {
    if (isDisabled) {
      this.setAttribute('aria-disabled', 'true')
    } else {
      this.setAttribute('aria-disabled', 'false')
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
}

customElements.define('ui-menu', MenuElement)
customElements.define('ui-menuitem', MenuItemElement)

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'ui-menu': React.DetailedHTMLProps<React.HTMLAttributes<MenuElement>, MenuElement>
      'ui-menuitem': React.DetailedHTMLProps<React.HTMLAttributes<MenuItemElement>, MenuItemElement>
    }
  }
}
