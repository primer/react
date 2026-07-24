import type {Meta, StoryObj} from '@storybook/react-vite'
import {Select} from './Select'
const meta = {
  title: 'React Tailwind/Forms/Select',
  component: Select,
} satisfies Meta<typeof Select>

export default meta

type Story = StoryObj<typeof meta>
const Example = () => (
  <Select>
    <Select.Trigger>
      <Select.Value placeholder="Choose a branch" />
    </Select.Trigger>
    <Select.Portal>
      <Select.Positioner>
        <Select.Popup>
          <Select.List>
            <Select.Item value="main">main</Select.Item>
            <Select.Item value="next">next</Select.Item>
          </Select.List>
        </Select.Popup>
      </Select.Positioner>
    </Select.Portal>
  </Select>
)
export const Default: Story = {render: () => <Example />}
export const Playground: Story = {render: () => <Example />}
