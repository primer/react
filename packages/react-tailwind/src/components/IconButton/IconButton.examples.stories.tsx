import type {Meta, StoryObj} from '@storybook/react-vite'
import {IconButton} from './IconButton'

const AddGlyph = () => <span>+</span>
const CloseGlyph = () => <span>×</span>

const meta = {
  title: 'React Tailwind/Components/IconButton/Examples',
  component: IconButton,
  args: {icon: AddGlyph, 'aria-label': 'Add item'},
} satisfies Meta<typeof IconButton>

export default meta
type Story = StoryObj<typeof meta>

export const ItemActions: Story = {
  render: () => (
    <div className="flex gap-2">
      <IconButton aria-label="Add item" icon={AddGlyph} />
      <IconButton aria-label="Close item" icon={CloseGlyph} variant="invisible" />
    </div>
  ),
}
