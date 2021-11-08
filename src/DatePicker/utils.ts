import deepmerge from 'deepmerge'
import {DatePickerConfiguration, isMultiSelection, isRangeSelection, Selection} from './types'
import {defaultConfiguration} from './DatePickerProvider'

export const sanitizeDate = (date: Date | string) => new Date(new Date(date).toDateString())

export const getInitialFocusDate = (selection?: Selection) => {
  if (!selection) return sanitizeDate(new Date())

  if (selection instanceof Date) {
    return sanitizeDate(selection)
  } else if (isMultiSelection(selection)) {
    return sanitizeDate(selection[0])
  } else if (isRangeSelection(selection)) {
    return sanitizeDate(selection.from)
  } else {
    return sanitizeDate(new Date())
  }
}

export const initializeConfigurations = (externalConfig?: DatePickerConfiguration) => {
  let sanitizedConfig = {}
  if (externalConfig) {
    sanitizedConfig = Object.entries(externalConfig).filter(item => item[1] !== undefined && item[1] !== null)
    for (const item of sanitizedConfig) {
      if (item instanceof Date) {
        sanitizeDate(item)
      }
    }
  }
  return deepmerge(defaultConfiguration, sanitizedConfig)
}
