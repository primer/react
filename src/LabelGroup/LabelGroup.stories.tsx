import {ComponentStory, Meta} from '@storybook/react'
import React from 'react'
import Label from '../Label'
import LabelGroup from './LabelGroup'

export default {
  title: 'Components/LabelGroup',
  component: LabelGroup,
} as Meta<typeof LabelGroup>

export const Default = () => (
  <LabelGroup>
    <Label>Default label</Label>
    <Label variant="danger">Label with background indicating a closed PR state</Label>
    <Label variant="primary">Default outline label</Label>
  </LabelGroup>
)

export const Playground: ComponentStory<typeof LabelGroup> = args => (
  <LabelGroup {...args}>
    <Label>Default label</Label>
    <Label variant="danger">Label with background indicating a closed PR state</Label>
    <Label variant="primary">Default outline label</Label>
  </LabelGroup>
)

Playground.argTypes = {
  sx: {
    controls: false,
    table: {
      disable: true,
    },
  },
}
