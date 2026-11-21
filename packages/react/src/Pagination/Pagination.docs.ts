import {defineComponent} from '../docs/component'

export default defineComponent({
  id: 'pagination',
  name: 'Pagination',
  status: 'alpha',
  a11yReviewed: '2025-01-08',
  stories: [
    'components-pagination--default',
    'components-pagination-features--larger-page-count-margin',
    'components-pagination-features--hide-page-numbers',
    'components-pagination-features--hide-page-numbers-by-viewport',
    'components-pagination-features--higher-surrounding-page-count',
  ],
  importPath: '@primer/react',
  props: [
    {
      name: 'currentPage',
      type: 'number',
      required: true,
      description: 'The currently selected page.',
    },
    {name: 'pageCount', type: 'number', required: true, description: 'The total number of pages.'},
    {
      name: 'hrefBuilder',
      type: 'function',
      defaultValue: '',
      description: 'A function to generate links based on page number.',
      required: false,
    },
    {
      name: 'marginPageCount',
      type: 'number',
      defaultValue: '1',
      description: 'How many pages to always show at the left and right of the component.',
      required: false,
    },
    {
      name: 'onPageChange',
      type: 'function',
      defaultValue: '(e: MouseEvent<Element, MouseEvent>, n: number) => void',
      description: 'Called with event and page number when a page is clicked.',
      required: false,
    },
    {
      name: 'showPages',
      type: 'boolean | { narrow?: boolean, regular?: boolean, wide?: boolean }',
      defaultValue: 'true',
      description: 'Whether or not to show the individual page links.',
      required: false,
    },
    {
      name: 'surroundingPageCount',
      type: 'number',
      defaultValue: '2',
      description: 'How many pages to display on each side of the currently selected page.',
      required: false,
    },
    {
      name: 'renderPage',
      type: 'function',
      defaultValue: '(props: PageProps) => ReactNode',
      description: 'Provide a custom component or render prop to render each page link within the component.',
      required: false,
    },
  ],
  subcomponents: [],
})
