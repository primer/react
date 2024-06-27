import React from 'react'
import styled from 'styled-components'
import type {LabelGroupProps} from './LabelGroup'
import LabelGroup from './LabelGroup'
import type {Meta, StoryFn} from '@storybook/react'
import Label from '../Label/Label'

const meta: Meta = {
  title: 'Components/LabelGroup',
  component: LabelGroup,
}

const ResizableContainer = styled.div`
  outline: 1px solid black;
  overflow: auto;
  padding: 0.25rem;
  resize: horizontal;
  width: 600px;
`

export const Default: StoryFn = () => (
  <LabelGroup>
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

export const Playground: StoryFn = ({
  autoTruncateTokens,
  visibleChildCount,
  ...restArgs
}: LabelGroupProps & {autoTruncateTokens?: boolean}) => {
  const visibleChildCountValue = autoTruncateTokens ? 'auto' : visibleChildCount

  return (
    <ResizableContainer>
      <LabelGroup {...restArgs} visibleChildCount={visibleChildCountValue}>
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
}
Playground.argTypes = {
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
  visibleChildCount: {
    control: {
      type: 'number',
    },
    if: {arg: 'autoTruncateTokens', truthy: false},
  },
}

export default meta
