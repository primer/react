// #region TYPES
export type AnchorVariant = 'input' | 'button' | 'icon-only'
export type DateFormat = 'short' | 'long' | string

export type SelectionVariant = 'single' | 'multi' | 'range'
export type Selection = Date | Array<Date> | RangeSelection | null
export type StringSelection = string | Array<string> | {to: string; from: string} | null
export type DayNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6
export type DaySelection = boolean | 'start' | 'middle' | 'end'
export type IconPlacement = 'start' | 'end' | 'none'

export type RangeSelection = {
  from: Date
  to: Date | null
}

export type StringRangeSelection = {
  from: string
  to: string
}

export type UnsanitizedSelection = Selection | StringSelection | null | undefined

export interface BaseDatePickerConfiguration {
  anchorVariant?: AnchorVariant
  confirmation?: boolean
  confirmUnsavedClose?: boolean
  compressedHeader?: boolean
  dateFormat?: DateFormat
  disableWeekends?: boolean
  iconPlacement?: IconPlacement
  maxDate?: Date | null
  minDate?: Date | null
  placeholder?: string
  variant?: SelectionVariant
  view?: '1-month' | '2-month'
  weekStartsOn?: 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'
}

type SingleDatePickerConfiguration = {
  variant?: 'single'
} & BaseDatePickerConfiguration

type MultiDatePickerConfiguration = {
  maxSelections?: number
  variant: 'multi'
} & BaseDatePickerConfiguration

type RangeDatePickerConfiguration = {
  maxRangeSize?: number
  variant: 'range'
} & BaseDatePickerConfiguration

export type DatePickerConfiguration =
  | SingleDatePickerConfiguration
  | MultiDatePickerConfiguration
  | RangeDatePickerConfiguration

export interface DatePickerContext {
  disabled?: boolean
  configuration: DatePickerConfiguration
  currentViewingDate: Date
  dialogOpen: boolean
  focusDate: Date
  formattedDate: string
  goToMonth: (date: Date) => void
  inputDate: string
  hoverRange?: RangeSelection | null
  nextMonth: () => void
  onClose: () => void
  onDateInput: (updatedSelection: Selection) => void
  onDayFocus: (date: Date) => void
  onSelection: (date: Date) => void
  previousMonth: () => void
  revertValue: () => void
  saveValue: (selection?: Selection) => void
  selection?: Selection
  selectionActive?: boolean
  setFocusDate: React.Dispatch<React.SetStateAction<Date>>
  setHoverRange: React.Dispatch<React.SetStateAction<RangeSelection | null>>
  softSelection?: Partial<RangeSelection> | null
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
  viewMode: '1-month' | '2-month'
}
// #endregion

// #region TYPE GUARDS
export function isSingleSelection(selection: Selection): selection is Date {
  return selection instanceof Date
}

export function isMultiSelection(selection: Selection | StringSelection): selection is Array<Date> | Array<string> {
  return Array.isArray(selection)
}

export function isRangeSelection(selection: Selection | StringSelection): selection is RangeSelection {
  return !!(selection as RangeSelection).from
}
// #endregion
