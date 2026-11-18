import {defineComponent} from '../docs/components'

export default defineComponent({
  name: 'TreeView',
  displayName: 'TreeView',
  status: 'stable',
  keywords: [],
  stories: [
    'components-treeview-features--files',
    'components-treeview-features--files-changed',
    'components-treeview-features--async-success',
    'components-treeview-features--async-error',
    'components-treeview-features--async-with-count',
    'components-treeview-features--controlled',
  ],
  importPath: '@primer/react',
  props: [
    {name: 'aria-label', type: 'string', description: 'Names the tree directly.', required: false},
    {
      name: 'aria-labelledby',
      type: 'string',
      description: 'Names the tree using a referenced element.',
      required: false,
    },
    {name: 'className', type: 'string', description: 'Class name for custom styling.', required: false},
    {name: 'flat', type: 'boolean', description: 'Uses the flat tree presentation.', required: false},
    {
      name: 'truncate',
      type: 'boolean',
      description: 'Truncates item labels when they do not fit.',
      required: false,
      defaultValue: 'true',
    },
    {name: 'children', type: 'React.ReactNode', description: 'Items in the tree.', required: true},
    {name: 'style', type: 'React.CSSProperties', description: 'Inline styles for the tree.', required: false},
  ],
  subcomponents: [
    {
      name: 'TreeView.Item',
      displayName: 'TreeView.Item',
      props: [
        {
          name: 'children',
          type: 'React.ReactNode',
          description: 'Item contents, including optional visuals or a subtree.',
          required: true,
        },
        {name: 'id', type: 'string', description: 'Unique identifier for the item.', required: true},
        {name: 'aria-label', type: 'string', description: 'Names the item directly.', required: false},
        {
          name: 'aria-labelledby',
          type: 'string',
          description: 'Names the item using a referenced element.',
          required: false,
        },
        {name: 'className', type: 'string', description: 'Class name for custom styling.', required: false},
        {
          name: 'current',
          type: 'boolean',
          description: 'Marks the current item.',
          required: false,
          defaultValue: 'false',
        },
        {
          name: 'defaultExpanded',
          type: 'boolean',
          description: 'Initial expansion state in uncontrolled mode.',
          required: false,
        },
        {name: 'expanded', type: 'boolean | null', description: 'Controls expansion when supplied.', required: false},
        {
          name: 'secondaryActions',
          type: 'Array<TreeViewSecondaryActions>',
          description: 'Additional actions on the item.',
          required: false,
        },
        {
          name: 'containIntrinsicSize',
          type: 'string',
          description: 'Provides a CSS intrinsic size for contained content.',
          required: false,
        },
        {
          name: 'onExpandedChange',
          type: '(expanded: boolean) => void',
          description: 'Reports changes to expansion.',
          required: false,
        },
        {
          name: 'onSelect',
          type: '(event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => void',
          description: 'Called when the item is selected.',
          required: false,
        },
        {
          name: 'ref',
          type: 'React.Ref<unknown>',
          description: 'Ref to the element rendered for the item.',
          required: false,
        },
        {
          name: 'as',
          type: 'React.ElementType',
          description: 'Element or component that receives the tree item role.',
          required: false,
          defaultValue: "'li'",
        },
      ],
    },
    {
      name: 'TreeView.LeadingVisual',
      displayName: 'TreeView.LeadingVisual',
      props: [
        {
          name: 'children',
          type: 'React.ReactNode | ((props: {isExpanded: boolean}) => React.ReactNode)',
          description: 'Visual or a function that renders it from expansion state.',
          required: true,
        },
        {
          name: 'label',
          type: 'string',
          description: 'Accessible name describing what the visual indicates.',
          required: false,
        },
      ],
    },
    {
      name: 'TreeView.TrailingVisual',
      displayName: 'TreeView.TrailingVisual',
      props: [
        {
          name: 'children',
          type: 'React.ReactNode | ((props: {isExpanded: boolean}) => React.ReactNode)',
          description: 'Visual or a function that renders it from expansion state.',
          required: true,
        },
        {
          name: 'label',
          type: 'string',
          description: 'Accessible name describing what the visual indicates.',
          required: false,
        },
      ],
    },
    {name: 'TreeView.DirectoryIcon', displayName: 'TreeView.DirectoryIcon', props: []},
    {
      name: 'TreeView.SubTree',
      displayName: 'TreeView.SubTree',
      props: [
        {name: 'children', type: 'React.ReactNode', description: 'Nested items.', required: false},
        {
          name: 'state',
          type: "'initial' | 'loading' | 'done' | 'error'",
          description: 'Loading state of the subtree.',
          required: false,
        },
        {
          name: 'count',
          type: 'number',
          description: 'Number of placeholder items to show while loading.',
          required: false,
        },
        {name: 'aria-label', type: 'string', description: 'Accessible name for the nested group.', required: false},
      ],
    },
    {
      name: 'TreeView.ErrorDialog',
      displayName: 'TreeView.ErrorDialog',
      props: [
        {name: 'children', type: 'React.ReactNode', description: 'Content describing the error.', required: true},
        {name: 'title', type: 'string', description: 'Title of the dialog.', required: false, defaultValue: "'Error'"},
        {name: 'onRetry', type: '() => void', description: 'Called when retry is requested.', required: false},
        {
          name: 'onDismiss',
          type: '() => void',
          description: 'Called when the error dialog is dismissed.',
          required: false,
        },
      ],
    },
    {
      name: 'TreeView.LeadingAction',
      displayName: 'TreeView.LeadingAction',
      props: [
        {
          name: 'children',
          type: 'React.ReactNode | ((props: {isExpanded: boolean}) => React.ReactNode)',
          description: 'Leading action, optionally rendered from expansion state.',
          required: true,
        },
        {name: 'label', type: 'string', description: 'Name of the action.', required: false},
      ],
    },
  ],
  usage: {
    // Source: https://primer.style/product/components/tree-view/
    description: 'Display nested items that users can reveal or hide by expanding or collapsing their parent.',
    bestPractices: [
      {
        // Source: https://primer.style/product/components/tree-view/guidelines/
        guidance: true,
        description: 'Use brief node labels and make the full text available to keyboard users when it is truncated.',
      },
      {
        // Source: https://primer.style/product/components/tree-view/guidelines/
        guidance: true,
        description: 'Give meaningful leading and trailing visuals an accessible text label.',
      },
      {
        // Source: https://primer.style/product/components/tree-view/guidelines/
        guidance: false,
        description: 'Do not use a tree for general site navigation or for lists without a hierarchy.',
      },
    ],
    anatomy: [
      {
        // Source: https://primer.style/product/components/tree-view/guidelines/
        name: 'Parent node',
        required: false,
        description: 'An item that expands or collapses to show or hide its children.',
      },
      {
        // Source: https://primer.style/product/components/tree-view/guidelines/
        name: 'End node',
        required: false,
        description: 'An item without children.',
      },
      {
        // Source: https://primer.style/product/components/tree-view/guidelines/
        name: 'Chevron',
        required: false,
        description: 'Toggles a parent and shows whether it is expanded.',
      },
      {
        // Source: https://primer.style/product/components/tree-view/guidelines/
        name: 'Nesting level indicator lines',
        required: false,
        description: 'Show the depth of nested items.',
      },
    ],
  },
})
