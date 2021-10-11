import React from 'react'
import {Meta} from '@storybook/react'

import {BaseStyles, ThemeProvider} from '..'
import {DatePicker, DatePickerProps} from '../DatePicker'
import {Day, DayProps} from '../DatePicker/Day'
import {Month, MonthProps} from '../DatePicker/Month'

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
    }
  }
} as Meta

export const defaultDatePicker = (args: DatePickerProps) => <DatePicker {...args} />

export const DayControl = (args: DayProps) => <Day {...args} />
DayControl.args = {day: 10, disabled: false, blockedOut: true, selected: true}

export const MonthControl = (args: MonthProps) => <Month {...args} />
MonthControl.args = {month: new Date().getMonth(), year: new Date().getFullYear()}
