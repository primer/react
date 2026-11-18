import {defineComponent} from '../docs/components'

export default defineComponent({
  name: 'Timeline',
  displayName: 'Timeline',
  status: 'stable',
  keywords: [],
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
      type: "boolean | 'start' | 'end' | 'both'",
      description:
        'Clips the line before the first item, after the last item, or at both ends. `true` clips both ends.',
      required: false,
    },
    {name: 'className', type: 'string', description: '', required: false},
  ],
  subcomponents: [
    {
      name: 'Timeline.Item',
      displayName: 'Timeline.Item',
      props: [
        {
          name: 'condensed',
          type: 'boolean',
          description: 'Reduces vertical padding and removes the badge background.',
          required: false,
        },
        {name: 'className', type: 'string', description: '', required: false},
      ],
    },
    {
      name: 'Timeline.Badge',
      displayName: 'Timeline.Badge',
      props: [
        {
          name: 'variant',
          type: "'accent' | 'success' | 'attention' | 'severe' | 'danger' | 'done' | 'open' | 'closed' | 'sponsors'",
          description: 'Color variant of the badge.',
          required: false,
        },
        {name: 'children', type: 'React.ReactNode', description: '', required: false},
        {name: 'className', type: 'string', description: '', required: false},
      ],
    },
    {
      name: 'Timeline.Body',
      displayName: 'Timeline.Body',
      props: [
        {
          name: 'className',
          type: 'string',
          description: 'Class name for custom styling.',
          required: false,
        },
      ],
    },
    {
      name: 'Timeline.Break',
      displayName: 'Timeline.Break',
      props: [
        {
          name: 'className',
          type: 'string',
          description: 'Class name for custom styling.',
          required: false,
        },
      ],
    },
    {
      name: 'Timeline.Actions',
      displayName: 'Timeline.Actions',
      props: [
        {
          name: 'className',
          type: 'string',
          description: 'Class name for custom styling.',
          required: false,
        },
      ],
    },
    {
      name: 'Timeline.Avatar',
      displayName: 'Timeline.Avatar',
      props: [
        {
          name: 'className',
          type: 'string',
          description: 'Class name for custom styling.',
          required: false,
        },
      ],
    },
  ],
  usage: {
    // Source: https://primer.style/product/components/timeline/
    description: 'Display related items connected along a vertical timeline.',
    bestPractices: [
      {
        // Source: https://primer.style/product/components/timeline/
        guidance: true,
        description: 'Keep Timeline.Item and Timeline.Break directly inside Timeline, without DOM wrappers.',
      },
    ],
    anatomy: [],
  },
})
