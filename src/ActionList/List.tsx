import {Group, GroupProps} from './Group'
import {Item, ItemProps} from './Item'
import React from 'react'
import {Divider} from './Divider'
import {Header, HeaderProps} from './Header'
import styled from 'styled-components'
import {get} from '../constants'

type Flatten<T extends unknown> = T extends (infer U)[] ? U : never

interface UngroupedListProps {
  items: ItemProps[]
  renderItem?: (props: ItemProps) => JSX.Element
}

interface GroupedListProps extends UngroupedListProps {
  groupMetadata: (GroupProps & {groupId: string; header?: HeaderProps})[]
  items: (ItemProps & {groupId: string})[]
}
function isGroupedListProps(props: ListProps): props is GroupedListProps {
  return 'groupMetadata' in props
}

export type ListProps = UngroupedListProps | GroupedListProps

type GroupWithItems = Omit<Flatten<GroupedListProps['groupMetadata']>, 'groupId'> & {items?: JSX.Element[]}

const StyledList = styled.div`
  font-size: ${get('fontSizes.1')};
`

export function List(props: ListProps): JSX.Element {
  const toJSX = (itemProps: ItemProps) =>
    ((('renderItem' in itemProps && itemProps.renderItem) ?? props.renderItem) || Item).call(null, itemProps)

  let groups: GroupWithItems[] = []
  if (!isGroupedListProps(props)) {
    groups = [{items: props.items?.map(toJSX)}]
  } else {
    const groupMap = props.groupMetadata.reduce(
      (groups, groupMetadata) => groups.set(groupMetadata.groupId, groupMetadata),
      new Map<string, GroupWithItems>()
    )
    for (const itemProps of props.items) {
      const group = groupMap.get(itemProps.groupId)
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
