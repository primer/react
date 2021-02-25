/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react'
import {Meta} from '@storybook/react'

import {BaseStyles, Position} from '..'
import {useAnchoredPosition} from '../hooks/useAnchoredPosition'
import styled from 'styled-components'
import {get} from '../constants'
import {AnchorSide} from '../behaviors/anchoredPosition'

export default {
  title: 'Hooks/useAnchoredPosition',
  decorators: [
    // Note: For some reason, if you use <BaseStyles><Story /></BaseStyles>,
    // the component gets unmounted from the root every time a control changes!
    Story => {
      return <BaseStyles>{Story()}</BaseStyles>
    }
  ],
  argTypes: {
    anchorX: {
      control: {type: 'range', min: 0, max: 500}
    },
    anchorY: {
      control: {type: 'range', min: 0, max: 500}
    },
    anchorWidth: {
      control: {type: 'range', min: 50, max: 500}
    },
    anchorHeight: {
      control: {type: 'range', min: 50, max: 500}
    },
    floatWidth: {
      control: {type: 'range', min: 50, max: 500}
    },
    floatHeight: {
      control: {type: 'range', min: 50, max: 500}
    },
    anchorPosition: {
      control: {type: 'inline-radio', options: ['inside', 'outside']}
    },
    anchorSide: {
      control: {type: 'inline-radio', options: ['top', 'bottom', 'left', 'right', 'center']},
      description: 'note'
    },
    anchorAlignment: {
      control: {type: 'inline-radio', options: ['first', 'center', 'last']}
    },
    anchorOffset: {
      control: {type: 'range', min: -100, max: 100}
    },
    alignmentOffset: {
      control: {type: 'range', min: -100, max: 100}
    },
    preventOverflow: {
      control: {type: 'boolean'}
    }
  }
} as Meta

const Float = styled(Position)`
  position: absolute;
  border: 1px solid ${get('colors.gray.6')};
  border-radius: ${get('radii.2')};
  transition: all 0.2s;
  background-color: ${get('colors.orange.3')};
  display: flex;
  flex-direction: column;
  text-align: center;
  font-size: ${get('fontSizes.3')};
  font-weight: ${get('fontWeights.bold')};
  padding: ${get('space.3')};
`
const Anchor = styled(Position)`
  position: absolute;
  border: 1px solid ${get('colors.gray.6')};
  border-radius: ${get('radii.2')};
  background-color: ${get('colors.blue.3')};
  display: flex;
  flex-direction: column;
  text-align: center;
  font-size: ${get('fontSizes.3')};
  font-weight: ${get('fontWeights.bold')};
  padding: ${get('space.3')};
`

export const UseAnchoredPosition = (args: any) => {
  const {floatingElementRef, anchorElementRef, position} = useAnchoredPosition(
    {
      side: `${args.anchorPosition ?? 'outside'}-${args.anchorSide ?? 'bottom'}` as AnchorSide,
      align: args.anchorAlignment ?? 'first',
      anchorOffset: args.anchorOffset && (parseInt(args.anchorOffset, 10) ?? undefined),
      alignmentOffset: args.alignmentOffset && (parseInt(args.alignmentOffset, 10) ?? undefined),
      preventOverflow: args.preventOverflow ?? undefined
    },
    [args]
  )
  return (
    <Position position="absolute" top={2} bottom={0} left={2} right={0}>
      <Anchor
        top={args.anchorY ?? 0}
        left={args.anchorX ?? 0}
        width={args.anchorWidth}
        height={args.anchorHeight}
        ref={anchorElementRef as React.RefObject<HTMLDivElement>}
      >
        Anchor Element
      </Anchor>
      <Float
        top={position?.top ?? 0}
        left={position?.left ?? 0}
        width={args.floatWidth ?? 150}
        height={args.floatHeight ?? 150}
        ref={floatingElementRef as React.RefObject<HTMLDivElement>}
      >
        Floating element
      </Float>
    </Position>
  )
}
export const CenteredOnScreen = (args: any) => {
  const {floatingElementRef, anchorElementRef, position} = useAnchoredPosition({
    side: 'inside-center',
    align: 'center'
  })
  // The outer Position element simply fills all available space
  return (
    <Position
      ref={anchorElementRef as React.RefObject<HTMLDivElement>}
      position="absolute"
      top={0}
      bottom={0}
      left={0}
      right={0}
    >
      <Float
        ref={floatingElementRef as React.RefObject<HTMLDivElement>}
        top={position?.top ?? 0}
        left={position?.left ?? 0}
      >
        <p>Screen-Centered Floating Element </p>
        <p>
          <small><em>(Controls are ignored for this story)</em></small>
        </p>
      </Float>
    </Position>
  )
}
