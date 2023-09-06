import React from 'react'
import {Meta} from '@storybook/react'
import {Prose, ProseProps} from '.'
import {KitchenSinkChildren} from './_ProseStorybookHelpers'

export default {
  title: 'Components/Prose',
  component: Prose,
  argTypes: {
    fullWidth: {
      control: {
        type: 'boolean',
      },
    },
  },
} as Meta<typeof Prose>

export const Default = () => (
  <Prose>
    <KitchenSinkChildren />
  </Prose>
)

export const Playground = (args: ProseProps) => (
  <Prose {...args}>
    <KitchenSinkChildren />
  </Prose>
)
