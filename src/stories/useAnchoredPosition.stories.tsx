/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react'
import {Meta} from '@storybook/react'

import {BaseStyles, BorderBox, Position} from '..'
import {useAnchoredPosition} from '../hooks/useAnchoredPosition'
import styled from 'styled-components'

export default {
  title: 'Hooks/useAnchoredPosition',
  decorators: [
    Story => {
      return (
        <BaseStyles>
          <Story />
        </BaseStyles>
      )
    }
  ]
} as Meta

const BorderedPosition = styled(Position)`
  border: 1px solid #ccc;
`

export const UseAnchoredPosition = () => {
  const {floatingElementRef, anchorElementRef, position} = useAnchoredPosition({side: 'outside-bottom', align: 'center'})
  return (
    <Position position="absolute" top={0} bottom={0} left={0} right={0}>
      <BorderedPosition
        position="absolute"
        top={position?.top ?? 0}
        left={position?.left ?? 0}
        width={150}
        height={150}
        ref={floatingElementRef as React.RefObject<HTMLDivElement>}
      >
        Floating element
      </BorderedPosition>
      <BorderBox width={400} height={75} ref={anchorElementRef as React.RefObject<HTMLDivElement>}>
        Anchor Element
      </BorderBox>
    </Position>
  )
}
