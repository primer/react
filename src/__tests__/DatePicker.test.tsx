import {cleanup, render, screen} from '@testing-library/react'
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
  DatePickerProps
} from '../DatePicker'
import {format, nextSaturday} from 'date-fns'
import {act} from 'react-dom/test-utils'
expect.extend(toHaveNoViolations)

function SimpleDatePicker(props: DatePickerProps): JSX.Element {
  return (
    <ThemeProvider theme={theme}>
      <BaseStyles>
        <DatePicker {...props} />
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
    DatePickerPanel
  })

  it('should have no axe violations', async () => {
    const {container} = render(<SimpleDatePicker />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })

  describe('props', () => {
    describe('Anchor Variant', () => {
      it('should render as a button by default', async () => {
        render(<SimpleDatePicker />)

        const buttonComponent = screen.getByTestId('anchor-button')
        expect(screen.queryByTestId('anchor-input')).toBeNull()
        expect(buttonComponent.querySelector('span')).toBeDefined()
        expect(buttonComponent.querySelector('svg')).toBeDefined()
      })
      it('should render as a button', () => {
        render(<SimpleDatePicker anchorVariant="button" />)

        const buttonComponent = screen.getByTestId('anchor-button')
        expect(screen.queryByTestId('anchor-input')).toBeNull()
        expect(buttonComponent.querySelector('span')).toBeDefined()
        expect(buttonComponent.querySelector('svg')).toBeDefined()
      })
      it('should render as a button with only an icon', () => {
        render(<SimpleDatePicker anchorVariant="icon-only" />)

        const buttonComponent = screen.getByTestId('anchor-button')
        expect(screen.queryByTestId('anchor-input')).toBeNull()
        expect(buttonComponent.querySelector('span')).toBeNull()
        expect(buttonComponent.querySelector('svg')).toBeDefined()
      })
      it('should render as an input', () => {
        render(<SimpleDatePicker anchorVariant="input" />)

        expect(screen.queryByTestId('anchor-button')).toBeNull()
        const inputComponent = screen.getByTestId('anchor-input')
        expect(inputComponent).toBeDefined()
      })
      it('should render a custom anchor', () => {
        render(<SimpleDatePicker renderAnchor={() => <button data-testId="custom-anchor" />} />)

        expect(screen.queryByTestId('anchor-button')).toBeNull()
        expect(screen.queryByTestId('anchor-input')).toBeNull()
        const customComponent = screen.getByTestId('custom-anchor')
        expect(customComponent).toBeDefined()
      })
    })
    describe('Confirmation', () => {
      it('should not require confirmation by default', async () => {
        render(<SimpleDatePicker />)

        expect(screen.queryByTestId('datepicker-apply')).toBeNull()
      })
      it('should not require confirmation when false', async () => {
        render(<SimpleDatePicker confirmation={false} />)

        expect(screen.queryByTestId('datepicker-apply')).toBeNull()
      })
      it('should require confirmation when true', async () => {
        render(<SimpleDatePicker confirmation={true} />)

        const button = screen.getByTestId('anchor-button')
        await button.click()

        const applyButton = screen.getByTestId('datepicker-apply')
        expect(applyButton).toBeDefined()
      })
    })
    describe('Confirm Unsaved Changes', () => {
      it('should not show modal by default', async () => {
        render(<SimpleDatePicker />)

        act(async () => {
          const button = screen.getByTestId('anchor-button')
          await button.click()
          const today = format(new Date(), 'MM/dd/yyyy')
          const todayElem = screen.getByTestId(`day-${today}`)
          await todayElem.click()
          await button.click()
        })

        expect(screen.queryByText('Save Changes?')).toBeNull()
      })
      it('should not show modal when false', async () => {
        render(<SimpleDatePicker confirmUnsavedClose={false} />)

        act(async () => {
          const button = screen.getByTestId('anchor-button')
          await button.click()
          const today = format(new Date(), 'MM/dd/yyyy')
          const todayElem = screen.getByTestId(`day-${today}`)
          await todayElem.click()
          await button.click()
        })

        expect(screen.queryByText('Save Changes?')).toBeNull()
      })
      it('should show modal when true', async () => {
        render(<SimpleDatePicker confirmUnsavedClose={true} />)

        const button = screen.getByTestId('anchor-button')
        await button.click()
        const today = format(new Date(), 'MM/dd/yyyy')
        const todayElem = screen.getByTestId(`day-${today}`)
        await todayElem.click()
        await button.click()

        expect(screen.getByRole('alertdialog')).toBeDefined()
      })
    })
    describe('Compressed Header', () => {
      it('should not show compressed header by default', async () => {
        render(<SimpleDatePicker />)

        act(async () => {
          const button = screen.getByTestId('anchor-button')
          await button.click()
        })

        expect(screen.queryByTestId('datepicker-compressed-header')).toBeNull()
      })
      it('should not show compressed header when false', async () => {
        render(<SimpleDatePicker compressedHeader={false} />)

        act(async () => {
          const button = screen.getByTestId('anchor-button')
          await button.click()
        })

        expect(screen.queryByText('datepicker-compressed-header')).toBeNull()
      })
      it('should show compressed header when true', async () => {
        render(<SimpleDatePicker compressedHeader={true} />)

        const button = screen.getByTestId('anchor-button')
        await button.click()

        const compressedHeader = screen.getByTestId('datepicker-compressed-header')
        expect(compressedHeader).toBeDefined()
      })
    })
    describe('Date Format', () => {
      it('should show short format by default', async () => {
        const today = new Date()
        render(<SimpleDatePicker value={today} />)

        const button = screen.getByTestId('anchor-button')
        expect(button.textContent).toEqual(format(today, 'MMM d'))
      })
      it('should show short format when specified', async () => {
        const today = new Date()
        render(<SimpleDatePicker value={today} dateFormat="short" />)

        const button = screen.getByTestId('anchor-button')
        expect(button.textContent).toEqual(format(today, 'MMM d'))
      })
      it('should show long format when specified', async () => {
        const today = new Date()
        render(<SimpleDatePicker value={today} dateFormat="long" />)

        const button = screen.getByTestId('anchor-button')
        expect(button.textContent).toEqual(format(today, 'MMM d, yyyy'))
      })
      it('should show custom format when specified', async () => {
        const today = new Date()
        render(<SimpleDatePicker value={today} dateFormat="d.MMM.yyyy" />)

        const button = screen.getByTestId('anchor-button')
        expect(button.textContent).toEqual(format(today, 'd.MMM.yyyy'))
      })
    })
    describe('Disable Weekends', () => {
      it('should enable weekends by default', async () => {
        const today = new Date()
        render(<SimpleDatePicker />)

        const button = screen.getByTestId('anchor-button')
        await button.click()

        const saturday = format(nextSaturday(today), 'MM/dd/yyyy')
        const saturdayElem = screen.getByTestId(`day-${saturday}`)

        expect(saturdayElem.attributes.getNamedItem('disabled')).toBeFalsy()
      })
      it('should enable weekends when false', async () => {
        const today = new Date()
        render(<SimpleDatePicker disableWeekends={false} />)

        const button = screen.getByTestId('anchor-button')
        await button.click()

        const saturday = format(nextSaturday(today), 'MM/dd/yyyy')
        const saturdayElem = screen.getByTestId(`day-${saturday}`)

        expect(saturdayElem.attributes.getNamedItem('disabled')).toBeFalsy()
      })
      it('should disable weekends when true', async () => {
        const today = new Date()
        render(<SimpleDatePicker disableWeekends={true} />)

        const button = screen.getByTestId('anchor-button')
        await button.click()

        const saturday = format(nextSaturday(today), 'MM/dd/yyyy')
        const saturdayElem = screen.getByTestId(`day-${saturday}`)

        expect(saturdayElem.attributes.getNamedItem('disabled')).toBeTruthy()
      })
    })
    describe('Icon Placement', () => {
      it('should show icon on the left by default', async () => {
        render(<SimpleDatePicker />)

        const button = screen.getByTestId('anchor-button')
        expect(button.childElementCount).toEqual(2)
        expect(button.childNodes[0].nodeName).toEqual('svg')
        expect(button.childNodes[1].nodeName.toLowerCase()).toEqual('span')
      })
      it('should show icon on the left when set to start', async () => {
        render(<SimpleDatePicker iconPlacement="start" />)

        const button = screen.getByTestId('anchor-button')
        expect(button.childElementCount).toEqual(2)
        expect(button.childNodes[0].nodeName).toEqual('svg')
        expect(button.childNodes[1].nodeName.toLowerCase()).toEqual('span')
      })
      it('should show icon on the right when set to end', async () => {
        render(<SimpleDatePicker iconPlacement="end" />)

        const button = screen.getByTestId('anchor-button')
        expect(button.childElementCount).toEqual(2)
        expect(button.childNodes[0].nodeName.toLowerCase()).toEqual('span')
        expect(button.childNodes[1].nodeName).toEqual('svg')
      })
      it('should not show icon when set to none', async () => {
        render(<SimpleDatePicker iconPlacement="none" />)

        const button = screen.getByTestId('anchor-button')
        expect(button.childElementCount).toEqual(1)
        expect(button.childNodes[0].nodeName.toLowerCase()).toEqual('span')
      })
    })
    describe('Max Date', () => {
      it('should disable dates after max date', async () => {
        render(<SimpleDatePicker />)
        // TODO
      })
      it('should not allow navigtion after max date', async () => {
        render(<SimpleDatePicker />)
        // TODO
      })
    })
    describe('Min Date', () => {
      it('should disable dates before min date', async () => {
        render(<SimpleDatePicker />)
        // TODO
      })
      it('should not allow navigtion before min date', async () => {
        render(<SimpleDatePicker />)
        // TODO
      })
    })
    describe('Placeholder', () => {
      it('should show the default placeholder by default', async () => {
        render(<SimpleDatePicker />)
        const button = screen.getByTestId('anchor-button')
        expect(button.textContent).toEqual('Choose Date...')
      })
      it('should show placeholder specified', async () => {
        render(<SimpleDatePicker placeholder="Pick a date" />)
        const button = screen.getByTestId('anchor-button')
        expect(button.textContent).toEqual('Pick a date')
      })
    })
    describe('Value', () => {
      it('should not select date when value is not provided', async () => {
        render(<SimpleDatePicker />)
        // TODO
      })
      it('should select date when value is provided', async () => {
        render(<SimpleDatePicker />)
        // TODO
      })
    })
    describe('Variant', () => {
      it('should be a single-select by defailt', async () => {
        render(<SimpleDatePicker />)
        // TODO
      })
      it('should be a single-select when set to single', async () => {
        render(<SimpleDatePicker variant="single" />)
        // TODO
      })
      it('should be a multi-select when set to multi', async () => {
        render(<SimpleDatePicker variant="multi" />)
        // TODO
      })
      it('should be a range-select when set to range', async () => {
        render(<SimpleDatePicker variant="range" />)
        // TODO
      })
    })
    describe('View', () => {
      it('should be single-month view by default', async () => {
        render(<SimpleDatePicker />)
        // TODO
      })
      it('should be 1-month view when set to 1-month', async () => {
        render(<SimpleDatePicker view="1-month" />)
        // TODO
      })
      it('should be 2-month when set to 2-month', async () => {
        render(<SimpleDatePicker view="2-month" />)
        // TODO
      })
      it("should be 1-month view when viewport can't support 2-month view", async () => {
        render(<SimpleDatePicker view="2-month" />)
        // TODO
      })
    })
    describe('Week Starts On', () => {
      it('should start on Sunday by default', async () => {
        render(<SimpleDatePicker />)
        // TODO
      })
      it('should start on Wednesday when specified', async () => {
        render(<SimpleDatePicker weekStartsOn="Wednesday" />)
        // TODO
      })
    })
  })
})
