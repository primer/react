import type {Meta, StoryObj} from '@storybook/react-vite'
import {ButtonGroup} from './ButtonGroup'

const meta = {
  title: 'React Tailwind/Display/ButtonGroup/Examples',
  component: ButtonGroup,
} satisfies Meta<typeof ButtonGroup>

export default meta
type Story = StoryObj<typeof meta>

export const FormattingToolbar: Story = {
  render: () => (
    <ButtonGroup role="toolbar" aria-label="Formatting">
      <button type="button">Bold</button>
      <button type="button">Italic</button>
      <button type="button">Code</button>
    </ButtonGroup>
  ),
}
