import React from 'react'
import styled from 'styled-components'
import {get} from '../constants'

const StyledDivider = styled.div`
  height: 1px;
  background: ${get('colors.selectMenu.borderSecondary')};
  margin: calc(${get('space.2')} - 1px) -${get('space.2')} ${get('space.2')};
`

export function Divider(): JSX.Element {
  return <StyledDivider />
}
Divider.renderItem = Divider
