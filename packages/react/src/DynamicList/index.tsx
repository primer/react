import React from 'react'
import type {DynamicListElement, DynamicListItemElement, DynamicListTriggerElement} from '@primer/dynamic-list-element'

type CustomElementAttributes<I> = React.DetailedHTMLProps<React.HTMLAttributes<I>, I> &
  ElementProps<I> & {
    class?: string
  }
type ElementProps<I> = Partial<Omit<I, keyof HTMLElement>>

type DynamicListAttributes = CustomElementAttributes<DynamicListElement>
type DynamicListItemAttributes = CustomElementAttributes<DynamicListItemElement>
type DynamicListTriggerAttributes = CustomElementAttributes<DynamicListTriggerElement>

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'dynamic-list': DynamicListAttributes
      'dynamic-list-item': DynamicListItemAttributes
      'dynamic-list-trigger': DynamicListTriggerAttributes
    }
  }
}

type DynamicListProps = DynamicListAttributes

const DynamicList = React.forwardRef<DynamicListElement, DynamicListProps>(function DynamicList(
  {className, hideRoot, ...rest},
  ref,
) {
  return <dynamic-list ref={ref} class={className} hide-root={hideRoot ? '' : undefined} {...rest} />
})

type DynamicListItemProps = DynamicListItemAttributes

const DynamicListItem = React.forwardRef<DynamicListItemElement, DynamicListItemProps>(function DynamicListItem(
  {className, ...rest},
  ref,
) {
  return <dynamic-list-item ref={ref} class={className} {...rest} />
})

type DynamicListTriggerProps = DynamicListTriggerAttributes

const DynamicListTrigger = React.forwardRef<DynamicListTriggerElement, DynamicListTriggerProps>(
  function DynamicListTrigger({className, ...rest}, ref) {
    return <dynamic-list-trigger ref={ref} class={className} {...rest} />
  },
)

export {DynamicList, DynamicListItem, DynamicListTrigger}
export type {DynamicListProps, DynamicListItemProps, DynamicListTriggerProps}
