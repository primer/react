import {defineComponent} from '../docs/components'

export default defineComponent({
  name: 'IconButton',
  displayName: 'IconButton',
  status: 'stable',
  keywords: [],
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
    {name: 'children', type: 'React.ReactNode', description: '', required: false},
    {
      name: 'as',
      type: 'React.ElementType',
      description: 'Element or component to render.',
      required: false,
      defaultValue: "'button'",
    },
    {name: 'href', type: 'string', description: 'Destination when rendered as an anchor.', required: false},
    {
      name: 'variant',
      type: "'default' | 'primary' | 'danger' | 'invisible' | 'link'",
      description: 'Visual treatment of the button.',
      required: false,
      defaultValue: "'default'",
    },
    {
      name: 'size',
      type: "'small' | 'medium' | 'large'",
      description: 'Visual size of the button.',
      required: false,
      defaultValue: "'medium'",
    },
    {
      name: 'inactive',
      type: 'boolean',
      description: 'Uses an inactive appearance without removing normal interactions.',
      required: false,
    },
    {
      name: 'icon',
      type: 'React.ReactNode | React.ComponentType<IconProps> | React.ExoticComponent<IconProps>',
      description: 'Visual shown in place of a text label.',
      required: true,
    },
    {
      name: 'aria-label',
      type: 'string',
      description: 'Names the button. Provide this or `aria-labelledby`, not both.',
      required: false,
    },
    {name: 'keyshortcuts', type: 'string', description: 'Deprecated. Use `keybindingHint` instead.', required: false},
    {
      name: 'keybindingHint',
      type: 'string | Array<string>',
      description: 'Keyboard shortcut hint or list of hints for the tooltip.',
      required: false,
    },
    {
      name: 'tooltipDirection',
      type: "'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw'",
      description: 'Preferred direction of the built-in tooltip.',
      required: false,
      defaultValue: "'s'",
    },
    {
      name: 'description',
      type: 'string',
      description: 'Additional text shown in the tooltip instead of the accessible label.',
      required: false,
    },
    {
      name: 'aria-labelledby',
      type: 'string',
      description: 'References an accessible label. Required when `aria-label` is omitted.',
      required: false,
    },
    {
      name: 'notificationIndicator',
      type: "'button' | 'icon'",
      description:
        'Marks new activity on the button or icon. Convey meaning through an accessible name or description.',
      required: false,
    },
    {
      name: 'unsafeDisableTooltip',
      type: 'boolean',
      description: 'Suppresses the built-in tooltip.',
      required: false,
      defaultValue: 'false',
    },
    {name: 'disabled', type: 'boolean', description: 'Disables interaction with the button.', required: false},
    {name: 'block', type: 'boolean', description: 'Fills the available width.', required: false},
    {name: 'loading', type: 'boolean', description: 'Shows that the button is busy.', required: false},
    {
      name: 'loadingAnnouncement',
      type: 'string',
      description: 'Text announced to assistive technology while loading.',
      required: false,
      defaultValue: "'Loading'",
    },
    {
      name: 'labelWrap',
      type: 'boolean',
      description: 'Allows button content to wrap.',
      required: false,
      defaultValue: 'false',
    },
  ],
  subcomponents: [],
  usage: {
    // Source: https://primer.style/product/components/icon-button/
    description: 'Present an action as an icon instead of a visible text label.',
    bestPractices: [
      {
        // Source: https://primer.style/product/components/icon-button/guidelines/
        guidance: true,
        description: 'Choose an icon whose action is clear to the audience in context.',
      },
      {
        // Source: https://primer.style/product/components/icon-button/guidelines/
        guidance: true,
        description: 'Provide a text label in a tooltip on hover and focus.',
      },
    ],
    anatomy: [],
  },
})
