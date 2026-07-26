import type {Meta, StoryObj} from '@storybook/react-vite'
import {ProgressBar} from './ProgressBar'

const meta = {
  title: 'React Tailwind/Display/ProgressBar/Features',
  component: ProgressBar,
} satisfies Meta<typeof ProgressBar>

export default meta
type Story = StoryObj<typeof meta>

const label = 'Upload test.png'

export const ProgressZero: Story = {args: {progress: 0, 'aria-label': label}}
export const ProgressHalf: Story = {args: {progress: 50, 'aria-label': label}}
export const ProgressDone: Story = {args: {progress: 100, 'aria-label': label}}
export const SizeSmall: Story = {args: {progress: 66, size: 'small', 'aria-label': label}}
export const SizeLarge: Story = {args: {progress: 66, size: 'large', 'aria-label': label}}
export const Inline: Story = {args: {inline: true, progress: 66, style: {width: 100}, 'aria-label': label}}

export const AllColors: Story = {
  render: () => (
    <ProgressBar aria-label="Upload test.png">
      <ProgressBar.Item progress={20} aria-label="Photo Usage" variant="accent" />
      <ProgressBar.Item progress={15} aria-label="Application Usage" variant="danger" />
      <ProgressBar.Item progress={12} aria-label="Music Usage" variant="severe" />
      <ProgressBar.Item progress={11} aria-label="Music Usage" variant="done" />
      <ProgressBar.Item progress={8} aria-label="Music Usage" variant="sponsors" />
      <ProgressBar.Item progress={7} aria-label="Music Usage" variant="neutral" />
      <ProgressBar.Item progress={7} aria-label="Music Usage" variant="attention" />
    </ProgressBar>
  ),
}

export const MultipleItems: Story = {
  render: () => (
    <ProgressBar aria-label="Repository usage">
      <ProgressBar.Item progress={33} aria-label="Photo Usage" variant="accent" />
      <ProgressBar.Item progress={23} aria-label="Application Usage" variant="danger" />
      <ProgressBar.Item progress={14} aria-label="Music Usage" variant="severe" />
    </ProgressBar>
  ),
}

export const Animated: Story = {args: {progress: 50, animated: true, 'aria-label': label}}

export const ClampedValues: Story = {
  render: () => (
    <div className="space-y-2">
      <ProgressBar progress={-20} aria-label="Negative progress" />
      <ProgressBar progress={140} aria-label="Progress over one hundred" />
    </div>
  ),
}
