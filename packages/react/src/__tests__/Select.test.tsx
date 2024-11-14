import React from 'react'
import {Select} from '..'
import {render} from '@testing-library/react'
import {FeatureFlags} from '../FeatureFlags'
import userEvent from '@testing-library/user-event'

describe('Select', () => {
  it('should support `className` on the outermost element', () => {
    const Element = () => (
      <>
        <label htmlFor="default">Choice</label>
        <Select id="default" data-testid="select-default" className={'test-class-name'}>
          <Select.Option value="one">Choice one</Select.Option>
          <Select.Option value="two">Choice two</Select.Option>
          <Select.Option value="three">Choice three</Select.Option>
          <Select.Option value="four">Choice four</Select.Option>
          <Select.Option value="five">Choice five</Select.Option>
          <Select.Option value="six">Choice six</Select.Option>
        </Select>
      </>
    )
    const FeatureFlagElement = () => {
      return (
        <FeatureFlags
          flags={{
            primer_react_css_modules_team: true,
            primer_react_css_modules_staff: true,
            primer_react_css_modules_ga: true,
          }}
        >
          <Element />
        </FeatureFlags>
      )
    }
    expect(render(<Element />).getAllByTestId('select-default')[0]).toHaveClass('test-class-name')
    expect(render(<FeatureFlagElement />).getAllByTestId('select-default')[0]).toHaveClass('test-class-name')
  })

  it('renders a select input', () => {
    const {getByLabelText} = render(
      <>
        <label htmlFor="default">Choice</label>
        <Select id="default">
          <Select.Option value="one">Choice one</Select.Option>
          <Select.Option value="two">Choice two</Select.Option>
          <Select.Option value="three">Choice three</Select.Option>
          <Select.Option value="four">Choice four</Select.Option>
          <Select.Option value="five">Choice five</Select.Option>
          <Select.Option value="six">Choice six</Select.Option>
        </Select>
      </>,
    )

    const select = getByLabelText('Choice')

    expect(select).toBeDefined()
  })

  it('renders a select input with grouped options', () => {
    const {getByLabelText} = render(
      <>
        <label htmlFor="grouped">Choice</label>
        <Select id="grouped">
          <Select.OptGroup label="Group one">
            <Select.Option value="one">Choice one</Select.Option>
            <Select.Option value="two">Choice two</Select.Option>
            <Select.Option value="three">Choice three</Select.Option>
          </Select.OptGroup>
          <Select.OptGroup label="Group two">
            <Select.Option value="four">Choice four</Select.Option>
            <Select.Option value="five">Choice five</Select.Option>
            <Select.Option value="six">Choice six</Select.Option>
          </Select.OptGroup>
        </Select>
      </>,
    )

    const select = getByLabelText('Choice')

    expect(select.querySelectorAll('optgroup')).toHaveLength(2)
  })

  it('renders a select input with a placeholder', () => {
    const {getByText, getByLabelText} = render(
      <>
        <label htmlFor="placeholder">Choice</label>
        <Select id="placeholder" placeholder="Pick a choice">
          <Select.Option value="one">Choice one</Select.Option>
          <Select.Option value="two">Choice two</Select.Option>
          <Select.Option value="three">Choice three</Select.Option>
          <Select.Option value="four">Choice four</Select.Option>
          <Select.Option value="five">Choice five</Select.Option>
          <Select.Option value="six">Choice six</Select.Option>
        </Select>
      </>,
    )

    const placeholderOption = getByText('Pick a choice')
    const select = getByLabelText('Choice')

    expect(select).not.toHaveAttribute('required')

    expect(placeholderOption).toBeDefined()
    expect(placeholderOption.tagName.toLowerCase()).toBe('option')
    // @ts-expect-error Property 'selected' does not exist on type 'HTMLElement'
    expect(placeholderOption.selected).not.toBeNull()
    expect(placeholderOption).not.toHaveAttribute('disabled')
    expect(placeholderOption).not.toHaveAttribute('hidden')
  })

  it('renders a required select input with a placeholder', () => {
    const {getByText, getByLabelText} = render(
      <>
        <label htmlFor="reqWithPlaceholder">Choice</label>
        <Select id="reqWithPlaceholder" placeholder="Pick a choice" required>
          <Select.Option value="one">Choice one</Select.Option>
          <Select.Option value="two">Choice two</Select.Option>
          <Select.Option value="three">Choice three</Select.Option>
          <Select.Option value="four">Choice four</Select.Option>
          <Select.Option value="five">Choice five</Select.Option>
          <Select.Option value="six">Choice six</Select.Option>
        </Select>
      </>,
    )

    const placeholderOption = getByText('Pick a choice')
    const select = getByLabelText('Choice')

    expect(select).toHaveAttribute('required')

    expect(placeholderOption).toBeDefined()
    expect(placeholderOption.tagName.toLowerCase()).toBe('option')
    // @ts-expect-error Property 'selected' does not exist on type 'HTMLElement'
    expect(placeholderOption.selected).not.toBeNull()
    expect(placeholderOption).toHaveAttribute('disabled')
    expect(placeholderOption).toHaveAttribute('hidden')
  })

  it('renders a disabled select input', () => {
    const {getByLabelText} = render(
      <>
        <label htmlFor="disabled">Choice</label>
        <Select id="disabled" disabled>
          <Select.Option value="one">Choice one</Select.Option>
          <Select.Option value="two">Choice two</Select.Option>
          <Select.Option value="three">Choice three</Select.Option>
          <Select.Option value="four">Choice four</Select.Option>
          <Select.Option value="five">Choice five</Select.Option>
          <Select.Option value="six">Choice six</Select.Option>
        </Select>
      </>,
    )

    const select = getByLabelText('Choice')

    expect(select).toHaveAttribute('disabled')
    expect(select).toHaveAttribute('disabled')
  })

  it('trigger changes event when option selected', async () => {
    const {getByLabelText} = render(
      <>
        <label htmlFor="default">Choice</label>
        <Select
          id="default"
          onChange={e => {
            expect(e.currentTarget.value).toBe('one')
          }}
        >
          <Select.Option value="one">Choice one</Select.Option>
          <Select.Option value="two">Choice two</Select.Option>
          <Select.Option value="three">Choice three</Select.Option>
          <Select.Option value="four">Choice four</Select.Option>
          <Select.Option value="five">Choice five</Select.Option>
          <Select.Option value="six">Choice six</Select.Option>
        </Select>
      </>,
    )

    const select = getByLabelText('Choice')

    expect(select).toBeDefined()

    await userEvent.selectOptions(select, 'one')
  })
})
