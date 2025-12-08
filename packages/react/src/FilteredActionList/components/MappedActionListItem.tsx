import {isValidElementType} from 'react-is'
import {ActionList} from '../../ActionList'
import type {ItemInput, RenderItemFn} from '../types'

export function MappedActionListItem(item: ItemInput & {renderItem?: RenderItemFn}) {
  // keep backward compatibility for renderItem
  // escape hatch for custom Item rendering
  if (typeof item.renderItem === 'function') return item.renderItem(item)

  const {
    id,
    description,
    descriptionVariant,
    text,
    trailingVisual: TrailingVisual,
    leadingVisual: LeadingVisual,
    trailingText,
    trailingIcon: TrailingIcon,
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
      {...rest}
    >
      {LeadingVisual ? (
        <ActionList.LeadingVisual>
          <LeadingVisual />
        </ActionList.LeadingVisual>
      ) : null}
      {children}
      {text}
      {description ? <ActionList.Description variant={descriptionVariant}>{description}</ActionList.Description> : null}
      {TrailingVisual ? (
        <ActionList.TrailingVisual>
          {typeof TrailingVisual !== 'string' && isValidElementType(TrailingVisual) ? (
            <TrailingVisual />
          ) : (
            TrailingVisual
          )}
        </ActionList.TrailingVisual>
      ) : TrailingIcon || trailingText ? (
        <ActionList.TrailingVisual>
          {trailingText}
          {TrailingIcon && <TrailingIcon />}
        </ActionList.TrailingVisual>
      ) : null}
    </ActionList.Item>
  )
}
