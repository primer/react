export const TimelineBadgeVariants = [
  'accent',
  'success',
  'attention',
  'severe',
  'danger',
  'done',
  'open',
  'closed',
  'sponsors',
] as const
export type TimelineBadgeVariant = (typeof TimelineBadgeVariants)[number]
