import React from 'react'
import {IssueLabel} from '../IssueLabel'
import type {Meta} from '@storybook/react'
import type {Hex} from './IssueLabel'

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

export const HexColor = (hex: Hex) => <IssueLabel fillColor={hex} text="Issue label" />
HexColor.args = {
  hex: '#59B200',
  variant: undefined,
}
HexColor.argTypes = {
  hex: {control: {type: 'color'}},
  variant: {control: {disable: true}},
}

export const Link = () => <IssueLabel href="/" text="Issue label" />

export const AsButton = () => <IssueLabel text="Issue label" as="button" />

export const OnClick = () => <IssueLabel text="Issue label" onClick={() => alert('clicked')} />
