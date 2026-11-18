import {defineComponent} from '../docs/components'

export default defineComponent({
  name: 'Blankslate',
  displayName: 'Blankslate',
  status: 'experimental',
  keywords: [],
  stories: [
    'experimental-components-blankslate--default',
    'experimental-components-blankslate-features--with-visual',
    'experimental-components-blankslate-features--with-primary-action-as-link',
    'experimental-components-blankslate-features--with-primary-action-as-button',
    'experimental-components-blankslate-features--with-secondary-action',
    'experimental-components-blankslate-features--with-border',
    'experimental-components-blankslate-features--narrow',
    'experimental-components-blankslate-features--spacious',
  ],
  importPath: '@primer/react/experimental',
  props: [
    {
      name: 'border',
      type: 'boolean',
      description: 'Adds a border.',
      required: false,
    },
    {
      name: 'narrow',
      type: 'boolean',
      description: 'Constrains the maximum width.',
      required: false,
    },
    {
      name: 'spacious',
      type: 'boolean',
      description: 'Increases the padding.',
      required: false,
    },
    {
      name: 'className',
      type: 'string',
      description: 'CSS class for the inner container.',
      required: false,
    },
    {
      name: 'size',
      type: "'small' | 'medium' | 'large'",
      description: 'Size of the component.',
      required: false,
      defaultValue: 'medium',
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Content and actions for the empty state.',
      required: false,
    },
  ],
  subcomponents: [
    {
      name: 'Blankslate.Visual',
      displayName: 'Blankslate.Visual',
      props: [
        {
          name: 'children',
          type: 'ReactNode',
          description: 'Graphic for the empty state.',
          required: false,
        },
      ],
    },
    {
      name: 'Blankslate.Heading',
      displayName: 'Blankslate.Heading',
      props: [
        {
          name: 'as',
          type: "'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'",
          description: 'Heading element.',
          required: false,
          defaultValue: 'h2',
        },
        {
          name: 'children',
          type: 'ReactNode',
          description: 'Heading text.',
          required: false,
        },
      ],
    },
    {
      name: 'Blankslate.Description',
      displayName: 'Blankslate.Description',
      props: [
        {
          name: 'children',
          type: 'ReactNode',
          description: 'Description text.',
          required: false,
        },
      ],
    },
    {
      name: 'Blankslate.PrimaryAction',
      displayName: 'Blankslate.PrimaryAction',
      props: [
        {
          name: 'href',
          type: 'string',
          description: 'Renders a link when provided. Omit for a button, which accepts native button props.',
          required: false,
        },
        {
          name: 'onClick',
          type: 'React.MouseEventHandler<HTMLButtonElement>',
          description: 'Click handler for the button variant.',
          required: false,
        },
        {
          name: 'children',
          type: 'ReactNode',
          description: 'Label for the primary action.',
          required: false,
        },
      ],
    },
    {
      name: 'Blankslate.SecondaryAction',
      displayName: 'Blankslate.SecondaryAction',
      props: [
        {
          name: 'href',
          type: 'string',
          description: 'Destination of the secondary link.',
          required: true,
        },
        {
          name: 'children',
          type: 'ReactNode',
          description: 'Label for the secondary action.',
          required: false,
        },
      ],
    },
  ],
  usage: {
    // Source: https://primer.style/product/components/blankslate/
    description: 'Explain why expected content is missing in an otherwise empty area.',
    bestPractices: [
      {
        // Source: https://primer.style/product/components/blankslate/guidelines/
        guidance: true,
        description: 'If a graphic conveys information, provide that information in another form too.',
      },
    ],
    anatomy: [
      {
        // Source: https://primer.style/product/components/blankslate/guidelines/
        name: 'Graphic',
        required: false,
        description: 'Illustrates the feature or empty state.',
      },
    ],
  },
})
