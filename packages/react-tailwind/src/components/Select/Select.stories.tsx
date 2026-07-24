import type {Meta, StoryObj} from '@storybook/react-vite'
import {Select} from './Select'
const meta = {
  title: 'React Tailwind/Forms/Select',
  component: Select,
} satisfies Meta<typeof Select>

export default meta

type Story = StoryObj<typeof meta>
const Example = () => (
  <Select defaultValue="one">
    <Select.Trigger aria-label="Default label">
      <Select.Value placeholder="Choice one" />
    </Select.Trigger>
    <Select.Portal>
      <Select.Positioner>
        <Select.Popup>
          <Select.List>
            <Select.Item value="one">Choice one</Select.Item>
            <Select.Item value="two">Choice two</Select.Item>
            <Select.Item value="three">Choice three</Select.Item>
            <Select.Item value="four">Choice four</Select.Item>
            <Select.Item value="five">Choice five</Select.Item>
            <Select.Item value="six">Choice six</Select.Item>
          </Select.List>
        </Select.Popup>
      </Select.Positioner>
    </Select.Portal>
  </Select>
)
export const Default: Story = {render: () => <Example />}
export const Playground: Story = {render: () => <Example />}
