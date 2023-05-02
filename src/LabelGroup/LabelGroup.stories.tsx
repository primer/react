import React from 'react'
import styled from 'styled-components'
import LabelGroup, {LabelGroupProps} from './LabelGroup'
import {ComponentStory, Meta, Story} from '@storybook/react'
import Token from '../Token/Token'

const meta: Meta = {
  title: 'Components/LabelGroup',
  component: LabelGroup,
  argTypes: {
    overflowStyle: {
      control: {
        type: 'radio',
      },
      options: ['inline', 'overlay'],
    },
    autoTruncateTokens: {
      name: 'Truncate to fit width',
      defaultValue: false,
      control: {
        type: 'boolean',
      },
    },
    visibleTokenCount: {
      control: {
        type: 'number',
      },
      if: {arg: 'autoTruncateTokens', truthy: false},
    },
  },
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

export const Default: Story = () => (
  <LabelGroup>
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
)

export const Playground: Story = ({
  autoTruncateTokens,
  visibleTokenCount,
  ...restArgs
}: LabelGroupProps & {autoTruncateTokens?: boolean}) => {
  const visibleTokenCountValue = autoTruncateTokens ? 'auto' : visibleTokenCount

  return (
    <ResizableContainer>
      <LabelGroup {...restArgs} visibleTokenCount={visibleTokenCountValue}>
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
}

export default meta
