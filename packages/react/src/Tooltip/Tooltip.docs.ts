import {defineComponent} from '../docs/components'

export default defineComponent({
  name: 'Tooltip',
  displayName: 'Tooltip',
  status: 'deprecated',
  keywords: [],
  stories: [],
  importPath: '@primer/react/deprecated',
  props: [
    {
      name: 'align',
      type: "'left' | 'right'",
      description: '',
      required: false,
    },
    {
      name: 'direction',
      type: "'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw'",
      description: 'Sets where the tooltip renders in relation to the target.',
      required: false,
      defaultValue: 'n',
    },
    {
      name: 'noDelay',
      type: 'boolean',
      description: 'When set to `true`, tooltip appears without any delay.',
      required: false,
    },
    {
      name: 'aria-label',
      type: 'string',
      description: 'Text used in `aria-label` (for accessibility)',
      required: false,
    },
    {
      name: 'wrap',
      type: 'boolean',
      description: 'Use `true` to allow text within tooltip to wrap.',
      required: false,
    },
  ],
  subcomponents: [],
  usage: {
    // Checked https://primer.style/react/Tooltip, which redirects to the TooltipV2 docs.
    description: '',
    bestPractices: [],
    anatomy: [],
  },
})
