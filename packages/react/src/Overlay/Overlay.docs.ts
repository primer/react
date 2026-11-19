import {defineComponent} from '../docs/component'

export default defineComponent({
  id: 'overlay',
  name: 'Overlay',
  status: 'alpha',
  a11yReviewed: '2025-01-08',
  stories: [
    'private-components-overlay--default',
    'private-components-overlay-features--dialog-overlay',
    'private-components-overlay-features--positioned-overlays',
  ],
  importPath: '@primer/react',
  props: [
    {
      name: 'preventFocusOnClose',
      type: 'boolean',
      defaultValue: 'false',
      description:
        'If true, focus will not be returned to returnFocusRef when the Overlay is unmounted. Consumers must manage focus themselves.',
      required: false,
    },
    {
      name: 'returnFocusRef',
      type: 'React.RefObject<HTMLElement>',
      defaultValue: '',
      required: true,
      description: 'Ref for the element to focus when the `Overlay` is closed.',
    },
    {
      name: 'onClickOutside',
      type: 'function',
      defaultValue: '',
      required: true,
      description:
        'Function to call when clicking outside of the `Overlay`. Typically this function sets the `Overlay` visibility state to `false`.',
    },
    {
      name: 'onEscape',
      type: 'function',
      defaultValue: '',
      required: true,
      description:
        'Function to call when user presses `Escape`. Typically this function sets the `Overlay` visibility state to `false`.',
    },
    {
      name: 'ignoreClickRefs',
      type: 'Array<React.RefObject<HTMLElement>>',
      defaultValue: '',
      description:
        'An array of ref objects to ignore clicks on in the onOutsideClick behavior. This is often used to ignore clicking on the element that toggles the open/closed state for the Overlay to prevent the Overlay from being toggled twice.',
      required: false,
    },
    {
      name: 'initialFocusRef',
      type: 'React.RefObject<HTMLElement>',
      defaultValue: '',
      description:
        'Ref for the element to focus when the `Overlay` is opened. If nothing is provided, the first focusable element in the `Overlay` body is focused.',
      required: false,
    },
    {
      name: 'width',
      type: "| 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge' | 'auto'",
      defaultValue: "'auto'",
      description:
        'Sets the width of the `Overlay`, pick from our set list of widths, or pass `auto` to automatically set the width based on the content of the `Overlay`. `small` corresponds to `256px`, `medium` corresponds to `320px`, `large` corresponds to `480px`, `xlarge` corresponds to `640px`, `xxlarge` corresponds to `960px`.',
      required: false,
    },
    {
      name: 'height',
      type: "| 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'auto'",
      defaultValue: "'auto'",
      description:
        'Sets the height of the `Overlay`, pick from our set list of heights, or pass `auto` to automatically set the height based on the content of the `Overlay`. `xsmall` corresponds to `192px`, `small` corresponds to `256px`, `medium` corresponds to `320px`, `large` corresponds to `432px`, `xlarge` corresponds to `600px`.',
      required: false,
    },
    {
      name: 'maxHeight',
      type: "| 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge'",
      defaultValue: '100vh',
      description:
        'Sets the maximum height of the `Overlay`, pick from our set list of heights. `xsmall` corresponds to `192px`, `small` corresponds to `256px`, `medium` corresponds to `320px`, `large` corresponds to `432px`, `xlarge` corresponds to `600px`.',
      required: false,
    },
    {
      name: 'maxWidth',
      type: "| 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge'",
      defaultValue: '',
      description:
        'Sets the maximum width of the `Overlay`, pick from our set list of widths. `small` corresponds to `256px`, `medium` corresponds to `320px`, `large` corresponds to `480px`, `xlarge` corresponds to `640px`, `xxlarge` corresponds to `960px`.',
      required: false,
    },
    {
      name: 'visibility',
      type: "| 'visible' | 'hidden'",
      defaultValue: "'visible'",
      description: 'Sets the visibility of the `Overlay`.',
      required: false,
    },
    {
      name: 'anchorSide',
      type: "| 'inside-top' | 'inside-bottom' | 'inside-left' | 'inside-right' | 'inside-center' | 'outside-top' | 'outside-bottom' | 'outside-left' | 'outside-right'",
      defaultValue: '',
      description:
        'If provided, the Overlay will slide into position from the side of the anchor with a brief animation',
      required: false,
    },
    {
      name: 'top',
      type: 'number',
      defaultValue: '0',
      description: 'The top CSS property of the Overlay — affects the vertical position.',
      required: false,
    },
    {
      name: 'left',
      type: 'number',
      defaultValue: '0',
      description: 'The left CSS property of the Overlay — affects the horizontal position.',
      required: false,
    },
    {
      name: 'right',
      type: 'number',
      description: 'The right CSS property of the Overlay — affects the horizontal position.',
      required: false,
    },
    {
      name: 'bottom',
      type: 'number',
      description: 'The bottom CSS property of the Overlay — affects the vertical position.',
      required: false,
    },
    {
      name: 'position',
      type: "| 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky'",
      defaultValue: 'absolute',
      description:
        'The position CSS property of the Overlay — sets how the Overlay is positioned relative to its Portal',
      required: false,
    },
    {
      name: 'portalContainerName',
      type: 'string',
      defaultValue: '',
      description: 'If defined, Overlays will be rendered in the named portal. See also `Portal`.',
      required: false,
    },
    {
      name: 'overflow',
      type: "'hidden' | 'scroll' | 'auto' | 'visible'",
      required: false,
      description: '',
      defaultValue: 'hidden',
    },
    {
      name: 'preventOverflow',
      type: 'boolean',
      defaultValue: 'true',
      description:
        'Determines if the Overlay width should be adjusted responsively if `width` is set to either `auto`, `medium` or lower and there is not enough space to display the Overlay.\nIf `preventOverflow` is set to `false`, the Overlay will be displayed at the maximum width that fits within the viewport.',
      required: false,
    },
    {
      name: 'role',
      type: "ARIA role - will most often be 'dialog' or 'menu'",
      required: false,
      description: 'ARIA role to use for the overlay',
      defaultValue: '',
    },
    {name: 'data-test-id', type: 'unknown', required: false, description: '', defaultValue: ''},
    {
      name: 'responsiveVariant',
      type: "'fullscreen'",
      required: false,
      description: 'Optional prop to set responsive variant for narrow screen sizes',
      defaultValue: '',
    },
  ],
  subcomponents: [],
})
