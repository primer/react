import {describe, expect, it} from 'vitest'
import Select from '.'
import {render} from '@testing-library/react'
import {page, userEvent} from 'vitest/browser'
import {implementsClassName} from '../utils/testing'
import classes from './Select.module.css'

describe('Select', () => {
  implementsClassName(Select, classes.TextInputWrapper)
  implementsClassName(Select.Option)
  implementsClassName(Select.OptGroup)

  it('renders data-component attributes', async () => {
    render(
      <>
        <label htmlFor="grouped">Choice</label>
        <Select id="grouped">
          <Select.OptGroup label="Group one">
            <Select.Option value="one">Choice one</Select.Option>
          </Select.OptGroup>
        </Select>
      </>,
    )

    const select = page.getByLabelText('Choice')

    await expect.element(select).toHaveAttribute('data-component', 'Select')
    await expect
      .element(select.element().querySelector('optgroup'))
      .toHaveAttribute('data-component', 'Select.OptGroup')
    await expect.element(page.getByText('Choice one', {exact: true})).toHaveAttribute('data-component', 'Select.Option')
  })

  it('renders data-component on placeholder option', async () => {
    render(
      <>
        <label htmlFor="placeholder">Choice</label>
        <Select id="placeholder" placeholder="Pick a choice">
          <Select.Option value="one">Choice one</Select.Option>
        </Select>
      </>,
    )

    await expect
      .element(page.getByText('Pick a choice', {exact: true}))
      .toHaveAttribute('data-component', 'Select.Option')
  })

  it('renders a select input', async () => {
    render(
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

    const select = page.getByLabelText('Choice')

    await expect.element(select).toBeInTheDocument()
  })

  it('renders a select input with grouped options', () => {
    render(
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

    const select = page.getByLabelText('Choice')

    expect(select.element().querySelectorAll('optgroup')).toHaveLength(2)
  })

  it('renders a select input with a placeholder', async () => {
    render(
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

    const placeholderOption = page.getByText('Pick a choice', {exact: true})
    const select = page.getByLabelText('Choice')

    await expect.element(select).not.toHaveAttribute('required')

    await expect.element(placeholderOption).toBeInTheDocument()
    expect(placeholderOption.element().tagName.toLowerCase()).toBe('option')
    expect(select.element().querySelector<HTMLOptionElement>('option:checked')).not.toBeNull()
    await expect.element(placeholderOption).not.toHaveAttribute('disabled')
    await expect.element(placeholderOption).not.toHaveAttribute('hidden')
  })

  it('renders a required select input with a placeholder', async () => {
    render(
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

    const placeholderOption = page.getByText('Pick a choice', {exact: true})
    const select = page.getByLabelText('Choice')

    await expect.element(select).toHaveAttribute('required')

    await expect.element(placeholderOption).toBeInTheDocument()
    expect(placeholderOption.element().tagName.toLowerCase()).toBe('option')
    expect(select.element().querySelector<HTMLOptionElement>('option:checked')).not.toBeNull()
    await expect.element(placeholderOption).toHaveAttribute('disabled')
    await expect.element(placeholderOption).toHaveAttribute('hidden')
  })

  it('renders a disabled select input', async () => {
    render(
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

    const select = page.getByLabelText('Choice')

    await expect.element(select).toHaveAttribute('disabled')
    await expect.element(select).toHaveAttribute('disabled')
  })

  it('trigger changes event when option selected', async () => {
    render(
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

    const select = page.getByLabelText('Choice')

    await expect.element(select).toBeInTheDocument()

    await userEvent.selectOptions(select, 'one')
  })
})
