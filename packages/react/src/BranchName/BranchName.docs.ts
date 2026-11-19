import {defineComponent} from '../docs/components'

export default defineComponent({
  name: 'BranchName',
  displayName: 'BranchName',
  status: 'stable',
  keywords: [],
  stories: [
    'components-branchname--default',
    'components-branchname-features--with-branch-icon',
    'components-branchname-features--not-a-link',
  ],
  importPath: '@primer/react',
  props: [
    {
      name: 'ref',
      type: 'React.ComponentPropsWithRef<As>["ref"]',
      description: 'Ref to the rendered element.',
      required: false,
    },
    {
      name: 'as',
      type: 'React.ElementType',
      description: 'Element or component to render.',
      required: false,
      defaultValue: "'a'",
    },
    {name: 'className', type: 'string', description: 'Class name for custom styling.', required: false},
  ],
  subcomponents: [],
  usage: {
    // Source: https://primer.style/product/components/branch-name/
    description: 'Display the name of a branch as a link or as plain text.',
    bestPractices: [
      {
        // Source: https://primer.style/product/components/branch-name/
        guidance: true,
        description:
          'Include a branch icon when the surrounding content does not make it clear that the label names a branch.',
      },
    ],
    anatomy: [],
  },
})
