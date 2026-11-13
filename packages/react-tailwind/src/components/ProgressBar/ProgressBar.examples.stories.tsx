import {DotFillIcon} from '@primer/octicons-react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {Stack} from '../Stack'
import {ProgressBar} from './ProgressBar'

const meta = {
  title: 'React Tailwind/Display/ProgressBar/Examples',
  component: ProgressBar,
} satisfies Meta<typeof ProgressBar>

export default meta
type Story = StoryObj<typeof meta>

export const WithVisibleTextValue: Story = {
  render: () => (
    <>
      <ProgressBar progress={50} aria-label="Loading example" />
      <p className="text-sm leading-[21px] text-muted">50% completed</p>
    </>
  ),
}

export const MultipleSegments: Story = {
  render: () => (
    <>
      <ProgressBar>
        <ProgressBar.Item progress={30} variant="success" aria-labelledby="done" />
        <ProgressBar.Item progress={15} variant="accent" aria-labelledby="in-progress" />
        <ProgressBar.Item progress={5} variant="danger" aria-labelledby="closed" />
      </ProgressBar>
      <Stack direction="horizontal" wrap="wrap">
        <Stack direction="horizontal" gap="condensed" align="center" id="done">
          <DotFillIcon fill="var(--bgColor-success-emphasis)" />
          Done
        </Stack>
        <Stack direction="horizontal" gap="condensed" align="center" id="in-progress">
          <DotFillIcon fill="var(--bgColor-accent-emphasis)" />
          In progress
        </Stack>
        <Stack direction="horizontal" gap="condensed" align="center" id="closed">
          <DotFillIcon fill="var(--bgColor-danger-emphasis)" />
          Closed
        </Stack>
      </Stack>
    </>
  ),
}

export const EmptyAndComplete: Story = {
  render: () => (
    <div className="space-y-2">
      <ProgressBar progress={0} aria-label="Not started" />
      <ProgressBar progress={100} aria-label="Complete" />
    </div>
  ),
}
