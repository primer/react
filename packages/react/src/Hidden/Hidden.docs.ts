import {defineComponent} from '../docs/components'

export default defineComponent({
  name: 'Hidden',
  displayName: 'Hidden',
  status: 'experimental',
  keywords: [],
  stories: [
    'experimental-components-hidden--default',
    'experimental-components-hidden-features--hide-content',
    'experimental-components-hidden-features--render-content-responsively',
  ],
  importPath: '@primer/react/experimental',
  props: [
    {
      name: 'when',
      type: "'narrow' | 'regular' | 'wide' | Array<'narrow' | 'regular' | 'wide'>",
      description: 'Viewports in which the content is hidden.',
      required: true,
    },
    {
      name: 'children',
      type: 'React.ReactNode',
      description: 'Content to hide at the selected viewports.',
      required: true,
    },
    {name: 'className', type: 'string', description: 'Class name for the wrapper.', required: false},
    {
      name: 'style',
      type: 'React.CSSProperties',
      description: 'Inline styles for the wrapper.',
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
