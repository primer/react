import {defineComponent} from '../docs/component'

export default defineComponent({
  id: 'autocomplete',
  name: 'Autocomplete',
  status: 'alpha',
  a11yReviewed: '2025-01-08',
  stories: [
    'components-autocomplete--default',
    'components-autocomplete-features--with-token-input',
    'components-autocomplete-features--add-new-item',
    'components-autocomplete-features--custom-search-filter-fn',
    'components-autocomplete-features--custom-sort-after-menu-close',
    'components-autocomplete-features--with-callback-when-overlay-open-state-changes',
    'components-autocomplete-features--async-loading-of-items',
    'components-autocomplete-features--rendering-the-menu-outside-an-overlay',
    'components-autocomplete-features--custom-overlay-menu-anchor',
    'components-autocomplete-features--in-overlay-with-custom-scroll-container-ref',
    'components-autocomplete-features--in-a-dialog',
  ],
  importPath: '@primer/react',
  props: [
    {
      name: 'children',
      type: 'React.ReactNode',
      description: 'Content rendered within the autocomplete context.',
      required: false,
    },
    {
      name: 'id',
      type: 'string',
      description:
        'May be used to customize how the ID is set on the text input to be used by ARIA attributes on related elements.',
      defaultValue: '',
      required: false,
    },
  ],
  subcomponents: [
    {
      name: 'Autocomplete.Input',
      props: [
        {
          name: 'as',
          type: 'React.ElementType',
          defaultValue: 'TextInput',
          description: 'Component used to render the autocomplete input.',
          required: false,
        },
        {
          name: 'openOnFocus',
          type: 'boolean',
          defaultValue: 'false',
          description: 'Whether the associated autocomplete menu should open on an input focus event',
          deprecated: true,
          required: false,
        },
      ],
      passthrough: {element: 'TextInput', url: '/react/TextInput'},
      displayName: 'Input',
    },
    {
      name: 'Autocomplete.Overlay',
      props: [
        {
          name: 'menuAnchorRef',
          type: 'React.RefObject<HTMLElement>',
          required: false,
          description:
            'The ref of the element that the position of the menu is based on. By default, the menu is positioned based on the text input',
        },
        {
          name: 'children',
          type: 'React.ReactNode',
          description: 'Content rendered inside the overlay when it is open.',
          required: false,
        },
        {
          name: 'overlayProps',
          deprecated: true,
          type: 'Partial<OverlayProps>',
          description: 'Props to be spread on the internal `Overlay` component.',
          required: false,
        },
      ],
      passthrough: {element: 'Overlay', url: '/react/Overlay'},
      displayName: 'Overlay',
    },
    {
      name: 'Autocomplete.Menu',
      props: [
        {
          name: 'items',
          required: true,
          type: 'Array<T>',
          description:
            'The options for field values that are displayed in the dropdown menu. One or more may be selected depending on the value of the `selectionVariant` prop.',
        },
        {name: 'selectedItemIds', required: true, type: 'Array<string>', description: 'The IDs of the selected items'},
        {
          name: 'aria-labelledby',
          required: true,
          type: 'string',
          description: 'ID of the element that labels the listbox.',
        },
        {
          name: 'addNewItem',
          type: "Omit<T, 'id' | 'leadingVisual' | 'onAction'> & { handleAddItem: (item: Omit<T, 'leadingVisual' | 'onAction'>) => void; }",
          description:
            'A menu item that is used to allow users make a selection that is not available in the array passed to the `items` prop. This menu item gets appended to the end of the list of options.',
          required: false,
        },
        {
          name: 'emptyStateText',
          type: 'React.ReactNode | false',
          description:
            'The text that appears in the menu when there are no options in the array passed to the `items` prop.',
          required: false,
        },
        {
          name: 'filterFn',
          type: '(item: T, i: number) => boolean',
          description:
            "A custom function used to filter the options in the array passed to the `items` prop. By default, we filter out items that don't match the value of the autocomplete text input. The default filter is not case-sensitive.",
          required: false,
        },
        {
          name: 'loading',
          type: 'boolean',
          description: 'Whether the data is loading for the menu items',
          required: false,
        },
        {
          name: 'sortOnCloseFn',
          type: '(itemIdA: string | number, itemIdB: string | number) => number',
          description:
            'The sort function that is applied to the options in the array passed to the `items` prop after the user closes the menu. By default, selected items are sorted to the top after the user closes the menu.',
          required: false,
        },
        {
          name: 'selectionVariant',
          type: "'single' | 'multiple'",
          description: 'Whether there can be one item selected from the menu or multiple items selected from the menu',
          required: false,
        },
        {
          name: 'onOpenChange',
          type: '(open: boolean) => void',
          description: 'Function that gets called when the menu is opened or closed',
          required: false,
        },
        {
          name: 'onSelectedChange',
          type: '(item: T | Array<T>) => void',
          description: 'The function that is called when an item in the list is selected or deselected',
          required: false,
        },
        {
          name: 'customScrollContainerRef',
          type: 'React.MutableRefObject<HTMLElement | null>',
          description:
            'If the menu is rendered in a scrolling element other than the `Autocomplete.Overlay` component, pass the ref of that element to `customScrollContainerRef` to ensure the container automatically scrolls when the user highlights an item in the menu that is outside the scroll container',
          required: false,
        },
      ],
      displayName: 'Menu',
    },
  ],
})
