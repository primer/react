import type {SystemStyleObject} from '@styled-system/css'
import {Group, GroupProps} from './Group'
import {Item, ItemProps} from './Item'
import React from 'react'
import {StyledDiv} from './private/StyledDiv'
import {Divider} from './Divider'
import {Header, HeaderProps} from './private/Header'

type Flatten<T extends unknown> = T extends (infer U)[] ? U : never

interface UngroupedListProps {
  items: ItemProps[]
  renderItem?: (props: ItemProps) => JSX.Element
}
function isUngroupedListProps(props: ListProps): props is UngroupedListProps {
  return typeof props === 'object' && props !== null && !('groupMetadata' in props)
}

interface GroupedListProps extends UngroupedListProps {
  groupMetadata: (GroupProps & {groupId: number; header?: HeaderProps})[]
  items: (ItemProps & {groupId: number})[]
}
function isGroupedListProps(props: ListProps): props is GroupedListProps {
  return typeof props === 'object' && props !== null && 'groupMetadata' in props
}

export type ListProps = UngroupedListProps | GroupedListProps

const actionListStyles: SystemStyleObject = {
  fontSize: '14px'
}

export function List({renderItem = Item, ...props}: ListProps): JSX.Element {
  const toJSX = (itemProps: ItemProps) =>
    'renderItem' in itemProps ? itemProps.renderItem(itemProps) : renderItem(itemProps)

  const groups = (() => {
    if (isUngroupedListProps(props)) {
      return [{items: props.items.map(toJSX)}]
    } else if (isGroupedListProps(props)) {
      const groupMap = props.groupMetadata.reduce(
        (groups, groupMetadata) => groups.set(groupMetadata.groupId, groupMetadata),
        new Map<number, Omit<Flatten<GroupedListProps['groupMetadata']>, 'groupId'> & {items?: JSX.Element[]}>()
      )
      props.items.forEach(itemProps => {
        const group = groupMap.get(itemProps.groupId)
        groupMap.set(itemProps.groupId, {
          ...group,
          items: [...(group?.items ?? []), toJSX({renderItem: group?.renderItem ?? renderItem, ...itemProps})]
        })
      })
      return [...groupMap.values()]
    }
  })()

  return (
    <StyledDiv data-component="ActionList" sx={actionListStyles} {...props}>
      {groups?.map(({header, items}, index) => (
        <>
          <Group key={index}>
            {header && <Header {...header} />}
            {items}
          </Group>
          {index + 1 !== groups.length && <Divider />}
        </>
      ))}
    </StyledDiv>
  )
}
