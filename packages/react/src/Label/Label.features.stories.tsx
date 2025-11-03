import type {Meta} from '@storybook/react-vite'
import type {ComponentProps} from '../utils/types'
import Label from './Label'

export default {
  title: 'Components/Label/Features',
  component: Label,
} as Meta<ComponentProps<typeof Label>>

export const Primary = () => <Label variant="primary">Primary</Label>

export const Secondary = () => <Label variant="secondary">Secondary</Label>

export const Accent = () => <Label variant="accent">Accent</Label>

export const Success = () => <Label variant="success">Success</Label>

export const Attention = () => <Label variant="attention">Attention</Label>

export const Severe = () => <Label variant="severe">Primary</Label>

export const Danger = () => <Label variant="danger">Danger</Label>

export const Done = () => <Label variant="done">Done</Label>

export const Sponsors = () => <Label variant="sponsors">Sponsors</Label>

export const SizeLarge = () => <Label size="large">Default</Label>

export const SizeSmall = () => <Label size="small">Default</Label>
