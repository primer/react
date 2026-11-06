import type {Meta, StoryObj} from '@storybook/react-vite'
import {KeybindingHint} from './KeybindingHint'
import {PlatformOverrideProvider, type Platform} from './utils'

const chord = 'Mod+Shift+K'
const sequence = 'Mod+x y z'

const modifierKeys = ['Mod', 'Meta', 'Alt', 'Control', 'Shift']
const platforms: Array<{platform: Platform; label: string}> = [
  {platform: 'apple', label: 'Apple (macOS / iOS)'},
  {platform: 'windows', label: 'Windows'},
  {platform: 'other', label: 'Other (Linux, Android, …)'},
]

const meta = {
  title: 'React Tailwind/Content/KeybindingHint/Features',
  component: KeybindingHint,
  args: {keys: chord},
} satisfies Meta<typeof KeybindingHint>

export default meta
type Story = StoryObj<typeof meta>

export const Condensed: Story = {args: {keys: chord}}
export const Full: Story = {args: {keys: chord, format: 'full'}}
export const SequenceCondensed: Story = {args: {keys: sequence}}
export const SequenceFull: Story = {args: {keys: sequence, format: 'full'}}

export const OnEmphasis: Story = {
  render: args => (
    <div className="bg-black p-3 text-on-emphasis">
      <KeybindingHint {...args} />
    </div>
  ),
  args: {keys: chord, variant: 'onEmphasis'},
}

export const OnPrimary: Story = {
  render: args => (
    <div className="bg-[var(--button-primary-bgColor-rest)] p-3 text-on-emphasis">
      <KeybindingHint {...args} />
    </div>
  ),
  args: {keys: chord, variant: 'onPrimary'},
}

export const Small: Story = {args: {keys: chord, size: 'small'}}

export const Platforms: Story = {
  render: ({format = 'full', ...args}) => (
    <table className="border-collapse">
      <thead>
        <tr>
          <th scope="col" className="border border-default px-3 py-2 text-left font-semibold text-muted">
            Platform
          </th>
          {modifierKeys.map(key => (
            <th scope="col" className="border border-default px-3 py-2 text-left font-semibold text-muted" key={key}>
              {key}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {platforms.map(({platform, label}) => (
          <tr key={platform}>
            <th scope="row" className="border border-default px-3 py-2 text-left font-semibold text-muted">
              {label}
            </th>
            {modifierKeys.map((modifier, index) => (
              <td className="border border-default px-3 py-2 text-left" key={`${modifier}-${index}`}>
                <PlatformOverrideProvider value={platform}>
                  <KeybindingHint {...args} keys={`${modifier}+K`} format={format} />
                </PlatformOverrideProvider>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
  args: {format: 'full'},
}

export const ModifierKeys: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      {['Control', 'Command', 'Alt', 'Shift', 'ArrowUp', 'Enter', 'Escape'].map(key => (
        <KeybindingHint key={key} keys={`${key}+K`} />
      ))}
    </div>
  ),
  args: {keys: 'Control+K'},
}
