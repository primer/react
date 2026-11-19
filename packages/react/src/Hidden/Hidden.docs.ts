import {defineComponent} from '../docs/component'

export default defineComponent({
  id: 'hidden',
  name: 'Hidden',
  status: 'draft',
  a11yReviewed: '2025-01-08',
  stories: [
    'experimental-components-hidden--default',
    'experimental-components-hidden-features--hide-content',
    'experimental-components-hidden-features--render-content-responsively',
  ],
  importPath: '@primer/react/experimental',
  props: [
    {
      name: 'when',
      type: "'narrow' | 'wide' | 'regular' | Array<'narrow' | 'regular' | 'wide'>",
      defaultValue: '',
      description: 'In which viewport(s) the children are going to be hidden',
      required: true,
    },
  ],
  subcomponents: [],
})
