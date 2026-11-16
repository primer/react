import React from 'react'
import {cleanup, render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {FormControl} from '../FormControl'
import {Select} from './Select'

const choices = (
  <>
    <Select.Option value="one">Choice one</Select.Option>
    <Select.Option value="two">Choice two</Select.Option>
    <Select.Option value="three">Choice three</Select.Option>
  </>
)

afterEach(cleanup)

describe('Select', () => {
  it('renders a native select with options and groups', () => {
    render(
      <Select aria-label="Choice">
        <Select.OptGroup label="Group one">{choices}</Select.OptGroup>
      </Select>,
    )

    const select = screen.getByRole('combobox', {name: 'Choice'})
    expect(select).toHaveAttribute('data-component', 'Select')
    expect(select.querySelector('optgroup')).toHaveAttribute('data-component', 'Select.OptGroup')
    expect(screen.getByRole('option', {name: 'Choice one'})).toHaveAttribute('data-component', 'Select.Option')
  })

  it('uses an enabled placeholder option by default and hides a required placeholder', () => {
    const {rerender} = render(
      <Select aria-label="Choice" placeholder="No choice selected">
        {choices}
      </Select>,
    )

    const select = screen.getByRole('combobox', {name: 'Choice'})
    expect(select).toHaveValue('')
    expect(screen.getByRole('option', {name: 'No choice selected'})).not.toBeDisabled()

    rerender(
      <Select aria-label="Choice" placeholder="No choice selected" required>
        {choices}
      </Select>,
    )

    expect(select).toBeRequired()
    expect(screen.getByText('No choice selected')).toBeDisabled()
    expect(screen.getByText('No choice selected')).toHaveAttribute('hidden')
  })

  it('supports controlled and uncontrolled native changes', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const {rerender} = render(
      <Select aria-label="Choice" defaultValue="one" onChange={onChange}>
        {choices}
      </Select>,
    )

    await user.selectOptions(screen.getByRole('combobox', {name: 'Choice'}), 'two')
    expect(onChange).toHaveBeenCalledOnce()
    expect(screen.getByRole('combobox', {name: 'Choice'})).toHaveValue('two')

    rerender(
      <Select aria-label="Choice" value="one" onChange={onChange}>
        {choices}
      </Select>,
    )
    await user.selectOptions(screen.getByRole('combobox', {name: 'Choice'}), 'three')
    expect(screen.getByRole('combobox', {name: 'Choice'})).toHaveValue('one')
  })

  it('uses native keyboard focus', async () => {
    const user = userEvent.setup()
    render(<Select aria-label="Choice">{choices}</Select>)

    await user.tab()
    expect(screen.getByRole('combobox', {name: 'Choice'})).toHaveFocus()
  })

  it('preserves native multiple selection and form values', async () => {
    const user = userEvent.setup()
    render(
      <form>
        <Select aria-label="Choices" defaultValue={['one', 'three']} multiple name="choices">
          {choices}
        </Select>
      </form>,
    )

    const select = screen.getByRole('listbox', {name: 'Choices'})
    expect(select.parentElement).toHaveAttribute('data-multiple')
    expect(select.parentElement).toHaveClass('primer:data-[multiple]:h-auto', 'primer:data-[multiple]:overflow-visible')
    expect(select).toHaveValue(['one', 'three'])
    await user.selectOptions(select, 'two')
    expect(new FormData(select.closest('form')!).getAll('choices')).toEqual(['one', 'two', 'three'])
  })

  it('does not render a single-select placeholder in a multiple select', () => {
    render(
      <Select aria-label="Choices" multiple placeholder="Choose values">
        {choices}
      </Select>,
    )

    expect(screen.queryByRole('option', {name: 'Choose values'})).not.toBeInTheDocument()
  })

  it('forwards FormControl naming, descriptions, disabled state, and form name', () => {
    render(
      <form>
        <FormControl disabled id="repository" name="repository" required>
          <FormControl.Label>Repository</FormControl.Label>
          <Select>{choices}</Select>
          <FormControl.Caption>Choose the repository to clone.</FormControl.Caption>
        </FormControl>
      </form>,
    )

    const select = screen.getByRole('combobox', {name: 'Repository*'})
    expect(select).toBeDisabled()
    expect(select).toBeRequired()
    expect(select).toHaveAccessibleDescription('Choose the repository to clone.')
    expect(select).toHaveAttribute('name', 'repository')
  })

  it('styles validation, size, block, and disabled states without leaking custom props', () => {
    const {container} = render(
      <Select aria-label="Choice" block className="custom-select w-64" disabled size="large" validationStatus="error">
        {choices}
      </Select>,
    )

    const wrapper = container.firstElementChild
    const select = screen.getByRole('combobox', {name: 'Choice'})
    expect(wrapper).toHaveClass('custom-select', 'w-64')
    expect(wrapper).toHaveAttribute('data-block')
    expect(wrapper).not.toHaveAttribute('data-contrast')
    expect(wrapper).toHaveAttribute('data-disabled')
    expect(wrapper).toHaveAttribute('data-size', 'large')
    expect(wrapper).toHaveAttribute('data-validation', 'error')
    expect(select).toHaveAttribute('aria-invalid', 'true')
    expect(select).not.toHaveAttribute('block')
    expect(select).not.toHaveAttribute('validationstatus')
  })

  it('forwards select DOM props and its ref to the native control', () => {
    const ref = React.createRef<HTMLSelectElement>()
    render(
      <Select aria-describedby="description" data-testid="choice" id="choice" ref={ref}>
        {choices}
      </Select>,
    )

    expect(ref.current).toBe(screen.getByTestId('choice'))
    expect(ref.current).toHaveAttribute('id', 'choice')
    expect(ref.current).toHaveAttribute('aria-describedby', 'description')
  })
})
