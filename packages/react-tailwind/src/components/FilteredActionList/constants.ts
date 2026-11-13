export type FilteredActionListLoadingType = 'body-spinner' | 'body-skeleton' | 'input'

export const FilteredActionListLoadingTypes = {
  bodySpinner: 'body-spinner',
  bodySkeleton: 'body-skeleton',
  input: 'input',
} as const satisfies Record<string, FilteredActionListLoadingType>
