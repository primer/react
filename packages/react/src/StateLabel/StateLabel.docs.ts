import {defineComponent} from '../docs/components'

export default defineComponent({
  name: 'StateLabel',
  displayName: 'StateLabel',
  status: 'stable',
  keywords: [],
  stories: [
    'components-statelabel--default',
    'components-statelabel-features--issue-opened',
    'components-statelabel-features--issue-closed',
    'components-statelabel-features--issue-closed-not-planned',
    'components-statelabel-features--issue-draft',
    'components-statelabel-features--pull-opened',
    'components-statelabel-features--pull-closed',
    'components-statelabel-features--pull-merged',
    'components-statelabel-features--queued',
    'components-statelabel-features--draft',
    'components-statelabel-features--unavailable',
    'components-statelabel-features--alert-opened',
    'components-statelabel-features--alert-fixed',
    'components-statelabel-features--alert-dismissed',
    'components-statelabel-features--alert-closed',
    'components-statelabel-features--small',
    'components-statelabel-features--open',
    'components-statelabel-features--closed',
    'components-statelabel-features--archived',
  ],
  importPath: '@primer/react',
  props: [
    {
      name: 'size',
      type: "'small' | 'medium'",
      description: 'Size of the label. Takes precedence over `variant`.',
      required: false,
      defaultValue: 'medium',
    },
    {
      name: 'variant',
      type: "'normal' | 'small'",
      description: 'Deprecated. Use `size` instead.',
      required: false,
    },
    {
      name: 'status',
      type: "'issueOpened' | 'issueClosed' | 'issueClosedNotPlanned' | 'pullOpened' | 'pullClosed' | 'pullMerged' | 'draft' | 'issueDraft' | 'pullQueued' | 'unavailable' | 'alertOpened' | 'alertFixed' | 'alertDismissed' | 'alertClosed' | 'open' | 'closed' | 'archived'",
      description: 'Selects the visual treatment for the state.',
      required: true,
    },
    {name: 'children', type: 'ReactNode', description: 'Visible text for the state.', required: false},
  ],
  subcomponents: [],
  usage: {
    // Source: https://primer.style/product/components/state-label/
    description: 'Show the status of an issue or pull request.',
    bestPractices: [
      {
        // Source: https://primer.style/product/components/state-label/accessibility/
        guidance: true,
        description: 'Use consistent wording so users can recognize the state at a glance.',
      },
    ],
    anatomy: [],
  },
})
