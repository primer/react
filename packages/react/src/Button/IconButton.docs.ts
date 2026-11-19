import {defineComponent} from '../docs/component'

export default defineComponent({
  id: 'icon_button',
  name: 'IconButton',
  status: 'alpha',
  a11yReviewed: '2025-01-08',
  stories: [
    'components-iconbutton--default',
    'components-iconbutton-features--primary',
    'components-iconbutton-features--danger',
    'components-iconbutton-features--invisible',
    'components-iconbutton-features--disabled',
    'components-iconbutton-features--small',
    'components-iconbutton-features--medium',
    'components-iconbutton-features--large',
    'components-iconbutton-features--with-description',
    'components-iconbutton-features--external-tooltip',
    'components-iconbutton-features--as-a-menu-anchor',
    'components-iconbutton-features--loading',
    'components-iconbutton-features--loading-trigger',
    'components-iconbutton-features--keybinding-hint-on-description',
    'components-iconbutton-features--keybinding-hint',
  ],
  importPath: '@primer/react',
  props: [
    {
      name: 'children',
      type: 'React.ReactNode',
      defaultValue: '',
      required: true,
      description: 'This will be the Button description.',
    },
    {
      name: 'as',
      type: 'React.ElementType',
      defaultValue: "'button'",
      description: 'Element to render. Defaults to a button; use an anchor for navigation.',
      required: false,
    },
    {
      name: 'href',
      type: 'string',
      description:
        "**May only be used when `as` is set to 'a'**.\n The URL the button links to. If `as` is set to 'a', this prop is required.",
      required: false,
    },
    {
      name: 'variant',
      type: "'default' | 'primary' | 'danger' | 'invisible' | 'link'",
      defaultValue: '',
      description: 'Changes the look and feel of the button which is different for each variant',
      required: false,
    },
    {
      name: 'size',
      type: "'small' | 'medium' | 'large'",
      defaultValue: '',
      description: 'Changes the size of the icon button component',
      required: false,
    },
    {
      name: 'inactive',
      type: 'boolean',
      description:
        'Whether the button looks visually disabled, but can still accept all the same interactions as an enabled button.',
      required: false,
    },
    {
      name: 'icon',
      type: 'React.ReactNode | React.ComponentType<IconProps> | React.ExoticComponent<IconProps>',
      defaultValue: '',
      description:
        'Provide an icon component or React node. It will be placed in the center of the button. Use a React element when passing an icon from a Server Component.',
      required: true,
    },
    {
      name: 'aria-label',
      type: 'string',
      defaultValue: '',
      description:
        'Use an aria label to describe the functionality of the button. Please refer to [our guidance on alt text](https://primer.style/guides/accessibility/alternative-text-for-images) for tips on writing good alternative text.',
      required: false,
    },
    {
      name: 'keyshortcuts',
      type: 'string',
      defaultValue: '',
      deprecated: true,
      description: 'Use `keybindingHint` instead.',
      required: false,
    },
    {
      name: 'keybindingHint',
      type: 'string | Array<string>',
      description:
        'Optional keybinding hint to show in the tooltip for this button. Pass a string for a single shortcut or an array of strings to show multiple shortcuts joined with "or". See the `KeybindingHint` component documentation for the correct format. Has no effect if tooltip is overridden or disabled. Does **not** bind any keybindings for this button - this is only for visual hints.',
      required: false,
    },
    {
      name: 'tooltipDirection',
      type: "'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw'",
      defaultValue: "'s'",
      description: 'The direction of the tooltip.',
      required: false,
    },
    {
      name: 'description',
      type: 'string',
      required: false,
      description:
        'If `description` is provided, we will use a Tooltip to describe the button. Then `aria-label` is used to label the button.',
      defaultValue: '',
    },
  ],
  subcomponents: [],
})
