const template = document.createElement('template')
template.innerHTML = `
<slot name="flexible"></slot>
<slot name="trigger"></slot>
<slot name="overflow"></slot>
`

export class ListOverflowElement extends HTMLElement {
  observer: ResizeObserver | null = null

  constructor() {
    super()
    const shadowRoot = this.attachShadow({mode: 'open', slotAssignment: 'manual'})
    shadowRoot.appendChild(template.content.cloneNode(true))
  }

  get overflow() {
    return this.hasAttribute('overflow')
  }

  set overflow(hasOverflow: boolean) {
    if (hasOverflow) {
      this.setAttribute('overflow', '')
    } else {
      this.removeAttribute('overflow')
    }
  }

  get flexibleSlot(): HTMLSlotElement {
    return this.shadowRoot?.querySelector('slot[name="flexible"]') as HTMLSlotElement
  }

  get overflowSlot(): HTMLSlotElement {
    return this.shadowRoot?.querySelector('slot[name="overflow"]') as HTMLSlotElement
  }

  getOverflowElement(): HTMLElement {
    const assignedElements = this.overflowSlot.assignedElements()
    if (assignedElements.length !== 0) {
      return assignedElements[0] as HTMLElement
    }

    const element = this.querySelector('[slot="overflow"]')
    if (!element) {
      throw new Error('Expected element with slot="overflow"')
    }

    this.overflowSlot.assign(element)

    return element as HTMLElement
  }

  get triggerSlot(): HTMLSlotElement {
    return this.shadowRoot?.querySelector('slot[name="trigger"]') as HTMLSlotElement
  }

  getTriggerElement(): HTMLButtonElement {
    const assignedElements = this.triggerSlot.assignedElements()
    if (assignedElements.length !== 0) {
      return assignedElements[0] as HTMLButtonElement
    }

    const element = this.querySelector('[slot="trigger"]')
    if (!element) {
      throw new Error('Expected element with slot="trigger"')
    }

    this.triggerSlot.assign(element)

    return element as HTMLButtonElement
  }

  connectedCallback() {
    this.style.overflow = 'hidden'
    this.observer = new ResizeObserver(() => {
      this.computeLayout()
    })
    this.observer.observe(this)
  }

  disconnectedCallback() {
    this.observer?.disconnect()
  }

  computeLayout() {
    const triggerElement = this.getTriggerElement()
    triggerElement.style.setProperty('visibility', 'hidden')

    const overflowElement = this.getOverflowElement()
    if (overflowElement.children.length > 0) {
      this.append(...overflowElement.children)
    }

    const items = Array.from(this.children).filter(child => {
      if (child === triggerElement || child === overflowElement) {
        return false
      }
      return true
    })

    this.flexibleSlot.assign(...items)

    const sizes = items.map(item => {
      return item.getBoundingClientRect().width
    })
    const totalContentWidth = sizes.reduce((sum, width) => {
      return sum + width
    }, 0)
    const rect = this.getBoundingClientRect()

    let availableWidth = rect.width

    if (totalContentWidth < availableWidth) {
      this.overflow = false
      triggerElement.style.setProperty('display', 'none')
      triggerElement.style.setProperty('visibility', 'hidden')
      return
    }

    if (triggerElement) {
      availableWidth -= triggerElement.getBoundingClientRect().width
    }

    const visible = []
    const overflow = []
    let shouldOverflow = false

    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (shouldOverflow) {
        overflow.push(item)
        continue
      }

      const width = sizes[i]
      if (availableWidth - width >= 0) {
        visible.push(item)
        availableWidth -= width
      } else {
        shouldOverflow = true
        overflow.push(item)
      }
    }

    this.flexibleSlot.assign(...visible)

    triggerElement.style.removeProperty('display')
    triggerElement.style.removeProperty('visibility')

    overflowElement.append(...overflow)
    this.overflow = true
  }
}
