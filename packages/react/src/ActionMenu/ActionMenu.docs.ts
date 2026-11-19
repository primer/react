import {defineComponent} from '../docs/components'

export default defineComponent({
  name: 'ActionMenu',
  displayName: 'ActionMenu',
  status: 'stable',
  keywords: [],
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
      type: 'React.ReactElement | Array<React.ReactElement>',
      description: 'Menu parts, typically an anchor and an overlay.',
      required: true,
    },
    {
      name: 'open',
      type: 'boolean',
      description: 'Controls whether the menu is open. Use with `onOpenChange`.',
      required: false,
      defaultValue: 'false',
    },
    {
      name: 'onOpenChange',
      type: '(open: boolean) => void',
      description: 'Reports requests to open or close a controlled menu. Use with `open`.',
      required: false,
    },
    {
      name: 'anchorRef',
      type: 'React.RefObject<HTMLElement | null>',
      description: 'Ref to an external element that anchors the menu.',
      required: false,
    },
  ],
  subcomponents: [
    {
      name: 'ActionMenu.Button',
      displayName: 'ActionMenu.Button',
      props: [
        {
          name: 'children',
          type: 'React.ReactNode',
          description: 'Label or content of the menu trigger.',
          required: false,
        },
        {
          name: 'alignContent',
          type: "'start' | 'center'",
          description: 'Alignment of the button content.',
          required: false,
          defaultValue: "'center'",
        },
        {
          name: 'as',
          type: 'React.ElementType',
          description: 'Element or component to render.',
          required: false,
          defaultValue: "'button'",
        },
        {name: 'block', type: 'boolean', description: 'Fills the available width.', required: false},
        {name: 'count', type: 'number | string', description: 'Count displayed after the label.', required: false},
        {name: 'disabled', type: 'boolean', description: 'Disables the trigger.', required: false},
        {
          name: 'icon',
          type: 'React.ReactNode | React.ComponentType<IconProps> | React.ExoticComponent<IconProps>',
          description: 'Icon-only visual.',
          required: false,
        },
        {
          name: 'inactive',
          type: 'boolean',
          description: 'Uses an inactive appearance without removing normal interactions.',
          required: false,
        },
        {name: 'labelWrap', type: 'boolean', description: 'Allows the label to wrap.', required: false},
        {
          name: 'leadingVisual',
          type: 'React.ElementType | React.ReactElement | null',
          description: 'Visual before the label.',
          required: false,
        },
        {name: 'loading', type: 'boolean', description: 'Shows that the button is busy.', required: false},
        {
          name: 'loadingAnnouncement',
          type: 'string',
          description: 'Text announced to assistive technology while loading.',
          required: false,
          defaultValue: "'Loading'",
        },
        {
          name: 'notificationIndicator',
          type: "'button' | 'leadingVisual'",
          description: 'Marks new activity on the button or leading visual. The latter requires `leadingVisual`.',
          required: false,
        },
        {
          name: 'size',
          type: "'small' | 'medium' | 'large'",
          description: 'Visual size of the trigger.',
          required: false,
          defaultValue: "'medium'",
        },
        {
          name: 'trailingAction',
          type: 'React.ElementType | null',
          description: 'Visual at the end of the trigger.',
          required: false,
          defaultValue: 'TriangleDownIcon',
        },
        {
          name: 'trailingVisual',
          type: 'React.ElementType | React.ReactElement | null',
          description: 'Visual after the label.',
          required: false,
        },
        {
          name: 'variant',
          type: "'default' | 'primary' | 'danger' | 'invisible' | 'link'",
          description: 'Visual treatment of the trigger.',
          required: false,
          defaultValue: "'default'",
        },
      ],
    },
    {
      name: 'ActionMenu.Anchor',
      displayName: 'ActionMenu.Anchor',
      props: [
        {
          name: 'children',
          type: 'React.ReactElement',
          description: 'Custom element that triggers the menu.',
          required: true,
        },
        {name: 'id', type: 'string', description: 'Overrides the generated anchor ID.', required: false},
      ],
    },
    {
      name: 'ActionMenu.Overlay',
      displayName: 'ActionMenu.Overlay',
      props: [
        {
          name: 'children',
          type: 'React.ReactNode',
          description: 'Menu contents, typically an ActionList.',
          required: true,
        },
        {
          name: 'align',
          type: "'start' | 'center' | 'end'",
          description: 'Alignment of the overlay relative to its anchor.',
          required: false,
          defaultValue: "'start'",
        },
        {
          name: 'side',
          type: "'inside-top' | 'inside-bottom' | 'inside-left' | 'inside-right' | 'inside-center' | 'outside-top' | 'outside-bottom' | 'outside-left' | 'outside-right'",
          description: 'Preferred side relative to the anchor. Submenus default to `outside-right`.',
          required: false,
          defaultValue: "'outside-bottom'",
        },
        {
          name: 'onPositionChange',
          type: '(value: {position: AnchorPosition}) => void',
          description: 'Reports changes to the computed position.',
          required: false,
        },
        {
          name: 'preventFocusOnClose',
          type: 'boolean',
          description: 'Skips restoring focus when the overlay closes.',
          required: false,
          defaultValue: 'false',
        },
        {name: 'data-test-id', type: 'unknown', description: '', required: false},
        {
          name: 'variant',
          type: "{narrow?: 'anchored' | 'fullscreen'; regular?: 'anchored'; wide?: 'anchored'}",
          description: 'Controls whether the menu is anchored or fullscreen on narrow viewports.',
          required: false,
          defaultValue: "{regular: 'anchored', narrow: 'anchored'}",
        },
        {
          name: 'displayInViewport',
          type: 'boolean',
          description: 'Controls viewport-relative positioning. Defaults to true inside a dialog.',
          required: false,
        },
      ],
    },
    {
      name: 'ActionMenu.Divider',
      displayName: 'ActionMenu.Divider',
      props: [
        {name: 'className', type: 'string', description: 'Class name for the divider.', required: false},
        {name: 'style', type: 'React.CSSProperties', description: 'Inline styles for the divider.', required: false},
      ],
    },
  ],
  usage: {
    // Source: https://primer.style/product/components/action-menu/
    description: 'Offer quick actions or selections in a menu that opens from a trigger.',
    bestPractices: [
      {
        // Source: https://primer.style/product/components/action-menu/guidelines/
        guidance: true,
        description: 'Organize related actions with dividers and section titles when needed.',
      },
      {
        // Source: https://primer.style/product/components/action-menu/guidelines/
        guidance: false,
        description: 'Do not put form input controls in the menu.',
      },
    ],
    anatomy: [],
  },
})
