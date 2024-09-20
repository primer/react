import React from 'react'
import type {Meta, StoryObj} from '@storybook/react'
import {KeybindingHint, type KeybindingHintProps} from '.'
import {Button, ActionList, FormControl, TextInput} from '..'

export default {
  title: 'Experimental/Components/KeybindingHint/Examples',
  component: KeybindingHint,
} satisfies Meta<typeof KeybindingHint>

export const ButtonExample: StoryObj<KeybindingHintProps> = {
  render: args => <Button trailingVisual={() => <KeybindingHint {...args} />}>Pull requests</Button>,
  args: {keys: 'g p'},
  name: 'Button',
}

export const PrimaryButton: StoryObj<KeybindingHintProps> = {
  render: args => (
    <Button variant="primary" trailingVisual={() => <KeybindingHint {...args} />}>
      Submit
    </Button>
  ),
  args: {keys: 'Mod+Enter', variant: 'onEmphasis'},
}

export const ActionListExample: StoryObj<KeybindingHintProps> = {
  render: args => (
    <ActionList sx={{maxWidth: '300px', border: '1px solid', borderColor: 'border.default', borderRadius: 2}}>
      <ActionList.Item>Add comment</ActionList.Item>
      <ActionList.Item>
        Copy text{' '}
        <ActionList.TrailingVisual>
          <KeybindingHint {...args} />
        </ActionList.TrailingVisual>
      </ActionList.Item>
      <ActionList.Item>Cancel</ActionList.Item>
    </ActionList>
  ),
  args: {keys: 'Mod+c'},
  name: 'ActionList',
}

export const Prose: StoryObj<KeybindingHintProps> = {
  render: args => (
    <p>
      Press <KeybindingHint {...args} /> to toggle between write and preview modes.
    </p>
  ),
  args: {
    keys: 'Mod+Shift+P',
    format: 'full',
  },
}

export const TextInputExample: StoryObj<KeybindingHintProps> = {
  render: args => (
    <FormControl>
      <FormControl.Label visuallyHidden>Search</FormControl.Label>
      <TextInput trailingVisual={() => <KeybindingHint {...args} />} placeholder="Search" />
    </FormControl>
  ),
  args: {keys: '/'},
  name: 'TextInput',
}
