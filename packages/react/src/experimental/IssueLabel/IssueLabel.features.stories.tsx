import {IssueLabel} from '../IssueLabel'
import type {Meta} from '@storybook/react-vite'
import {Stack} from '../../Stack'
import {action} from 'storybook/internal/actions'

const meta = {
  title: 'Experimental/Components/IssueLabel/Features',
  component: IssueLabel,
} satisfies Meta<typeof IssueLabel>

export default meta

export const VariantPink = () => <IssueLabel variant="pink">Issue label</IssueLabel>

export const VariantPlum = () => <IssueLabel variant="plum">Issue label</IssueLabel>

export const VariantPurple = () => <IssueLabel variant="purple">Issue label</IssueLabel>

export const VariantIndigo = () => <IssueLabel variant="indigo">Issue label</IssueLabel>

export const VariantBlue = () => <IssueLabel variant="blue">Issue label</IssueLabel>

export const VariantCyan = () => <IssueLabel variant="cyan">Issue label</IssueLabel>

export const VariantTeal = () => <IssueLabel variant="teal">Issue label</IssueLabel>

export const VariantPine = () => <IssueLabel variant="pine">Issue label</IssueLabel>

export const VariantGreen = () => <IssueLabel variant="green">Issue label</IssueLabel>

export const VariantLime = () => <IssueLabel variant="lime">Issue label</IssueLabel>

export const VariantOlive = () => <IssueLabel variant="olive">Issue label</IssueLabel>

export const VariantLemon = () => <IssueLabel variant="lemon">Issue label</IssueLabel>

export const VariantYellow = () => <IssueLabel variant="yellow">Issue label</IssueLabel>

export const VariantOrange = () => <IssueLabel variant="orange">Issue label</IssueLabel>

export const VariantRed = () => <IssueLabel variant="red">Issue label</IssueLabel>

export const VariantCoral = () => <IssueLabel variant="coral">Issue label</IssueLabel>

export const VariantGray = () => <IssueLabel variant="gray">Issue label</IssueLabel>

export const VariantBrown = () => <IssueLabel variant="brown">Issue label</IssueLabel>

export const VariantAuburn = () => <IssueLabel variant="auburn">Issue label</IssueLabel>

export const HexColor = (args: {fillColor: `#${string}`}) => {
  return <IssueLabel fillColor={args.fillColor}>Issue label</IssueLabel>
}

HexColor.args = {
  fillColor: '#59B200',
}
HexColor.argTypes = {
  fillColor: {control: {type: 'color'}},
  variant: {table: {disable: true}},
  children: {table: {disable: true}},
  id: {table: {disable: true}},
  className: {table: {disable: true}},
  onClick: {table: {disable: true}},
  onFocus: {table: {disable: true}},
  as: {table: {disable: true}},
  href: {table: {disable: true}},
}

export const AsLink = () => <IssueLabel href="/">Issue label</IssueLabel>

export const AsButton = () => <IssueLabel onClick={action('onClick')}>Issue label</IssueLabel>

export const GroupOfLabels = () => (
  <Stack direction="horizontal" gap="condensed" wrap="wrap">
    <IssueLabel variant="blue">Issue label</IssueLabel>
    <IssueLabel variant="purple">Another label</IssueLabel>
    <IssueLabel variant="green">A third label</IssueLabel>
    <IssueLabel variant="orange">Issue label</IssueLabel>
    <IssueLabel variant="yellow">Another label</IssueLabel>
    <IssueLabel variant="brown">A third label</IssueLabel>
  </Stack>
)
