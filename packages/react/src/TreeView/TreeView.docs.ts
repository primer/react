import {defineComponent} from '../docs/component'

export default defineComponent({
  id: 'tree_view',
  name: 'TreeView',
  status: 'beta',
  a11yReviewed: '2025-01-08',
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
    {name: 'aria-label', type: 'string', description: '', required: false},
    {name: 'aria-labelledby', type: 'string', description: '', required: false},
    {
      name: 'className',
      type: 'string',
      description: 'Class name(s) used to customize styles',
      required: false,
    },
    {
      name: 'flat',
      type: 'boolean',
      description:
        'Prevents the tree from indenting items. This should only be used when the tree is used to display a flat list of items.',
      required: false,
    },
    {
      name: 'truncate',
      type: 'boolean',
      description: 'Whether to truncate node text',
      defaultValue: 'true',
      required: false,
    },
    {name: 'children', type: 'React.ReactNode', required: true, description: 'The tree items to render.'},
  ],
  subcomponents: [
    {
      name: 'TreeView.Item',
      props: [
        {
          name: 'children',
          type: 'React.ReactNode',
          required: true,
          description: 'The item label and any leading action, visuals, or subtree.',
        },
        {name: 'id', type: 'string', required: true, description: 'A unique identifier for the item.'},
        {name: 'aria-label', type: 'string', description: '', required: false},
        {name: 'aria-labelledby', type: 'string', description: '', required: false},
        {
          name: 'className',
          type: 'string',
          description: 'Class name(s) used to customize styles',
          required: false,
        },
        {
          name: 'current',
          type: 'boolean',
          defaultValue: 'false',
          description:
            'Indicates whether the item is the current item. No more than one item should be current at once. The path to the current item will be expanded by default.',
          required: false,
        },
        {
          name: 'defaultExpanded',
          type: 'boolean',
          description:
            'The expanded state of the item when it is initially rendered. Use when you do not need to control the state.',
          required: false,
        },
        {
          name: 'expanded',
          type: 'boolean',
          description: 'The controlled expanded state of item. Must be used in conjunction with onExpandedChange.',
          required: false,
        },
        {
          name: 'secondaryActions',
          type: 'Array<TreeViewSecondaryActions>',
          description:
            "An array of secondary actions to render in as a trailing action. Each action should have a 'label', 'icon', and 'onClick' handler.",
          required: false,
        },
        {
          name: 'containIntrinsicSize',
          type: 'string',
          description:
            "The size of this item's contents. Passing this will set 'content-visiblity: auto' on the content container, delaying rendering until the item is in the viewport.",
          required: false,
        },
        {
          name: 'onExpandedChange',
          type: '(expanded: boolean) => void',
          description: 'Event handler called when the expanded state of the item changes.',
          required: false,
        },
        {
          name: 'onSelect',
          type: '(event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => void',
          description: 'Called when the item is clicked or activated with Enter or Space.',
          required: false,
        },
        {
          name: 'ref',
          type: 'React.Ref<HTMLElement>',
          required: false,
          description: 'Ref to the element rendered as the tree item.',
        },
        {
          name: 'as',
          type: 'React.ElementType',
          defaultValue: "'li'",
          description:
            'The element type to render the tree item as. When set to a different element type or component, the polymorphic element is rendered with `role="treeitem"` and is wrapped in an `li` element with `role="none"` so the markup remains valid inside a `ul` with `role="tree"`.',
          required: false,
        },
      ],
      displayName: 'Item',
    },
    {
      name: 'TreeView.LeadingVisual',
      props: [
        {
          name: 'children',
          required: true,
          type: '| React.ReactNode\n| (props: {isExpanded: boolean}) => React.ReactNode)',
          description:
            'The visual before the item label, or a function that receives the item’s expanded state and returns the visual.',
        },
        {
          name: 'label',
          type: 'string',
          description: 'Provide an accessible label for the visual. This is not necessary for decorative visuals.',
          required: false,
        },
      ],
      displayName: 'LeadingVisual',
    },
    {
      name: 'TreeView.TrailingVisual',
      props: [
        {
          name: 'children',
          required: true,
          type: '| React.ReactNode\n| (props: {isExpanded: boolean}) => React.ReactNode)',
          description:
            'The visual after the item label, or a function that receives the item’s expanded state and returns the visual.',
        },
        {
          name: 'label',
          type: 'string',
          description: 'Provide an accessible label for the visual. This is not necessary for decorative visuals.',
          required: false,
        },
      ],
      displayName: 'TrailingVisual',
    },
    {name: 'TreeView.DirectoryIcon', props: [], displayName: 'DirectoryIcon'},
    {
      name: 'TreeView.SubTree',
      props: [
        {name: 'children', type: 'React.ReactNode', description: 'The nested tree items to render.', required: false},
        {
          name: 'state',
          type: "| 'initial'\n| 'loading'\n| 'done'\n| 'error'",
          description:
            "Specify a state if items in the subtree are loaded asynchronously. An asynchronous subtree can be in one of the following states: 'initial', 'loading', 'done', or 'error'. In the 'initial' state, items are neither loaded nor loading. In the 'loading' state, items are loading and the subtree will render a loading indicator. In the 'done' state, items are loaded. Screen readers will announce when a subtree enters the 'done' state. An 'error' state means that an error occurred while loading items.",
          required: false,
        },
        {
          name: 'count',
          type: 'number',
          description:
            'The number of items expected to be in the subtree. When in the loading state, the subtree will render a skeleton loading placeholder with the specified count of items',
          required: false,
        },
        {
          name: 'aria-label',
          type: 'string',
          description:
            "An accessible name for the subtree. It is recommended that you provide a short version of the parent list item's name as the name of the subtree.",
          required: false,
        },
      ],
      displayName: 'SubTree',
    },
    {
      name: 'TreeView.ErrorDialog',
      props: [
        {
          name: 'children',
          required: true,
          type: 'React.ReactNode',
          description: 'The content of the dialog. This is usually a message explaining the error.',
        },
        {
          name: 'title',
          type: 'string',
          defaultValue: "'Error'",
          description: 'The title of the dialog. This is usually a short description of the error.',
          required: false,
        },
        {
          name: 'onRetry',
          type: '() => void',
          description: 'Event handler called when the user clicks the retry button.',
          required: false,
        },
        {
          name: 'onDismiss',
          type: '() => void',
          description: 'Event handler called when the dialog is dismissed.',
          required: false,
        },
      ],
      displayName: 'ErrorDialog',
    },
  ],
})
