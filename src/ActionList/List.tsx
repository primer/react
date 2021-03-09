import type {SystemStyleObject} from '@styled-system/css'
import {Group, GroupProps} from './Group'
import {Item, ItemProps} from './Item'
import React from 'react'
import {StyledDiv} from './private/StyledDiv'
import {Divider} from './Divider'
import {Header, HeaderProps} from './private/Header'

interface ListPropsWithItems<I extends ItemProps = ItemProps> {
  items: I[]
  renderItem?: (props: I) => JSX.Element
}
interface ListPropsWithGroups<
  I extends ItemProps = ItemProps,
  G extends GroupProps = GroupProps,
  H extends HeaderProps = HeaderProps
> extends Partial<ListPropsWithItems<I>> {
  groups: (G & {header?: H; items?: I[]})[]
  renderGroup?: (props: G) => JSX.Element
}
export type ListProps = ListPropsWithItems | ListPropsWithGroups

const actionListStyles: SystemStyleObject = {
  fontSize: '14px'
}

export function List({items, renderItem = Item, ...props}: ListProps): JSX.Element {
  const groups = 'groups' in props ? props.groups : [{items}]
  return (
    <StyledDiv data-component="ActionList" sx={actionListStyles} {...props}>
      {groups.map(({header, items}, index) => (
        <>
          <Group key={index}>
            {header && <Header {...header} />}
            {items?.map(item => ('renderItem' in item ? item.renderItem(item) : renderItem(item)))}
          </Group>
          {index + 1 !== groups.length && <Divider />}
        </>
      ))}
    </StyledDiv>
  )
}
