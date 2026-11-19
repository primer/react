import {defineComponent} from '../docs/component'

export default defineComponent({
  id: 'KeybindingHint',
  name: 'KeybindingHint',
  status: 'draft',
  a11yReviewed: '2025-01-08',
  stories: [],
  importPath: '@primer/react',
  props: [
    {
      name: 'keys',
      type: 'string',
      description: 'The keys involved in this keybinding.',
      required: true,
    },
    {
      name: 'format',
      type: "'condensed' | 'full'",
      defaultValue: "'condensed'",
      description: 'Control the display format.',
      required: false,
    },
    {
      name: 'variant',
      type: "'normal' | 'onEmphasis'",
      defaultValue: "'normal'",
      description: "Set to `onEmphasis` for display on 'emphasis' colors.",
      required: false,
    },
    {
      name: 'size',
      type: "'small' | 'normal'",
      defaultValue: "'normal'",
      description: 'Control the size of the hint.',
      required: false,
    },
  ],
  subcomponents: [],
})
