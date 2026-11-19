import {forwardRef} from 'react'
import {ActionList} from '../../ActionList'
import type {ActionListItemProps} from '../../ActionList'
import {renderActionListItemContent} from '../../internal/components/ActionListItemContent'
import type {ItemInput, RenderItemFn} from '../types'

interface MappedActionListItemRenderers {
  ItemComponent?: React.ComponentType<React.PropsWithoutRef<ActionListItemProps> & React.RefAttributes<HTMLLIElement>>
}

export const MappedActionListItem = forwardRef<
  HTMLLIElement,
  ItemInput & {renderItem?: RenderItemFn} & MappedActionListItemRenderers
>(({ItemComponent = ActionList.Item, ...item}, ref) => {
  // keep backward compatibility for renderItem
  // escape hatch for custom Item rendering
  if (typeof item.renderItem === 'function') return item.renderItem(item)

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
