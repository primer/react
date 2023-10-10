import React from 'react'
import {ComponentStory, ComponentMeta} from '@storybook/react'
import FormControl, {FormControlProps} from './FormControl'

export default {
  title: 'Components/FormControl',
  component: FormControl,
} as ComponentMeta<typeof FormControl>
export const Default: ComponentStory<typeof FormControl> = () => <FormControl>Default H2 FormControl</FormControl>

export const Playground: ComponentStory<typeof FormControl> = args => <FormControl {...args}>FormControl</FormControl>

// Playground.args = {
//   children: `<h1>hi</h1>`,
//   // required: false,
//   disabled: false,
//   layout: 'horizontal',
// } as FormControlProps

// Playground.argTypes = {
//   // as: {
//   //   control: {
//   //     type: 'select',
//   //     options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
//   //   },
//   // },
// }
