import {defineComponent} from '../docs/components'

export default defineComponent({
  name: 'TextInput',
  displayName: 'TextInput',
  status: 'stable',
  keywords: [],
  stories: [
    'components-textinput--default',
    'components-textinput-features--disabled',
    'components-textinput-features--with-caption',
    'components-textinput-features--visually-hidden-label',
    'components-textinput-features--error',
    'components-textinput-features--success',
    'components-textinput-features--block',
    'components-textinput-features--small',
    'components-textinput-features--large',
    'components-textinput-features--required',
    'components-textinput-features--with-leading-visual',
    'components-textinput-features--with-trailing-icon',
    'components-textinput-features--with-trailing-action',
    'components-textinput-features--with-tooltip-direction',
    'components-textinput-features--with-loading-indicator',
    'components-textinput-features--with-autocomplete-attribute',
  ],
  importPath: '@primer/react',
  props: [
    {name: 'aria-label', type: 'string', description: 'Accessible label for the input.', required: false},
    {
      name: 'autoComplete',
      type: 'string',
      description: 'Specifies the type of information the browser can autofill.',
      required: false,
    },
    {
      name: 'block',
      type: 'boolean',
      description: 'Makes the input fill the available width.',
      required: false,
      defaultValue: 'false',
    },
    {
      name: 'characterLimit',
      type: 'number',
      description: 'Shows a character counter and applies validation styling when the limit is exceeded.',
      required: false,
    },
    {
      name: 'contrast',
      type: 'boolean',
      description: 'Deprecated. Omit to use the default background.',
      required: false,
      defaultValue: 'false',
    },
    {name: 'size', type: "'small' | 'medium' | 'large'", description: 'Visual size of the input.', required: false},
    {name: 'loading', type: 'boolean', description: 'Shows a loading indicator.', required: false},
    {
      name: 'loaderPosition',
      type: "'auto' | 'leading' | 'trailing'",
      description:
        'Places the loader before or after the input. Auto places it at the end unless a leading visual is present.',
      required: false,
      defaultValue: "'auto'",
    },
    {
      name: 'loaderText',
      type: 'string',
      description: 'Text for assistive technology while loading.',
      required: false,
      defaultValue: "'Loading'",
    },
    {
      name: 'leadingVisual',
      type: 'React.ElementType | React.ReactNode',
      description: 'Visual before the typing area.',
      required: false,
    },
    {
      name: 'monospace',
      type: 'boolean',
      description: 'Uses monospace typography.',
      required: false,
      defaultValue: 'false',
    },
    {
      name: 'trailingVisual',
      type: 'React.ElementType | React.ReactNode',
      description: 'Visual after the typing area.',
      required: false,
    },
    {
      name: 'trailingAction',
      type: 'React.ReactElement<React.HTMLProps<HTMLButtonElement>>',
      description: 'Action button after the typing area.',
      required: false,
    },
    {
      name: 'validationStatus',
      type: "'error' | 'success'",
      description: 'Displays the validation state.',
      required: false,
    },
    {
      name: 'variant',
      type: "'small' | 'medium' | 'large'",
      description: 'Deprecated. Use `size` instead.',
      required: false,
    },
    {
      name: 'width',
      type: 'string | number',
      description: 'Deprecated. Set width with CSS or inline styles.',
      required: false,
    },
    {
      name: 'maxWidth',
      type: 'string | number',
      description: 'Deprecated. Set maximum width with CSS or inline styles.',
      required: false,
    },
    {
      name: 'minWidth',
      type: 'string | number',
      description: 'Deprecated. Set minimum width with CSS or inline styles.',
      required: false,
    },
    {
      name: 'icon',
      type: 'React.ElementType',
      description: 'Deprecated. Use `leadingVisual` or `trailingVisual` instead.',
      required: false,
    },
    {name: 'ref', type: 'React.Ref<HTMLInputElement>', description: 'Ref to the underlying input.', required: false},
    {
      name: 'data-component',
      type: 'string',
      description: 'Overrides the component identifier on the input.',
      required: false,
      defaultValue: "'input'",
    },
  ],
  subcomponents: [
    {
      name: 'TextInput.Action',
      displayName: 'TextInput.Action',
      props: [
        {
          name: 'aria-label',
          type: 'string',
          description: 'Tooltip text and accessible label for an icon-only action.',
          required: false,
        },
        {
          name: 'tooltipDirection',
          type: "'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw'",
          description: 'Preferred tooltip direction for an icon-only action.',
          required: false,
          defaultValue: "'s'",
        },
        {
          name: 'icon',
          type: 'React.FunctionComponent<React.PropsWithChildren<IconProps>>',
          description: 'Icon for the action button.',
          required: false,
        },
        {
          name: 'variant',
          type: "'default' | 'primary' | 'invisible' | 'danger' | 'link'",
          description: 'Deprecated. Use the default invisible treatment.',
          required: false,
          defaultValue: "'invisible'",
        },
        {name: 'ref', type: 'React.Ref<HTMLButtonElement>', description: 'Ref to the action button.', required: false},
        {
          name: 'children',
          type: 'React.ReactNode',
          description: 'Deprecated. Use an icon-only action.',
          required: false,
        },
      ],
    },
  ],
  usage: {
    // Source: https://primer.style/product/components/text-input/
    description: 'Let users enter or edit a single line of text.',
    bestPractices: [
      {
        // Source: https://primer.style/product/components/text-input/guidelines/
        guidance: true,
        description: 'Give every input a concise label, even when it is visually hidden.',
      },
    ],
    anatomy: [
      {
        // Source: https://primer.style/product/components/text-input/guidelines/
        name: 'Label',
        required: true,
        description: 'Identifies what the input is for.',
      },
      {
        // Source: https://primer.style/product/components/text-input/guidelines/
        name: 'Input',
        required: true,
        description: 'Accepts free-form text.',
      },
      {
        // Source: https://primer.style/product/components/text-input/guidelines/
        name: 'Leading visual',
        required: false,
        description: 'Clarifies the input’s purpose before its value.',
      },
      {
        // Source: https://primer.style/product/components/text-input/guidelines/
        name: 'Trailing visual',
        required: false,
        description: 'Adds context after the input value.',
      },
    ],
  },
})
