/* eslint-disable primer-react/spread-props-first */
import type React from 'react'
import type {LabelGroupProps} from './LabelGroup'
import LabelGroup from './LabelGroup'
import type {Meta, StoryFn} from '@storybook/react-vite'
import Label from '../Label/Label'
import classes from './LabelGroupStories.module.css'

const meta: Meta = {
  title: 'Components/LabelGroup',
  component: LabelGroup,
}

const ResizableContainer = ({children, ...props}: {children: React.ReactNode}) => (
  <div className={classes.ResizableContainer} {...props}>
    {children}
  </div>
)

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
Playground.args = {
  as: 'ul',
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
