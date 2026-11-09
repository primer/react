import type {Meta, StoryObj} from '@storybook/react-vite'
import {Stack, StackItem} from './Stack'

const meta = {title: 'React Tailwind/Layout/Stack/Examples', component: Stack} satisfies Meta<typeof Stack>
export default meta
type Story = StoryObj<typeof meta>

const SummaryRow = ({label, value}: {label: string; value: string}) => (
  <Stack direction="horizontal" justify="space-between" gap="normal">
    <span className="text-muted">{label}</span>
    <strong>{value}</strong>
  </Stack>
)

export const SettingsSummary: Story = {
  render: () => (
    <Stack gap="normal" padding="normal" className="max-w-md border-thin border-default">
      <h2 className="m-0">Repository settings</h2>
      <SummaryRow label="Visibility" value="Private" />
      <SummaryRow label="Default branch" value="main" />
      <StackItem>Collaborators: 8</StackItem>
    </Stack>
  ),
}
