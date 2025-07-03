import type {Meta} from '@storybook/react-vite'
import type {ComponentProps} from '../utils/types'
import Label from './Label'

export default {
  title: 'Components/Label/Dev',
  component: Label,
} as Meta<ComponentProps<typeof Label>>

export const AccentSx = () => (
  <Label size="small" variant="accent" sx={{color: 'danger.fg'}}>
    Default
  </Label>
)

export const SizeSmallSx = () => (
  <Label size="small" variant="sponsors" sx={{color: 'danger.fg'}}>
    Default
  </Label>
)
