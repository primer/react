import {defineComponent} from '../docs/components'

export default defineComponent({
  name: 'ActionBar',
  displayName: 'ActionBar',
  status: 'stable',
  keywords: [],
  stories: ['experimental-components-actionbar--default'],
  importPath: '@primer/react',
  props: [
    {
      name: 'aria-label',
      type: 'string',
      description: 'Names the action bar directly. Use either `aria-label` or `aria-labelledby`.',
      required: false,
    },
    {
      name: 'aria-labelledby',
      type: 'string',
      description: 'Names the action bar using the referenced element. Use either `aria-label` or `aria-labelledby`.',
      required: false,
    },
    {
      // The legacy metadata marks this optional; ActionBarProps requires it.
      name: 'children',
      type: 'ReactNode',
      description: 'Buttons in the action bar',
      required: true,
    },
    {
      name: 'size',
      type: "'small' | 'large' | 'medium'",
      description: 'Size of the action bar',
      required: false,
      defaultValue: "'medium'",
    },
    {
      name: 'flush',
      type: 'boolean',
      description: 'Allows ActionBar to be flush with the container',
      required: false,
      defaultValue: 'false',
    },
    {
      name: 'className',
      type: 'string',
      description: 'Custom className',
      required: false,
    },
    {
      name: 'gap',
      type: "'none' | 'condensed'",
      description: 'Horizontal gap scale between items (restricted to none or condensed).',
      required: false,
      defaultValue: "'condensed'",
    },
  ],
  subcomponents: [
    {
      name: 'ActionBar.IconButton',
      displayName: 'ActionBar.IconButton',
      props: [
        {
          // The legacy metadata requires children; IconButtonProps does not.
          name: 'children',
          type: 'React.ReactNode',
          description: 'This will be the Button description.',
          required: false,
        },
        {
          name: 'icon',
          type: 'React.ReactNode | React.ComponentType<IconProps> | React.ExoticComponent<IconProps>',
          description: 'Provide an octicon. It will be placed in the center of the button',
          required: true,
        },
        {
          name: 'aria-label',
          type: 'string',
          description: 'Names the button directly. If omitted, `aria-labelledby` is required. Do not pass both.',
          required: false,
        },
        {
          name: 'aria-labelledby',
          type: 'string',
          description: 'Names the button using the referenced element. Required when `aria-label` is omitted.',
          required: false,
        },
        {
          name: 'disabled',
          type: 'boolean',
          description:
            'Provides a disabled state for the button. The button will remain focusable, and have `aria-disabled` applied.',
          required: false,
        },
      ],
    },
    {
      name: 'ActionBar.Button',
      displayName: 'ActionBar.Button',
      props: [
        {
          // The legacy metadata requires children; ButtonProps does not.
          name: 'children',
          type: 'React.ReactNode',
          description: 'The text content of the button.',
          required: false,
        },
        {
          name: 'leadingVisual',
          type: 'React.ElementType | React.ReactElement | null',
          description:
            'Provide an octicon to render before the button text. It will also be shown when the button overflows into the menu.',
          required: false,
        },
        {
          name: 'disabled',
          type: 'boolean',
          description:
            'Provides a disabled state for the button. The button will remain focusable, and have `aria-disabled` applied.',
          required: false,
        },
      ],
    },
    {
      name: 'ActionBar.Divider',
      displayName: 'ActionBar.Divider',
      props: [],
    },
    {
      name: 'ActionBar.Group',
      displayName: 'ActionBar.Group',
      props: [
        {
          name: 'children',
          type: 'React.ReactNode',
          description: '',
          required: false,
        },
      ],
    },
    {
      name: 'ActionBar.Menu',
      displayName: 'ActionBar.Menu',
      props: [
        {
          name: 'aria-label',
          type: 'string',
          description: 'Accessible label for the menu button.',
          required: true,
        },
        {
          name: 'icon',
          type: 'React.ReactNode | React.ComponentType<IconProps> | React.ExoticComponent<IconProps>',
          description: 'Icon for the menu button.',
          required: true,
        },
        {
          name: 'items',
          type: 'ActionBarMenuItemProps[]',
          description: 'Menu actions and dividers. An action can include nested `items` to open a submenu.',
          required: true,
        },
        {
          name: 'overflowIcon',
          type: "React.ReactNode | React.ComponentType<IconProps> | React.ExoticComponent<IconProps> | 'none'",
          description:
            "Icon displayed when the menu item is within the overflow menu. If 'none' is provided, no icon will be shown in the overflow menu.",
          required: false,
        },
        {
          name: 'returnFocusRef',
          type: 'React.RefObject<HTMLElement>',
          description: 'A ref to an element that should receive focus when the menu is closed.',
          required: false,
        },
      ],
    },
  ],
  usage: {
    // Source: https://primer.style/product/components/action-bar/
    description:
      'Place related action buttons in one row. When space runs out, the remaining buttons move into a menu.',
    bestPractices: [
      {
        // Source: https://primer.style/product/components/action-bar/guidelines/#buttons
        guidance: true,
        description: 'Use a consistent button format across the row: icons, text, or text with icons.',
      },
      {
        // Source: https://primer.style/product/components/action-bar/guidelines/#button-states
        guidance: false,
        description: 'Avoid using ActionBar to show which option is selected. Use SegmentedControl for that choice.',
      },
      {
        // Source: https://primer.style/product/components/action-bar/#with-dividers
        guidance: false,
        description: 'Keep dividers between groups, not at either end of the bar.',
      },
    ],
    anatomy: [
      {
        // Source: https://primer.style/product/components/action-bar/#with-dividers
        name: 'Divider',
        required: false,
        description: 'Separates neighboring groups of buttons.',
      },
      {
        // Source: https://primer.style/product/components/action-bar/#demo-of-overflow-behavior
        name: 'Overflow menu',
        required: false,
        description: 'Holds the buttons that do not fit in the row, along with their dividers.',
      },
    ],
  },
})
