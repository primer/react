import type {Meta, StoryObj} from '@storybook/react-vite'
import {Stack} from '../Stack'
import {IssueLabel} from './IssueLabel'

const meta = {
  title: 'React Tailwind/Content/IssueLabel/Features',
  component: IssueLabel,
} satisfies Meta<typeof IssueLabel>

export default meta
type Story = StoryObj<typeof meta>

export const VariantPink: Story = {args: {variant: 'pink', children: 'Issue label'}}
export const VariantPlum: Story = {args: {variant: 'plum', children: 'Issue label'}}
export const VariantPurple: Story = {args: {variant: 'purple', children: 'Issue label'}}
export const VariantIndigo: Story = {args: {variant: 'indigo', children: 'Issue label'}}
export const VariantBlue: Story = {args: {variant: 'blue', children: 'Issue label'}}
export const VariantCyan: Story = {args: {variant: 'cyan', children: 'Issue label'}}
export const VariantTeal: Story = {args: {variant: 'teal', children: 'Issue label'}}
export const VariantPine: Story = {args: {variant: 'pine', children: 'Issue label'}}
export const VariantGreen: Story = {args: {variant: 'green', children: 'Issue label'}}
export const VariantLime: Story = {args: {variant: 'lime', children: 'Issue label'}}
export const VariantOlive: Story = {args: {variant: 'olive', children: 'Issue label'}}
export const VariantLemon: Story = {args: {variant: 'lemon', children: 'Issue label'}}
export const VariantYellow: Story = {args: {variant: 'yellow', children: 'Issue label'}}
export const VariantOrange: Story = {args: {variant: 'orange', children: 'Issue label'}}
export const VariantRed: Story = {args: {variant: 'red', children: 'Issue label'}}
export const VariantCoral: Story = {args: {variant: 'coral', children: 'Issue label'}}
export const VariantGray: Story = {args: {variant: 'gray', children: 'Issue label'}}
export const VariantBrown: Story = {args: {variant: 'brown', children: 'Issue label'}}
export const VariantAuburn: Story = {args: {variant: 'auburn', children: 'Issue label'}}

export const HexColor: Story = {args: {fillColor: '#59B200', children: 'Issue label'}}
export const AsLink: Story = {args: {href: '/', children: 'Issue label'}}
export const AsButton: Story = {args: {onClick: () => undefined, children: 'Issue label'}}

export const GroupOfLabels: Story = {
  render: () => (
    <Stack direction="horizontal" gap="condensed" wrap="wrap">
      <IssueLabel variant="blue">Issue label</IssueLabel>
      <IssueLabel variant="purple">Another label</IssueLabel>
      <IssueLabel variant="green">A third label</IssueLabel>
      <IssueLabel variant="orange">Issue label</IssueLabel>
      <IssueLabel variant="yellow">Another label</IssueLabel>
      <IssueLabel variant="brown">A third label</IssueLabel>
    </Stack>
  ),
}

export const LongLabel: Story = {
  args: {variant: 'gray', children: 'A label with a longer description'},
}
