import React from 'react'
import {actionListItemDivider, s16, s8} from './private/variables'
import styled from 'styled-components'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DividerProps {}

const StyledDivider = styled.div`
  position: relative;
  height: 1px;
  background: ${actionListItemDivider};
  border: 0;
  margin: ${s8 - 1}px -${s8}px ${s8}px;
  padding: 0;

  ::before {
    content: '';
    display: block;
    position: absolute;
    width: calc(100% - ${s16}px);
    height: 1px;
    background: ${actionListItemDivider};
    top: 0;
    left: ${s8}px;
  }
`

export function Divider(props?: DividerProps): JSX.Element {
  return <StyledDivider data-component="ActionList.Divider" {...props} />
}
Divider.renderItem = Divider
