import type {Meta, StoryObj} from '@storybook/react-vite'
import {ShieldLockIcon} from '@primer/octicons-react'
import {Stack, StackItem} from './Stack'

const meta = {title: 'React Tailwind/Layout/Stack/Features', component: Stack} satisfies Meta<typeof Stack>
export default meta
type Story = StoryObj<typeof meta>

const Placeholder = ({label}: {label: string}) => (
  <div className="rounded-md border border-accent-muted bg-accent-muted px-4 py-2 text-xs leading-[18px]">{label}</div>
)

function Items() {
  return (
    <>
      <Placeholder label="A" />
      <Placeholder label="B" />
      <Placeholder label="C" />
    </>
  )
}

export const GapScale: Story = {
  render: () => (
    <Stack gap="spacious">
      {(['none', 'tight', 'condensed', 'cozy', 'normal', 'spacious'] as const).map(gap => (
        <Stack key={gap} gap="spacious">
          <span className="text-xs leading-[18px] text-muted">gap=&quot;{gap}&quot;</span>
          <Stack direction="horizontal" gap={gap}>
            <Items />
          </Stack>
        </Stack>
      ))}
    </Stack>
  ),
}
export const DirectionalPadding: Story = {
  render: () => (
    <Stack gap="normal">
      <Stack padding="normal" className="bg-muted">
        <Placeholder label='padding="normal" (all sides)' />
      </Stack>
      <Stack padding="normal" paddingInline="spacious" className="bg-muted">
        <Placeholder label='padding="normal" paddingInline="spacious"' />
      </Stack>
      <Stack paddingBlock="condensed" paddingInline="spacious" className="bg-muted">
        <Placeholder label='paddingBlock="condensed" paddingInline="spacious"' />
      </Stack>
    </Stack>
  ),
}
export const PaddingScale: Story = {
  render: () => (
    <Stack gap="spacious">
      {(['none', 'tight', 'condensed', 'cozy', 'normal', 'spacious'] as const).map(padding => (
        <Stack key={padding} gap="spacious">
          <span className="text-xs leading-[18px] text-muted">padding=&quot;{padding}&quot;</span>
          <Stack padding={padding} className="bg-muted">
            <Placeholder label="Content" />
          </Stack>
        </Stack>
      ))}
    </Stack>
  ),
}
export const ShrinkingStackItems: Story = {
  render: () => (
    <div className="max-w-[200px] p-2">
      <Stack direction="horizontal" gap="condensed">
        <StackItem shrink={false}>
          <ShieldLockIcon size={16} />
        </StackItem>
        <StackItem>This stack has the leading icon set to prevent shrinking</StackItem>
      </Stack>
      <Stack direction="horizontal" gap="condensed">
        <StackItem shrink>
          <ShieldLockIcon size={16} />
        </StackItem>
        <StackItem>This stack item does not have the icon set to prevent shrinking</StackItem>
      </Stack>
    </div>
  ),
}
export const ResponsiveDirection: Story = {
  render: () => (
    <Stack direction={{narrow: 'vertical', regular: 'horizontal'}} gap="normal">
      <Items />
    </Stack>
  ),
}
