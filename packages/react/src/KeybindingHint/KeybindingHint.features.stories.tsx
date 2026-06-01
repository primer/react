import type {Meta, StoryObj} from '@storybook/react-vite'
import {KeybindingHint, type KeybindingHintProps} from '.'
import {PlatformOverrideProvider, type Platform} from './platform'
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

const platforms: Array<{platform: Platform; label: string}> = [
  {platform: 'apple', label: 'Apple (macOS / iOS)'},
  {platform: 'windows', label: 'Windows'},
  {platform: 'other', label: 'Other (Linux, Android, …)'},
]

const modifierKeys = ['Mod', 'Meta', 'Alt', 'Control', 'Shift']

/**
 * Demonstrates how each modifier key renders across platforms. The platform is faked via
 * `PlatformOverrideProvider` so all variations can be previewed regardless of the device
 * actually running Storybook.
 */
export const Platforms: StoryObj<KeybindingHintProps> = {
  render: ({format = 'full', ...args}) => (
    <table className={classes.PlatformTable}>
      <thead>
        <tr>
          <th scope="col" className={`${classes.PlatformCell} ${classes.PlatformHeader}`}>
            Platform
          </th>
          {modifierKeys.map(key => (
            <th scope="col" className={`${classes.PlatformCell} ${classes.PlatformHeader}`} key={key}>
              {key}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {platforms.map(({platform, label}) => (
          <tr key={platform}>
            <th scope="row" className={`${classes.PlatformCell} ${classes.PlatformHeader}`}>
              {label}
            </th>
            {modifierKeys.map(key => (
              <td key={key} className={classes.PlatformCell}>
                <PlatformOverrideProvider value={platform}>
                  <KeybindingHint {...args} format={format} keys={`${key}+K`} />
                </PlatformOverrideProvider>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
  args: {format: 'full'},
  argTypes: {
    format: {
      control: 'radio',
      options: ['condensed', 'full'],
    },
    keys: {table: {disable: true}},
  },
}
