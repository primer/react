import {defineComponent} from '../docs/components'

export default defineComponent({
  name: 'Pagination',
  displayName: 'Pagination',
  status: 'stable',
  keywords: [],
  stories: [
    'components-pagination--default',
    'components-pagination-features--larger-page-count-margin',
    'components-pagination-features--hide-page-numbers',
    'components-pagination-features--hide-page-numbers-by-viewport',
    'components-pagination-features--higher-surrounding-page-count',
  ],
  importPath: '@primer/react',
  props: [
    {name: 'currentPage', type: 'number', description: 'Current page number.', required: true},
    {name: 'pageCount', type: 'number', description: 'Total number of pages.', required: true},
    {
      name: 'hrefBuilder',
      type: '(n: number) => string',
      description: 'Builds the destination for a page link.',
      required: false,
    },
    {
      name: 'marginPageCount',
      type: 'number',
      description: 'Number of page links to show at each end of the range.',
      required: false,
      defaultValue: '1',
    },
    {
      name: 'onPageChange',
      type: '(e: React.MouseEvent, n: number) => void',
      description: 'Called when a user activates a page link.',
      required: false,
    },
    {
      name: 'showPages',
      type: 'boolean | {narrow?: boolean; regular?: boolean; wide?: boolean}',
      description: 'Controls whether to show page numbers, optionally per viewport.',
      required: false,
      defaultValue: 'true',
    },
    {
      name: 'surroundingPageCount',
      type: 'number',
      description: 'Number of page links to show on either side of the current page.',
      required: false,
      defaultValue: '2',
    },
    {
      name: 'renderPage',
      type: '(props: PageProps) => React.ReactNode',
      description: 'Custom renderer for a page link.',
      required: false,
    },
    {
      name: 'className',
      type: 'string',
      description: 'Class name for the navigation container.',
      required: false,
    },
  ],
  subcomponents: [],
  usage: {
    // Source: https://primer.style/product/components/pagination/
    description: 'Provide links for moving between sequential pages of content.',
    bestPractices: [
      {
        // Source: https://primer.style/product/components/pagination/guidelines/
        guidance: true,
        description: 'Give every page its own URL and place pagination after the content.',
      },
      {
        // Source: https://primer.style/product/components/pagination/guidelines/
        guidance: false,
        description: 'Do not show pagination when the content fits on one page.',
      },
    ],
    anatomy: [
      {
        // Source: https://primer.style/product/components/pagination/guidelines/
        name: 'Previous page link',
        required: true,
        description: 'Moves to the preceding page when available.',
      },
      {
        // Source: https://primer.style/product/components/pagination/guidelines/
        name: 'Next page link',
        required: true,
        description: 'Moves to the following page when available.',
      },
      {
        // Source: https://primer.style/product/components/pagination/guidelines/
        name: 'Page numbers',
        required: false,
        description: 'Jump directly to a numbered page.',
      },
      {
        // Source: https://primer.style/product/components/pagination/guidelines/
        name: 'Current page',
        required: false,
        description: 'Identifies the active page among the numbers.',
      },
      {
        // Source: https://primer.style/product/components/pagination/guidelines/
        name: 'Truncation indicator',
        required: false,
        description: 'Shows where page links have been omitted.',
      },
    ],
  },
})
