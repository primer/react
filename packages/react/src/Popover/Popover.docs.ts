import {defineComponent} from '../docs/components'

export default defineComponent({
  name: 'Popover',
  displayName: 'Popover',
  status: 'stable',
  keywords: [],
  stories: ['components-popover--default'],
  importPath: '@primer/react',
  props: [
    {name: 'as', type: 'string', description: 'Does not change the root element.', required: false},
    {
      name: 'caret',
      type: "'top' | 'bottom' | 'left' | 'right' | 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right' | 'left-bottom' | 'left-top' | 'right-bottom' | 'right-top'",
      description: 'Position of the caret.',
      required: false,
      defaultValue: "'top'",
    },
    {
      name: 'open',
      type: 'boolean',
      description: 'Shows the popover when true.',
      required: false,
      defaultValue: 'false',
    },
    {
      name: 'relative',
      type: 'boolean',
      description: 'Uses relative positioning when true.',
      required: false,
    },
    {name: 'className', type: 'string', description: 'Class name for custom styling.', required: false},
  ],
  subcomponents: [
    {
      name: 'Popover.Content',
      displayName: 'Popover.Content',
      props: [
        {name: 'as', type: 'string', description: 'Does not change the root element.', required: false},
        {
          name: 'width',
          type: "'xsmall' | 'small' | 'large' | 'medium' | 'auto' | 'xlarge'",
          description: 'Sets the content width.',
          required: false,
          defaultValue: "'small'",
        },
        {
          name: 'height',
          type: "'small' | 'large' | 'medium' | 'auto' | 'xlarge' | 'fit-content'",
          description: 'Sets the content height.',
          required: false,
          defaultValue: "'fit-content'",
        },
        {
          name: 'overflow',
          type: "'auto' | 'hidden' | 'scroll' | 'visible'",
          description: 'Forwarded to the root element. Does not set CSS overflow.',
          required: false,
        },
        {
          name: 'onClickOutside',
          type: '(event: MouseEvent | TouchEvent) => void',
          description: 'Called when a click or touch occurs outside the content.',
          required: false,
        },
        {
          name: 'onEscape',
          type: '(event: KeyboardEvent) => void',
          description: 'Called when the user presses Escape while the popover is open.',
          required: false,
        },
        {
          name: 'ignoreClickRefs',
          type: 'Array<React.RefObject<HTMLElement>>',
          description: 'Refs to elements excluded from outside-click detection.',
          required: false,
          defaultValue: '[]',
        },
        {name: 'className', type: 'string', description: '', required: false},
      ],
    },
  ],
  usage: {
    // Source: https://primer.style/product/components/popover/guidelines/
    description: 'Draw attention to an element with contextual instructions, onboarding, or options.',
    bestPractices: [
      {
        // Source: https://primer.style/product/components/popover/guidelines/
        guidance: true,
        description: 'Use popovers sparingly and provide a way to dismiss each one.',
      },
      {
        // Source: https://primer.style/product/components/popover/guidelines/
        guidance: false,
        description: 'Do not use a popover to show errors or other critical information.',
      },
    ],
    anatomy: [],
  },
})
