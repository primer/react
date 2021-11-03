import React from 'react'
import {Meta} from '@storybook/react'

import {BaseStyles, ThemeProvider} from '..'
import {DatePicker, DatePickerProps} from '../DatePicker'
import {addDays} from 'date-fns'

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

export const MultiDatePicker = (args: DatePickerProps) => <DatePicker {...args} />
MultiDatePicker.args = {
  maxRangeSize: {control: false},
  variant: 'multi'
}

export const DateRangePicker = (args: DatePickerProps) => <DatePicker {...args} />
DateRangePicker.args = {
  maxRangeSize: 21,
  variant: 'range',
  value: {from: new Date(), to: addDays(new Date(), 4)}
}

export const InputDatePicker = (args: DatePickerProps) => <DatePicker {...args} />
InputDatePicker.args = {
  anchorVariant: 'input',
  iconPlacement: 'start',
  variant: 'single'
}
