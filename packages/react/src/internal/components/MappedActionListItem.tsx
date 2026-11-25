import {forwardRef} from 'react'
import {ActionList} from '../../ActionList'
import {renderActionListItemContent} from './ActionListItemContent'
import type {ItemInput, RenderItemFn} from '../../FilteredActionList/types'

export const MappedActionListItem = forwardRef<HTMLLIElement, ItemInput & {renderItem?: RenderItemFn}>((item, ref) => {
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
    <ActionList.Item
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
    </ActionList.Item>
  )
})
