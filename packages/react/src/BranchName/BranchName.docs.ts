import {defineComponent} from '../docs/component'

export default defineComponent({
  id: 'branch_name',
  name: 'BranchName',
  status: 'alpha',
  a11yReviewed: '2025-01-08',
  stories: [
    'components-branchname--default',
    'components-branchname-features--with-branch-icon',
    'components-branchname-features--not-a-link',
  ],
  importPath: '@primer/react',
  props: [
    {
      name: 'ref',
      type: 'React.RefObject<HTMLAnchorElement>',
      required: false,
      description:
        'Allows getting a ref to the component instance.\nOnce the component unmounts, React will set `ref.current` to `null`\n(or call the ref with `null` if you passed a callback ref).',
    },
    {
      name: 'as',
      type: 'React.ElementType',
      defaultValue: '"a"',
      description: 'HTML element or React component to render instead of the default anchor.',
      required: false,
    },
  ],
  subcomponents: [],
})
