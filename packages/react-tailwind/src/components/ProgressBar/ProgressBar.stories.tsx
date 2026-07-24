import type {Meta, StoryObj} from '@storybook/react-vite'
import {ProgressBar} from './ProgressBar'

const meta = {
  title: 'React Tailwind/Display/ProgressBar',
  component: ProgressBar,
} satisfies Meta<typeof ProgressBar>

export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {args: {progress: 60, 'aria-label': 'Upload'}}
export const Playground: Story = {
  args: {progress: 42, variant: 'accent', size: 'large', animated: true, 'aria-label': 'Upload'},
}
