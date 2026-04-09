import type {Meta} from '@storybook/react-vite'
import {Stack} from '../Stack'
import {ShieldLockIcon} from '@primer/octicons-react'

export default {
  title: 'Components/Stack/Features',
  component: Stack,
} as Meta<typeof Stack>

const Placeholder = ({label}: {label: string}) => (
  <div
    style={{
      padding: 'var(--base-size-8) var(--base-size-16)',
      backgroundColor: 'var(--bgColor-accent-muted)',
      border: '1px solid var(--borderColor-accent-muted)',
      borderRadius: 'var(--borderRadius-medium)',
      fontSize: 'var(--text-body-size-small)',
    }}
  >
    {label}
  </div>
)

export const GapScale = () => (
  <Stack gap="spacious">
    {(['none', 'tight', 'condensed', 'cozy', 'normal', 'spacious'] as const).map(gap => (
      <Stack key={gap}>
        <span style={{fontSize: 'var(--text-body-size-small)', color: 'var(--fgColor-muted)'}}>
          gap=&quot;{gap}&quot;
        </span>
        <Stack direction="horizontal" gap={gap}>
          <Placeholder label="A" />
          <Placeholder label="B" />
          <Placeholder label="C" />
        </Stack>
      </Stack>
    ))}
  </Stack>
)

export const DirectionalPadding = () => (
  <Stack gap="normal">
    <Stack padding="normal" style={{backgroundColor: 'var(--bgColor-muted)'}}>
      <Placeholder label='padding="normal" (all sides)' />
    </Stack>
    <Stack padding="normal" paddingInline="spacious" style={{backgroundColor: 'var(--bgColor-muted)'}}>
      <Placeholder label='padding="normal" paddingInline="spacious"' />
    </Stack>
    <Stack paddingBlock="condensed" paddingInline="spacious" style={{backgroundColor: 'var(--bgColor-muted)'}}>
      <Placeholder label='paddingBlock="condensed" paddingInline="spacious"' />
    </Stack>
  </Stack>
)

export const PaddingScale = () => (
  <Stack gap="spacious">
    {(['none', 'tight', 'condensed', 'cozy', 'normal', 'spacious'] as const).map(padding => (
      <Stack key={padding}>
        <span style={{fontSize: 'var(--text-body-size-small)', color: 'var(--fgColor-muted)'}}>
          padding=&quot;{padding}&quot;
        </span>
        <Stack padding={padding} style={{backgroundColor: 'var(--bgColor-muted)'}}>
          <Placeholder label="Content" />
        </Stack>
      </Stack>
    ))}
  </Stack>
)

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
