import {clsx} from 'clsx'
import type {To} from 'history'
import React from 'react'
import type {SxProp} from '../sx'
import type {ComponentProps} from '../utils/types'
import classes from './Breadcrumbs.module.css'
import {BoxWithFallback} from '../internal/components/BoxWithFallback'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {toggleSxComponent} from '../internal/utils/toggleSxComponent'
import {KebabHorizontalIcon} from '@primer/octicons-react'
import {IconButton} from '../'

const SELECTED_CLASS = 'selected'

export type BreadcrumbsProps = React.PropsWithChildren<
  {
    className?: string
  } & SxProp
>

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

// in-between
// first

class DynamicList extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({
      mode: 'open',
      slotAssignment: 'manual',
    })
    this.shadowRoot?.appendChild(template.content.cloneNode(true))
  }

  get showRoot() {
    return this.hasAttribute('show-root')
  }

  set showRoot(shouldShowRoot) {
    if (shouldShowRoot) {
      this.setAttribute('show-root', '')
    } else {
      this.removeAttribute('show-root')
    }
  }

  observer: ResizeObserver | null = null

  connectedCallback() {
    const triggerElement = this.querySelector('dynamic-list-trigger')
    const visibleSlot: HTMLSlotElement = this.shadowRoot?.querySelector('slot[name="visible"]')
    visibleSlot.assign(triggerElement)

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
  }

  disconnectedCallback() {
    this.observer?.disconnect()
    triggerElement?.removeEventListener('click', this.onTriggerClick)
  }

  onTriggerClick = () => {
    const popover = this.shadowRoot?.getElementById('popover')
    popover?.showPopover()
  }

  onResize = () => {
    const rect = this.getBoundingClientRect()
    const triggerElement = this.querySelector('dynamic-list-trigger')
    const triggerRect = triggerElement!.getBoundingClientRect()
    const listItems = Array.from(this.querySelectorAll('dynamic-list-item'))

    const visibleSlot: HTMLSlotElement = this.shadowRoot?.querySelector('slot[name="visible"]')
    const visible = []
    const leading = []
    const overflowSlot: HTMLSlotElement = this.shadowRoot?.querySelector('slot[name="overflow"]')
    const overflow = []

    let availableWidth = rect.width - triggerRect.width

    if (this.showRoot) {
      const firstItem = listItems.shift()
      if (firstItem) {
        visibleSlot.assign(...leading, ...visible, firstItem)
        const itemRect = firstItem.getBoundingClientRect()
        availableWidth -= itemRect.width
        leading.push(firstItem)
      }
    }

    // if everything can fit...show everything

    // if everything cannot fit
    //   if show root is true
    //     start placing items from the end of the list (always show the root)
    //
    //   if show root is false
    //
    // note: must always have at least two items
    // question: what happens if we have one item but it does not fit?
    //
    // [root] [one-that-is-super-duper-long] [last]

    for (const listItem of listItems.reverse()) {
      visibleSlot.assign(...leading, ...visible, listItem)

      const itemRect = listItem.getBoundingClientRect()
      if (availableWidth - itemRect.width >= 0) {
        visible.unshift(listItem)
        availableWidth -= itemRect.width
      } else {
        overflow.push(listItem)
      }

      visibleSlot.assign(...leading, ...visible)
    }

    visibleSlot.assign(...leading, triggerElement, ...visible)
    overflowSlot.assign(...overflow.reverse())
    if (overflow.length > 0) {
      triggerElement.style.display = 'block'
    } else {
      triggerElement.style.display = 'none'
    }
  }
}

class DynamicListItem extends HTMLElement {}

class DynamicListTrigger extends HTMLElement {}

customElements.define('dynamic-list', DynamicList)
customElements.define('dynamic-list-item', DynamicListItem)
customElements.define('dynamic-list-trigger', DynamicListTrigger)

const BreadcrumbsList = ({children}: React.PropsWithChildren) => {
  return (
    <dynamic-list class={clsx(classes.DynamicList, classes.BreadcrumbsList)} role="list">
      {children}
    </dynamic-list>
  )
}

function Breadcrumbs({className, children, sx: sxProp}: BreadcrumbsProps) {
  const wrappedChildren = React.Children.map(children, child => (
    <dynamic-list-item class={classes.DynamicListItem} role="listitem">
      {child}
    </dynamic-list-item>
  ))
  return (
    <BoxWithFallback as="nav" className={clsx(className)} aria-label="Breadcrumbs" sx={sxProp}>
      <BreadcrumbsList>
        <dynamic-list-trigger class={classes.DynamicListTrigger} role="listitem">
          <IconButton icon={KebabHorizontalIcon} aria-label="Open parent pages" variant="invisible" size="small" />
        </dynamic-list-trigger>
        {wrappedChildren}
      </BreadcrumbsList>
    </BoxWithFallback>
  )
}

type StyledBreadcrumbsItemProps = {
  to?: To
  selected?: boolean
  className?: string
} & SxProp &
  React.HTMLAttributes<HTMLAnchorElement> &
  React.ComponentPropsWithRef<'a'>

const BreadcrumbsItem = React.forwardRef(({selected, className, ...rest}, ref) => {
  return (
    <BoxWithFallback
      as="a"
      className={clsx(className, classes.Item, 'item', {
        [SELECTED_CLASS]: selected,
        [classes.ItemSelected]: selected,
      })}
      aria-current={selected ? 'page' : undefined}
      ref={ref}
      {...rest}
    />
  )
}) as PolymorphicForwardRefComponent<'a', StyledBreadcrumbsItemProps>

Breadcrumbs.displayName = 'Breadcrumbs'

BreadcrumbsItem.displayName = 'Breadcrumbs.Item'

export type BreadcrumbsItemProps = ComponentProps<typeof BreadcrumbsItem>
export default Object.assign(Breadcrumbs, {Item: BreadcrumbsItem})

/**
 * @deprecated Use the `Breadcrumbs` component instead (i.e. `<Breadcrumb>` → `<Breadcrumbs>`)
 */
export const Breadcrumb = Object.assign(Breadcrumbs, {Item: BreadcrumbsItem})

/**
 * @deprecated Use the `BreadcrumbsProps` type instead
 */
export type BreadcrumbProps = BreadcrumbsProps

/**
 * @deprecated Use the `BreadcrumbsItemProps` type instead
 */
export type BreadcrumbItemProps = ComponentProps<typeof BreadcrumbsItem>
