import type {GroupProps} from '../Group'
import {Item, ItemProps} from '../Item'
import {List} from '../List'
import React from 'react'
import {HeaderProps} from './Header'

interface ListPropsWithItems<I extends ItemProps = ItemProps> {
  items: I[]
  renderItem?: (props: I) => JSX.Element
}

interface AlternativeListProps<
  I extends ItemProps = ItemProps,
  G extends GroupProps = GroupProps,
  H extends HeaderProps = HeaderProps
> extends Partial<ListPropsWithItems<I>> {
  items: (I & {groupId: number})[]
  renderItem?: (props: I) => JSX.Element
  groups?: (G & {header?: H; groupId: number})[]
  renderGroup?: (props: G) => JSX.Element
}

type Flatten<T> = T extends (infer U)[] ? U : never

export function AlternativeList({items, renderItem = Item, ...props}: AlternativeListProps): JSX.Element {
  // Coalesce 'groups' into what non-Alternative List expects
  let groups: (Omit<Flatten<typeof props.groups>, 'groupId'> & {items?: ItemProps[]})[] | undefined = undefined

  if ('groups' in props && props.groups) {
    // Create a Map of group ids to group data (including group headers)
    const groupMap = props.groups.reduce(
      (groups, group) => groups.set(group.groupId, group),
      new Map<number, Omit<Flatten<typeof props.groups>, 'groupId'> & {items?: ItemProps[]}>()
    )

    // Add each item to its group in the Map
    items.forEach(item => {
      const group = groupMap.get(item.groupId)
      groupMap.set(item.groupId, {...group, items: [...(group?.items ? group?.items : []), item]})
    })

    groups = [...groupMap.values()]
  }

  return <List items={items} renderItem={renderItem} {...(groups && {groups})} />
}
