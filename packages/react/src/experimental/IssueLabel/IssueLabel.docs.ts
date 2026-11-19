import {defineComponent} from '../../docs/components'

export default defineComponent({
  name: 'IssueLabel',
  displayName: 'IssueLabel',
  status: 'experimental',
  keywords: [],
  stories: [
    'experimental-components-issuelabel--default',
    'experimental-components-issuelabel-features--group-of-labels',
    'experimental-components-issuelabel-features--hex-color',
  ],
  importPath: '@primer/react/experimental',
  props: [
    {
      name: 'as',
      type: 'React.ElementType',
      description:
        'Overrides the element. Without it, the label renders as a link with `href`, a button with `onClick`, or otherwise a span.',
      required: false,
    },
    {name: 'className', type: 'string', description: '', required: false},
    {
      name: 'fillColor',
      type: 'Hex',
      description:
        'Overrides the variant with a hexadecimal background color. The text color is calculated for contrast.',
      required: false,
    },
    {
      name: 'variant',
      type: 'LabelColorVariant',
      description: 'Preset color when no `fillColor` is provided.',
      required: false,
      defaultValue: "'gray'",
    },
    {
      name: 'href',
      type: 'string',
      description: 'Required for the native link variant. Takes precedence over `onClick` when choosing the element.',
      required: false,
    },
    {
      name: 'onClick',
      type: 'React.MouseEventHandler<HTMLButtonElement> | React.MouseEventHandler<HTMLAnchorElement>',
      description: 'Required for the native button variant; optional on links.',
      required: false,
    },
  ],
  subcomponents: [],
  usage: {description: '', bestPractices: [], anatomy: []},
})
