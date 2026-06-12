class ListboxElement extends HTMLElement {
  static defaultAttributes = {
    role: 'listbox',
    tabindex: '0',
  }

  #activeElement: OptionElement | null = null
  #selectedElement: OptionElement | null = null

  constructor() {
    super()
    this.addEventListener('toggle-select-option', this.onToggleSelectOption)
    this.addEventListener('keydown', this.onKeyDown)
    this.addEventListener('focus', this.onFocus)
  }

  connectedCallback() {
    for (const [key, value] of Object.entries(ListboxElement.defaultAttributes)) {
      if (!this.hasAttribute(key)) {
        this.setAttribute(key, value)
      }
    }
  }

  onFocus = () => {
    const walker = getOptionsWalker(this, this.#activeElement)
    const nextOption = getNextOption(walker)
    if (!nextOption) {
      return
    }

    if (this.#activeElement) {
      this.#activeElement.active = false
    }

    this.#activeElement = nextOption
    this.#activeElement.active = true
    this.#activeElement.focus()
    this.removeAttribute('tabindex')
  }

  onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      this.visitNextOption()
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      this.visitPreviousOption()
    } else if (event.key === 'Home') {
      event.preventDefault()
      this.visitFirstOption()
    } else if (event.key === 'End') {
      event.preventDefault()
      this.visitLastOption()
    }
  }

  onToggleSelectOption = (event: ToggleSelectOptionEvent) => {
    if (this.#selectedElement === event.detail.option) {
      this.unselectOption(this.#selectedElement)
    } else {
      this.selectOption(event.detail.option)
    }
  }

  selectOption(option: OptionElement) {
    if (this.#selectedElement) {
      this.#selectedElement.selected = false
    }

    this.#selectedElement = option
    this.#selectedElement.selected = true
    this.dispatchEvent(
      new CustomEvent('change', {
        bubbles: true,
        composed: true,
        detail: {
          option: this.#selectedElement,
          value: this.#selectedElement.value,
        },
      }),
    )
  }

  unselectOption(option: OptionElement) {
    if (this.#selectedElement === option) {
      this.#selectedElement.selected = false
      this.#selectedElement = null
    }
  }

  visitOption(option: OptionElement) {
    if (this.#activeElement) {
      this.#activeElement.active = false
    }

    this.#activeElement = option
    this.#activeElement.active = true
    this.#activeElement.focus()
  }

  visitNextOption = () => {
    const walker = getOptionsWalker(this, this.#activeElement)
    const nextOption = getNextOption(walker)
    if (nextOption) {
      this.visitOption(nextOption)
    }
  }

  visitPreviousOption = () => {
    const walker = getOptionsWalker(this, this.#activeElement)
    const previousOption = getPreviousOption(walker)
    if (previousOption) {
      this.visitOption(previousOption)
    }
  }

  visitFirstOption = () => {
    const firstOption = getFirstOption(this)
    if (firstOption) {
      this.visitOption(firstOption)
    }
  }

  visitLastOption = () => {
    const lastOption = getLastOption(this)
    if (lastOption) {
      this.visitOption(lastOption)
    }
  }
}

function getOptionsWalker(root: Node, activeElement: OptionElement | null): TreeWalker {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, {
    acceptNode(node) {
      if (node instanceof OptionElement) {
        if (node.hasAttribute('disabled') || node.getAttribute('aria-disabled') === 'true') {
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

function findOption(walker: TreeWalker, predicate: (option: OptionElement) => boolean): OptionElement | null {
  let node: Node | null = null

  while (walker.nextNode()) {
    if (walker.currentNode instanceof OptionElement && predicate(walker.currentNode)) {
      node = walker.currentNode
      break
    }
  }

  return node instanceof OptionElement ? node : null
}

function getNextOption(walker: TreeWalker): OptionElement | null {
  const nextNode = walker.nextNode()
  if (nextNode instanceof OptionElement) {
    return nextNode
  }

  walker.currentNode = walker.root
  return walker.nextNode() instanceof OptionElement ? (walker.currentNode as OptionElement) : null
}

function getPreviousOption(walker: TreeWalker): OptionElement | null {
  const previousNode = walker.previousNode()
  if (previousNode instanceof OptionElement) {
    return previousNode
  }

  walker.currentNode = walker.root

  let lastNode: Node | null = null

  while (walker.nextNode()) {
    if (walker.currentNode instanceof OptionElement) {
      lastNode = walker.currentNode
    }
  }

  return lastNode instanceof OptionElement ? lastNode : null
}

function getFirstOption(root: Node): OptionElement | null {
  const walker = getOptionsWalker(root, null)
  const firstNode = walker.nextNode()
  return firstNode instanceof OptionElement ? firstNode : null
}

function getLastOption(root: Node): OptionElement | null {
  const walker = getOptionsWalker(root, null)

  let lastNode: Node | null = null

  while (walker.nextNode()) {
    if (walker.currentNode instanceof OptionElement) {
      lastNode = walker.currentNode
    }
  }

  return lastNode instanceof OptionElement ? lastNode : null
}

type ToggleSelectOptionEvent = CustomEvent<{option: OptionElement}>

function toggleSelectOption(option: OptionElement): CustomEvent {
  return new CustomEvent('toggle-select-option', {
    detail: {
      option,
    },
    bubbles: true,
    composed: true,
  })
}

type SelectOptionEvent = CustomEvent<{option: OptionElement}>

declare global {
  interface HTMLElementEventMap {
    'toggle-select-option': ToggleSelectOptionEvent
  }
}

// <ui-option active selected disabled></ui-option>
// <ui-option active selected disabled aria-disabled="true"></ui-option>
// <ui-option active selected aria-selected="true" disabled aria-disabled="true"></ui-option>
class OptionElement extends HTMLElement {
  static defaultAttributes = {
    role: 'option',
    tabindex: '-1',
  }

  constructor() {
    super()

    this.addEventListener('click', this.onClick)
    this.addEventListener('keydown', this.onKeyDown)
    this.addEventListener('focus', this.onFocus)
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

  get selected() {
    return this.hasAttribute('selected') && this.getAttribute('aria-selected') !== 'false'
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
    for (const [key, value] of Object.entries(OptionElement.defaultAttributes)) {
      if (!this.hasAttribute(key)) {
        this.setAttribute(key, value)
      }
    }

    this.active = this.hasAttribute('active')
    this.disabled = this.hasAttribute('disabled')
    this.selected = this.hasAttribute('selected')
  }

  onClick = () => {
    if (this.disabled) {
      return
    }

    this.dispatchEvent(toggleSelectOption(this))
  }

  onFocus = () => {
    if (this.disabled) {
      return
    }

    const listbox = this.closest('ui-listbox')
    if (listbox && listbox instanceof ListboxElement) {
      listbox.visitOption(this)
    }
  }

  onKeyDown = (event: KeyboardEvent) => {
    if (this.disabled) {
      return
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      this.dispatchEvent(toggleSelectOption(this))
    }
  }
}

class GroupElement extends HTMLElement {
  static defaultAttributes = {
    role: 'group',
  }

  connectedCallback() {
    for (const [key, value] of Object.entries(GroupElement.defaultAttributes)) {
      if (!this.hasAttribute(key)) {
        this.setAttribute(key, value)
      }
    }
  }
}

customElements.define('ui-listbox', ListboxElement)
customElements.define('ui-option', OptionElement)
customElements.define('ui-group', GroupElement)

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'ui-listbox': React.DetailedHTMLProps<React.HTMLAttributes<ListboxElement>, ListboxElement>
      'ui-option': React.DetailedHTMLProps<React.HTMLAttributes<OptionElement>, OptionElement>
      'ui-group': React.DetailedHTMLProps<React.HTMLAttributes<GroupElement>, GroupElement>
    }
  }
}
