import {defineComponent} from '../docs/component'

export default defineComponent({
  id: 'stack',
  name: 'Stack',
  status: 'alpha',
  a11yReviewed: '2025-01-08',
  stories: [],
  importPath: '@primer/react',
  props: [
    {
      name: 'gap',
      type: "'none' | 'tight' | 'condensed' | 'cozy' | 'normal' | 'spacious' | ResponsiveValue<'none' | 'tight' | 'condensed' | 'cozy' | 'normal' | 'spacious'>",
      description: 'Specify the gap between children elements in the stack.',
      required: false,
    },
    {
      name: 'direction',
      type: "'horizontal' | 'vertical' | ResponsiveValue<'horizontal' | 'vertical'>",
      description: 'Specify the orientation for the stack container.',
      required: false,
    },
    {
      name: 'align',
      type: "'stretch' | 'start' | 'center' | 'end' | 'baseline' | ResponsiveValue<'stretch' | 'start' | 'center' | 'end' | 'baseline'>",
      description: 'Specify the alignment between items in the cross-axis of the orientation.',
      required: false,
    },
    {
      name: 'wrap',
      type: "'wrap' | 'nowrap' | 'balance' | ResponsiveValue<'wrap' | 'nowrap' | 'balance'>",
      description: 'Specify whether items are forced onto one line or can wrap onto multiple lines.',
      required: false,
    },
    {
      name: 'justify',
      type: "'start' | 'center' | 'end' | 'space-between' | 'space-evenly' | ResponsiveValue<'start' | 'center' | 'end' | 'space-between' | 'space-evenly'>",
      description: 'Specify how items will be distributed in the stacking direction.',
      required: false,
    },
    {
      name: 'padding',
      type: "'none' | 'tight' | 'condensed' | 'cozy' | 'normal' | 'spacious' | ResponsiveValue<'none' | 'tight' | 'condensed' | 'cozy' | 'normal' | 'spacious'>",
      description: 'Specify the padding of the stack container.',
      required: false,
    },
    {
      name: 'paddingBlock',
      type: "'none' | 'tight' | 'condensed' | 'cozy' | 'normal' | 'spacious' | ResponsiveValue<'none' | 'tight' | 'condensed' | 'cozy' | 'normal' | 'spacious'>",
      description:
        'Specify the block (vertical) padding of the stack container. Overrides the block axis of padding when both are set.',
      required: false,
    },
    {
      name: 'paddingInline',
      type: "'none' | 'tight' | 'condensed' | 'cozy' | 'normal' | 'spacious' | ResponsiveValue<'none' | 'tight' | 'condensed' | 'cozy' | 'normal' | 'spacious'>",
      description:
        'Specify the inline (horizontal) padding of the stack container. Overrides the inline axis of padding when both are set.',
      required: false,
    },
    {
      name: 'className',
      type: 'string',
      description: 'Additional CSS class names for the stack container.',
      required: false,
    },
  ],
  subcomponents: [
    {
      name: 'Stack.Item',
      props: [
        {
          name: 'grow',
          type: 'boolean | ResponsiveValue<boolean>',
          description: 'Allow item to keep size or expand to fill the available space.',
          required: false,
        },
        {
          name: 'shrink',
          type: 'boolean | ResponsiveValue<boolean>',
          description: 'Allow item to keep size or shrink to fit the available space.',
          required: false,
        },
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS class names for the stack item.',
          required: false,
        },
      ],
      displayName: 'Item',
    },
  ],
})
