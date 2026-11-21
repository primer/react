import {defineComponent} from '../docs/component'

export default defineComponent({
  id: 'octicon',
  name: 'Octicon',
  status: 'deprecated',
  a11yReviewed: false,
  stories: [],
  importPath: '@primer/react/deprecated',
  props: [
    {
      name: 'aria-label',
      type: 'string',
      description: 'Specifies the aria-label attribute, which is read verbatim by screen readers',
      required: false,
    },
    {
      name: 'icon',
      type: 'Component',
      description:
        'Checks the input by default in uncontrolled modeName of the [Octicon component](https://primer.style/octicons/) used in the',
      required: true,
    },
    {
      name: 'size',
      type: 'number',
      defaultValue: '16',
      description: 'Sets the uniform `width` and `height` of the SVG element',
      required: false,
    },
    {
      name: 'verticalAlign',
      type: 'string',
      defaultValue: 'text-bottom',
      description: 'Sets the `vertical-align` CSS property',
      required: false,
    },
  ],
  subcomponents: [],
})
