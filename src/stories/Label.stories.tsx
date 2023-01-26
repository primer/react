import React from 'react'
import {Meta, Story} from '@storybook/react'
// import {ComponentProps} from '../utils/types'
import Label from '../Label'

// type Args = ComponentProps<typeof Label>

export default {
  title: 'Components/Label',
  component: Label,
  args: {
    //   variant: 'default',
    //   size: 'large',
  },
  argTypes: {
    //   variant: {
    //     control: {
    //       type: 'select',
    //     },
    //     options: [
    //       'default',
    //       'primary',
    //       'secondary',
    //       'accent',
    //       'success',
    //       'attention',
    //       'severe',
    //       'danger',
    //       'done',
    //       'sponsors',
    //     ],
    //   },
    //   size: {
    //     control: {
    //       type: 'radio',
    //     },
    //     options: ['small', 'large'],
    //   },
  },
} as Meta<typeof Label>

export const Playground: Story<typeof Label> = args => <Label {...args}>Label</Label>
