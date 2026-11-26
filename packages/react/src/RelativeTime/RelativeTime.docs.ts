import {defineComponent} from '../docs/components'

export default defineComponent({
  name: 'RelativeTime',
  displayName: 'RelativeTime',
  status: 'stable',
  keywords: [],
  stories: [
    'components-relativetime--default',
    'components-relativetime-features--micro-format',
    'components-relativetime-features--recent-time',
    'components-relativetime-features--count-down-timer',
  ],
  importPath: '@primer/react',
  props: [
    {
      name: 'datetime',
      type: 'string',
      description:
        'Timestamp as a string. Provide this or `date` to show a time; a nonempty `datetime` takes precedence.',
      required: false,
    },
    {
      name: 'date',
      type: 'Date | null',
      description: 'Timestamp as a Date object.',
      required: false,
    },
    {
      name: 'format',
      type: "'auto' | 'micro' | 'elapsed' | 'duration' | 'relative' | 'datetime'",
      description: 'Chooses the timestamp format. `auto`, `micro` and `elapsed` are legacy formats.',
      required: false,
      defaultValue: 'auto',
    },
    {
      name: 'tense',
      type: "'auto' | 'past' | 'future'",
      description: 'Controls whether to express a past or future time.',
      required: false,
      defaultValue: 'auto',
    },
    {
      name: 'precision',
      type: "'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second' | 'millisecond'",
      description:
        'Smallest unit to display. Defaults to `minute` in the legacy `micro` format and `second` otherwise.',
      required: false,
    },
    {
      name: 'threshold',
      type: 'string',
      description: 'ISO 8601 duration that determines when to switch from relative to absolute formatting.',
      required: false,
      defaultValue: 'P30D',
    },
    {
      name: 'prefix',
      type: 'string',
      description: 'Text before an absolute date. Defaults to empty in `datetime` format and `on` otherwise.',
      required: false,
    },
    {
      name: 'second',
      type: "'numeric' | '2-digit'",
      description: 'Format for seconds.',
      required: false,
    },
    {
      name: 'minute',
      type: "'numeric' | '2-digit'",
      description: 'Format for minutes.',
      required: false,
    },
    {
      name: 'hour',
      type: "'numeric' | '2-digit'",
      description: 'Format for hours.',
      required: false,
    },
    {
      name: 'weekday',
      type: "'short' | 'long' | 'narrow'",
      description: 'Format for the day of the week.',
      required: false,
    },
    {
      name: 'day',
      type: "'numeric' | '2-digit'",
      description: 'Format for the day of the month.',
      required: false,
    },
    {
      name: 'month',
      type: "'numeric' | '2-digit' | 'short' | 'long' | 'narrow'",
      description: 'Format for the month. Defaults to `formatStyle` for `datetime` and `short` otherwise.',
      required: false,
    },
    {
      name: 'year',
      type: "'numeric' | '2-digit'",
      description: 'Format for the year.',
      required: false,
    },
    {
      name: 'timeZoneName',
      type: "'long' | 'short' | 'shortOffset' | 'longOffset' | 'shortGeneric' | 'longGeneric'",
      description: 'Format for the time zone name.',
      required: false,
    },
    {
      name: 'noTitle',
      type: 'boolean',
      description: 'Suppresses the generated title tooltip.',
      required: false,
      defaultValue: 'false',
    },
    {
      name: 'onRelativeTimeUpdated',
      type: '((event: RelativeTimeUpdatedEvent) => void) | null',
      description: 'Called when the formatted text or title changes.',
      required: false,
    },
    {
      name: 'formatStyle',
      type: "'long' | 'short' | 'narrow'",
      description: 'Controls output detail. The default depends on `format`.',
      required: false,
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Fallback content before the custom element formats the timestamp.',
      required: false,
    },
  ],
  subcomponents: [],
  usage: {
    // Source: https://primer.style/product/components/relative-time/
    description: 'Display a localized timestamp or an elapsed time that updates as time passes.',
    bestPractices: [],
    anatomy: [],
  },
})
