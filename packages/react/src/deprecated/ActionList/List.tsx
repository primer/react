import type {Key} from 'react'
import React from 'react'
import type {AriaRole} from '../../utils/types'
import type {GroupProps} from './Group'
import {Group} from './Group'
import type {ItemProps} from './Item'
import {Item} from './Item'
import {Divider} from './Divider'
import styled from 'styled-components'
import {get} from '../../constants'
import type {SystemCssProperties} from '@styled-system/css'
import {hasActiveDescendantAttribute} from '@primer/behaviors'
import type {Merge} from '../../utils/types/Merge'

type RenderItemFn = (props: ItemProps) => React.ReactElement

export type ItemInput =
  | Merge<React.ComponentPropsWithoutRef<'div'>, ItemProps>
  | ((Partial<ItemProps> & {renderItem: RenderItemFn}) & {key?: Key})

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
   * id to attach to the base DOM node of the list
   */
  id?: string

  /**
   * A `List`-level custom `Item` renderer. Every `Item` within this `List`
   * without a `Group`-level or `Item`-level custom `Item` renderer will be
   * rendered using this function component.
   */
  renderItem?: RenderItemFn

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

  /**
   *  For `Item`s which can be selected, whether `multiple` `Item`s or a `single` `Item` can be selected
   */
  selectionVariant?: 'single' | 'multiple'

  /**
   * Whether to display a divider above each `Item` in this `List` when it does not follow a `Header` or `Divider`.
   */
  showItemDividers?: boolean
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
    | Omit<Partial<GroupProps> & {renderItem?: RenderItemFn; renderGroup?: typeof Group}, 'items'>
  ) & {groupId: string})[]

  /**
   * A collection of `Item` props, plus associated group identifiers
   * and `Item`-level custom `Item` renderers.
   */
  items: ((ItemProps | (Partial<ItemProps> & {renderItem: RenderItemFn})) & {groupId: string})[]
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
  /* 14px font-size * 1.428571429 = 20px line height
   *
   * TODO: When rem-based spacing on a 4px scale lands, replace
   * hardcoded '20px'
   */
  line-height: 20px;

  &[${hasActiveDescendantAttribute}], &:focus-within {
    --item-hover-bg-override: none;
    --item-hover-divider-border-color-override: ${get('colors.border.muted')};
  }
`

/**
 * Returns `sx` prop values for `List` children matching the given `List` style variation.
 * @param variant `List` style variation.
 */
function useListVariant(variant: ListProps['variant'] = 'inset'): {
  firstGroupStyle?: SystemCssProperties
  lastGroupStyle?: SystemCssProperties
  headerStyle?: SystemCssProperties
  itemStyle?: SystemCssProperties
} {
  switch (variant) {
    case 'full':
      return {
        headerStyle: {paddingX: get('space.2')},
        itemStyle: {borderRadius: 0},
      }
    default:
      return {
        firstGroupStyle: {marginTop: get('space.2')},
        lastGroupStyle: {marginBottom: get('space.2')},
        itemStyle: {marginX: get('space.2')},
      }
  }
}

/**
 * Lists `Item`s, either grouped or ungrouped, with a `Divider` between each `Group`.
 */
export const List = React.forwardRef<HTMLDivElement, ListProps>((props, forwardedRef): JSX.Element => {
  // Get `sx` prop values for `List` children matching the given `List` style variation.
  const {firstGroupStyle, lastGroupStyle, headerStyle, itemStyle} = useListVariant(props.variant)

  /**
   * Render a `Group` using the first of the following renderers that is defined:
   * A `Group`-level or `List`-level custom `Group` renderer, or
   * the default `Group` renderer.
   */
  const renderGroup = (
    groupProps: GroupProps | (Partial<GroupProps> & {renderItem?: typeof Item; renderGroup?: typeof Group}),
  ) => {
    const GroupComponent = (('renderGroup' in groupProps && groupProps.renderGroup) ?? props.renderGroup) || Group
    return <GroupComponent {...groupProps} key={groupProps.groupId} />
  }

  /**
   * Render an `Item` using the first of the following renderers that is defined:
   * An `Item`-level, `Group`-level, or `List`-level custom `Item` renderer,
   * or the default `Item` renderer.
   */
  const renderItem = (itemProps: ItemInput, item: ItemInput, itemIndex: number) => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const ItemComponent = ('renderItem' in itemProps && itemProps.renderItem) || props.renderItem || Item
    const key = ('key' in itemProps ? itemProps.key : undefined) ?? itemProps.id?.toString() ?? itemIndex.toString()
    return (
      <ItemComponent
        showDivider={props.showItemDividers}
        selectionVariant={props.selectionVariant}
        {...itemProps}
        key={key}
        sx={{...itemStyle, ...itemProps.sx}}
        item={item}
      />
    )
  }

  /**
   * An array of `Group`s, each with an associated `Header` and with an array of `Item`s belonging to that `Group`.
   */
  let groups: (GroupProps | (Partial<GroupProps> & {renderItem?: typeof Item; renderGroup?: typeof Group}))[] = []

  // Collect rendered `Item`s into `Group`s, avoiding excess iteration over the lists of `items` and `groupMetadata`:
  if (!isGroupedListProps(props)) {
    // When no `groupMetadata`s is provided, collect rendered `Item`s into a single anonymous `Group`.
    groups = [{items: props.items.map((item, index) => renderItem(item, item, index)), groupId: '0'}]
  } else {
    // When `groupMetadata` is provided, collect rendered `Item`s into their associated `Group`s.

    /**
     * A map of group identifiers to `Group`s, each with an associated array of `Item`s belonging to that `Group`.
     */
    const groupMap = props.groupMetadata.reduce(
      (groupAccumulator, groupMetadata) => groupAccumulator.set(groupMetadata.groupId, groupMetadata),
      new Map<string, GroupProps | (Partial<GroupProps> & {renderItem?: typeof Item; renderGroup?: typeof Group})>(),
    )

    for (const itemProps of props.items) {
      // Look up the group associated with the current item.
      const group = groupMap.get(itemProps.groupId)
      const itemIndex = group?.items?.length ?? 0

      // Upsert the group to include the current item (rendered).
      groupMap.set(itemProps.groupId, {
        ...group,
        items: [
          ...(group?.items ?? []),
          renderItem(
            {
              showDivider: group?.showItemDividers,
              ...(group && 'renderItem' in group && {renderItem: group.renderItem}),
              ...itemProps,
            },
            itemProps,
            itemIndex,
          ),
        ],
      })
    }

    groups = [...groupMap.values()]
  }

  return (
    <StyledList {...props} ref={forwardedRef}>
      {groups.map(({header, ...groupProps}, index) => {
        const hasFilledHeader = header?.variant === 'filled'
        const shouldShowDivider = index > 0 && !hasFilledHeader
        return (
          <React.Fragment key={groupProps.groupId}>
            {shouldShowDivider ? <Divider key={`${groupProps.groupId}-divider`} /> : null}
            {renderGroup({
              sx: {
                ...(index === 0 && firstGroupStyle),
                ...(index === groups.length - 1 && lastGroupStyle),
                ...(index > 0 && !shouldShowDivider && {mt: 2}),
              },
              ...(header && {
                header: {
                  ...header,
                  sx: {...headerStyle, ...header.sx},
                },
              }),
              ...groupProps,
            })}
          </React.Fragment>
        )
      })}
    </StyledList>
  )
})

List.displayName = 'ActionList'
