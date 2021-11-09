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
      description: 'Variant of the anchor component that launches the date picker',
      defaultValue: 'button',
      table: {
        defaultValue: {
          summary: 'button'
        }
      },
      control: {
        type: 'select',
        options: ['button', 'icon-only', 'input']
      }
    },
    compressedHeader: {
      description: 'Whether to show month and year picker in the top of the Date Picker',
      defaultValue: false,
      table: {
        defaultValue: {
          summary: false
        }
      },
      control: {
        type: 'boolean'
      }
    },
    confirmation: {
      description: 'If true, the Apply button needs to be clicked before selections are saved',
      defaultValue: false,
      table: {
        defaultValue: {
          summary: false
        }
      },
      control: {
        type: 'boolean'
      }
    },
    confirmUnsavedClose: {
      description: 'If true, will show a modal confirmation when user attempts to close without saving',
      defaultValue: false,
      table: {
        defaultValue: {
          summary: false
        }
      },
      control: {
        type: 'boolean'
      }
    },
    dateFormat: {
      description: 'The format of the date shown in the anchor',
      defaultValue: 'short',
      table: {
        defaultValue: {
          summary: 'short'
        }
      },
      control: {
        type: 'select',
        options: ['short', 'long']
      }
    },
    disableWeekends: {
      description: 'If true, will show but disable selection on weekends',
      defaultValue: false,
      table: {
        defaultValue: {
          summary: false
        }
      },
      control: {
        type: 'boolean'
      }
    },
    iconPlacement: {
      description: 'Where to show the calendar icon',
      defaultValue: 'start',
      table: {
        defaultValue: {
          summary: 'start'
        }
      },
      control: {
        type: 'select',
        options: ['start', 'end', 'none']
      }
    },
    maxDate: {
      description: 'The maximum selectable and browsable date',
      defaultValue: undefined,
      table: {
        defaultValue: {
          summary: 'null'
        }
      },
      control: {
        type: 'date'
      }
    },
    maxRangeSize: {
      description: 'In Range mode, the maximum size of a range selection',
      defaultValue: undefined,
      table: {
        defaultValue: {
          summary: 'null'
        }
      },
      control: {
        type: 'number'
      }
    },
    maxSelections: {
      description: 'In Multiselect mode, the maximum number of selections that can be made',
      defaultValue: undefined,
      table: {
        defaultValue: {
          summary: 'null'
        }
      },
      control: {
        type: 'number'
      }
    },
    minDate: {
      description: 'Minimum date that can be selected',
      defaultValue: undefined,
      table: {
        defaultValue: {
          summary: 'null'
        }
      },
      control: {
        type: 'date'
      }
    },
    onOpen: {
      table: {
        disable: true
      },
      control: 'none'
    },
    onClose: {
      table: {
        disable: true
      },
      control: 'none'
    },
    open: {
      description: 'Explicit control of whether the date picker is open',
      defaultValue: undefined,
      table: {
        defaultValue: {
          summary: 'null'
        }
      },
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
      description: 'The placeholder shown when no selection has been made',
      defaultValue: undefined,
      table: {
        defaultValue: {
          summary: 'Choose a date...'
        }
      },
      control: 'text'
    },
    value: {
      description: 'The selected value of the date picker',
      defaultValue: undefined,
      table: {
        defaultValue: {
          summary: 'null'
        }
      },
      control: 'date'
    },
    variant: {
      description: 'The type of selection allowed',
      defaultValue: undefined,
      table: {
        defaultValue: {
          summary: 'single'
        }
      },
      control: {
        type: 'select',
        options: ['single', 'multi', 'range']
      }
    },
    view: {
      description: 'The calendar viewing mode',
      defaultValue: undefined,
      table: {
        defaultValue: {
          summary: '1-month'
        }
      },
      control: {
        type: 'select',
        options: ['1-month', '2-month']
      }
    },
    weekStartsOn: {
      description: 'Date of the week that the calendar should start on',
      defaultValue: undefined,
      table: {
        defaultValue: {
          summary: 'Sunday'
        }
      },
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
