import React from 'react'
import styled from 'styled-components'
import {get} from '../constants'

const StyledDivider = styled.div`
  height: 1px;
  background: ${get('colors.selectMenu.borderSecondary')};
  margin: calc(${get('space.2')} - 1px) -${get('space.2')} ${get('space.2')};
`

/**
 * Visually separates `Item`s or `Group`s in an `ActionList`.
 */
export function Divider(): JSX.Element {
  return <StyledDivider />
}

/**
 * `Divider` fulfills the `ItemPropsWithRenderItem` contract,
 * so it can be used inline in an `ActionList`’s `items` prop.
 * In other words, `items={[ActionList.Divider]}` is supported as a concise
 * alternative to `items={[{renderItem: () => <ActionList.Divider />}]}`.
 */
Divider.renderItem = Divider
