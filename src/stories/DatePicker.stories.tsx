import React from 'react'
import {Meta} from '@storybook/react'

import {BaseStyles, ThemeProvider} from '..'
import {DatePicker, DatePickerProps} from '../DatePicker'
import {Day, DayProps} from '../DatePicker/Day'
import {Month, MonthProps} from '../DatePicker/Month'
import {DatePickerAnchor, DatePickerAnchorProps} from '../DatePicker/DatePickerAnchor'
import {addDays, addYears, subDays} from 'date-fns'

export default {
  title: 'Composite components/DatePicker',
  decorators: [
    Story => {
      return (
        <ThemeProvider>
          <BaseStyles>
            <div style={{display: 'flex'}}>
              <Story />
            </div>
          </BaseStyles>
        </ThemeProvider>
      )
    }
  ],
  argTypes: {
    as: {
      table: {
        disable: true
      }
    },
    theme: {
      table: {
        disable: true
      }
    },
    sx: {
      table: {
        disable: true
      }
    },
    anchorVariant: {
      control: {
        type: 'select',
        options: ['button', 'icon-only', 'input']
      }
    },
    confirmation: {
      control: {
        type: 'boolean'
      }
    },
    confirmUnsavedClose: {
      control: {
        type: 'boolean'
      }
    },
    dateFormat: {
      control: {
        type: 'select',
        options: ['short', 'long']
      }
    },
    disableWeekends: {
      control: {
        type: 'boolean'
      }
    },
    iconPlacement: {
      control: {
        type: 'select',
        options: ['start', 'end', 'none']
      }
    },
    maxDate: {
      control: {
        type: 'date'
      }
    },
    maxRangeSize: {
      control: {
        type: 'number'
      }
    },
    maxSelections: {
      control: {
        type: 'number'
      }
    },
    minDate: {
      name: 'Min Date',
      description: 'Minimum date to select',
      table: {
        type: {
          summary: 'something short',
          detail: 'something really really long'
        }
      },
      control: {
        type: 'date'
      }
    },
    onOpen: {
      control: 'none'
    },
    onClose: {
      control: 'none'
    },
    open: {
      control: {
        type: 'boolean'
      }
    },
    overlayProps: {
      table: {
        disable: true
      }
    },
    placeholder: {
      control: 'text'
    },
    value: {
      control: 'date'
    },
    variant: {
      control: {
        type: 'select',
        options: ['single', 'multi', 'range']
      }
    },
    view: {
      control: {
        type: 'select',
        options: ['1-month', '2-month']
      }
    },
    weekStartsOn: {
      control: {
        type: 'select',
        options: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      }
    }
  }
} as Meta

export const DefaultDatePicker = (args: DatePickerProps) => <DatePicker {...args} />
DefaultDatePicker.args = {}

export const InputDatePicker = (args: DatePickerProps) => <DatePicker {...args} />
InputDatePicker.args = {
  anchorVariant: 'input',
  confirmation: false,
  confirmUnsavedClose: false,
  compressedHeader: false,
  dateFormat: 'short',
  disableWeekends: false,
  iconPlacement: 'start',
  maxDate: addYears(new Date(), 1),
  maxSelections: 2,
  maxRangeSize: 21,
  minDate: subDays(new Date(), 4),
  placeholder: 'Select a date',
  showInputPrompt: true,
  variant: 'range',
  value: {from: new Date(), to: addDays(new Date(), 4)},
  view: '2-month',
  weekStartsOn: 'Sunday'
}

export const DatePickerAnchorControl = (args: DatePickerAnchorProps) => <DatePickerAnchor {...args} />
DatePickerAnchorControl.args = {
  iconOnly: false,
  fromDate: new Date(),
  toDate: addDays(new Date(), 7),
  dateFormat: 'short'
}

export const DayControl = (args: DayProps) => <Day {...args} />
DayControl.args = {date: new Date(), disabled: false, blocked: false, selected: false}

export const MonthControl = (args: MonthProps) => <Month {...args} />
MonthControl.args = {month: new Date().getMonth(), year: new Date().getFullYear()}
