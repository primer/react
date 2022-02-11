import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import {render, within} from '@testing-library/react'
import {Checkbox, ChoiceGroup, FormControl, Radio, TextInput} from '..'
import {behavesAsComponent, checkExports} from '../utils/testing'

const INPUT_GROUP_LABEL = 'Choices'

describe('ChoiceGroup', () => {
  const mockWarningFn = jest.fn()

  beforeAll(() => {
    jest.spyOn(global.console, 'warn').mockImplementation(mockWarningFn)
  })

  afterAll(() => {
    jest.clearAllMocks()
  })
  behavesAsComponent({
    Component: ChoiceGroup,
    options: {skipAs: true},
    toRender: () => (
      <ChoiceGroup>
        <ChoiceGroup.Label>{INPUT_GROUP_LABEL}</ChoiceGroup.Label>
        <FormControl>
          <Radio name="radioInput" value="choiceOne" />
          <FormControl.Label>Choice one</FormControl.Label>
        </FormControl>
        <FormControl>
          <Radio name="radioInput" value="choiceTwo" />
          <FormControl.Label>Choice two</FormControl.Label>
        </FormControl>
        <FormControl>
          <Radio name="radioInput" value="choiceThree" />
          <FormControl.Label>Choice three</FormControl.Label>
        </FormControl>
      </ChoiceGroup>
    )
  })
  checkExports('ChoiceGroup', {
    default: ChoiceGroup
  })
  it('renders a group of radio inputs', () => {
    const {getAllByRole} = render(
      <ChoiceGroup>
        <ChoiceGroup.Label>{INPUT_GROUP_LABEL}</ChoiceGroup.Label>
        <FormControl>
          <Radio name="radioInput" value="choiceOne" />
          <FormControl.Label>Choice one</FormControl.Label>
        </FormControl>
        <FormControl>
          <Radio name="radioInput" value="choiceTwo" />
          <FormControl.Label>Choice two</FormControl.Label>
        </FormControl>
        <FormControl>
          <Radio name="radioInput" value="choiceThree" />
          <FormControl.Label>Choice three</FormControl.Label>
        </FormControl>
      </ChoiceGroup>
    )
    const radioInputs = getAllByRole('radio')

    expect(radioInputs.length).toBe(3)
  })
  it('renders a group of checkbox inputs', () => {
    const {getAllByRole} = render(
      <ChoiceGroup>
        <ChoiceGroup.Label>{INPUT_GROUP_LABEL}</ChoiceGroup.Label>
        <FormControl>
          <Checkbox />
          <FormControl.Label>Choice one</FormControl.Label>
        </FormControl>
        <FormControl>
          <Checkbox />
          <FormControl.Label>Choice two</FormControl.Label>
        </FormControl>
        <FormControl>
          <Checkbox />
          <FormControl.Label>Choice three</FormControl.Label>
        </FormControl>
      </ChoiceGroup>
    )
    const checkboxInputs = getAllByRole('checkbox')

    expect(checkboxInputs.length).toBe(3)
  })
  it('renders a group of inputs with a caption in the <legend>', () => {
    render(
      <ChoiceGroup>
        <ChoiceGroup.Label>{INPUT_GROUP_LABEL}</ChoiceGroup.Label>
        <ChoiceGroup.Caption>Caption text</ChoiceGroup.Caption>
        <FormControl>
          <Checkbox />
          <FormControl.Label>Choice one</FormControl.Label>
        </FormControl>
        <FormControl>
          <Checkbox />
          <FormControl.Label>Choice two</FormControl.Label>
        </FormControl>
        <FormControl>
          <Checkbox />
          <FormControl.Label>Choice three</FormControl.Label>
        </FormControl>
      </ChoiceGroup>
    )
    const legend = document.getElementsByTagName('legend')[0]
    const caption = within(legend).getByText('Caption text')

    expect(caption).toBeInTheDocument()
  })
  it('renders a group of inputs with a validation message in the <legend>', () => {
    render(
      <ChoiceGroup>
        <ChoiceGroup.Label>{INPUT_GROUP_LABEL}</ChoiceGroup.Label>
        <ChoiceGroup.Caption>Caption text</ChoiceGroup.Caption>
        <FormControl>
          <Checkbox />
          <FormControl.Label>Choice one</FormControl.Label>
        </FormControl>
        <FormControl>
          <Checkbox />
          <FormControl.Label>Choice two</FormControl.Label>
        </FormControl>
        <FormControl>
          <Checkbox />
          <FormControl.Label>Choice three</FormControl.Label>
        </FormControl>
        <ChoiceGroup.Validation variant="error">Validation text</ChoiceGroup.Validation>
      </ChoiceGroup>
    )
    const legend = document.getElementsByTagName('legend')[0]
    const validationMsg = within(legend).getByText('Validation text')

    expect(validationMsg).toBeInTheDocument()
  })
  it('renders a disabled group of inputs', () => {
    const {getAllByRole, getByRole} = render(
      <ChoiceGroup disabled>
        <ChoiceGroup.Label>{INPUT_GROUP_LABEL}</ChoiceGroup.Label>
        <FormControl>
          <Checkbox />
          <FormControl.Label>Choice one</FormControl.Label>
        </FormControl>
        <FormControl>
          <Checkbox />
          <FormControl.Label>Choice two</FormControl.Label>
        </FormControl>
        <FormControl>
          <Checkbox />
          <FormControl.Label>Choice three</FormControl.Label>
        </FormControl>
      </ChoiceGroup>
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
      <ChoiceGroup required>
        <ChoiceGroup.Label>{INPUT_GROUP_LABEL}</ChoiceGroup.Label>
        <FormControl>
          <Checkbox />
          <FormControl.Label>Choice one</FormControl.Label>
        </FormControl>
        <FormControl>
          <Checkbox />
          <FormControl.Label>Choice two</FormControl.Label>
        </FormControl>
        <FormControl>
          <Checkbox />
          <FormControl.Label>Choice three</FormControl.Label>
        </FormControl>
      </ChoiceGroup>
    )
    const requiredIndicator = getByTitle('required field')

    expect(requiredIndicator).toBeInTheDocument()
  })
  it('renders with a hidden label', () => {
    const {getByText} = render(
      <ChoiceGroup disabled>
        <ChoiceGroup.Label>{INPUT_GROUP_LABEL}</ChoiceGroup.Label>
        <FormControl>
          <Checkbox />
          <FormControl.Label>Choice one</FormControl.Label>
        </FormControl>
        <FormControl>
          <Checkbox />
          <FormControl.Label>Choice two</FormControl.Label>
        </FormControl>
        <FormControl>
          <Checkbox />
          <FormControl.Label>Choice three</FormControl.Label>
        </FormControl>
      </ChoiceGroup>
    )
    const legend = getByText(INPUT_GROUP_LABEL)

    expect(legend).toBeInTheDocument()
  })
  it('uses a legend to label the input group', () => {
    const {getByRole} = render(
      <ChoiceGroup>
        <ChoiceGroup.Label>{INPUT_GROUP_LABEL}</ChoiceGroup.Label>
        <FormControl>
          <Checkbox />
          <FormControl.Label>Choice one</FormControl.Label>
        </FormControl>
        <FormControl>
          <Checkbox />
          <FormControl.Label>Choice two</FormControl.Label>
        </FormControl>
        <FormControl>
          <Checkbox />
          <FormControl.Label>Choice three</FormControl.Label>
        </FormControl>
      </ChoiceGroup>
    )

    expect(getByRole('group', {name: INPUT_GROUP_LABEL})).toBeTruthy()
  })
  it('associates a label with the input group when the label is not a child of ChoiceGroup', () => {
    const INPUT_GROUP_LABEL_ID = 'the-label'
    const {getByLabelText} = render(
      <>
        <h2 id={INPUT_GROUP_LABEL_ID}>{INPUT_GROUP_LABEL}</h2>
        <ChoiceGroup aria-labelledby={INPUT_GROUP_LABEL_ID}>
          <FormControl>
            <Checkbox />
            <FormControl.Label>Choice one</FormControl.Label>
          </FormControl>
          <FormControl>
            <Checkbox />
            <FormControl.Label>Choice two</FormControl.Label>
          </FormControl>
          <FormControl>
            <Checkbox />
            <FormControl.Label>Choice three</FormControl.Label>
          </FormControl>
        </ChoiceGroup>
      </>
    )
    const fieldset = getByLabelText(INPUT_GROUP_LABEL)

    expect(fieldset).toBeInTheDocument()
  })
  it('logs a warning when trying to render a group without a label', () => {
    const consoleSpy = jest.spyOn(global.console, 'warn')

    render(
      <ChoiceGroup>
        <FormControl>
          <Checkbox />
          <FormControl.Label>Choice one</FormControl.Label>
        </FormControl>
        <FormControl>
          <Checkbox />
          <FormControl.Label>Choice two</FormControl.Label>
        </FormControl>
        <FormControl>
          <Checkbox />
          <FormControl.Label>Choice three</FormControl.Label>
        </FormControl>
      </ChoiceGroup>
    )

    expect(consoleSpy).toHaveBeenCalled()
  })
  it('logs a warning when trying to render an input component other than Radio or Checkbox', () => {
    const consoleSpy = jest.spyOn(global.console, 'warn')

    render(
      <ChoiceGroup>
        <FormControl.Label>{INPUT_GROUP_LABEL}</FormControl.Label>
        <FormControl>
          <FormControl.Label>Choice one</FormControl.Label>
          <TextInput />
        </FormControl>
        <FormControl>
          <Checkbox />
          <FormControl.Label>Choice two</FormControl.Label>
        </FormControl>
        <FormControl>
          <Checkbox />
          <FormControl.Label>Choice three</FormControl.Label>
        </FormControl>
      </ChoiceGroup>
    )

    expect(consoleSpy).toHaveBeenCalled()
  })
})
