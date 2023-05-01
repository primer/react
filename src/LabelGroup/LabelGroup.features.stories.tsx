import React from 'react'
import styled from 'styled-components'
import LabelGroup from './LabelGroup'
import {Meta, Story} from '@storybook/react'
import Token from '../Token/Token'

const meta: Meta = {
  title: 'Components/LabelGroup/Features',
  component: LabelGroup,
  decorators: [
    Story => {
      return (
        <>
          <Story />
        </>
      )
    },
  ],
}

const ResizableContainer = styled.div`
  outline: 1px solid black;
  resize: horizontal;
  overflow: auto;
`

export const TruncateAuto: Story = () => (
  <ResizableContainer>
    <LabelGroup visibleTokenCount="auto">
      <Token text="One" />
      <Token text="Two" />
      <Token text="Three" />
      <Token text="Four" />
      <Token text="Five" />
      <Token text="Six" />
      <Token text="Seven" />
      <Token text="Eight" />
      <Token text="Nine" />
      <Token text="Ten" />
      <Token text="Eleven" />
      <Token text="Twelve" />
      <Token text="Thirteen" />
      <Token text="Fourteen" />
      <Token text="Fifteen" />
      <Token text="Sixteen" />
    </LabelGroup>
  </ResizableContainer>
)

export const TruncateAfterCount: Story = () => (
  <ResizableContainer>
    <LabelGroup visibleTokenCount={5}>
      <Token text="One" />
      <Token text="Two" />
      <Token text="Three" />
      <Token text="Four" />
      <Token text="Five" />
      <Token text="Six" />
      <Token text="Seven" />
      <Token text="Eight" />
      <Token text="Nine" />
      <Token text="Ten" />
      <Token text="Eleven" />
      <Token text="Twelve" />
      <Token text="Thirteen" />
      <Token text="Fourteen" />
      <Token text="Fifteen" />
      <Token text="Sixteen" />
    </LabelGroup>
  </ResizableContainer>
)

export const TruncateAutoExpandInline: Story = () => (
  <ResizableContainer>
    <LabelGroup visibleTokenCount="auto" overflowStyle="inline">
      <Token text="One" />
      <Token text="Two" />
      <Token text="Three" />
      <Token text="Four" />
      <Token text="Five" />
      <Token text="Six" />
      <Token text="Seven" />
      <Token text="Eight" />
      <Token text="Nine" />
      <Token text="Ten" />
      <Token text="Eleven" />
      <Token text="Twelve" />
      <Token text="Thirteen" />
      <Token text="Fourteen" />
      <Token text="Fifteen" />
      <Token text="Sixteen" />
    </LabelGroup>
  </ResizableContainer>
)

export const TruncateAutoExpandInlineWithInteractiveTokens: Story = () => (
  <ResizableContainer>
    <LabelGroup visibleTokenCount="auto" overflowStyle="inline">
      <Token as="button" text="One" />
      <Token as="button" text="Two" />
      <Token as="button" text="Three" />
      <Token as="button" text="Four" />
      <Token as="button" text="Five" />
      <Token as="button" text="Six" />
      <Token as="button" text="Seven" />
      <Token as="button" text="Eight" />
      <Token as="button" text="Nine" />
      <Token as="button" text="Ten" />
      <Token as="button" text="Eleven" />
      <Token as="button" text="Twelve" />
      <Token as="button" text="Thirteen" />
      <Token as="button" text="Fourteen" />
      <Token as="button" text="Fifteen" />
      <Token as="button" text="Sixteen" />
    </LabelGroup>
  </ResizableContainer>
)

export default meta
