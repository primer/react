import React from 'react'
import {Meta} from '@storybook/react'

import {BaseStyles, ThemeProvider} from '..'
import DatePicker, {DatePickerProps} from '../DatePicker'
import {subDays, addYears} from 'date-fns'

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
  parameters: {
    controls: {expanded: true}
  },
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
    compressedHeader: {
      control: {
        type: 'boolean'
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
      description: 'Minimum date that can be selected',
      defaultValue: null,
      table: {
        defaultValue: null
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
DefaultDatePicker.args = {
  view: '1-month'
}

export const MultiDatePicker = (args: DatePickerProps) => <DatePicker {...args} />
MultiDatePicker.args = {
  minDate: subDays(new Date(), 7),
  maxDate: addYears(new Date(), 1),
  maxRangeSize: {control: false},
  placeholder: 'Choose Dates',
  view: '1-month',
  variant: 'multi'
}

export const DateRangePicker = (args: DatePickerProps) => <DatePicker {...args} />
DateRangePicker.args = {
  placeholder: 'Choose Range',
  view: '2-month',
  variant: 'range'
}

export const InputDatePicker = (args: DatePickerProps) => <DatePicker {...args} />
InputDatePicker.args = {
  anchorVariant: 'input',
  dateFormat: 'long',
  iconPlacement: 'end',
  view: '1-month',
  variant: 'single'
}

export const ConfirmationDatePicker = (args: DatePickerProps) => <DatePicker {...args} />
ConfirmationDatePicker.args = {
  anchorVariant: 'icon-only',
  compressedHeader: true,
  confirmation: true,
  confirmUnsavedClose: true,
  maxSelections: 5,
  minDate: subDays(new Date(), 15),
  variant: 'multi',
  view: '1-month'
}

export const DisabledWeekendsPicker = (args: DatePickerProps) => <DatePicker {...args} />
DisabledWeekendsPicker.args = {
  disableWeekends: true,
  maxRangeSize: 21,
  placeholder: 'Choose Range',
  view: '2-month',
  variant: 'range'
}

export const StartDayPicker = (args: DatePickerProps) => <DatePicker {...args} />
StartDayPicker.args = {
  view: '1-month',
  weekStartsOn: 'Wednesday'
}
