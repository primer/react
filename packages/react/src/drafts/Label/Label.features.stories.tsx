import React from 'react'
import {Label} from '../Label'
import type {Meta} from '@storybook/react'

const meta = {
  title: 'Drafts/Components/Label/Features',
  component: Label,
} satisfies Meta<typeof Label>

export default meta

export const Pink = () => <Label variant="pink">Issue label</Label>

export const Plum = () => <Label variant="plum">Issue label</Label>

export const Purple = () => <Label variant="purple">Issue label</Label>

export const Indigo = () => <Label variant="indigo">Issue label</Label>

export const Blue = () => <Label variant="blue">Issue label</Label>

export const Cyan = () => <Label variant="cyan">Issue label</Label>

export const Teal = () => <Label variant="teal">Issue label</Label>

export const Pine = () => <Label variant="pine">Issue label</Label>

export const Green = () => <Label variant="green">Issue label</Label>

export const Lime = () => <Label variant="lime">Issue label</Label>

export const Olive = () => <Label variant="olive">Issue label</Label>

export const Lemon = () => <Label variant="lemon">Issue label</Label>

export const Yellow = () => <Label variant="yellow">Issue label</Label>

export const Orange = () => <Label variant="orange">Issue label</Label>

export const Red = () => <Label variant="red">Issue label</Label>

export const Coral = () => <Label variant="coral">Issue label</Label>

export const Gray = () => <Label variant="gray">Issue label</Label>

export const Brown = () => <Label variant="brown">Issue label</Label>

export const Auburn = () => <Label variant="auburn">Issue label</Label>

export const SizeLarge = () => <Label size="large">Issue label</Label>

export const SizeSmall = () => <Label size="small">Issue label</Label>
