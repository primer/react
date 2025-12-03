import {render, within} from '@testing-library/react'
import {beforeAll, afterAll, describe, expect, it, vi} from 'vitest'
import {Checkbox, FormControl, TextInput} from '..'
import CheckboxOrRadioGroup from '../internal/components/CheckboxOrRadioGroup'

const INPUT_GROUP_LABEL = 'Choices'

describe('CheckboxOrRadioGroup', () => {
  const mockWarningFn = vi.fn()

  beforeAll(() => {
    vi.spyOn(console, 'warn').mockImplementation(mockWarningFn)
  })

  afterAll(() => {
    vi.clearAllMocks()
  })

  it('renders a group of inputs with a caption in the <legend>', () => {
    render(
      <CheckboxOrRadioGroup>
        <CheckboxOrRadioGroup.Label>{INPUT_GROUP_LABEL}</CheckboxOrRadioGroup.Label>
        <CheckboxOrRadioGroup.Caption>Caption text</CheckboxOrRadioGroup.Caption>
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
      </CheckboxOrRadioGroup>,
    )
    const legend = document.getElementsByTagName('legend')[0]
    const caption = within(legend).getByText('Caption text')

    expect(caption).toBeInTheDocument()
  })

  it('renders a group of inputs with a validation message in the <legend>', () => {
    render(
      <CheckboxOrRadioGroup>
        <CheckboxOrRadioGroup.Label>{INPUT_GROUP_LABEL}</CheckboxOrRadioGroup.Label>
        <CheckboxOrRadioGroup.Caption>Caption text</CheckboxOrRadioGroup.Caption>
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
        <CheckboxOrRadioGroup.Validation variant="error">Validation text</CheckboxOrRadioGroup.Validation>
      </CheckboxOrRadioGroup>,
    )
    const legend = document.getElementsByTagName('legend')[0]
    const validationMsg = within(legend).getByText('Validation text')

    expect(validationMsg).toBeInTheDocument()
  })

  it('renders with a hidden label', () => {
    const {getByText} = render(
      <CheckboxOrRadioGroup disabled>
        <CheckboxOrRadioGroup.Label>{INPUT_GROUP_LABEL}</CheckboxOrRadioGroup.Label>
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
      </CheckboxOrRadioGroup>,
    )
    const legend = getByText(INPUT_GROUP_LABEL)

    expect(legend).toBeInTheDocument()
  })

  it('uses a legend to label the input group', () => {
    const {getByRole} = render(
      <CheckboxOrRadioGroup>
        <CheckboxOrRadioGroup.Label>{INPUT_GROUP_LABEL}</CheckboxOrRadioGroup.Label>
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
      </CheckboxOrRadioGroup>,
    )

    expect(getByRole('group', {name: INPUT_GROUP_LABEL})).toBeTruthy()
  })

  it('associates a label with the input group when the label is not a child of CheckboxOrRadioGroup', () => {
    const INPUT_GROUP_LABEL_ID = 'the-label'
    const {getByLabelText} = render(
      <>
        <h2 id={INPUT_GROUP_LABEL_ID}>{INPUT_GROUP_LABEL}</h2>
        <CheckboxOrRadioGroup aria-labelledby={INPUT_GROUP_LABEL_ID}>
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
        </CheckboxOrRadioGroup>
      </>,
    )
    const fieldset = getByLabelText(INPUT_GROUP_LABEL)

    expect(fieldset).toBeInTheDocument()
  })

  it('logs a warning when trying to render a group without a label', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    render(
      <CheckboxOrRadioGroup>
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
      </CheckboxOrRadioGroup>,
    )

    expect(consoleSpy).toHaveBeenCalled()

    consoleSpy.mockRestore()
  })

  it('logs a warning when trying to render an input component other than Radio or Checkbox', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    render(
      <CheckboxOrRadioGroup>
        <FormControl>
          <FormControl.Label>Choice one</FormControl.Label>
          <TextInput />
        </FormControl>
        <FormControl>
          <Checkbox value="two" />
          <FormControl.Label>Choice two</FormControl.Label>
        </FormControl>
        <FormControl>
          <Checkbox value="three" />
          <FormControl.Label>Choice three</FormControl.Label>
        </FormControl>
      </CheckboxOrRadioGroup>,
    )

    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })
})
