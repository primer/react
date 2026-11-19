import {defineComponent} from '../docs/component'

export default defineComponent({
  id: 'blankslate',
  name: 'Blankslate',
  status: 'draft',
  a11yReviewed: '2025-01-08',
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
    {name: 'border', type: 'boolean', description: 'Add a border around this component', required: false},
    {name: 'narrow', type: 'boolean', description: '', required: false},
    {name: 'spacious', type: 'boolean', description: '', required: false},
    {
      name: 'className',
      type: 'string',
      description: 'Class name(s) for custom styling.',
      defaultValue: '',
      required: false,
    },
    {
      name: 'size',
      type: "'small' | 'medium' | 'large'",
      description: 'The size of the componeont',
      defaultValue: "'medium'",
      required: false,
    },
  ],
  subcomponents: [
    {name: 'Blankslate.Visual', props: [], displayName: 'Visual'},
    {
      name: 'Blankslate.Heading',
      props: [
        {
          name: 'as',
          type: "'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'",
          description: 'HTML heading element used to render the blankslate heading.',
          required: false,
        },
      ],
      displayName: 'Heading',
    },
    {name: 'Blankslate.Description', props: [], displayName: 'Description'},
    {
      name: 'Blankslate.PrimaryAction',
      props: [
        {
          name: 'href',
          type: 'string',
          required: false,
          description: 'Link to complete primary action. If defined, will render as an anchor instead of a button.',
        },
      ],
      displayName: 'PrimaryAction',
    },
    {
      name: 'Blankslate.SecondaryAction',
      props: [{name: 'href', type: 'string', description: 'Link to complete secondary action', required: true}],
      displayName: 'SecondaryAction',
    },
  ],
})
