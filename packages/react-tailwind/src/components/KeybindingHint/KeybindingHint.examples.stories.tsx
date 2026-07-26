import type {Meta, StoryObj} from '@storybook/react-vite'
import {ActionList} from '../ActionList'
import {Button} from '../Button'
import {TextInput} from '../TextInput'
import {KeybindingHint, type KeybindingHintProps} from './KeybindingHint'

const meta = {
  title: 'React Tailwind/Content/KeybindingHint/Examples',
  component: KeybindingHint,
} satisfies Meta<typeof KeybindingHint>

export default meta
type Story = StoryObj<typeof meta>

export const ButtonExample: Story = {
  render: (args: KeybindingHintProps) => (
    <div className="flex flex-col gap-4">
      {(['default', 'primary', 'danger', 'invisible'] as const).map(variant => (
        <div className="flex gap-2" key={variant}>
          <Button variant={variant} trailingVisual={<KeybindingHint {...args} />}>
            Default button
          </Button>
          <Button variant={variant} size="small" trailingVisual={<KeybindingHint {...args} size="small" />}>
            Small button
          </Button>
          <Button variant={variant} size="large" trailingVisual={<KeybindingHint {...args} />}>
            Large button
          </Button>
          <Button variant={variant} disabled trailingVisual={<KeybindingHint {...args} />}>
            Disabled button
          </Button>
          <Button variant={variant} inactive trailingVisual={<KeybindingHint {...args} />}>
            Inactive button
          </Button>
        </div>
      ))}
    </div>
  ),
  args: {keys: 'g p'},
}

export const ActionListExample: Story = {
  render: args => (
    <ActionList className="max-w-[300px] rounded-md border border-default">
      <ActionList.Item>Add comment</ActionList.Item>
      <ActionList.Item>
        Copy text
        <ActionList.TrailingVisual>
          <KeybindingHint {...args} />
        </ActionList.TrailingVisual>
      </ActionList.Item>
      <ActionList.Item>Cancel</ActionList.Item>
    </ActionList>
  ),
  args: {keys: 'Mod+c'},
}

export const Prose: Story = {
  render: args => (
    <p>
      Press <KeybindingHint {...args} /> to toggle between write and preview modes.
    </p>
  ),
  args: {keys: 'Mod+Shift+P', format: 'full'},
}

export const TextInputExample: Story = {
  render: args => (
    <label className="relative inline-flex" htmlFor="keybinding-hint-search">
      <span className="sr-only">Search</span>
      <TextInput id="keybinding-hint-search" className="pr-8" placeholder="Search" />
      <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
        <KeybindingHint {...args} />
      </span>
    </label>
  ),
  args: {keys: '/'},
}
