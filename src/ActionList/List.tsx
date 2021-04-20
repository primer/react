import React from 'react'
import type {AriaRole} from '../utils/types'
import {Group, GroupProps} from './Group'
import {Item, ItemProps} from './Item'
import {Divider} from './Divider'
import styled from 'styled-components'
import {get} from '../constants'
import {SystemCssProperties} from '@styled-system/css'

export type ItemInput = ItemProps | (Partial<ItemProps> & {renderItem: typeof Item})

/**
 * Contract for props passed to the `List` component.
 */
export interface ListPropsBase {
  /**
   * A collection of `Item` props and `Item`-level custom `Item` renderers.
   */
  items: ItemInput[]

  /**
   * The ARIA role describing the function of `List` component. `listbox` is a common value.
   */
  role?: AriaRole

  /**
   * A `List`-level custom `Item` renderer. Every `Item` within this `List`
   * without a `Group`-level or `Item`-level custom `Item` renderer will be
   * rendered using this function component.
   */
  renderItem?: typeof Item

  /**
   * A `List`-level custom `Group` renderer. Every `Group` within this `List`
   * without a `Group`-level custom `Item` renderer will be rendered using
   * this function component.
   */
  renderGroup?: typeof Group

  /**
   * Style variations. Usage is discretionary.
   *
   * - `"inset"` - `List` children are offset (vertically and horizontally) from `List`’s edges
   * - `"full"` - `List` children are flush (vertically and horizontally) with `List` edges
   */
  variant?: 'inset' | 'full'
}

/**
 * Contract for props passed to the `List` component, when its `Item`s are collected in `Group`s.
 */
export interface GroupedListProps extends ListPropsBase {
  /**
   * A collection of `Group` props (except `items`), plus a unique group identifier
   * and `Group`-level custom `Item` or `Group` renderers.
   */
  groupMetadata: ((
    | Omit<GroupProps, 'items'>
    | Omit<Partial<GroupProps> & {renderItem?: typeof Item; renderGroup?: typeof Group}, 'items'>
  ) & {groupId: string})[]

  /**
   * A collection of `Item` props, plus associated group identifiers
   * and `Item`-level custom `Item` renderers.
   */
  items: ((ItemProps | (Partial<ItemProps> & {renderItem: typeof Item})) & {groupId: string})[]
}

/**
 * Asserts that the given value fulfills the `GroupedListProps` contract.
 * @param props A value which fulfills either the `ListPropsBase` or the `GroupedListProps` contract.
 */
function isGroupedListProps(props: ListProps): props is GroupedListProps {
  return 'groupMetadata' in props
}

/**
 * Contract for props passed to the `List` component.
 */
export type ListProps = ListPropsBase | GroupedListProps

const StyledList = styled.div`
  font-size: ${get('fontSizes.1')};
`

/**
 * Returns `sx` prop values for `List` children matching the given `List` style variation.
 * @param variant `List` style variation.
 */
function useListVariant(
  variant: ListProps['variant'] = 'inset'
): {
  firstGroupStyle?: SystemCssProperties
  lastGroupStyle?: SystemCssProperties
  headerStyle?: SystemCssProperties
  itemStyle?: SystemCssProperties
} {
  switch (variant) {
    case 'full':
      return {
        headerStyle: {paddingX: get('space.2')},
        itemStyle: {borderRadius: 0}
      }
    default:
      return {
        firstGroupStyle: {marginTop: get('space.2')},
        lastGroupStyle: {marginBottom: get('space.2')},
        itemStyle: {marginX: get('space.2')}
      }
  }
}

/**
 * Lists `Item`s, either grouped or ungrouped, with a `Divider` between each `Group`.
 */
export function List(props: ListProps): JSX.Element {
  // Get `sx` prop values for `List` children matching the given `List` style variation.
  const {firstGroupStyle, lastGroupStyle, headerStyle, itemStyle} = useListVariant(props.variant)

  /**
   * Render a `Group` using the first of the following renderers that is defined:
   * A `Group`-level or `List`-level custom `Group` renderer, or
   * the default `Group` renderer.
   */
  const renderGroup = (
    groupProps: GroupProps | (Partial<GroupProps> & {renderItem?: typeof Item; renderGroup?: typeof Group})
  ) => ((('renderGroup' in groupProps && groupProps.renderGroup) ?? props.renderGroup) || Group).call(null, groupProps)

  /**
   * Render an `Item` using the first of the following renderers that is defined:
   * An `Item`-level, `Group`-level, or `List`-level custom `Item` renderer,
   * or the default `Item` renderer.
   */
  const renderItem = (itemProps: ItemInput, item: ItemInput) =>
    (('renderItem' in itemProps && itemProps.renderItem) || props.renderItem || Item).call(null, {
      ...itemProps,
      sx: {...itemStyle, ...itemProps.sx},
      item
    })

  /**
   * An array of `Group`s, each with an associated `Header` and with an array of `Item`s belonging to that `Group`.
   */
  let groups: (GroupProps | (Partial<GroupProps> & {renderItem?: typeof Item; renderGroup?: typeof Group}))[] = []

  // Collect rendered `Item`s into `Group`s, avoiding excess iteration over the lists of `items` and `groupMetadata`:

  if (!isGroupedListProps(props)) {
    // When no `groupMetadata`s is provided, collect rendered `Item`s into a single anonymous `Group`.
    groups = [{items: props.items?.map(item => renderItem(item, item))}]
  } else {
    // When `groupMetadata` is provided, collect rendered `Item`s into their associated `Group`s.

    /**
     * A map of group identifiers to `Group`s, each with an associated array of `Item`s belonging to that `Group`.
     */
    const groupMap = props.groupMetadata.reduce(
      (groupAccumulator, groupMetadata) => groupAccumulator.set(groupMetadata.groupId, groupMetadata),
      new Map<string, GroupProps | (Partial<GroupProps> & {renderItem?: typeof Item; renderGroup?: typeof Group})>()
    )

    for (const itemProps of props.items) {
      // Look up the group associated with the current item.
      const group = groupMap.get(itemProps.groupId)

      // Upsert the group to include the current item (rendered).
      groupMap.set(itemProps.groupId, {
        ...group,
        items: [
          ...(group?.items ?? []),
          renderItem(
            {
              ...(group && 'renderItem' in group && {renderItem: group.renderItem}),
              ...itemProps
            },
            itemProps
          )
        ]
      })
    }

    groups = [...groupMap.values()]
  }

  return (
    <StyledList {...props}>
      {groups?.map(({header, ...groupProps}, index) => (
        <>
          {renderGroup({
            key: index,
            sx: {
              ...(index === 0 && firstGroupStyle),
              ...(index === groups.length - 1 && lastGroupStyle)
            },
            ...(header && {
              header: {
                ...header,
                sx: {...headerStyle, ...header?.sx}
              }
            }),
            ...groupProps
          })}
          {index + 1 !== groups.length && <Divider />}
        </>
      ))}
    </StyledList>
  )
}
