import {defineComponent} from '../docs/component'

export default defineComponent({
  id: 'action_menu',
  name: 'ActionMenu',
  status: 'beta',
  a11yReviewed: '2025-01-08',
  stories: [
    'components-actionmenu--default',
    'components-actionmenu-features--links-and-actions',
    'components-actionmenu-features--single-select',
    'components-actionmenu-features--multi-select',
    'components-actionmenu-features--inactive-items',
    'components-actionmenu-features--loading-items',
    'components-actionmenu-features--submenus',
  ],
  importPath: '@primer/react',
  props: [
    {
      name: 'children',
      type: 'Array<React.ReactElement>',
      defaultValue: '',
      required: true,
      description: 'Recommended: `ActionMenu.Button` or `ActionMenu.Anchor` with `ActionMenu.Overlay`',
    },
    {
      name: 'open',
      type: 'boolean',
      defaultValue: 'false',
      description:
        'If defined, will control the open/closed state of the overlay. Must be used in conjuction with `onOpenChange`.',
      required: false,
    },
    {
      name: 'onOpenChange',
      type: '(open: boolean) => void',
      defaultValue: '',
      description:
        'If defined, will control the open/closed state of the overlay. Must be used in conjuction with `open`.',
      required: false,
    },
    {
      name: 'anchorRef',
      type: 'React.RefObject<HTMLElement>',
      defaultValue: '',
      description: 'Useful for defining an external anchor',
      required: false,
    },
  ],
  subcomponents: [
    {
      name: 'ActionMenu.Button',
      props: [{name: 'children', type: 'React.ReactElement', defaultValue: '', required: true, description: ''}],
      passthrough: {element: 'Button', url: '/react/Button'},
      displayName: 'Button',
    },
    {
      name: 'ActionMenu.Anchor',
      props: [
        {
          name: 'children',
          type: 'React.ReactElement',
          defaultValue: '',
          required: true,
          description: 'Accepts a single child element',
        },
        {name: 'id', type: 'string', description: '', defaultValue: '', required: false},
      ],
      displayName: 'Anchor',
    },
    {
      name: 'ActionMenu.Overlay',
      props: [
        {name: 'children', type: 'React.ReactNode', defaultValue: '', required: true, description: ''},
        {name: 'align', type: 'start | center | end', defaultValue: 'start', description: '', required: false},
        {
          name: 'side',
          type: "| 'inside-top' | 'inside-bottom' | 'inside-left' | 'inside-right' | 'inside-center' | 'outside-top' | 'outside-bottom' | 'outside-left' | 'outside-right'",
          defaultValue: "'outside-bottom'",
          description: 'Controls which side of the anchor the menu will appear',
          required: false,
        },
        {
          name: 'onPositionChange',
          type: '({ position }: { position: AnchorPosition }) => void',
          defaultValue: '',
          description: 'Callback that is called when the position of the overlay changes',
          required: false,
        },
        {
          name: 'preventFocusOnClose',
          type: 'boolean',
          defaultValue: 'false',
          description:
            'If true, focus will not be returned to the anchor or returnFocusRef when the menu closes. Consumers must manage focus themselves.',
          required: false,
        },
        {
          name: 'data-test-id',
          type: 'unknown',
          required: false,
          description: 'ID to use for React testing utilities.',
          defaultValue: '',
        },
      ],
      passthrough: {element: 'Overlay', url: '/react/Overlay'},
      displayName: 'Overlay',
    },
  ],
})
