import {defineComponent} from '../docs/components'

export default defineComponent({
  name: 'Dialog',
  displayName: 'Dialog',
  status: 'stable',
  keywords: [],
  stories: [
    'components-dialog--default',
    'components-dialog-features--with-custom-renderers',
    'components-dialog-features--stress-test',
    'components-dialog-features--repro-multistep-dialog-with-conditional-footer',
    'components-dialog-features--bottom-sheet-narrow',
    'components-dialog-features--full-screen-narrow',
    'components-dialog-features--side-sheet',
    'components-dialog-features--return-focus-ref',
    'components-dialog-features--new-issues',
    'components-dialog-features--retains-focus-trap-with-dynamic-content',
    'components-dialog-features--align-top',
    'components-dialog-features--align-bottom',
  ],
  importPath: '@primer/react',
  props: [
    {
      name: 'title',
      type: 'React.ReactNode',
      description: 'Title that names the dialog.',
      required: false,
      defaultValue: "'Dialog'",
    },
    {
      name: 'subtitle',
      type: 'React.ReactNode',
      description: 'Text below the title that describes the dialog.',
      required: false,
      defaultValue: '""',
    },
    {
      name: 'renderHeader',
      type: 'React.FunctionComponent<React.PropsWithChildren<DialogHeaderProps>>',
      description: 'Replaces the default header.',
      required: false,
    },
    {
      name: 'renderBody',
      type: 'React.FunctionComponent<React.PropsWithChildren<DialogProps>>',
      description: 'Replaces the default body.',
      required: false,
    },
    {
      name: 'renderFooter',
      type: 'React.FunctionComponent<React.PropsWithChildren<DialogProps>>',
      description: 'Replaces the default footer.',
      required: false,
    },
    {
      name: 'footerButtons',
      type: 'Array<DialogButtonProps>',
      description: 'Buttons to render in the default footer.',
      required: false,
      defaultValue: '[]',
    },
    {
      name: 'onClose',
      type: "(gesture: 'close-button' | 'escape') => void",
      description: 'Receives the gesture that requested dismissal.',
      required: true,
    },
    {
      name: 'role',
      type: "'dialog' | 'alertdialog'",
      description: 'ARIA role for the dialog.',
      required: false,
      defaultValue: "'dialog'",
    },
    {
      name: 'width',
      type: 'DialogWidth',
      description: 'Width preset or CSS width value.',
      required: false,
      defaultValue: "'xlarge'",
    },
    {
      name: 'height',
      type: 'DialogHeight',
      description: 'Height preset. With `auto`, content determines the height.',
      required: false,
      defaultValue: "'auto'",
    },
    {
      name: 'returnFocusRef',
      type: 'React.RefObject<HTMLElement | null>',
      description: 'Overrides where focus returns after the dialog closes.',
      required: false,
    },
    {
      name: 'initialFocusRef',
      type: 'React.RefObject<HTMLElement | null>',
      description: 'Element to focus when the dialog opens.',
      required: false,
    },
    {
      name: 'position',
      type: "'center' | 'left' | 'right' | ResponsiveValue<'left' | 'right' | 'bottom' | 'fullscreen' | 'center'>",
      description: 'Positions the dialog by viewport width.',
      required: false,
      defaultValue: "{narrow: 'center', regular: 'center'}",
    },
    {
      name: 'align',
      type: "'top' | 'center' | 'bottom'",
      description: 'Vertical alignment when the position is centered.',
      required: false,
      defaultValue: "'center'",
    },
    {name: 'className', type: 'string', description: 'Additional class name.', required: false},
    {name: 'style', type: 'React.CSSProperties', description: 'Additional styles.', required: false},
    {name: 'children', type: 'React.ReactNode', description: 'Content for the dialog body.', required: false},
  ],
  subcomponents: [
    {name: 'Dialog.Body', displayName: 'Dialog.Body', props: []},
    {
      name: 'Dialog.Buttons',
      displayName: 'Dialog.Buttons',
      props: [
        {
          name: 'buttons',
          type: 'Array<DialogButtonProps>',
          description: 'Button configurations to render.',
          required: true,
        },
      ],
    },
    {
      name: 'Dialog.CloseButton',
      displayName: 'Dialog.CloseButton',
      props: [
        {
          name: 'onClose',
          type: '() => void',
          description: 'Called when the close button is activated.',
          required: true,
        },
        {
          name: 'onKeyDown',
          type: 'React.KeyboardEventHandler',
          description: 'Handles key presses on the close button.',
          required: false,
        },
      ],
    },
    {name: 'Dialog.Footer', displayName: 'Dialog.Footer', props: []},
    {name: 'Dialog.Header', displayName: 'Dialog.Header', props: []},
    {name: 'Dialog.Title', displayName: 'Dialog.Title', props: []},
    {
      // Preserve the legacy grouping for the footer button configuration type.
      name: 'DialogButtonProps',
      displayName: 'DialogButtonProps',
      props: [
        {
          name: 'buttonType',
          type: "'default' | 'danger' | 'primary' | 'normal'",
          description: 'Button variant. `normal` is equivalent to `default`.',
          required: false,
          defaultValue: "'default'",
        },
        {name: 'content', type: 'React.ReactNode', description: 'Button content.', required: true},
        {
          name: 'autoFocus',
          type: 'boolean',
          description: 'Requests initial focus on this button.',
          required: false,
          defaultValue: 'false',
        },
        {
          name: 'ref',
          type: 'React.RefObject<HTMLButtonElement | null>',
          description: 'Reference to the button used for initial focus.',
          required: false,
        },
      ],
    },
  ],
  usage: {
    // Source: https://primer.style/product/components/dialog/
    description: 'Present a focused task, such as a confirmation or a choice, in a temporary surface.',
    bestPractices: [],
    anatomy: [
      {
        // Source: https://primer.style/product/components/dialog/guidelines/
        name: 'Header',
        required: true,
        description: 'Provides context through the title and optional description, and offers a close button.',
      },
    ],
  },
})
