import type {Meta, StoryObj} from '@storybook/react-vite'
import {ProgressBar} from './ProgressBar'

const meta = {
  title: 'React Tailwind/Display/ProgressBar',
  component: ProgressBar,
} satisfies Meta<typeof ProgressBar>

export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {args: {'aria-label': 'Upload test.png'}}
export const Playground: Story = {
  args: {progress: 66, size: 'medium', inline: false, variant: 'success', 'aria-label': 'Upload test.png'},
}
