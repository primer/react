import {defineComponent} from '../docs/component'

export default defineComponent({
  id: 'dialog_v2',
  docsId: 'dialog',
  name: 'Dialog',
  status: 'alpha',
  a11yReviewed: '2025-01-08',
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
      description: 'Title of the Dialog. Also serves as the aria-label for this Dialog.',
      required: false,
    },
    {
      name: 'subtitle',
      type: 'React.ReactNode',
      description:
        "The Dialog's subtitle. Optional. Rendered below the title in smaller type with less contrast. Also serves as the aria-describedby for this Dialog.",
      required: false,
    },
    {
      name: 'renderHeader',
      type: 'React.FunctionComponent<React.PropsWithChildren<DialogHeaderProps>>',
      description:
        'Provide a custom renderer for the dialog header. This content is rendered directly into the dialog body area, full bleed from edge to edge, top to the start of the body element. Warning: using a custom renderer may violate Primer UX principles.',
      required: false,
    },
    {
      name: 'renderBody',
      type: 'React.FunctionComponent<React.PropsWithChildren<DialogProps>>',
      description:
        'Provide a custom render function for the dialog body. This content is rendered directly into the dialog body area, full bleed from edge to edge, header to footer. Warning: using a custom renderer may violate Primer UX principles.',
      required: false,
    },
    {
      name: 'renderFooter',
      type: 'React.FunctionComponent<React.PropsWithChildren<DialogProps>>',
      description:
        'Provide a custom render function for the dialog footer. This content is rendered directly into the dialog footer area, full bleed from edge to edge, end of the body element to bottom. Warning: using a custom renderer may violate Primer UX principles.',
      required: false,
    },
    {
      name: 'footerButtons',
      type: 'DialogButtonProps[]',
      description: 'Specifies the buttons to be rendered in the Dialog footer.',
      required: false,
    },
    {
      name: 'onClose',
      type: "(gesture: 'close-button' | 'escape') => void",
      description:
        "This method is invoked when a gesture to close the dialog is used (either an Escape key press or clicking the 'X' in the top-right corner). The gesture argument indicates the gesture that was used to close the dialog (either 'close-button' or 'escape').",
      required: true,
    },
    {
      name: 'role',
      type: "'dialog' | 'alertdialog'",
      description:
        'The ARIA role to assign to this dialog. See [dialog modal](https://www.w3.org/TR/wai-aria-practices-1.1/#dialog_modal) and [alert dialog](https://www.w3.org/TR/wai-aria-practices-1.1/#alertdialog)',
      required: false,
    },
    {
      name: 'width',
      type: "'small' | 'medium' | 'large' | 'xlarge' | string | number",
      description:
        "The width of the dialog.\nsmall: 296px\nmedium: 320px\nlarge: 480px\nxlarge: 640px\n\nAlso accepts any valid CSS width value (e.g. '400px', '80rem') or a number, which is interpreted as a pixel width.",
      required: false,
    },
    {
      name: 'height',
      type: "'small' | 'large' | 'auto'",
      description: 'The height of the dialog.\nsmall: 296x480\nlarge: 480x640\nauto: variable based on contents',
      required: false,
    },
    {
      name: 'returnFocusRef',
      type: 'React.RefObject<HTMLElement>',
      description:
        'Return focus to this element when the Dialog closes, instead of the element that had focus immediately before the Dialog opened',
      required: false,
    },
    {
      name: 'initialFocusRef',
      type: 'React.RefObject<HTMLElement>',
      description: 'Focus this element when the Dialog opens',
      required: false,
    },
    {
      name: 'position',
      type: "'center' | 'left' | 'right' | { narrow: 'center' | 'left' | 'right' | 'bottom' | 'fullscreen', regular: 'center' | 'left' | 'right' | 'bottom' | 'fullscreen', wide: 'center' | 'left' | 'right' | 'bottom' | 'fullscreen' }",
      required: false,
      description: 'The position of the dialog',
      defaultValue: '',
    },
    {
      name: 'align',
      type: "'top' | 'center' | 'bottom'",
      required: false,
      description:
        "The vertical alignment of the dialog. Only applies when position is 'center' (the default). 'top' positions the Dialog ~4rem from the top of the screen, 'center' (default) vertically centers the Dialog, 'bottom' positions the Dialog near the bottom of the screen.",
      defaultValue: '',
    },
    {name: 'className', type: 'string | undefined', defaultValue: '', description: 'CSS string', required: false},
    {
      name: 'style',
      type: 'React.CSSProperties | undefined',
      defaultValue: '',
      description: 'React CSS properties',
      required: false,
    },
  ],
  subcomponents: [
    {name: 'Dialog.Body', props: [], displayName: 'Body'},
    {
      name: 'Dialog.Buttons',
      props: [
        {
          name: 'buttons',
          type: 'DialogButtonProps[]',
          required: true,
          description: 'Buttons to render. See the `DialogButtonProps` table.',
        },
      ],
      displayName: 'Buttons',
    },
    {
      name: 'Dialog.CloseButton',
      props: [
        {
          name: 'onClose',
          type: '() => void',
          required: true,
          description: 'Callback for closing the Dialog',
          defaultValue: '',
        },
      ],
      displayName: 'CloseButton',
    },
    {name: 'Dialog.Footer', props: [], displayName: 'Footer'},
    {name: 'Dialog.Header', props: [], displayName: 'Header'},
    {name: 'Dialog.Title', props: [], displayName: 'Title'},
  ],
  relatedTypes: [
    {
      name: 'DialogButtonProps',
      props: [
        {
          name: 'buttonType',
          type: "'default' | 'danger' | 'primary' | 'normal'",
          description: 'The variant of Button to use',
          required: false,
        },
        {name: 'content', type: 'React.ReactNode', required: true, description: "The Button's inner text"},
        {
          name: 'autoFocus',
          type: 'boolean',
          description:
            'If true, and if this is the only button with autoFocus set to true, focus this button automatically when the dialog appears.',
          required: false,
        },
        {
          name: 'ref',
          type: 'React.RefObject<HTMLButtonElement>',
          description:
            ' A reference to the rendered Button’s DOM node, used together with `autoFocus` for `focusTrap`’s `initialFocus`.',
          required: false,
        },
      ],
    },
  ],
})
