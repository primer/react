import React from 'react'
import styled from 'styled-components'
import {get} from '../constants'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DividerProps {}

const StyledDivider = styled.div`
  position: relative;
  height: 1px;
  background: ${get('colors.selectMenu.borderSecondary')};
  border: 0;
  margin: calc(${get('space.2')} - 1px) -${get('space.2')} ${get('space.2')};
  padding: 0;

  ::before {
    content: '';
    display: block;
    position: absolute;
    width: calc(100% - ${get('space.3')});
    height: 1px;
    background: ${get('colors.selectMenu.borderSecondary')};
    top: 0;
    left: ${get('space.2')};
  }
`

export function Divider(props?: DividerProps): JSX.Element {
  return <StyledDivider data-component="ActionList.Divider" {...props} />
}
Divider.renderItem = Divider
