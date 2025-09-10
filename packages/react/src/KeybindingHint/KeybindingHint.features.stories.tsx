import type {Meta, StoryObj} from '@storybook/react-vite'
import {KeybindingHint, type KeybindingHintProps} from '.'
import classes from './KeybindingHint.features.stories.module.css'

export default {
  title: 'Experimental/Components/KeybindingHint/Features',
  component: KeybindingHint,
} satisfies Meta<typeof KeybindingHint>

const chord = 'Mod+Shift+K'

export const Condensed = {args: {keys: chord}}

export const Full = {args: {keys: chord, format: 'full'}}

const sequence = 'Mod+x y z'

export const SequenceCondensed = {args: {keys: sequence}}

export const SequenceFull = {args: {keys: sequence, format: 'full'}}

export const OnEmphasis: StoryObj<KeybindingHintProps> = {
  render: args => (
    <div className={classes.EmphasisBackground}>
      <KeybindingHint {...args} />
    </div>
  ),
  args: {keys: chord, variant: 'onEmphasis'},
}

export const OnPrimary: StoryObj<KeybindingHintProps> = {
  render: args => (
    <div className={classes.PrimaryBackground}>
      <KeybindingHint {...args} />
    </div>
  ),
  args: {keys: chord, variant: 'onPrimary'},
}

export const Small = {args: {keys: chord, size: 'small'}}
