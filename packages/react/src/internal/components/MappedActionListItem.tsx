import {forwardRef} from 'react'
import {ActionList, type ActionListItemProps} from '../../ActionList'
import {renderActionListItemContent} from './ActionListItemContent'
import type {ItemInput, RenderItemFn} from '../../FilteredActionList/types'

export const MappedActionListItem = forwardRef<
  HTMLLIElement,
  ItemInput & {
    renderItem?: RenderItemFn
    ItemComponent?: React.ComponentType<React.PropsWithoutRef<ActionListItemProps> & React.RefAttributes<HTMLLIElement>>
  }
>(({ItemComponent = ActionList.Item, renderItem, ...item}, ref) => {
  // keep backward compatibility for renderItem
  // escape hatch for custom Item rendering
  if (typeof renderItem === 'function') return renderItem(item)

  const {
    id,
    description,
    descriptionVariant,
    text,
    trailingVisual,
    leadingVisual,
    trailingText,
    trailingIcon,
    onAction,
    children,
    ...rest
  } = item

  return (
    <ItemComponent
      role="option"
      // @ts-ignore - for now
      onSelect={(e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => {
        if (typeof onAction === 'function')
          onAction(item, e as React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>)
      }}
      data-id={id}
      ref={ref}
      {...rest}
    >
      {renderActionListItemContent({
        text,
        description,
        descriptionVariant,
        leadingVisual,
        trailingVisual,
        trailingIcon,
        trailingText,
        children,
      })}
    </ItemComponent>
  )
})
