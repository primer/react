import {eachDayOfInterval, format, isBefore} from 'date-fns'
import {AnchorVariant, isMultiSelection, isRangeSelection, Selection, UnsanitizedSelection} from './types'
import {sanitizeDate} from './utils'

const INVALID_DATE = 'Invalid Date'
const DATE_REGEX = new RegExp(
  /(\d{1,2}[-/.]\d{1,2}[-/.](?:\d{2}){1,2})(?:\s?-\s?)?(\d{1,2}[-/.]\d{1,2}[-/.](?:\d{2}){1,2})?/g
)

const sanitizeDateString = (dateString: string) => {
  return dateString.replaceAll('.', '/').replaceAll('-', '/')
}

export const parseStringDate = (dateString: string, variant: SelectionVariant = 'single'): Selection => {
  const dateItems = dateString.matchAll(DATE_REGEX)
  const parsedDateItems: Array<Selection> = []
  // Determine Format
  for (const d of dateItems) {
    const tempD1 = new Date(sanitizeDateString(d[1]))
    const tempD2 = d[2] ? new Date(sanitizeDateString(d[2])) : null
    if (tempD2) {
      // Range
      if (tempD1.toString() !== INVALID_DATE && tempD2.toString() !== INVALID_DATE) {
        parsedDateItems.push(isBefore(tempD1, tempD2) ? {from: tempD1, to: tempD2} : {from: tempD2, to: tempD1})
      } else if (tempD1.toString() !== INVALID_DATE) {
        parsedDateItems.push(tempD1)
      } else if (tempD2.toString() !== INVALID_DATE) {
        parsedDateItems.push(tempD2)
      }
    } else {
      if (tempD1.toString() !== INVALID_DATE) {
        parsedDateItems.push(tempD1)
      }
    }
  }

  if (parsedDateItems.length === 0) {
    // No Valid Dates
    return null
  }

  // Cast Format based on variant
  switch (variant) {
    case 'single': {
      return parsedDateItems[0]
    }
    case 'multi': {
      const expandedParsedItems: Array<Date> = []
      for (const item of parsedDateItems) {
        if (isRangeSelection(item)) {
          if (item.to) {
            eachDayOfInterval({start: item.from, end: item.to}).map(d => expandedParsedItems.push(d))
          } else {
            expandedParsedItems.push(item.from)
          }
        } else {
          if (item) {
            if (Array.isArray(item)) {
              item.map(d => expandedParsedItems.push(d))
            } else {
              expandedParsedItems.push(item)
            }
          }
        }
      }
      return expandedParsedItems
    }
    case 'range': {
      return parsedDateItems.filter(d => isRangeSelection(d))[0]
    }
    default: {
      return parsedDateItems[0]
    }
  }
}

export const castToSelection = (
  selection?: UnsanitizedSelection,
  variant: SelectionVariant = 'single'
): Selection | undefined => {
  if (!selection) return

  if (variant === 'multi') {
    if (isMultiSelection(selection)) {
      const parsedSelection: Array<Date> = []
      for (const d of selection) {
        parsedSelection.push(sanitizeDate(d))
      }
      return parsedSelection.sort((a, b) => a.getTime() - b.getTime())
    } else if (selection instanceof Date || typeof selection === 'string') {
      return [sanitizeDate(selection)]
    } else if (isRangeSelection(selection)) {
      const parsedSelection: Array<Date> = []
      parsedSelection.push(sanitizeDate(selection.from))
      if (selection.to) {
        parsedSelection.push(sanitizeDate(selection.to))
      }
      return parsedSelection.sort((a, b) => a.getTime() - b.getTime())
    }
  } else if (variant === 'range') {
    if (isRangeSelection(selection)) {
      return {
        from: sanitizeDate(selection.from),
        to: selection.to ? sanitizeDate(selection.to) : null
      }
    } else if (isMultiSelection(selection)) {
      return {
        from: sanitizeDate(selection[0] || new Date()),
        to: selection[1] ? sanitizeDate(selection[1]) : null
      }
    } else if (selection instanceof Date) {
      return {
        from: sanitizeDate(selection),
        to: null
      }
    }
  } else {
    if (selection instanceof Date) {
      return sanitizeDate(selection)
    } else if (isMultiSelection(selection)) {
      return sanitizeDate(selection[0] || new Date())
    } else if (isRangeSelection(selection)) {
      return sanitizeDate(selection.from)
    } else {
      return
    }
  }
}

type FormatDateOptions = {
  selection?: Selection
  anchorVariant?: AnchorVariant
  dateFormat?: string
  placeholder?: string
  rawFormat?: boolean
  variant?: SelectionVariant
}

export const formatDate = ({
  selection,
  dateFormat = 'short',
  placeholder = 'Choose Date',
  rawFormat = false,
  variant = 'single'
}: FormatDateOptions) => {
  if (!selection) {
    if (rawFormat) return ''
    return placeholder
  }

  let template = 'MMM d'
  if (!rawFormat && dateFormat) {
    switch (dateFormat) {
      case 'short':
        template = 'MMM d'
        break
      case 'long':
        template = 'MMM d, yyyy'
        break
      default:
        template = dateFormat
        break
    }
  } else {
    template = 'MM/dd/yyyy'
  }

  switch (variant) {
    case 'single': {
      if (selection instanceof Date) {
        return format(selection, template)
      } else if (Array.isArray(selection)) {
        return format(selection[0], template)
      } else if (isRangeSelection(selection)) {
        return format(selection.from, template)
      } else {
        return 'Invalid Selection'
      }
    }
    case 'multi': {
      if (Array.isArray(selection)) {
        if (selection.length > 3 && !rawFormat) return `${selection.length} Selected`
        if (selection.length === 0 && !rawFormat) return placeholder
        const formatted = selection.map(d => format(d, template)).join(', ')
        return formatted
      } else if (selection instanceof Date) {
        return [selection].map(d => format(d, template)).join(', ')
      } else if (isRangeSelection(selection)) {
        return [selection.to, selection.from].map(d => (d ? format(d, template) : '')).join(', ')
      } else {
        return 'Invalid Selection'
      }
    }
    case 'range': {
      if (isRangeSelection(selection)) {
        return Object.entries(selection)
          .map(([_, date]) => (date ? format(date, template) : ''))
          .join(' - ')
      } else if (selection instanceof Date) {
        return Object.entries({from: selection, to: null})
          .map(([_, date]) => (date ? format(date, template) : ''))
          .join(' - ')
      } else if (Array.isArray(selection)) {
        return (
          Object.entries({from: selection[0], to: selection[1]})
            // to date can still be null
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            .map(([_, date]) => (date ? format(date, template) : ''))
            .join(' - ')
        )
      } else {
        return 'Invalid Selection'
      }
    }
    default: {
      return 'Invalid Configuration'
    }
  }
}
