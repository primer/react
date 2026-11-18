import {defineComponent} from '../docs/components'

export default defineComponent({
  name: 'SegmentedControl',
  displayName: 'SegmentedControl',
  status: 'stable',
  keywords: [],
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
    {
      name: 'aria-label',
      type: 'string',
      description: 'Names the control directly.',
      required: false,
    },
    {
      name: 'aria-labelledby',
      type: 'string',
      description: 'ID of the element that names the control.',
      required: false,
    },
    {
      name: 'aria-describedby',
      type: 'string',
      description: 'ID of the element that describes the control.',
      required: false,
    },
    {
      name: 'fullWidth',
      type: 'boolean | ResponsiveValue<boolean>',
      description: 'Makes the control fill its container, optionally by viewport size.',
      required: false,
    },
    {
      name: 'onChange',
      type: '(selectedIndex: number) => void',
      description: 'Called with the zero-based index of the selected segment.',
      required: false,
    },
    {
      name: 'variant',
      type: "'default' | 'subtle' | Partial<Record<WidthOnlyViewportRangeKeys, 'hideLabels' | 'dropdown' | 'default' | 'subtle'>>",
      description: 'Controls presentation, including alternative presentations at specific viewport widths.',
      required: false,
      defaultValue: 'default',
    },
    {
      name: 'size',
      type: "'small' | 'medium'",
      description: 'Size of the buttons.',
      required: false,
    },
    {
      name: 'className',
      type: 'string',
      description: '',
      required: false,
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Segments, dividers, and an optional action.',
      required: false,
    },
  ],
  subcomponents: [
    {
      name: 'SegmentedControl.Button',
      displayName: 'SegmentedControl.Button',
      props: [
        {
          name: 'leadingVisual',
          type: 'React.FunctionComponent<React.PropsWithChildren<IconProps>> | React.ReactElement',
          description: 'Visual before the label.',
          required: false,
        },
        {
          name: 'leadingIcon',
          type: 'React.FunctionComponent<React.PropsWithChildren<IconProps>> | React.ReactElement',
          description: 'Deprecated. Use `leadingVisual` instead.',
          required: false,
        },
        {
          name: 'selected',
          type: 'boolean',
          description: 'Selected state of a segment in a controlled control.',
          required: false,
        },
        {
          name: 'defaultSelected',
          type: 'boolean',
          description: 'Initial selection of a segment in an uncontrolled control.',
          required: false,
        },
        {
          name: 'count',
          type: 'number | string',
          description: 'Counter beside the label.',
          required: false,
        },
        {
          name: 'children',
          type: 'string',
          description: 'Visible label.',
          required: true,
        },
        {
          name: 'disabled',
          type: 'boolean',
          description: 'Disables activation and sets `aria-disabled`.',
          required: false,
        },
      ],
    },
    {
      name: 'SegmentedControl.IconButton',
      displayName: 'SegmentedControl.IconButton',
      props: [
        {
          name: 'aria-label',
          type: 'string',
          description: 'Accessible name of the segment.',
          required: true,
        },
        {
          name: 'icon',
          type: 'React.FunctionComponent<React.PropsWithChildren<IconProps>> | React.ReactElement',
          description: 'Icon representing the segment.',
          required: true,
        },
        {
          name: 'selected',
          type: 'boolean',
          description: 'Selected state of a segment in a controlled control.',
          required: false,
        },
        {
          name: 'defaultSelected',
          type: 'boolean',
          description: 'Initial selection of a segment in an uncontrolled control.',
          required: false,
        },
        {
          name: 'tooltipDirection',
          type: "'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw'",
          description: 'Tooltip placement.',
          required: false,
          defaultValue: 's',
        },
        {
          name: 'description',
          type: 'string',
          description: 'Supplementary tooltip text shown instead of the accessible name.',
          required: false,
        },
        {
          name: 'disabled',
          type: 'boolean',
          description: 'Disables activation and sets `aria-disabled`.',
          required: false,
        },
      ],
    },
    {
      name: 'SegmentedControl.Divider',
      displayName: 'SegmentedControl.Divider',
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
      name: 'SegmentedControl.Action',
      displayName: 'SegmentedControl.Action',
      props: [
        {
          name: 'label',
          type: 'string',
          description: 'Accessible action label.',
          required: true,
        },
        {
          name: 'icon',
          type: 'React.ElementType',
          description: 'Icon for the action.',
          required: true,
        },
        {
          name: 'onClick',
          type: '() => void',
          description: 'Called when the action is activated.',
          required: false,
        },
        {
          name: 'disabled',
          type: 'boolean',
          description: 'Disables the action.',
          required: false,
        },
        {
          name: 'loading',
          type: 'boolean',
          description: 'Shows the action’s loading state.',
          required: false,
        },
      ],
    },
  ],
  usage: {
    // Source: https://primer.style/product/components/segmented-control/
    description: 'Let users choose one of several related options and apply the selection immediately.',
    bestPractices: [
      {
        // Source: https://primer.style/product/components/segmented-control/guidelines/
        guidance: true,
        description:
          'Use a segmented control when an option takes effect immediately without a separate save or submit step.',
      },
    ],
    anatomy: [],
  },
})
