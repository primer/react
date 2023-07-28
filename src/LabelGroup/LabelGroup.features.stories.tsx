import React from 'react'
import styled from 'styled-components'
import LabelGroup from './LabelGroup'
import {Meta, Story} from '@storybook/react'
import Token from '../Token/Token'
import Label from '../Label/Label'

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
  overflow: auto;
  padding: 0.25rem;
  resize: horizontal;
  width: 600px;
`

export const TruncateAuto: Story = () => (
  <ResizableContainer>
    <LabelGroup visibleChildCount="auto">
      <Label>One</Label>
      <Label>Two</Label>
      <Label>Three</Label>
      <Label>Four</Label>
      <Label>Five</Label>
      <Label>Six</Label>
      <Label>Seven</Label>
      <Label>Eight</Label>
      <Label>Nine</Label>
      <Label>Ten</Label>
      <Label>Eleven</Label>
      <Label>Twelve</Label>
      <Label>Thirteen</Label>
      <Label>Fourteen</Label>
      <Label>Fifteen</Label>
      <Label>Sixteen</Label>
    </LabelGroup>
  </ResizableContainer>
)

export const TruncateAutoWithInteractiveTokens: Story = () => (
  <ResizableContainer>
    <LabelGroup visibleChildCount="auto">
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

export const TruncateAfterFive: Story = () => (
  <LabelGroup visibleChildCount={5}>
    <Label>One</Label>
    <Label>Two</Label>
    <Label>Three</Label>
    <Label>Four</Label>
    <Label>Five</Label>
    <Label>Six</Label>
    <Label>Seven</Label>
    <Label>Eight</Label>
    <Label>Nine</Label>
    <Label>Ten</Label>
    <Label>Eleven</Label>
    <Label>Twelve</Label>
    <Label>Thirteen</Label>
    <Label>Fourteen</Label>
    <Label>Fifteen</Label>
    <Label>Sixteen</Label>
  </LabelGroup>
)

export const TruncateAutoExpandInline: Story = () => (
  <ResizableContainer>
    <LabelGroup visibleChildCount="auto" overflowStyle="inline">
      <Label>One</Label>
      <Label>Two</Label>
      <Label>Three</Label>
      <Label>Four</Label>
      <Label>Five</Label>
      <Label>Six</Label>
      <Label>Seven</Label>
      <Label>Eight</Label>
      <Label>Nine</Label>
      <Label>Ten</Label>
      <Label>Eleven</Label>
      <Label>Twelve</Label>
      <Label>Thirteen</Label>
      <Label>Fourteen</Label>
      <Label>Fifteen</Label>
      <Label>Sixteen</Label>
    </LabelGroup>
  </ResizableContainer>
)

export const TruncateAutoExpandInlineWithInteractiveTokens: Story = () => (
  <ResizableContainer>
    <LabelGroup visibleChildCount="auto" overflowStyle="inline">
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
