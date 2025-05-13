import {render} from '@testing-library/react'
import {Checkbox, CheckboxGroup, FormControl} from '..'
import userEvent from '@testing-library/user-event'
import {describe, expect, it, vi, beforeAll, afterAll} from 'vitest'

describe('CheckboxGroup', () => {
  const mockWarningFn = vi.fn()

  beforeAll(() => {
    vi.spyOn(console, 'warn').mockImplementation(mockWarningFn)
  })

  afterAll(() => {
    vi.restoreAllMocks()
  })

  it('renders a disabled group of inputs', () => {
    const {getAllByRole, getByRole} = render(
      <CheckboxGroup disabled>
        <CheckboxGroup.Label>Choices</CheckboxGroup.Label>
        <FormControl>
          <Checkbox value="one" />
          <FormControl.Label>Choice one</FormControl.Label>
        </FormControl>
        <FormControl>
          <Checkbox value="two" />
          <FormControl.Label>Choice two</FormControl.Label>
        </FormControl>
        <FormControl>
          <Checkbox value="three" />
          <FormControl.Label>Choice three</FormControl.Label>
        </FormControl>
      </CheckboxGroup>,
    )
    const checkboxInputs = getAllByRole('checkbox') as HTMLInputElement[]
    const fieldset = getByRole('group') as HTMLFieldSetElement

    for (const checkboxInput of checkboxInputs) {
      expect(checkboxInput.disabled).toBe(true)
    }

    expect(fieldset.disabled).toBe(true)
  })

  it('renders a required group of inputs', () => {
    const {getByTitle} = render(
      <CheckboxGroup required>
        <CheckboxGroup.Label>Choices</CheckboxGroup.Label>
        <FormControl>
          <Checkbox value="one" />
          <FormControl.Label>Choice one</FormControl.Label>
        </FormControl>
        <FormControl>
          <Checkbox value="two" />
          <FormControl.Label>Choice two</FormControl.Label>
        </FormControl>
        <FormControl>
          <Checkbox value="three" />
          <FormControl.Label>Choice three</FormControl.Label>
        </FormControl>
      </CheckboxGroup>,
    )
    const requiredIndicator = getByTitle('required field')

    expect(requiredIndicator).toBeInTheDocument()
  })

  it('calls onChange handlers passed to CheckboxGroup and Checkbox', async () => {
    const user = userEvent.setup()
    const handleParentChange = vi.fn()
    const handleCheckboxChange = vi.fn()
    const {getByLabelText} = render(
      <CheckboxGroup onChange={handleParentChange}>
        <CheckboxGroup.Label>Choices</CheckboxGroup.Label>
        <FormControl>
          <Checkbox value="one" onChange={handleCheckboxChange} />
          <FormControl.Label>Choice one</FormControl.Label>
        </FormControl>
        <FormControl>
          <Checkbox value="two" />
          <FormControl.Label>Choice two</FormControl.Label>
        </FormControl>
        <FormControl>
          <Checkbox value="three" />
          <FormControl.Label>Choice three</FormControl.Label>
        </FormControl>
      </CheckboxGroup>,
    )
    const checkbox = getByLabelText('Choice one') as HTMLInputElement

    expect(handleParentChange).not.toHaveBeenCalled()
    expect(handleCheckboxChange).not.toHaveBeenCalled()
    await user.click(checkbox)
    expect(handleParentChange).toHaveBeenCalled()
    expect(handleCheckboxChange).toHaveBeenCalled()
  })

  it('calls onChange handler on CheckboxGroup with selected values', async () => {
    const user = userEvent.setup()
    const handleParentChange = vi.fn()
    const {getByLabelText} = render(
      <CheckboxGroup onChange={handleParentChange}>
        <CheckboxGroup.Label>Choices</CheckboxGroup.Label>
        <FormControl>
          <Checkbox value="one" />
          <FormControl.Label>Choice one</FormControl.Label>
        </FormControl>
        <FormControl>
          <Checkbox value="two" defaultChecked />
          <FormControl.Label>Choice two</FormControl.Label>
        </FormControl>
        <FormControl>
          <Checkbox value="three" />
          <FormControl.Label>Choice three</FormControl.Label>
        </FormControl>
      </CheckboxGroup>,
    )

    const checkbox = getByLabelText('Choice one') as HTMLInputElement

    expect(handleParentChange).not.toHaveBeenCalled()
    await user.click(checkbox)
    expect(handleParentChange).toHaveBeenCalledWith(
      ['two', 'one'],
      expect.objectContaining({
        target: expect.objectContaining({
          value: 'one',
        }),
      }),
    )
    await user.click(checkbox)
    expect(handleParentChange).toHaveBeenCalledWith(
      ['two'],
      expect.objectContaining({
        target: expect.objectContaining({
          value: 'one',
        }),
      }),
    )
  })
})
