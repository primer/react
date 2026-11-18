import {defineComponent} from '../docs/components'

export default defineComponent({
  name: 'Stack',
  displayName: 'Stack',
  status: 'stable',
  keywords: [],
  stories: [],
  importPath: '@primer/react',
  props: [
    {
      name: 'gap',
      type: "'none' | 'tight' | 'condensed' | 'cozy' | 'normal' | 'spacious' | ResponsiveValue<'none' | 'tight' | 'condensed' | 'cozy' | 'normal' | 'spacious'>",
      description: 'Space between adjacent items.',
      required: false,
      defaultValue: 'normal',
    },
    {
      name: 'direction',
      type: "'horizontal' | 'vertical' | ResponsiveValue<'horizontal' | 'vertical'>",
      description: 'Direction in which items are laid out.',
      required: false,
      defaultValue: 'vertical',
    },
    {
      name: 'align',
      type: "'stretch' | 'start' | 'center' | 'end' | 'baseline' | ResponsiveValue<'stretch' | 'start' | 'center' | 'end' | 'baseline'>",
      description: 'Alignment on the cross axis.',
      required: false,
      defaultValue: 'stretch',
    },
    {
      name: 'wrap',
      type: "'wrap' | 'nowrap' | 'balance' | ResponsiveValue<'wrap' | 'nowrap' | 'balance'>",
      description: 'Controls whether items can wrap.',
      required: false,
      defaultValue: 'nowrap',
    },
    {
      name: 'justify',
      type: "'start' | 'center' | 'end' | 'space-between' | 'space-evenly' | ResponsiveValue<'start' | 'center' | 'end' | 'space-between' | 'space-evenly'>",
      description: 'Distribution along the stacking axis.',
      required: false,
      defaultValue: 'start',
    },
    {
      name: 'padding',
      type: "'none' | 'tight' | 'condensed' | 'cozy' | 'normal' | 'spacious' | ResponsiveValue<'none' | 'tight' | 'condensed' | 'cozy' | 'normal' | 'spacious'>",
      description: 'Padding on both axes.',
      required: false,
      defaultValue: 'none',
    },
    {
      name: 'paddingBlock',
      type: "'none' | 'tight' | 'condensed' | 'cozy' | 'normal' | 'spacious' | ResponsiveValue<'none' | 'tight' | 'condensed' | 'cozy' | 'normal' | 'spacious'>",
      description: 'Overrides the block-axis padding.',
      required: false,
    },
    {
      name: 'paddingInline',
      type: "'none' | 'tight' | 'condensed' | 'cozy' | 'normal' | 'spacious' | ResponsiveValue<'none' | 'tight' | 'condensed' | 'cozy' | 'normal' | 'spacious'>",
      description: 'Overrides the inline-axis padding.',
      required: false,
    },
    {
      name: 'className',
      type: 'string',
      description: '',
      required: false,
    },
    {
      name: 'as',
      type: 'React.ElementType',
      description: 'Element used to render the container.',
      required: false,
      defaultValue: 'div',
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Items to arrange in the stack.',
      required: false,
    },
  ],
  subcomponents: [
    {
      name: 'Stack.Item',
      displayName: 'Stack.Item',
      props: [
        {
          name: 'grow',
          type: 'boolean | ResponsiveValue<boolean>',
          description: 'Lets the item grow to fill available space.',
          required: false,
          defaultValue: 'false',
        },
        {
          name: 'shrink',
          type: 'boolean | ResponsiveValue<boolean>',
          description: 'Lets the item shrink when space is limited.',
          required: false,
          defaultValue: 'true',
        },
        {
          name: 'className',
          type: 'string',
          description: '',
          required: false,
        },
        {
          name: 'as',
          type: 'React.ElementType',
          description: 'Element used to render the container.',
          required: false,
          defaultValue: 'div',
        },
        {
          name: 'children',
          type: 'ReactNode',
          description: 'Content of the stack item.',
          required: false,
        },
      ],
    },
  ],
  usage: {
    // Source: https://primer.style/product/components/stack/
    description: 'Arrange items in rows or columns that can adapt to the viewport.',
    bestPractices: [],
    anatomy: [],
  },
})
