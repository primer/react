import {describe, it, expect, beforeAll, afterAll, vi} from 'vitest'
import {render} from '@testing-library/react'
import {RadioGroup, FormControl, Radio} from '..'
import userEvent from '@testing-library/user-event'

describe('RadioGroup', () => {
  const mockWarningFn = vi.fn()

  beforeAll(() => {
    vi.spyOn(console, 'warn').mockImplementation(mockWarningFn)
  })

  afterAll(() => {
    vi.clearAllMocks()
  })

  it('renders a disabled group of inputs', () => {
    const {getAllByRole, getByRole} = render(
      <RadioGroup name="choices" disabled>
        <RadioGroup.Label>Choices</RadioGroup.Label>
        <FormControl>
          <Radio value="one" />
          <FormControl.Label>Choice one</FormControl.Label>
        </FormControl>
        <FormControl>
          <Radio value="two" />
          <FormControl.Label>Choice two</FormControl.Label>
        </FormControl>
        <FormControl>
          <Radio value="three" />
          <FormControl.Label>Choice three</FormControl.Label>
        </FormControl>
      </RadioGroup>,
    )
    const radioInputs = getAllByRole('radio') as HTMLInputElement[]
    const fieldset = getByRole('group') as HTMLFieldSetElement

    for (const radioInput of radioInputs) {
      expect(radioInput.disabled).toBe(true)
    }

    expect(fieldset.disabled).toBe(true)
  })

  it('renders a required group of inputs', () => {
    const {getByTitle} = render(
      <RadioGroup name="choices" required>
        <RadioGroup.Label>Choices</RadioGroup.Label>
        <FormControl>
          <Radio value="one" />
          <FormControl.Label>Choice one</FormControl.Label>
        </FormControl>
        <FormControl>
          <Radio value="two" />
          <FormControl.Label>Choice two</FormControl.Label>
        </FormControl>
        <FormControl>
          <Radio value="three" />
          <FormControl.Label>Choice three</FormControl.Label>
        </FormControl>
      </RadioGroup>,
    )
    const requiredIndicator = getByTitle('required field')

    expect(requiredIndicator).toBeInTheDocument()
  })

  it('calls onChange handlers passed to RadioGroup and Radio', async () => {
    const user = userEvent.setup()
    const handleParentChange = vi.fn()
    const handleRadioChange = vi.fn()
    const {getByLabelText} = render(
      <RadioGroup name="choices" onChange={handleParentChange}>
        <RadioGroup.Label>Choices</RadioGroup.Label>
        <FormControl>
          <Radio value="one" onChange={handleRadioChange} />
          <FormControl.Label>Choice one</FormControl.Label>
        </FormControl>
        <FormControl>
          <Radio value="two" />
          <FormControl.Label>Choice two</FormControl.Label>
        </FormControl>
        <FormControl>
          <Radio value="three" />
          <FormControl.Label>Choice three</FormControl.Label>
        </FormControl>
      </RadioGroup>,
    )
    const checkbox = getByLabelText('Choice one') as HTMLInputElement

    expect(handleParentChange).not.toHaveBeenCalled()
    expect(handleRadioChange).not.toHaveBeenCalled()
    await user.click(checkbox)
    expect(handleParentChange).toHaveBeenCalled()
    expect(handleRadioChange).toHaveBeenCalled()
  })

  it('calls onChange handler on RadioGroup with selected value', async () => {
    const user = userEvent.setup()
    const handleParentChange = vi.fn()
    const {getByLabelText} = render(
      <RadioGroup name="choices" onChange={handleParentChange}>
        <RadioGroup.Label>Choices</RadioGroup.Label>
        <FormControl>
          <Radio value="one" />
          <FormControl.Label>Choice one</FormControl.Label>
        </FormControl>
        <FormControl>
          <Radio value="two" />
          <FormControl.Label>Choice two</FormControl.Label>
        </FormControl>
        <FormControl>
          <Radio value="three" />
          <FormControl.Label>Choice three</FormControl.Label>
        </FormControl>
      </RadioGroup>,
    )

    const checkbox = getByLabelText('Choice one') as HTMLInputElement

    expect(handleParentChange).not.toHaveBeenCalled()
    await user.click(checkbox)
    expect(handleParentChange).toHaveBeenCalledWith(
      'one',
      expect.objectContaining({
        target: expect.objectContaining({
          value: 'one',
        }),
      }),
    )
  })
})
