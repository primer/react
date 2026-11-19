import {defineComponent} from '../docs/components'

export default defineComponent({
  name: 'Link',
  displayName: 'Link',
  status: 'stable',
  keywords: [],
  stories: ['components-link--default', 'components-link-features--muted', 'components-link-features--inline'],
  importPath: '@primer/react',
  props: [
    {
      name: 'href',
      type: 'string',
      description: 'Destination URL for an anchor. A component passed to `as` may use a different prop.',
      required: false,
    },
    {
      name: 'muted',
      type: 'boolean',
      description: 'Uses a less prominent color and restores the default link color on hover.',
      required: false,
    },
    {
      name: 'inline',
      type: 'boolean',
      description: 'Underlines the link to distinguish it from surrounding text.',
      required: false,
    },
    {
      name: 'hoverColor',
      type: 'string',
      description: 'Deprecated and ignored. Use CSS modules to style the hover color.',
      required: false,
    },
    {
      name: 'ref',
      type: 'React.Ref<HTMLAnchorElement>',
      description: 'Ref to the root element. Its type follows the element provided to `as`.',
      required: false,
    },
    {name: 'as', type: 'React.ElementType', description: '', required: false, defaultValue: "'a'"},
  ],
  subcomponents: [],
  usage: {
    // Source: https://primer.style/product/components/link/
    description: 'Style hyperlink text that takes the user to another page or resource.',
    bestPractices: [
      {
        // Source: https://primer.style/product/components/link/guidelines/
        guidance: true,
        description: 'Keep link text short, whether it stands alone or appears within a sentence.',
      },
      {
        // Source: https://primer.style/product/components/link/guidelines/
        guidance: false,
        description: 'Do not use a link to run an action. Use a button instead.',
      },
    ],
    anatomy: [],
  },
})
