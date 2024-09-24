import React from 'react'
import {IssueLabel} from '../IssueLabel'
import type {Meta} from '@storybook/react'
import {Stack} from '../../Stack'

const meta = {
  title: 'Experimental/Components/IssueLabel/Features',
  component: IssueLabel,
} satisfies Meta<typeof IssueLabel>

export default meta

export const VariantPink = () => <IssueLabel variant="pink" text="Issue label" />

export const VariantPlum = () => <IssueLabel variant="plum" text="Issue label" />

export const VariantPurple = () => <IssueLabel variant="purple" text="Issue label" />

export const VariantIndigo = () => <IssueLabel variant="indigo" text="Issue label" />

export const VariantBlue = () => <IssueLabel variant="blue" text="Issue label" />

export const VariantCyan = () => <IssueLabel variant="cyan" text="Issue label" />

export const VariantTeal = () => <IssueLabel variant="teal" text="Issue label" />

export const VariantPine = () => <IssueLabel variant="pine" text="Issue label" />

export const VariantGreen = () => <IssueLabel variant="green" text="Issue label" />

export const VariantLime = () => <IssueLabel variant="lime" text="Issue label" />

export const VariantOlive = () => <IssueLabel variant="olive" text="Issue label" />

export const VariantLemon = () => <IssueLabel variant="lemon" text="Issue label" />

export const VariantYellow = () => <IssueLabel variant="yellow" text="Issue label" />

export const VariantOrange = () => <IssueLabel variant="orange" text="Issue label" />

export const VariantRed = () => <IssueLabel variant="red" text="Issue label" />

export const VariantCoral = () => <IssueLabel variant="coral" text="Issue label" />

export const VariantGray = () => <IssueLabel variant="gray" text="Issue label" />

export const VariantBrown = () => <IssueLabel variant="brown" text="Issue label" />

export const VariantAuburn = () => <IssueLabel variant="auburn" text="Issue label" />

export const HexColor = (args: {fillColor: `#${string}`}) => (
  <IssueLabel text="Issue label" fillColor={args.fillColor} />
)
HexColor.args = {
  fillColor: '#59B200',
}
HexColor.argTypes = {
  fillColor: {control: {type: 'color'}},
  variant: {table: {disable: true}},
  text: {table: {disable: true}},
  id: {table: {disable: true}},
  className: {table: {disable: true}},
  onClick: {table: {disable: true}},
  onFocus: {table: {disable: true}},
  as: {table: {disable: true}},
  href: {table: {disable: true}},
}

export const AsLink = () => <IssueLabel href="/" text="Issue label" />

export const AsButton = () => <IssueLabel text="Issue label" as="button" />

export const OnClick = () => <IssueLabel text="Issue label" onClick={() => alert('clicked')} />

export const GroupOfLabels = () => (
  <Stack direction="horizontal" gap="condensed" wrap="wrap">
    <IssueLabel variant="blue" text="Issue label" />
    <IssueLabel variant="purple" text="Another label" />
    <IssueLabel variant="green" text="A third label" />
    <IssueLabel variant="orange" text="Issue label" />
    <IssueLabel variant="yellow" text="Another label" />
    <IssueLabel variant="brown" text="A third label" />
  </Stack>
)
