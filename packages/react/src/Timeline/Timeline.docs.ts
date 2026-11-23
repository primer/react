import {defineComponent} from '../docs/component'

export default defineComponent({
  id: 'timeline',
  name: 'Timeline',
  status: 'alpha',
  a11yReviewed: '2025-01-08',
  stories: [
    'components-timeline--default',
    'components-timeline-features--clip-sidebar',
    'components-timeline-features--clip-sidebar-start',
    'components-timeline-features--clip-sidebar-end',
    'components-timeline-features--condensed-items',
    'components-timeline-features--timeline-break',
    'components-timeline-features--badge-variants',
    'components-timeline-features--with-inline-links',
    'components-timeline-features--with-actions',
    'components-timeline-features--with-avatar',
  ],
  importPath: '@primer/react',
  props: [
    {
      name: 'clipSidebar',
      type: "| boolean | 'start' | 'end' | 'both'",
      description:
        "Controls which ends of the sidebar are clipped. When set to `true` or `'both'`, hides the sidebar above the first and below the last Timeline.Item. Use `'start'` to only clip the top or `'end'` to only clip the bottom.",
      required: false,
    },
  ],
  subcomponents: [
    {
      name: 'Timeline.Item',
      props: [
        {
          name: 'condensed',
          type: 'boolean',
          description: "Reduces vertical padding and removes background from an item's badge.",
          required: false,
        },
      ],
      displayName: 'Item',
    },
    {
      name: 'Timeline.Badge',
      props: [
        {
          name: 'variant',
          type: "'accent' | 'success' | 'attention' | 'severe' | 'danger' | 'done' | 'open' | 'closed' | 'sponsors'",
          description: 'The color variant of the badge.',
          required: false,
        },
      ],
      displayName: 'Badge',
    },
    {name: 'Timeline.Body', props: [], displayName: 'Body'},
    {name: 'Timeline.Break', props: [], displayName: 'Break'},
    {name: 'Timeline.Actions', props: [], displayName: 'Actions'},
    {name: 'Timeline.Avatar', props: [], displayName: 'Avatar'},
  ],
})
