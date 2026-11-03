import {describe, expect, it, vi, beforeEach} from 'vitest'
import {render} from '@testing-library/react'
import {page} from 'vitest/browser'
import Checkbox from '../Checkbox'
import {createRef} from 'react'
import {FeatureFlags} from '../FeatureFlags'
import {implementsClassName} from '../utils/testing'
import classes from './Checkbox.module.css'

describe('Checkbox', () => {
  implementsClassName(Checkbox, classes.Checkbox)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders a valid checkbox input', async () => {
    render(<Checkbox />)

    await expect.element(page.getByRole('checkbox')).toBeInTheDocument()
  })

  it('renders data-component attribute', async () => {
    render(<Checkbox />)
    await expect.element(page.getByRole('checkbox')).toHaveAttribute('data-component', 'Checkbox')
  })

  it('renders an unchecked checkbox by default', async () => {
    render(<Checkbox />)

    await expect.element(page.getByRole('checkbox')).not.toBeChecked()
  })

  it('renders an active checkbox when checked attribute is passed', async () => {
    const handleChange = vi.fn()
    render(<Checkbox checked onChange={handleChange} />)

    await expect.element(page.getByRole('checkbox')).toBeChecked()
  })

  it('accepts a change handler that can alter the checkbox state', async () => {
    const handleChange = vi.fn()
    render(<Checkbox onChange={handleChange} />)

    const checkbox = page.getByRole('checkbox')

    await expect.element(checkbox).not.toBeChecked()

    await checkbox.click()
    expect(handleChange).toHaveBeenCalled()
    await expect.element(checkbox).toBeChecked()

    await checkbox.click()
    expect(handleChange).toHaveBeenCalled()
    await expect.element(checkbox).not.toBeChecked()
  })

  it('renders an indeterminate prop correctly', async () => {
    const handleChange = vi.fn()
    render(<Checkbox indeterminate checked onChange={handleChange} />)

    const checkbox = page.getByRole('checkbox')

    await expect.element(checkbox).toBePartiallyChecked()
    expect(checkbox.element()).toHaveProperty('checked', false)
    expect(checkbox.element()).toHaveProperty('indeterminate', true)
  })

  it('renders an inactive checkbox state correctly', async () => {
    const handleChange = vi.fn()
    const {rerender} = render(<Checkbox disabled onChange={handleChange} />)

    const checkbox = page.getByRole('checkbox')

    await expect.element(checkbox).toBeDisabled()
    await expect.element(checkbox).not.toBeChecked()

    await checkbox.click({force: true})

    await expect.element(checkbox).toBeDisabled()
    await expect.element(checkbox).not.toBeChecked()

    // remove disabled attribute and retest
    rerender(<Checkbox onChange={handleChange} />)
  })

  it('renders an uncontrolled component correctly', async () => {
    render(<Checkbox defaultChecked />)

    const checkbox = page.getByRole('checkbox')

    await expect.element(checkbox).toBeChecked()

    await checkbox.click()

    await expect.element(checkbox).not.toBeChecked()
  })

  it('renders an aria-checked attribute correctly', async () => {
    const handleChange = vi.fn()
    const {rerender} = render(<Checkbox checked={false} onChange={handleChange} />)

    const checkbox = page.getByRole('checkbox')

    await expect.element(checkbox).toHaveAttribute('aria-checked', 'false')

    rerender(<Checkbox checked={true} onChange={handleChange} />)

    await expect.element(checkbox).toHaveAttribute('aria-checked', 'true')

    rerender(<Checkbox indeterminate checked onChange={handleChange} />)

    await expect.element(checkbox).toHaveAttribute('aria-checked', 'mixed')
  })

  it('renders an invalid aria state when validation prop indicates an error', async () => {
    const handleChange = vi.fn()
    const {rerender} = render(<Checkbox onChange={handleChange} />)

    const checkbox = page.getByRole('checkbox')

    await expect.element(checkbox).toHaveAttribute('aria-invalid', 'false')

    rerender(<Checkbox onChange={handleChange} validationStatus="success" />)

    await expect.element(checkbox).toHaveAttribute('aria-invalid', 'false')

    rerender(<Checkbox onChange={handleChange} validationStatus="error" />)

    await expect.element(checkbox).toHaveAttribute('aria-invalid', 'true')
  })

  it('renders an aria state indicating the field is required', async () => {
    const handleChange = vi.fn()
    const {rerender} = render(<Checkbox onChange={handleChange} />)

    const checkbox = page.getByRole('checkbox')

    await expect.element(checkbox).toHaveAttribute('aria-required', 'false')

    rerender(<Checkbox onChange={handleChange} required />)

    await expect.element(checkbox).toHaveAttribute('aria-required', 'true')
  })
})

describe('Checkbox forwarded ref (primer_react_merged_forwarded_refs)', () => {
  for (const enabled of [true, false]) {
    describe(`with the flag ${enabled ? 'enabled' : 'disabled'}`, () => {
      it('forwards a ref object to the element', () => {
        const ref = createRef<HTMLInputElement>()
        render(
          <FeatureFlags flags={{primer_react_merged_forwarded_refs: enabled}}>
            <Checkbox ref={ref} />
          </FeatureFlags>,
        )
        expect(ref.current).toBeInstanceOf(HTMLInputElement)
      })

      it('calls a callback ref with the element', () => {
        const refCallback = vi.fn()
        render(
          <FeatureFlags flags={{primer_react_merged_forwarded_refs: enabled}}>
            <Checkbox ref={refCallback} />
          </FeatureFlags>,
        )
        expect(refCallback.mock.calls.some(([el]) => el instanceof HTMLInputElement)).toBe(true)
      })
    })
  }
})
