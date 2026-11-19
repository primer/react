import {defineComponent} from '../docs/components'

export default defineComponent({
  name: 'Octicon',
  displayName: 'Octicon',
  status: 'deprecated',
  keywords: [],
  stories: [],
  importPath: '@primer/react/deprecated',
  props: [
    {name: 'aria-label', type: 'string', description: 'Accessible name for the icon.', required: false},
    {name: 'icon', type: 'React.ElementType', description: 'Icon component to render.', required: true},
    {
      name: 'size',
      type: "number | 'small' | 'medium' | 'large'",
      description: 'Size forwarded to the icon.',
      required: false,
    },
    {
      name: 'verticalAlign',
      type: "'middle' | 'text-bottom' | 'text-top' | 'top' | 'unset'",
      description: 'Vertical alignment forwarded to the icon.',
      required: false,
    },
    {name: 'fill', type: 'string', description: 'Fill color forwarded to the icon.', required: false},
    {name: 'className', type: 'string', description: 'Class name forwarded to the icon.', required: false},
    {
      name: 'as',
      type: 'React.ElementType',
      description: 'Forwarded to the supplied icon component.',
      required: false,
    },
  ],
  subcomponents: [],
  usage: {
    description: '',
    bestPractices: [],
    anatomy: [],
  },
})
