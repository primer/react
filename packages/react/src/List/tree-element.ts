class TreeElement extends HTMLElement {
  static defaultAttributes = {
    role: 'tree',
  }

  #activeItem: TreeItemElement | null = null
  #selectedItem: TreeItemElement | null = null

  connectedCallback() {
    for (const [key, value] of Object.entries(TreeElement.defaultAttributes)) {
      if (!this.hasAttribute(key)) {
        this.setAttribute(key, value)
      }
    }
  }

  visitItem = (item: TreeItemElement) => {
    if (this.#activeItem) {
      this.#activeItem.active = false
      this.#activeItem.setAttribute('tabindex', '-1')
    }

    this.#activeItem = item
    this.#activeItem.active = true
    this.#activeItem.setAttribute('tabindex', '0')
    this.#activeItem.focus()
  }
}

class TreeItemElement extends HTMLElement {
  static defaultAttributes = {
    role: 'treeitem',
    tabindex: '-1',
  }

  get active() {
    return this.hasAttribute('active')
  }

  set active(isActive) {
    if (isActive) {
      this.setAttribute('active', '')
    } else {
      this.removeAttribute('active')
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
}

customElements.define('ui-tree', TreeElement)
customElements.define('ui-treeitem', TreeItemElement)

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'ui-tree': React.DetailedHTMLProps<React.HTMLAttributes<TreeElement>, TreeElement>
      'ui-treeitem': React.DetailedHTMLProps<React.HTMLAttributes<TreeItemElement>, TreeItemElement>
    }
  }
}
