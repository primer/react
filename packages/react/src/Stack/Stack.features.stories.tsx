import type {Meta} from '@storybook/react-vite'
import {Stack} from '../Stack'
import {ShieldLockIcon} from '@primer/octicons-react'

export default {
  title: 'Components/Stack/Features',
  component: Stack,
} as Meta<typeof Stack>

export const ShrinkingStackItems = () => (
  <div style={{maxWidth: '200px', padding: 'var(--base-size-8)'}}>
    <Stack direction="horizontal" gap="condensed">
      <Stack.Item shrink={false}>
        <ShieldLockIcon size="small" />
      </Stack.Item>
      <Stack.Item>This stack has the leading icon set to prevent shrinking</Stack.Item>
    </Stack>
    <Stack direction="horizontal" gap="condensed">
      <Stack.Item shrink={true}>
        <ShieldLockIcon size="small" />
      </Stack.Item>
      <Stack.Item>This stack item does not have the icon set to prevent shrinking</Stack.Item>
    </Stack>
  </div>
)
