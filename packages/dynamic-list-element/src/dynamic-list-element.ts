const template = document.createElement('template')
template.innerHTML = `
<style>
:host {
  overflow-x: hidden;
  width: 100%;
  min-width: 100%;
  max-width: 100%;
  display: flex;
  align-items: center;
  --listitem-whitespace: wrap;
  --listItem-textDecoration: underline;
  --listItem-fgColor: var(--fgColor-link);
  --listItem-divider: '';
}

#popover {
  margin: unset;
}

#popover ::slotted(*) {
  --item-background: black;
  --listItem-bgColor-rest: var(--control-transparent-bgColor-rest);
  --listItem-bgColor-hover: var(--control-transparent-bgColor-hover);
  --listItem-bgColor-active: var(--control-transparent-bgColor-active);
  --listItem-borderRadius: var(--borderRadius-medium);
  --listItem-width: 100%;
  --listItem-paddingBlock: var(--control-medium-paddingBlock);
  --listItem-paddingInline: var(--control-medium-paddingInline-condensed);
  --listItem-display: flex;
  --listItem-whitespace: wrap;
  --listItem-textDecoration: none;
  --listItem-fgColor: var(--fgColor-default);
  --listItem-divider: none;

}

.OverflowList {
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;
  list-style: none;
}
</style>

<div id="popover" popover="manual" part="popover">
  <ul class="OverflowList"><slot name="overflow"></slot></ul>
</div>
<slot name="visible"></slot>
`

class DynamicListElement extends HTMLElement {
  static DEFAULT_MAX_ITEM_COUNT = 5

  constructor() {
    super()
    this.attachShadow({
      mode: 'open',
      slotAssignment: 'manual',
    })
    this.shadowRoot?.appendChild(template.content.cloneNode(true))
  }

  get hideRoot() {
    return this.hasAttribute('hide-root')
  }

  set hideRoot(shouldHideRoot) {
    if (shouldHideRoot) {
      this.setAttribute('hide-root', '')
    } else {
      this.removeAttribute('hide-root')
    }
  }

  get maxItemCount() {
    const maxItemCount = this.getAttribute('max-item-count')
    if (!maxItemCount) {
      return DynamicListElement.DEFAULT_MAX_ITEM_COUNT
    }

    const value = parseInt(maxItemCount, 10)
    if (Number.isInteger(value)) {
      return value
    }

    return DynamicListElement.DEFAULT_MAX_ITEM_COUNT
  }

  set maxItemCount(maxItemCount: number) {
    this.setAttribute('max-item-count', maxItemCount.toString())
  }

  observer: ResizeObserver | null = null
  popoverOpen: boolean = false

  connectedCallback() {
    const triggerElement = this.getTriggerElement()
    const popover = this.getPopover()
    popover.addEventListener('toggle', this.onToggle)

    this.observer = new ResizeObserver(entries => {
      if (entries.length === 0) {
        return
      }

      window.requestAnimationFrame(() => {
        this.onResize()
      })
    })
    this.observer.observe(this)

    triggerElement?.addEventListener('click', this.onTriggerClick)
    window.addEventListener('click', this.onClick)
    window.addEventListener('keydown', this.onKeyDown)
  }

  disconnectedCallback() {
    const triggerElement = this.getTriggerElement()
    const popover = this.getPopover()
    popover.removeEventListener('toggle', this.onToggle)

    this.observer?.disconnect()
    triggerElement.removeEventListener('click', this.onTriggerClick)
    window.removeEventListener('click', this.onClick)
    window.removeEventListener('keydown', this.onKeyDown)
  }

  onClick = () => {
    if (this.popoverOpen) {
      const popover = this.getPopover()
      popover.hidePopover()
    }
  }

  onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      const popover = this.getPopover()
      popover.hidePopover()
    }
  }

  onToggle = () => {
    const popover = this.getPopover()
    this.popoverOpen = popover.matches(':popover-open')
  }

  onTriggerClick = () => {
    const popover = this.shadowRoot?.getElementById('popover')
    popover?.showPopover()
  }

  getPopover = (): HTMLElement => {
    const popover = this.shadowRoot?.getElementById('popover')
    if (popover) {
      return popover
    }
    throw new Error(
      'Expected an element with id="popover" to be present in the shadow DOM of the <dynamic-list> element',
    )
  }

  getTriggerElement = (): HTMLElement => {
    const triggerElement = this.querySelector('dynamic-list-trigger')
    if (triggerElement) {
      return triggerElement as HTMLElement
    }

    throw new Error('The <dynamic-list-trigger> element was not found. Please add one to the <dynamic-list> element')
  }

  getTriggerSlot = (): HTMLSlotElement => {
    const triggerSlot = this.shadowRoot?.querySelector('slot[name="trigger"]')
    if (triggerSlot) {
      return triggerSlot as HTMLSlotElement
    }
    throw new Error('Expected a <slot name="trigger"> element to be present in the <dynamic-list> element')
  }

  getOverflowSlot = (): HTMLSlotElement => {
    const overflowSlot = this.shadowRoot?.querySelector('slot[name="overflow"]')
    if (overflowSlot) {
      return overflowSlot as HTMLSlotElement
    }
    throw new Error('Expected a <slot name="overflow"> element to be present in the <dynamic-list> element')
  }

  getVisibleSlot = (): HTMLSlotElement => {
    const visibleSlot = this.shadowRoot?.querySelector('slot[name="visible"]')
    if (visibleSlot) {
      return visibleSlot as HTMLSlotElement
    }
    throw new Error('Expected a <slot name="visible"> element to be present in the <dynamic-list> element')
  }

  getListItems = (): Array<HTMLElement> => {
    return Array.from(this.querySelectorAll('dynamic-list-item'))
  }

  onResize = () => {
    const dynamicListRect = this.getBoundingClientRect()
    const listItems = this.getListItems()
    const visibleSlot = this.getVisibleSlot()

    visibleSlot.assign(...listItems)

    // -------------------------------------------------------------------------
    // If all the items can fit, show them all without a trigger element. This
    // can only occur if there are fewer items than our maximum item count.
    let availableWidth = dynamicListRect.width
    let totalItemWidth = 0

    for (const listItem of listItems) {
      const itemRect = listItem.getBoundingClientRect()
      totalItemWidth += itemRect.width
    }

    if (totalItemWidth <= availableWidth && listItems.length <= this.maxItemCount) {
      visibleSlot.assign(...listItems)
      return
    }
    // -------------------------------------------------------------------------

    const triggerElement = this.getTriggerElement()
    const visible: Array<HTMLElement> = []
    const overflowSlot = this.getOverflowSlot()
    const overflow: Array<HTMLElement> = []

    let numVisibleItems = listItems.length

    for (let i = 0; i < listItems.length; i++) {
      const listItem = listItems[i]
      if (!this.hideRoot && i === 0) {
        visible.push(listItem)
      } else if (numVisibleItems > this.maxItemCount) {
        overflow.push(listItem)
        numVisibleItems--
      } else {
        visible.push(listItem)
      }
    }

    visibleSlot.assign(triggerElement, ...visible)

    const triggerElementRect = triggerElement.getBoundingClientRect()
    availableWidth = dynamicListRect.width - triggerElementRect.width
    totalItemWidth = 0

    for (const listItem of visible) {
      const itemRect = listItem.getBoundingClientRect()
      totalItemWidth += itemRect.width
    }

    let index = this.hideRoot ? 0 : 1

    while (totalItemWidth >= availableWidth) {
      const listItem = visible[index]
      const itemRect = listItem.getBoundingClientRect()

      totalItemWidth -= itemRect.width
      overflow.push(listItem)
      index++
    }

    if (this.hideRoot) {
      visible.splice(0, 0, triggerElement)
    } else {
      visible.splice(1, 0, triggerElement)
    }

    visibleSlot.assign(...visible)
    overflowSlot.assign(...overflow)
  }
}

export {DynamicListElement}
