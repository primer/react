import {defineComponent} from '../docs/components'

export default defineComponent({
  name: 'KeybindingHint',
  displayName: 'KeybindingHint',
  status: 'experimental',
  keywords: [],
  stories: [],
  importPath: '@primer/react/experimental',
  props: [
    {
      name: 'keys',
      type: 'string',
      description:
        'Shortcut in `KeyboardEvent.key` notation. Join simultaneous keys with `+` and sequential keys with spaces. `Mod` means Command on macOS and Control elsewhere.',
      required: true,
    },
    {
      name: 'format',
      type: "'condensed' | 'full'",
      description: 'Controls whether the shortcut uses compact or full key names.',
      required: false,
      defaultValue: 'condensed',
    },
    {
      name: 'variant',
      type: "'normal' | 'onEmphasis' | 'onPrimary'",
      description:
        'Matches the hint to its background. Use `onEmphasis` on emphasis colors and `onPrimary` on primary buttons.',
      required: false,
      defaultValue: 'normal',
    },
    {
      name: 'size',
      type: "'small' | 'normal'",
      description: 'Size of the hint.',
      required: false,
      defaultValue: 'normal',
    },
    {
      name: 'className',
      type: 'string',
      description: 'Additional CSS class for the hint.',
      required: false,
    },
  ],
  subcomponents: [],
  usage: {
    // Source: https://primer.style/product/components/keybinding-hint/
    description: 'Show an available keyboard shortcut with key symbols that match the user’s platform.',
    bestPractices: [],
    anatomy: [],
  },
})
