import React from 'react'
import styled from 'styled-components'
import {get} from '../../constants'

export const StyledDivider = styled.div`
  height: 1px;
  background: ${get('colors.border.muted')};
  margin-top: calc(${get('space.2')} - 1px);
  margin-bottom: ${get('space.2')};
`

/**
 * Visually separates `Item`s or `Group`s in an `ActionList`.
 */
export function Divider(): JSX.Element {
  return <StyledDivider />
}

/**
 * `Divider` fulfills the `ItemPropsWithCustomRenderer` contract,
 * so it can be used inline in an `ActionList`’s `items` prop.
 * In other words, `items={[ActionList.Divider]}` is supported as a concise
 * alternative to `items={[{renderItem: () => <ActionList.Divider />}]}`.
 */
Divider.renderItem = Divider
