import {render} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import Checkbox from '../Checkbox'
import {behavesAsComponent, checkExports} from '../utils/testing'
import {FeatureFlags} from '../FeatureFlags'

describe('Checkbox', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })
  behavesAsComponent({Component: Checkbox, options: {skipAs: true}})

  checkExports('Checkbox', {
    default: Checkbox,
  })

  it('should support `className` on the outermost element', () => {
    const Element = () => <Checkbox className={'test-class-name'} />
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
    expect(render(<Element />).container.firstChild).toHaveClass('test-class-name')
    expect(render(<FeatureFlagElement />).container.firstChild).toHaveClass('test-class-name')
  })

  it('renders a valid checkbox input', () => {
    const {getByRole} = render(<Checkbox />)

    const checkbox = getByRole('checkbox')

    expect(checkbox).toBeDefined()
  })

  it('renders an unchecked checkbox by default', () => {
    const {getByRole} = render(<Checkbox />)

    const checkbox = getByRole('checkbox') as HTMLInputElement

    expect(checkbox.checked).toEqual(false)
  })

  it('renders an active checkbox when checked attribute is passed', () => {
    const handleChange = jest.fn()
    const {getByRole} = render(<Checkbox checked onChange={handleChange} />)

    const checkbox = getByRole('checkbox') as HTMLInputElement

    expect(checkbox.checked).toEqual(true)
  })

  it('accepts a change handler that can alter the checkbox state', async () => {
    const user = userEvent.setup()
    const handleChange = jest.fn()
    const {getByRole} = render(<Checkbox onChange={handleChange} />)

    const checkbox = getByRole('checkbox') as HTMLInputElement

    expect(checkbox.checked).toEqual(false)

    await user.click(checkbox)
    expect(handleChange).toHaveBeenCalled()
    expect(checkbox.checked).toEqual(true)

    await user.click(checkbox)
    expect(handleChange).toHaveBeenCalled()
    expect(checkbox.checked).toEqual(false)
  })

  it('renders an indeterminate prop correctly', () => {
    const handleChange = jest.fn()
    const {getByRole} = render(<Checkbox indeterminate checked onChange={handleChange} />)

    const checkbox = getByRole('checkbox') as HTMLInputElement

    expect(checkbox.indeterminate).toEqual(true)
    expect(checkbox.checked).toEqual(false)
  })

  it('renders an inactive checkbox state correctly', async () => {
    const user = userEvent.setup()
    const handleChange = jest.fn()
    const {getByRole, rerender} = render(<Checkbox disabled onChange={handleChange} />)

    const checkbox = getByRole('checkbox') as HTMLInputElement

    expect(checkbox.disabled).toEqual(true)
    expect(checkbox.checked).toEqual(false)

    await user.click(checkbox)

    expect(checkbox.disabled).toEqual(true)
    expect(checkbox.checked).toEqual(false)

    // remove disabled attribute and retest
    rerender(<Checkbox onChange={handleChange} />)
  })

  it('renders an uncontrolled component correctly', async () => {
    const user = userEvent.setup()
    const {getByRole} = render(<Checkbox defaultChecked />)

    const checkbox = getByRole('checkbox') as HTMLInputElement

    expect(checkbox.checked).toEqual(true)

    await user.click(checkbox)

    expect(checkbox.checked).toEqual(false)
  })

  it('renders an aria-checked attribute correctly', () => {
    const handleChange = jest.fn()
    const {getByRole, rerender} = render(<Checkbox checked={false} onChange={handleChange} />)

    const checkbox = getByRole('checkbox') as HTMLInputElement

    expect(checkbox).toHaveAttribute('aria-checked', 'false')

    rerender(<Checkbox checked={true} onChange={handleChange} />)

    expect(checkbox).toHaveAttribute('aria-checked', 'true')

    rerender(<Checkbox indeterminate checked onChange={handleChange} />)

    expect(checkbox).toHaveAttribute('aria-checked', 'mixed')
  })

  it('renders an invalid aria state when validation prop indicates an error', () => {
    const handleChange = jest.fn()
    const {getByRole, rerender} = render(<Checkbox onChange={handleChange} />)

    const checkbox = getByRole('checkbox') as HTMLInputElement

    expect(checkbox).toHaveAttribute('aria-invalid', 'false')

    rerender(<Checkbox onChange={handleChange} validationStatus="success" />)

    expect(checkbox).toHaveAttribute('aria-invalid', 'false')

    rerender(<Checkbox onChange={handleChange} validationStatus="error" />)

    expect(checkbox).toHaveAttribute('aria-invalid', 'true')
  })

  it('renders an aria state indicating the field is required', () => {
    const handleChange = jest.fn()
    const {getByRole, rerender} = render(<Checkbox onChange={handleChange} />)

    const checkbox = getByRole('checkbox') as HTMLInputElement

    expect(checkbox).toHaveAttribute('aria-required', 'false')

    rerender(<Checkbox onChange={handleChange} required />)

    expect(checkbox).toHaveAttribute('aria-required', 'true')
  })
})
