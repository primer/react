import {describe, it, expect, beforeAll, afterAll, vi} from 'vitest'
import {render} from '@testing-library/react'
import RadioGroup from '.'
import FormControl from '../FormControl'
import Radio from '../Radio'
import {page, userEvent} from 'vitest/browser'
import {implementsClassName} from '../utils/testing'
import classes from '../internal/components/CheckboxOrRadioGroup/CheckboxOrRadioGroup.module.css'

describe('RadioGroup', () => {
  implementsClassName(
    props => (
      <RadioGroup {...props}>
        <RadioGroup.Label>Choices</RadioGroup.Label>
      </RadioGroup>
    ),
    classes.GroupFieldset,
  )
  implementsClassName(RadioGroup.Caption, classes.CheckboxOrRadioGroupCaption)
  implementsClassName(RadioGroup.Label, classes.RadioGroupLabel)
  const mockWarningFn = vi.fn()

  beforeAll(() => {
    vi.spyOn(console, 'warn').mockImplementation(mockWarningFn)
  })

  afterAll(() => {
    vi.clearAllMocks()
  })

  it('renders data-component attributes', async () => {
    render(
      <RadioGroup name="choices">
        <RadioGroup.Label>Choices</RadioGroup.Label>
        <RadioGroup.Caption>Pick one</RadioGroup.Caption>
        <RadioGroup.Validation variant="error">Selection required</RadioGroup.Validation>
        <FormControl>
          <Radio value="one" />
          <FormControl.Label>Choice one</FormControl.Label>
        </FormControl>
      </RadioGroup>,
    )

    await expect.element(page.getByRole('group')).toHaveAttribute('data-component', 'RadioGroup')
    await expect.element(page.getByText('Choices', {exact: true})).toHaveAttribute('data-component', 'RadioGroup.Label')
    await expect
      .element(page.getByText('Pick one', {exact: true}))
      .toHaveAttribute('data-component', 'RadioGroup.Caption')
    await expect
      .element(document.querySelector<HTMLElement>('[data-component="RadioGroup.Validation"]'))
      .toHaveTextContent('Selection required')
  })

  it('renders a disabled group of inputs', async () => {
    render(
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
    const radioInputs = page.getByRole('radio').elements()
    const fieldset = page.getByRole('group')

    for (const radioInput of radioInputs) {
      await expect.element(radioInput).toBeDisabled()
    }

    await expect.element(fieldset).toBeDisabled()
  })

  it('renders a required group of inputs', async () => {
    render(
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
    const requiredIndicator = page.getByTitle('required field')

    await expect.element(requiredIndicator).toBeInTheDocument()
  })

  it('calls onChange handlers passed to RadioGroup and Radio', async () => {
    const handleParentChange = vi.fn()
    const handleRadioChange = vi.fn()
    render(
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
    const checkbox = page.getByLabelText('Choice one')

    expect(handleParentChange).not.toHaveBeenCalled()
    expect(handleRadioChange).not.toHaveBeenCalled()
    await userEvent.click(checkbox)
    expect(handleParentChange).toHaveBeenCalled()
    expect(handleRadioChange).toHaveBeenCalled()
  })

  it('calls onChange handler on RadioGroup with selected value', async () => {
    const handleParentChange = vi.fn()
    render(
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

    const checkbox = page.getByLabelText('Choice one')

    expect(handleParentChange).not.toHaveBeenCalled()
    await userEvent.click(checkbox)
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
