class ListboxElement extends HTMLElement {
  static defaultAttributes = {
    role: 'listbox',
  }

  #activeElement: OptionElement | null = null
  #selectedElement: OptionElement | null = null

  constructor() {
    super()
    this.addEventListener('toggle-select-option', this.onToggleSelectOption)
  }

  connectedCallback() {
    for (const [key, value] of Object.entries(ListboxElement.defaultAttributes)) {
      if (!this.hasAttribute(key)) {
        this.setAttribute(key, value)
      }
    }
  }

  onToggleSelectOption = (event: ToggleSelectOptionEvent) => {
    if (this.#selectedElement) {
      this.#selectedElement.selected = false
    }

    this.#selectedElement = event.detail.option
    this.#selectedElement.selected = true
  }
}

type ToggleSelectOptionEvent = CustomEvent<{option: OptionElement}>

function toggleSelectOption(option: OptionElement): CustomEvent {
  const event = new CustomEvent('toggle-select-option', {
    detail: {
      option,
    },
    bubbles: true,
    composed: true,
  })
  return event
}

type SelectNextOptionEvent = CustomEvent<{option: OptionElement}>

function selectNextOption(option: OptionElement): CustomEvent {
  const event = new CustomEvent('select-next-option', {
    detail: {
      option,
    },
    bubbles: true,
    composed: true,
  })
  return event
}

type SelectPreviousOptionEvent = CustomEvent<{option: OptionElement}>

function selectPreviousOption(option: OptionElement): CustomEvent {
  const event = new CustomEvent('select-previous-option', {
    detail: {
      option,
    },
    bubbles: true,
    composed: true,
  })
  return event
}

type SelectFirstOptionEvent = CustomEvent

function selectFirstOption(): CustomEvent {
  const event = new CustomEvent('select-first-option', {
    bubbles: true,
    composed: true,
  })
  return event
}

type SelectLastOptionEvent = CustomEvent

function selectLastOption(): CustomEvent {
  const event = new CustomEvent('select-last-option', {
    bubbles: true,
    composed: true,
  })
  return event
}

declare global {
  interface HTMLElementEventMap {
    'toggle-select-option': ToggleSelectOptionEvent
    'select-next-option': SelectNextOptionEvent
    'select-previous-option': SelectPreviousOptionEvent
    'select-first-option': SelectFirstOptionEvent
    'select-last-option': SelectLastOptionEvent
  }
}

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
    } else {
      this.removeAttribute('active')
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

  connectedCallback() {
    for (const [key, value] of Object.entries(OptionElement.defaultAttributes)) {
      if (!this.hasAttribute(key)) {
        this.setAttribute(key, value)
      }
    }

    this.active = false
    this.disabled = false
    this.selected = false
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
    //
  }

  onKeyDown = (event: KeyboardEvent) => {
    if (this.disabled) {
      return
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      this.dispatchEvent(toggleSelectOption(this))
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      this.dispatchEvent(selectNextOption(this))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      this.dispatchEvent(selectPreviousOption(this))
    } else if (event.key === 'Home') {
      event.preventDefault()
      this.dispatchEvent(selectFirstOption())
    } else if (event.key === 'End') {
      event.preventDefault()
      this.dispatchEvent(selectLastOption())
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

// namespace global {
//   interface HTMLElementTagNameMap {
//     'ui-listbox': ListboxElement
//     'ui-option': OptionElement
//     'ui-group': GroupElement
//   }
// }

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'ui-listbox': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
      'ui-option': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
      'ui-group': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
    }
  }
}
