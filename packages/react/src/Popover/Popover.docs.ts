import {defineComponent} from '../docs/component'

export default defineComponent({
  id: 'popover',
  name: 'Popover',
  status: 'alpha',
  a11yReviewed: '2025-01-08',
  stories: ['components-popover--default'],
  importPath: '@primer/react',
  props: [
    {
      name: 'as',
      type: 'string',
      defaultValue: 'div',
      description: 'Sets the underlying HTML tag for the component',
      required: false,
    },
    {
      name: 'caret',
      type: "| 'top' | 'bottom' | 'left' | 'right' | 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right' | 'left-bottom' | 'left-top' | 'right-bottom' | 'right-top' ",
      defaultValue: "'top'",
      description: 'Controls the position of the caret',
      required: false,
    },
    {
      name: 'open',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Controls the visibility of the popover.',
      required: false,
    },
    {
      name: 'relative',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Set to true to render the popover using relative positioning.',
      required: false,
    },
  ],
  subcomponents: [
    {
      name: 'Popover.Content',
      props: [
        {
          name: 'as',
          type: 'string',
          defaultValue: 'div',
          description: 'Sets the underlying HTML tag for the component',
          required: false,
        },
        {
          name: 'width',
          type: "| 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'auto'",
          defaultValue: "'small'",
          description: 'Sets the width of the popover content.',
          required: false,
        },
        {
          name: 'height',
          type: "| 'small' | 'medium' | 'large' | 'xlarge' | 'fit-content' | 'auto'",
          defaultValue: "'fit-content'",
          description: 'Sets the height of the popover content.',
          required: false,
        },
        {
          name: 'overflow',
          type: "| 'auto' | 'hidden' | 'scroll' | 'visible'",
          defaultValue: "'auto'",
          description: 'Sets the overflow behavior of the popover content.',
          required: false,
        },
        {
          name: 'onClickOutside',
          type: '(event: MouseEvent | TouchEvent) => void',
          description: 'Callback fired when a click is detected outside the popover content',
          required: false,
        },
        {
          name: 'onEscape',
          type: '(event: KeyboardEvent) => void',
          description: 'Callback fired when the Escape key is pressed while the popover is open',
          required: false,
        },
        {
          name: 'ignoreClickRefs',
          type: 'Array<React.RefObject<HTMLElement>>',
          description: 'Refs to elements that should be ignored when detecting outside clicks',
          required: false,
        },
      ],
      displayName: 'Content',
    },
  ],
})
