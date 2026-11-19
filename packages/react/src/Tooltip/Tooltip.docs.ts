import {defineComponent} from '../docs/component'

export default defineComponent({
  id: 'tooltip',
  name: 'Tooltip',
  docsId: 'tooltip',
  status: 'deprecated',
  a11yReviewed: false,
  stories: [],
  importPath: '@primer/react/deprecated',
  props: [
    {
      name: 'align',
      type: "'left' | 'right'",
      description: 'Aligns the tooltip bubble with the left or right edge of its container.',
      required: false,
    },
    {
      name: 'direction',
      type: "'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw'",
      defaultValue: 'n',
      description: 'Sets where the tooltip renders in relation to the target.',
      required: false,
    },
    {
      name: 'noDelay',
      type: 'boolean',
      description: 'When set to `true`, tooltip appears without any delay.',
      required: false,
    },
    {name: 'aria-label', type: 'string', description: 'Text used in `aria-label` (for accessibility)', required: false},
    {name: 'wrap', type: 'boolean', description: 'Use `true` to allow text within tooltip to wrap.', required: false},
  ],
  subcomponents: [],
})
