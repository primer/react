import type {Meta, StoryObj} from '@storybook/react-vite'
import {KeybindingHint, type KeybindingHintProps} from '.'
import {Button, ActionList, FormControl, TextInput} from '..'
import classes from './KeybindingHint.examples.stories.module.css'

export default {
  title: 'Experimental/Components/KeybindingHint/Examples',
  component: KeybindingHint,
} satisfies Meta<typeof KeybindingHint>

export const ButtonExample: StoryObj<KeybindingHintProps> = {
  render: args => (
    <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
      <div style={{display: 'flex', gap: '8px'}}>
        <Button trailingVisual={() => <KeybindingHint {...args} />}>Default button</Button>
        <Button size="small" trailingVisual={() => <KeybindingHint {...args} size="small" />}>
          Small button
        </Button>
        <Button size="large" trailingVisual={() => <KeybindingHint {...args} />}>
          Large button
        </Button>
        <Button disabled trailingVisual={() => <KeybindingHint {...args} />}>
          Disabled button
        </Button>
        <Button inactive trailingVisual={() => <KeybindingHint {...args} />}>
          Inactive button
        </Button>
      </div>
      <div style={{display: 'flex', gap: '8px'}}>
        <Button variant="primary" trailingVisual={() => <KeybindingHint {...args} />}>
          Default button
        </Button>
        <Button variant="primary" size="small" trailingVisual={() => <KeybindingHint {...args} size="small" />}>
          Small button
        </Button>
        <Button variant="primary" size="large" trailingVisual={() => <KeybindingHint {...args} />}>
          Large button
        </Button>
        <Button variant="primary" disabled trailingVisual={() => <KeybindingHint {...args} />}>
          Disabled button
        </Button>
        <Button variant="primary" inactive trailingVisual={() => <KeybindingHint {...args} />}>
          Inactive button
        </Button>
      </div>
      <div style={{display: 'flex', gap: '8px'}}>
        <Button variant="danger" trailingVisual={() => <KeybindingHint {...args} />}>
          Default button
        </Button>
        <Button variant="danger" size="small" trailingVisual={() => <KeybindingHint {...args} size="small" />}>
          Small button
        </Button>
        <Button variant="danger" size="large" trailingVisual={() => <KeybindingHint {...args} />}>
          Large button
        </Button>
        <Button variant="danger" disabled trailingVisual={() => <KeybindingHint {...args} />}>
          Disabled button
        </Button>
        <Button variant="danger" inactive trailingVisual={() => <KeybindingHint {...args} />}>
          Inactive button
        </Button>
      </div>
      <div style={{display: 'flex', gap: '8px'}}>
        <Button variant="invisible" trailingVisual={() => <KeybindingHint {...args} />}>
          Default button
        </Button>
        <Button variant="invisible" size="small" trailingVisual={() => <KeybindingHint {...args} size="small" />}>
          Small button
        </Button>
        <Button variant="invisible" size="large" trailingVisual={() => <KeybindingHint {...args} />}>
          Large button
        </Button>
        <Button variant="invisible" disabled trailingVisual={() => <KeybindingHint {...args} />}>
          Disabled button
        </Button>
        <Button variant="invisible" inactive trailingVisual={() => <KeybindingHint {...args} />}>
          Inactive button
        </Button>
      </div>
    </div>
  ),
  args: {keys: 'g p'},
  argTypes: {
    keys: {
      control: 'text',
    },
    format: {
      control: 'radio',
      options: ['condensed', 'full'],
    },
    size: {
      control: false,
      table: {
        disable: true,
      },
    },
    variant: {
      control: false,
      table: {
        disable: true,
      },
    },
  },
  name: 'Button',
}

export const ActionListExample: StoryObj<KeybindingHintProps> = {
  render: args => (
    <ActionList className={classes.ActionListExample}>
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
