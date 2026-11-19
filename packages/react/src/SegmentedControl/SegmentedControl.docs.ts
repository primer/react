import {defineComponent} from '../docs/component'

export default defineComponent({
  id: 'segmented_control',
  name: 'SegmentedControl',
  status: 'alpha',
  a11yReviewed: '2025-01-08',
  stories: [
    'components-segmentedcontrol--default',
    'components-segmentedcontrol-features--with-icons',
    'components-segmentedcontrol-features--controlled',
    'components-segmentedcontrol-features--variant-narrow-hide-labels',
    'components-segmentedcontrol-features--variant-narrow-action-menu',
    'components-segmentedcontrol-features--variant-narrow-action-menu-with-action',
    'components-segmentedcontrol-features--fullwidth-narrow',
    'components-segmentedcontrol-features--fullwidth-regular',
    'components-segmentedcontrol-features--fullwidth-all',
    'components-segmentedcontrol-features--icon-only',
    'components-segmentedcontrol-features--associated-with-a-label-and-caption',
    'components-segmentedcontrol-features--variant-subtle',
  ],
  importPath: '@primer/react',
  props: [
    {name: 'aria-label', type: 'string', defaultValue: '', description: '', required: false},
    {name: 'aria-labelledby', type: 'string', defaultValue: '', description: '', required: false},
    {name: 'aria-describedby', type: 'string', defaultValue: '', description: '', required: false},
    {
      name: 'fullWidth',
      type: '| boolean | { narrow?: boolean regular?: boolean wide?: boolean }',
      defaultValue: '',
      description: 'Whether the control fills the width of its parent',
      required: false,
    },
    {
      name: 'onChange',
      type: '(selectedIndex?: number) => void',
      defaultValue: '',
      description: 'The handler that gets called when a segment is selected',
      required: false,
    },
    {
      name: 'variant',
      type: "| 'default' | 'subtle' | { narrow?: 'hideLabels' | 'dropdown' | 'default' | 'subtle' regular?: 'hideLabels' | 'dropdown' | 'default' | 'subtle' wide?: 'hideLabels' | 'dropdown' | 'default' | 'subtle' }",
      defaultValue: "'default'",
      description: "Configure the control's visual treatment or responsive behavior in tight spaces.",
      required: false,
    },
    {
      name: 'size',
      type: "'small' | 'medium'",
      description: 'The size of the buttons',
      defaultValue: '',
      required: false,
    },
  ],
  subcomponents: [
    {
      name: 'SegmentedControl.Button',
      props: [
        {
          name: 'leadingVisual',
          type: 'Component',
          defaultValue: '',
          description: 'The leading visual comes before item label',
          required: false,
        },
        {
          name: 'leadingIcon',
          deprecated: true,
          type: 'Component',
          defaultValue: '',
          description: 'Deprecated: use `leadingVisual` instead. The leading icon comes before item label.',
          required: false,
        },
        {
          name: 'selected',
          type: 'boolean',
          defaultValue: '',
          description:
            'Whether the segment is selected. This is used for controlled SegmentedControls, and needs to be updated using the onChange handler on SegmentedControl.',
          required: false,
        },
        {
          name: 'defaultSelected',
          type: 'boolean',
          defaultValue: '',
          description:
            'Whether the segment is selected. This is used for uncontrolled SegmentedControls to pick one SegmentedControlButton that is selected on the initial render.',
          required: false,
        },
        {
          name: 'count',
          type: 'number | string',
          defaultValue: '',
          description: 'The number to display in the counter label.',
          required: false,
        },
      ],
      displayName: 'Button',
    },
    {
      name: 'SegmentedControl.IconButton',
      props: [
        {name: 'aria-label', type: 'string', defaultValue: '', required: true, description: ''},
        {
          name: 'icon',
          type: 'Component',
          defaultValue: '',
          required: true,
          description: 'The icon that represents the segmented control item',
        },
        {
          name: 'selected',
          type: 'boolean',
          defaultValue: '',
          description:
            'Whether the segment is selected. This is used for controlled SegmentedControls, and needs to be updated using the onChange handler on SegmentedControl.',
          required: false,
        },
        {
          name: 'defaultSelected',
          type: 'boolean',
          defaultValue: '',
          description:
            'Whether the segment is selected. This is used for uncontrolled SegmentedControls to pick one SegmentedControlButton that is selected on the initial render.',
          required: false,
        },
        {
          name: 'tooltipDirection',
          type: "'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw'",
          required: false,
          description: 'The direction for the tooltip.',
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
      displayName: 'IconButton',
    },
    {
      name: 'SegmentedControl.Divider',
      props: [
        {
          name: 'className',
          type: 'string',
          required: false,
          description: 'Additional CSS class names for the divider.',
        },
        {name: 'style', type: 'React.CSSProperties', required: false, description: 'Inline styles for the divider.'},
      ],
      displayName: 'Divider',
    },
    {
      name: 'SegmentedControl.Action',
      props: [
        {name: 'label', type: 'string', required: true, description: 'Accessible label for the action icon button.'},
        {name: 'icon', type: 'Component', required: true, description: 'The icon rendered by the action button.'},
        {
          name: 'onClick',
          type: '() => void',
          description: 'The handler that gets called when the action button is clicked.',
          required: false,
        },
        {name: 'disabled', type: 'boolean', description: 'Whether the action is disabled.', required: false},
        {name: 'loading', type: 'boolean', description: 'Whether the action is in a loading state.', required: false},
      ],
      displayName: 'Action',
    },
  ],
})
