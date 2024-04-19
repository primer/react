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

  get overflowSlot(): HTMLSlotElement {
    return this.shadowRoot?.querySelector('slot[name="overflow"]') as HTMLSlotElement
  }

  get overflowElement(): HTMLElement | null {
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

  get triggerElement(): HTMLButtonElement | null {
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
    //
  }
}

// const template = document.createElement('template')

// template.innerHTML = `
// <style>
// :host {
// display: flex;
// }

// ::slotted([slot="trigger"]) {
// flex: 1 1 0%;
// }

// </style>
// <slot name="visible"></slot>
// <slot name="trigger"></slot>
// <slot name="overflow"></slot>
// `

// export class ListOverflowElement extends HTMLElement {
// observer: ResizeObserver | null = null

// constructor() {
// super()
// const shadowRoot = this.attachShadow({
// mode: 'open',
// slotAssignment: 'manual',
// })
// shadowRoot.appendChild(template.content.cloneNode(true))
// }

// get overflow() {
// return this.hasAttribute('overflow')
// }

// set overflow(hasOverflow: boolean) {
// if (hasOverflow) {
// this.setAttribute('overflow', '')
// } else {
// this.removeAttribute('overflow')
// }
// }

// get popoverElement(): HTMLElement {
// return this.shadowRoot?.querySelector('#popover') as HTMLElement
// }

// get overflowSlot(): HTMLSlotElement {
// return this.shadowRoot?.querySelector('slot[name="overflow"]') as HTMLSlotElement
// }

// get overflowElement(): HTMLElement | null {
// const assignedElements = this.overflowSlot.assignedElements()
// if (assignedElements.length === 0) {
// return null
// }
// return assignedElements[0] as HTMLElement
// }

// get triggerSlot(): HTMLSlotElement {
// return this.shadowRoot?.querySelector('slot[name="trigger"]') as HTMLSlotElement
// }

// get triggerElement(): HTMLButtonElement | null {
// const assignedElements = this.triggerSlot.assignedElements()
// if (assignedElements.length === 0) {
// return null
// }
// return assignedElements[0] as HTMLButtonElement
// }

// get visibleSlot(): HTMLSlotElement {
// return this.shadowRoot?.querySelector('slot[name="visible"]') as HTMLSlotElement
// }

// connectedCallback() {
// this.style.overflow = 'hidden'
// this.calculateLayout()

// this.observer = new ResizeObserver(() => {
// this.calculateLayout()
// })
// this.observer.observe(this)
// }

// disconnectedCallback() {
// this.observer?.disconnect()
// }

// calculateLayout() {
// const overflowElement = Array.from(this.children).find(child => {
// return child.getAttribute('slot') === 'overflow'
// })
// if (!overflowElement) {
// throw new Error('Expected element with slot="overflow"')
// }

// const triggerElement = Array.from(this.children).find(child => {
// return child.getAttribute('slot') === 'trigger'
// })
// if (!triggerElement) {
// throw new Error('Expected element with slot="trigger"')
// }

// const children = [...this.children, ...overflowElement.children].filter(child => {
// if (child === overflowElement || child === triggerElement) {
// return false
// }
// return true
// })

// this.triggerSlot.assign(triggerElement)
// if (this.triggerElement && !this.overflow) {
// this.triggerElement.style.removeProperty('display')
// this.triggerElement.style.visibility = 'hidden'
// }

// this.overflowSlot.assign(overflowElement)
// this.visibleSlot.assign(...children)

// const sizes = children.map(child => {
// return child.getBoundingClientRect()
// })
// const totalChildWidth = sizes.reduce((sum, rect) => {
// return sum + rect.width
// }, 0)
// const rect = this.getBoundingClientRect()

// let availableWidth = rect.width

// if (totalChildWidth < availableWidth) {
// this.overflow = false
// this.triggerElement?.style.setProperty('visibility', 'none')
// return
// }

// if (this.triggerElement) {
// availableWidth -= this.triggerElement.getBoundingClientRect().width
// }

// const visible = []
// const overflow = []
// let shouldOverflow = false

// for (let i = 0; i < children.length; i++) {
// const child = children[i]
// if (shouldOverflow) {
// overflow.push(child)
// continue
// }

// const rect = sizes[i]
// if (availableWidth - rect.width >= 0) {
// visible.push(child)
// availableWidth -= rect.width
// } else {
// shouldOverflow = true
// overflow.push(child)
// }
// }

// this.visibleSlot.assign(...visible)
// for (const child of overflow) {
// this.overflowElement?.appendChild(child)
// }

// if (overflow.length > 0) {
// this.overflow = true
// this.triggerElement?.style.setProperty('visibility', 'visible')
// } else {
// this.overflow = false
// this.triggerElement?.style.setProperty('visibility', 'none')
// }
// }
// }
