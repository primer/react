import React from 'react'
import {IssueLabel} from '../IssueLabel'
import type {Meta} from '@storybook/react'

const meta = {
  title: 'Drafts/Components/IssueLabel/Features',
  component: IssueLabel,
} satisfies Meta<typeof IssueLabel>

export default meta

export const Pink = () => <IssueLabel variant="pink">Issue label</IssueLabel>

export const Plum = () => <IssueLabel variant="plum">Issue label</IssueLabel>

export const Purple = () => <IssueLabel variant="purple">Issue label</IssueLabel>

export const Indigo = () => <IssueLabel variant="indigo">Issue label</IssueLabel>

export const Blue = () => <IssueLabel variant="blue">Issue label</IssueLabel>

export const Cyan = () => <IssueLabel variant="cyan">Issue label</IssueLabel>

export const Teal = () => <IssueLabel variant="teal">Issue label</IssueLabel>

export const Pine = () => <IssueLabel variant="pine">Issue label</IssueLabel>

export const Green = () => <IssueLabel variant="green">Issue label</IssueLabel>

export const Lime = () => <IssueLabel variant="lime">Issue label</IssueLabel>

export const Olive = () => <IssueLabel variant="olive">Issue label</IssueLabel>

export const Lemon = () => <IssueLabel variant="lemon">Issue label</IssueLabel>

export const Yellow = () => <IssueLabel variant="yellow">Issue label</IssueLabel>

export const Orange = () => <IssueLabel variant="orange">Issue label</IssueLabel>

export const Red = () => <IssueLabel variant="red">Issue label</IssueLabel>

export const Coral = () => <IssueLabel variant="coral">Issue label</IssueLabel>

export const Gray = () => <IssueLabel variant="gray">Issue label</IssueLabel>

export const Brown = () => <IssueLabel variant="brown">Issue label</IssueLabel>

export const Auburn = () => <IssueLabel variant="auburn">Issue label</IssueLabel>

export const SizeLarge = () => <IssueLabel size="large">Issue label</IssueLabel>

export const SizeSmall = () => <IssueLabel size="small">Issue label</IssueLabel>

export const Hex = hex => <IssueLabel fillColor={hex}>Issue label</IssueLabel>
Hex.args = {
  hex: '#59B200',
  variant: undefined,
}
Hex.argTypes = {
  hex: {control: {type: 'color'}},
  variant: {control: {disable: true}},
}
