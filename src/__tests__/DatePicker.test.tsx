import {cleanup, render as HTMLRender} from '@testing-library/react'
import 'babel-polyfill'
import {axe, toHaveNoViolations} from 'jest-axe'
import React from 'react'
import theme from '../theme'
import {behavesAsComponent, checkExports} from '../utils/testing'
import {BaseStyles, ThemeProvider} from '..'
import DatePicker, {
  DatePickerAnchor,
  DatePickerProvider,
  useDatePicker,
  Month,
  Day,
  DatePickerPanel,
  DatePickerProps,
  DatePickerConfiguration,
  DatePickerContext
} from '../DatePicker'
expect.extend(toHaveNoViolations)

function SimpleDatePicker(): JSX.Element {
  return (
    <ThemeProvider theme={theme}>
      <BaseStyles>
        <DatePicker />
      </BaseStyles>
    </ThemeProvider>
  )
}

describe('DatePicker', () => {
  behavesAsComponent({
    Component: DatePicker,
    options: {skipAs: true, skipSx: true},
    toRender: () => <DatePicker />
  })

  checkExports('DatePicker', {
    default: DatePicker,
    DatePickerAnchor,
    DatePickerProvider,
    useDatePicker,
    Month,
    Day,
    DatePickerPanel,
    DatePickerProps,
    DatePickerConfiguration,
    DatePickerContext
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<SimpleDatePicker />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })
})
