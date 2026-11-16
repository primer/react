import {page, userEvent} from 'vitest/browser'
import {render} from '@testing-library/react'
import Checkbox from '../Checkbox'
import CheckboxGroup from '.'
import FormControl from '../FormControl'
import {describe, expect, it, vi, beforeAll, afterAll} from 'vitest'
import {implementsClassName} from '../utils/testing'
import classes from '../internal/components/CheckboxOrRadioGroup/CheckboxOrRadioGroup.module.css'

describe('CheckboxGroup', () => {
  implementsClassName(
    props => (
      <CheckboxGroup {...props}>
        <CheckboxGroup.Label>Choices</CheckboxGroup.Label>
      </CheckboxGroup>
    ),
    classes.GroupFieldset,
  )
  implementsClassName(CheckboxGroup.Caption, classes.CheckboxOrRadioGroupCaption)
  implementsClassName(CheckboxGroup.Label, classes.RadioGroupLabel)
  const mockWarningFn = vi.fn()

  beforeAll(() => {
    vi.spyOn(console, 'warn').mockImplementation(mockWarningFn)
  })

  afterAll(() => {
    vi.restoreAllMocks()
  })

  it('renders data-component attribute', async () => {
    render(
      <CheckboxGroup>
        <CheckboxGroup.Label>Choices</CheckboxGroup.Label>
        <FormControl>
          <Checkbox value="one" />
          <FormControl.Label>Choice one</FormControl.Label>
        </FormControl>
      </CheckboxGroup>,
    )

    await expect.element(page.getByRole('group')).toHaveAttribute('data-component', 'CheckboxGroup')
  })

  it('renders data-component attributes for subcomponents', async () => {
    const {container} = render(
      <CheckboxGroup>
        <CheckboxGroup.Label>Choices</CheckboxGroup.Label>
        <CheckboxGroup.Caption>Help text</CheckboxGroup.Caption>
        <CheckboxGroup.Validation variant="error">Error text</CheckboxGroup.Validation>

        <FormControl>
          <Checkbox value="one" />
          <FormControl.Label>Choice one</FormControl.Label>
        </FormControl>
      </CheckboxGroup>,
    )

    await expect
      .element(container.querySelector<HTMLElement>('[data-component="CheckboxGroup.Label"]'))
      .toBeInTheDocument()
    await expect
      .element(container.querySelector<HTMLElement>('[data-component="CheckboxGroup.Caption"]'))
      .toBeInTheDocument()
    await expect
      .element(container.querySelector<HTMLElement>('[data-component="CheckboxGroup.Validation"]'))
      .toBeInTheDocument()
  })

  it('renders a disabled group of inputs', async () => {
    render(
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
    const checkboxInputs = page.getByRole('checkbox').all()
    const fieldset = page.getByRole('group')

    for (const checkboxInput of checkboxInputs) {
      await expect.element(checkboxInput).toBeDisabled()
    }

    await expect.element(fieldset).toBeDisabled()
  })

  it('renders a required group of inputs', async () => {
    render(
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
    const requiredIndicator = page.getByTitle('required field')

    await expect.element(requiredIndicator).toBeInTheDocument()
  })

  it('calls onChange handlers passed to CheckboxGroup and Checkbox', async () => {
    const handleParentChange = vi.fn()
    const handleCheckboxChange = vi.fn()
    render(
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
    const checkbox = page.getByLabelText('Choice one')

    expect(handleParentChange).not.toHaveBeenCalled()
    expect(handleCheckboxChange).not.toHaveBeenCalled()
    await userEvent.click(checkbox)
    expect(handleParentChange).toHaveBeenCalled()
    expect(handleCheckboxChange).toHaveBeenCalled()
  })

  it('calls onChange handler on CheckboxGroup with selected values', async () => {
    const handleParentChange = vi.fn()
    render(
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

    const checkbox = page.getByLabelText('Choice one')

    expect(handleParentChange).not.toHaveBeenCalled()
    await userEvent.click(checkbox)
    expect(handleParentChange).toHaveBeenCalledWith(
      ['two', 'one'],
      expect.objectContaining({
        target: expect.objectContaining({
          value: 'one',
        }),
      }),
    )
    await userEvent.click(checkbox)
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
