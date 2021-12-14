import React from 'react'
import {Select} from '..'
import {render} from '@testing-library/react'
import {toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
import '@testing-library/jest-dom'

expect.extend(toHaveNoViolations)

describe('Radio', () => {
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
      </>
    )

    const select = getByLabelText('Choice')

    expect(select).toBeDefined()
  })

  it('renders a select input with grouped options', () => {
    const {getByLabelText} = render(
      <>
        <label htmlFor="grouped">Choice</label>
        <Select id="grouped">
          <Select.Group label="Group one">
            <Select.Option value="one">Choice one</Select.Option>
            <Select.Option value="two">Choice two</Select.Option>
            <Select.Option value="three">Choice three</Select.Option>
          </Select.Group>
          <Select.Group label="Group two">
            <Select.Option value="four">Choice four</Select.Option>
            <Select.Option value="five">Choice five</Select.Option>
            <Select.Option value="six">Choice six</Select.Option>
          </Select.Group>
        </Select>
      </>
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
      </>
    )

    const placeholderOption = getByText('Pick a choice')
    const select = getByLabelText('Choice')

    expect(select.getAttribute('aria-required')).toBeFalsy()

    expect(placeholderOption).toBeDefined()
    expect(placeholderOption.tagName.toLowerCase()).toBe('option')
    /* @ts-ignore - `.selected` will exist if placeholderOption is an <option> element */
    expect(placeholderOption.selected).not.toBeNull()
    expect(placeholderOption.getAttribute('disabled')).toBeNull()
    expect(placeholderOption.getAttribute('hidden')).toBeNull()
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
      </>
    )

    const placeholderOption = getByText('Pick a choice')
    const select = getByLabelText('Choice')

    expect(select.getAttribute('aria-required')).toBeTruthy()

    expect(placeholderOption).toBeDefined()
    expect(placeholderOption.tagName.toLowerCase()).toBe('option')
    /* @ts-ignore - `.selected` will exist if placeholderOption is an <option> element */
    expect(placeholderOption.selected).not.toBeNull()
    expect(placeholderOption.getAttribute('disabled')).not.toBeNull()
    expect(placeholderOption.getAttribute('hidden')).not.toBeNull()
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
      </>
    )

    const select = getByLabelText('Choice')

    expect(select.getAttribute('aria-disabled')).toBeTruthy()
    expect(select.getAttribute('disabled')).toBeDefined()
  })
})
