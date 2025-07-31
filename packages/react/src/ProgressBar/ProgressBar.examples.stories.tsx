import type {Meta} from '@storybook/react-vite'
import {ProgressBar, Stack} from '..'
import {DotFillIcon} from '@primer/octicons-react'

export default {
  title: 'Components/ProgressBar/Examples',
  component: ProgressBar,
} as Meta<typeof ProgressBar>

export const WithVisibleTextValue = () => {
  return (
    <>
      <ProgressBar progress={50} aria-label="Loading example" />
      <p style={{color: 'var(--fgColor-muted)', font: 'var(--text-body-shorthand-medium)'}}>50% completed</p>
    </>
  )
}

export const MultipleSegments = () => {
  return (
    <>
      <ProgressBar>
        <ProgressBar.Item
          progress={30}
          style={{backgroundColor: 'var(--bgColor-success-emphasis)'}}
          aria-labelledby="done"
        />
        <ProgressBar.Item
          progress={15}
          style={{backgroundColor: 'var(--bgColor-accent-emphasis)'}}
          aria-labelledby="in-progress"
        />
        <ProgressBar.Item
          progress={5}
          style={{backgroundColor: 'var(--bgColor-danger-emphasis)'}}
          aria-labelledby="closed"
        />
      </ProgressBar>
      <Stack direction="horizontal" wrap="wrap" marginTop={2}>
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
  )
}
