import {cleanup, render, screen} from '@testing-library/react'
import {fireEvent} from '@testing-library/dom'
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
import {format} from 'date-fns'
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

        const button = screen.getByTestId('anchor-button')
        await button.click()
        const today = format(new Date(), 'MM/dd/yyyy')
        const todayElem = screen.getByTestId(`day-${today}`)
        await todayElem.click()
        await button.click()

        expect(screen.queryByText('Save Changes?')).toBeNull()
      })
      it('should not show modal when false', async () => {
        render(<SimpleDatePicker confirmUnsavedClose={false} />)

        const button = screen.getByTestId('anchor-button')
        await button.click()
        const today = format(new Date(), 'MM/dd/yyyy')
        const todayElem = screen.getByTestId(`day-${today}`)
        await todayElem.click()
        await button.click()

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

        const button = screen.getByTestId('anchor-button')
        await button.click()

        expect(screen.queryByTestId('datepicker-compressed-header')).toBeNull()
      })
      it('should not show compressed header when false', async () => {
        render(<SimpleDatePicker compressedHeader={false} />)

        const button = screen.getByTestId('anchor-button')
        await button.click()

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
  })
})
