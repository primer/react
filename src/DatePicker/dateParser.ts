import {eachDayOfInterval, format, isBefore} from 'date-fns'
import {AnchorVariant, isRangeSelection, Selection, SelectionVariant} from './useDatePicker'

const INVALID_DATE = 'Invalid Date'
const DATE_REGEX = new RegExp(
  /(\d{1,2}[-/.]\d{1,2}[-/.](?:\d{2}){1,2})(?:\s?-\s?)?(\d{1,2}[-/.]\d{1,2}[-/.](?:\d{2}){1,2})?/g
)

const sanitizeDate = (dateString: string) => {
  return dateString.replaceAll('.', '/').replaceAll('-', '/')
}

export const parseDate = (dateString: string, variant: SelectionVariant = 'single'): Selection => {
  const dateItems = dateString.matchAll(DATE_REGEX)
  const parsedDateItems: Array<Selection> = []
  // Determine Format
  for (const d of dateItems) {
    const tempD1 = new Date(sanitizeDate(d[1]))
    const tempD2 = d[2] ? new Date(sanitizeDate(d[2])) : null
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
