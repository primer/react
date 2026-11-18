import {defineComponent} from '../docs/components'

export default defineComponent({
  name: 'ActionList',
  displayName: 'ActionList',
  status: 'stable',
  keywords: [],
  stories: [],
  importPath: '@primer/react',
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Items, groups, headings, and dividers to render.',
      required: false,
    },
    {
      name: 'variant',
      type: "'inset' | 'horizontal-inset' | 'full'",
      description: 'Controls whether items are inset or flush with the list edges.',
      required: false,
      defaultValue: 'inset',
    },
    {
      name: 'selectionVariant',
      type: "'single' | 'radio' | 'multiple'",
      description: 'Controls how users select items.',
      required: false,
    },
    {
      name: 'showDividers',
      type: 'boolean',
      description: 'Shows dividers between adjacent items.',
      required: false,
      defaultValue: 'false',
    },
    {
      name: 'role',
      type: 'AriaRole',
      description: 'ARIA role for the rendered element.',
      required: false,
    },
    {
      name: 'disableItemGap',
      type: 'boolean',
      description: 'Disables the gap between items when rendered in a NavList.',
      required: false,
      defaultValue: 'false',
    },
    {
      name: 'disableFocusZone',
      type: 'boolean',
      description: 'Disables keyboard focus management for the list when it would otherwise be enabled.',
      required: false,
      defaultValue: 'false',
    },
    {
      name: 'as',
      type: 'React.ElementType',
      description: 'Element or component used to render the item.',
      required: false,
      defaultValue: 'ul',
    },
    {
      name: 'className',
      type: 'string',
      description: '',
      required: false,
    },
    {
      name: 'ref',
      type: 'React.Ref<HTMLUListElement>',
      description: 'Ref to the rendered element.',
      required: false,
    },
  ],
  subcomponents: [
    {
      name: 'ActionList.Item',
      displayName: 'ActionList.Item',
      props: [
        {
          name: 'children',
          type: 'ReactNode',
          description: 'Main content and optional visible parts of the item.',
          required: false,
        },
        {
          name: 'variant',
          type: "'default' | 'danger'",
          description: 'Use `danger` for destructive actions.',
          required: false,
          defaultValue: 'default',
        },
        {
          name: 'size',
          type: "'small' | 'medium' | 'large'",
          description: 'Size of the item.',
          required: false,
          defaultValue: 'medium',
        },
        {
          name: 'onSelect',
          type: '(event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => void',
          description: 'Called on click or keyboard selection unless the item is disabled, inactive, or loading.',
          required: false,
        },
        {
          name: 'selected',
          type: 'boolean',
          description: 'Marks the item as selected.',
          required: false,
        },
        {
          name: 'active',
          type: 'boolean',
          description: 'Marks the item as active. Only one item should be active.',
          required: false,
          defaultValue: 'false',
        },
        {
          name: 'disabled',
          type: 'boolean',
          description: 'Prevents selecting or navigating to the item.',
          required: false,
          defaultValue: 'false',
        },
        {
          name: 'inactiveText',
          type: 'string',
          description: 'Explains why the item’s usual action is unavailable.',
          required: false,
        },
        {
          name: 'loading',
          type: 'boolean',
          description: 'Shows the item’s loading state.',
          required: false,
        },
        {
          name: 'role',
          type: 'AriaRole',
          description: 'ARIA role for the rendered element.',
          required: false,
        },
        {
          name: 'id',
          type: 'string',
          description: 'ID of the item.',
          required: false,
        },
        {
          name: 'as',
          type: 'As',
          description: 'Deprecated. Has no effect on `ActionList.Item`.',
          required: false,
        },
        {
          name: 'className',
          type: 'string',
          description: '',
          required: false,
        },
        {
          name: 'ref',
          type: 'React.Ref<HTMLElement>',
          description: 'Ref to the rendered element.',
          required: false,
        },
      ],
    },
    {
      name: 'ActionList.Heading',
      displayName: 'ActionList.Heading',
      props: [
        {
          name: 'children',
          type: 'ReactNode',
          description: 'Text for the list heading.',
          required: false,
        },
        {
          name: 'as',
          type: "'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'",
          description: 'Semantic heading level.',
          required: true,
        },
        {
          name: 'visuallyHidden',
          type: 'boolean',
          description: 'Keeps the heading available to assistive technology while hiding it visually.',
          required: false,
          defaultValue: 'false',
        },
        {
          name: 'size',
          type: "'large' | 'medium' | 'small'",
          description: 'Visual size of the heading.',
          required: false,
        },
        {
          name: 'id',
          type: 'string',
          description: 'ID used to label the list.',
          required: false,
        },
        {
          name: 'className',
          type: 'string',
          description: '',
          required: false,
        },
        {
          name: 'style',
          type: 'React.CSSProperties',
          description: '',
          required: false,
        },
        {
          name: 'ref',
          type: 'React.Ref<HTMLHeadingElement>',
          description: 'Ref to the rendered element.',
          required: false,
        },
      ],
    },
    {
      name: 'ActionList.LinkItem',
      displayName: 'ActionList.LinkItem',
      props: [
        {
          name: 'children',
          type: 'ReactNode',
          description: 'Main content and optional visible parts of the link.',
          required: false,
        },
        {
          name: 'active',
          type: 'boolean',
          description: 'Marks the item as active. Only one item should be active.',
          required: false,
          defaultValue: 'false',
        },
        {
          name: 'size',
          type: "'small' | 'medium' | 'large'",
          description: 'Size of the item.',
          required: false,
          defaultValue: 'medium',
        },
        {
          name: 'ref',
          type: 'React.Ref<HTMLAnchorElement>',
          description: 'Ref to the rendered element.',
          required: false,
        },
        {
          name: 'as',
          type: 'React.ElementType',
          description: 'Element or component used to render the item.',
          required: false,
          defaultValue: 'a',
        },
        {
          name: 'inactiveText',
          type: 'string',
          description: 'Explains why the item’s usual action is unavailable.',
          required: false,
        },
        {
          name: 'variant',
          type: "'default' | 'danger'",
          description: 'Use `danger` for destructive actions.',
          required: false,
          defaultValue: 'default',
        },
        {
          name: 'href',
          type: 'string',
          description: 'Destination of the link.',
          required: false,
        },
        {
          name: 'className',
          type: 'string',
          description: '',
          required: false,
        },
      ],
    },
    {
      name: 'ActionList.LeadingVisual',
      displayName: 'ActionList.LeadingVisual',
      props: [
        {
          name: 'children',
          type: 'ReactNode',
          description: 'Visual placed before the item label.',
          required: false,
        },
        {
          name: 'className',
          type: 'string',
          description: '',
          required: false,
        },
      ],
    },
    {
      name: 'ActionList.TrailingVisual',
      displayName: 'ActionList.TrailingVisual',
      props: [
        {
          name: 'children',
          type: 'ReactNode',
          description: 'Visual placed after the item label.',
          required: false,
        },
        {
          name: 'className',
          type: 'string',
          description: '',
          required: false,
        },
      ],
    },
    {
      name: 'ActionList.TrailingAction',
      displayName: 'ActionList.TrailingAction',
      props: [
        {
          name: 'as',
          type: "'a' | 'button'",
          description: 'Renders a link or a button.',
          required: false,
          defaultValue: 'button',
        },
        {
          name: 'label',
          type: 'string',
          description: 'Text or accessible name for the action.',
          required: true,
        },
        {
          name: 'icon',
          type: 'React.ElementType',
          description: 'Icon for the action. Omit to render the visible label.',
          required: false,
        },
        {
          name: 'href',
          type: 'string',
          description: 'Link destination. Required when `as` is `a`; omit for a button.',
          required: false,
        },
        {
          name: 'loading',
          type: 'boolean',
          description: 'Shows the loading state for a button. Omit for a link.',
          required: false,
        },
        {
          name: 'tooltipDirection',
          type: "'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw'",
          description: 'Tooltip placement for an icon action.',
          required: false,
          defaultValue: 'w',
        },
        {
          name: 'className',
          type: 'string',
          description: '',
          required: false,
        },
        {
          name: 'style',
          type: 'React.CSSProperties',
          description: '',
          required: false,
        },
        {
          name: 'ref',
          type: 'React.Ref<HTMLAnchorElement | HTMLButtonElement>',
          description: 'Ref to the rendered element.',
          required: false,
        },
      ],
    },
    {
      name: 'ActionList.Description',
      displayName: 'ActionList.Description',
      props: [
        {
          name: 'children',
          type: 'ReactNode',
          description: 'Secondary text for the item.',
          required: false,
        },
        {
          name: 'variant',
          type: "'inline' | 'block'",
          description: 'Renders the description on the same line or below the label.',
          required: false,
          defaultValue: 'inline',
        },
        {
          name: 'className',
          type: 'string',
          description: '',
          required: false,
        },
        {
          name: 'truncate',
          type: 'boolean',
          description: 'Truncates text that does not fit.',
          required: false,
        },
        {
          name: 'style',
          type: 'React.CSSProperties',
          description: '',
          required: false,
        },
      ],
    },
    {
      name: 'ActionList.GroupHeading',
      displayName: 'ActionList.GroupHeading',
      props: [
        {
          name: 'children',
          type: 'ReactNode',
          description: 'Text for the group heading.',
          required: false,
        },
        {
          name: 'variant',
          type: "'filled' | 'subtle'",
          description: 'Visual treatment for the group heading.',
          required: false,
          defaultValue: 'subtle',
        },
        {
          name: 'auxiliaryText',
          type: 'string',
          description: 'Supplementary text for the group heading.',
          required: false,
        },
        {
          name: 'visuallyHidden',
          type: 'boolean',
          description: 'Keeps the heading available to assistive technology while hiding it visually.',
          required: false,
        },
        {
          name: 'as',
          type: "'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'",
          description:
            'Required for a heading with content in a list. Omit in a menu or listbox; the heading is then presentational.',
          required: false,
        },
        {
          name: 'size',
          type: "'large' | 'medium' | 'small'",
          description: 'Visual size of the heading.',
          required: false,
        },
        {
          name: 'headingWrapElement',
          type: "'div' | 'li'",
          description: 'Element used to wrap the heading.',
          required: false,
          defaultValue: 'div',
        },
        {
          name: 'id',
          type: 'string',
          description: 'ID used to label the group.',
          required: false,
        },
        {
          name: 'className',
          type: 'string',
          description: '',
          required: false,
        },
        {
          name: 'style',
          type: 'React.CSSProperties',
          description: '',
          required: false,
        },
      ],
    },
    {
      name: 'ActionList.Group',
      displayName: 'ActionList.Group',
      props: [
        {
          name: 'children',
          type: 'ReactNode',
          description: 'Items and an optional heading for the group.',
          required: false,
        },
        {
          name: 'title',
          type: 'string',
          description: 'Title to use when no group heading is supplied.',
          required: false,
        },
        {
          name: 'auxiliaryText',
          type: 'string',
          description: 'Supplementary text for the group heading.',
          required: false,
        },
        {
          name: 'variant',
          type: "'filled' | 'subtle'",
          description: 'Visual treatment for the group heading.',
          required: false,
          defaultValue: 'subtle',
        },
        {
          name: 'selectionVariant',
          type: "'single' | 'radio' | 'multiple' | false",
          description: 'Overrides list selection behavior. Pass `false` to disable selection for this group.',
          required: false,
        },
        {
          name: 'role',
          type: 'AriaRole',
          description: 'ARIA role for the rendered element.',
          required: false,
        },
        {
          name: 'aria-label',
          type: 'string',
          description: 'Accessible name of the group.',
          required: false,
        },
        {
          name: 'className',
          type: 'string',
          description: '',
          required: false,
        },
      ],
    },
    {
      name: 'ActionList.Divider',
      displayName: 'ActionList.Divider',
      props: [
        {
          name: 'className',
          type: 'string',
          description: '',
          required: false,
        },
        {
          name: 'style',
          type: 'React.CSSProperties',
          description: '',
          required: false,
        },
      ],
    },
    {
      name: 'ActionList.GroupHeading.TrailingAction',
      displayName: 'ActionList.GroupHeading.TrailingAction',
      props: [
        {
          name: 'as',
          type: "'a' | 'button'",
          description: 'Renders a link or a button.',
          required: false,
          defaultValue: 'button',
        },
        {
          name: 'label',
          type: 'string',
          description: 'Text or accessible name for the action.',
          required: true,
        },
        {
          name: 'icon',
          type: 'React.ElementType',
          description: 'Icon for the action.',
          required: true,
        },
        {
          name: 'href',
          type: 'string',
          description: 'Link destination. Required when `as` is `a`; omit for a button.',
          required: false,
        },
        {
          name: 'loading',
          type: 'boolean',
          description: 'Shows the loading state for a button. Omit for a link.',
          required: false,
        },
        {
          name: 'tooltipDirection',
          type: "'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw'",
          description: 'Tooltip placement for an icon action.',
          required: false,
          defaultValue: 'w',
        },
        {
          name: 'className',
          type: 'string',
          description: '',
          required: false,
        },
        {
          name: 'style',
          type: 'React.CSSProperties',
          description: '',
          required: false,
        },
        {
          name: 'ref',
          type: 'React.Ref<HTMLAnchorElement | HTMLButtonElement>',
          description: 'Ref to the rendered element.',
          required: false,
        },
      ],
    },
  ],
  usage: {
    // Source: https://primer.style/product/components/action-list/
    description:
      'Present interactive actions or options in one vertical column, with room for supporting visuals and text.',
    bestPractices: [
      {
        // Source: https://primer.style/product/components/action-list/guidelines/#leading-visual
        guidance: true,
        description: 'Use a leading visual when it helps users scan options or recognize content types.',
      },
      {
        // Source: https://primer.style/product/components/action-list/guidelines/#item-dividers
        guidance: true,
        description: 'Use item dividers when they make dense or multiline items easier to distinguish.',
      },
      {
        // Source: https://primer.style/product/components/action-list/guidelines/#trailing-actions
        guidance: true,
        description: 'Reserve a trailing action for a separate interaction related to the item.',
      },
    ],
    anatomy: [
      {
        // Source: https://primer.style/product/components/action-list/guidelines/
        name: 'Item',
        required: true,
        description: 'Represents an action or choice.',
      },
      {
        // Source: https://primer.style/product/components/action-list/guidelines/
        name: 'Item divider',
        required: false,
        description: 'Separates neighboring items.',
      },
      {
        // Source: https://primer.style/product/components/action-list/guidelines/
        name: 'Section header',
        required: false,
        description: 'Introduces a group of related items.',
      },
      {
        // Source: https://primer.style/product/components/action-list/guidelines/
        name: 'Section divider',
        required: false,
        description: 'Separates sections of the list.',
      },
    ],
  },
})
