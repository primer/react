import {Group, GroupProps} from './Group'
import {Item, ItemProps} from './Item'
import React from 'react'
import {Divider} from './Divider'
import {Header, HeaderProps} from './Header'
import styled from 'styled-components'
import {get} from '../constants'
import type {Flatten} from '../utils/types'

/**
 * Contract for props passed to the `List` component.
 */
interface UngroupedListProps {
  /**
   * `Item`s to render in the `List`.
   */
  items: ItemProps[]

  /**
   * A `List`-level custom `Item` renderer. Every `Item` within this `List`
   * without a `Group`-level or `Item`-level custom `Item` renderer will be
   * rendered using this function component.
   */
  renderItem?: (props: ItemProps) => JSX.Element
}

/**
 * Contract for props passed to the `List` component, when its `Item`s are collected in `Group`s.
 */
interface GroupedListProps extends UngroupedListProps {
  /**
   * An array of `Group`s, each an associated `Header` and a group idenitifier.
   */
  groupMetadata: (GroupProps & {groupId: string; header?: HeaderProps})[]

  /**
   * `Items` to render in the `List`, each with a group identifier used to associate it with its `Group`.
   */
  items: (ItemProps & {groupId: string})[]
}

/**
 * Asserts that the given value fulfills the `GroupedListProps` contract.
 * @param props A value which fulfills either the `UngroupedListProps` or the `GroupedListProps` contract.
 */
function isGroupedListProps(props: ListProps): props is GroupedListProps {
  return 'groupMetadata' in props
}

/**
 * Contract for props passed to the `List` component.
 */
export type ListProps = UngroupedListProps | GroupedListProps

/**
 * An array of `Group`s, each with an associated `Header` and with an array of `Item`s belonging to that `Group`.
 */
type GroupWithItems = Omit<Flatten<GroupedListProps['groupMetadata']>, 'groupId'> & {items?: JSX.Element[]}

const StyledList = styled.div`
  font-size: ${get('fontSizes.1')};
  padding-top: ${get('space.2')};
  padding-bottom: ${get('space.2')};
`

/**
 * Lists `Item`s, either grouped or ungrouped, with a `Divider` between each group.
 */
export function List(props: ListProps): JSX.Element {
  /**
   * Render an `Item` using the first of the following renderers that is defined:
   * An `Item`-level, `Group`-level, or `List`-level custom `Item` renderer,
   * or the default `Item` renderer.
   */
  const toJSX = (itemProps: ItemProps) =>
    ((('renderItem' in itemProps && itemProps.renderItem) ?? props.renderItem) || Item).call(null, itemProps)

  /**
   * An array of `Group`s, each with an associated `Header` and with an array of `Item`s belonging to that `Group`.
   */
  let groups: GroupWithItems[] = []

  // Collect rendered `Item`s into `Group`s, avoiding excess iteration over the lists of `items` and `groupMetadata`:

  if (!isGroupedListProps(props)) {
    // When no `groupMetadata`s is provided, collect rendered `Item`s into a single anonymous `Group`.
    groups = [{items: props.items?.map(toJSX)}]
  } else {
    // When `groupMetadata` is provided, collect rendered `Item`s into their associated `Group`s.

    /**
     * A map of group identifiers to `Group`s, each with an associated `Header` and an array of `Item`s belonging to that `Group`.
     */
    const groupMap = props.groupMetadata.reduce(
      (groups, groupMetadata) => groups.set(groupMetadata.groupId, groupMetadata),
      new Map<string, GroupWithItems>()
    )

    for (const itemProps of props.items) {
      // Look up the group associated with the current item.
      const group = groupMap.get(itemProps.groupId)

      // Upsert the group to include the current item (rendered).
      groupMap.set(itemProps.groupId, {
        ...group,
        items: [...(group?.items ?? []), toJSX({renderItem: group?.renderItem ?? props.renderItem, ...itemProps})]
      })
    }

    groups = [...groupMap.values()]
  }

  return (
    <StyledList {...props}>
      {groups?.map(({header, items}, index) => (
        <>
          <Group key={index}>
            {header && <Header {...header} />}
            {items}
          </Group>
          {index + 1 !== groups.length && <Divider />}
        </>
      ))}
    </StyledList>
  )
}
