import React from 'react'
import {render} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import {Autocomplete, SSRProvider, TextInput, TextInputWithTokens} from '../../'
import InputField from '../../deprecated/InputField'
expect.extend(toHaveNoViolations)

const TEXTINPUTFIELD_LABEL_TEXT = 'Name'
const TEXTINPUTFIELD_LABEL_TEXT_WITH_ASTERISK = 'Name *'
const TEXTINPUTFIELD_CAPTION_TEXT = 'Hint: your first name'
const TEXTINPUTFIELD_SUCCESS_TEXT = 'This name is valid'
const TEXTINPUTFIELD_ERROR_TEXT = 'This name is invalid'

describe('InputField', () => {
  describe('snapshots', () => {
    it('renders with a hidden label', () => {
      const {getByLabelText, getByText} = render(
        <SSRProvider>
          <InputField>
            <InputField.Label>{TEXTINPUTFIELD_LABEL_TEXT}</InputField.Label>
            <TextInput />
          </InputField>
        </SSRProvider>,
      )

      const input = getByLabelText(TEXTINPUTFIELD_LABEL_TEXT)
      const label = getByText(TEXTINPUTFIELD_LABEL_TEXT)

      expect(input).toBeDefined()
      expect(label).toBeDefined()
    })
    it('renders with a custom ID', () => {
      const {getByLabelText} = render(
        <SSRProvider>
          <InputField id="customId">
            <InputField.Label>{TEXTINPUTFIELD_LABEL_TEXT}</InputField.Label>
            <TextInput />
          </InputField>
        </SSRProvider>,
      )

      const input = getByLabelText(TEXTINPUTFIELD_LABEL_TEXT)

      expect(input.getAttribute('id')).toBe('customId')
    })
    it('renders as disabled', () => {
      const {getByLabelText} = render(
        <SSRProvider>
          <InputField disabled>
            <InputField.Label>{TEXTINPUTFIELD_LABEL_TEXT}</InputField.Label>
            <TextInput />
          </InputField>
        </SSRProvider>,
      )

      const input = getByLabelText(TEXTINPUTFIELD_LABEL_TEXT)

      expect(input.getAttribute('disabled')).not.toBeNull()
    })
    it('renders as required', () => {
      const {getByRole} = render(
        <SSRProvider>
          <InputField required>
            <InputField.Label>{TEXTINPUTFIELD_LABEL_TEXT}</InputField.Label>
            <TextInput />
          </InputField>
        </SSRProvider>,
      )

      const input = getByRole('textbox', {name: TEXTINPUTFIELD_LABEL_TEXT_WITH_ASTERISK})

      expect(input.getAttribute('required')).not.toBeNull()
    })
    it('renders with a caption', () => {
      const {getByText} = render(
        <SSRProvider>
          <InputField>
            <InputField.Label>{TEXTINPUTFIELD_LABEL_TEXT}</InputField.Label>
            <TextInput />
            <InputField.Caption>{TEXTINPUTFIELD_CAPTION_TEXT}</InputField.Caption>
          </InputField>
        </SSRProvider>,
      )

      const caption = getByText(TEXTINPUTFIELD_CAPTION_TEXT)

      expect(caption).toBeDefined()
    })
    it('renders with a successful validation message', () => {
      const {getByText} = render(
        <SSRProvider>
          <InputField
            validationMap={{
              noSpaces: 'error',
              validName: 'success',
            }}
            validationResult="validName"
          >
            <InputField.Label>{TEXTINPUTFIELD_LABEL_TEXT}</InputField.Label>
            <TextInput />
            <InputField.Validation validationKey="validName">{TEXTINPUTFIELD_SUCCESS_TEXT}</InputField.Validation>
          </InputField>
        </SSRProvider>,
      )

      const validationMessage = getByText(TEXTINPUTFIELD_SUCCESS_TEXT)

      expect(validationMessage).toBeDefined()
    })
    it('renders with an error validation message', () => {
      const {getByText} = render(
        <SSRProvider>
          <InputField
            validationMap={{
              noSpaces: 'error',
              validName: 'success',
            }}
            validationResult="noSpaces"
          >
            <InputField.Label>{TEXTINPUTFIELD_LABEL_TEXT}</InputField.Label>
            <TextInput />
            <InputField.Validation validationKey="noSpaces">{TEXTINPUTFIELD_ERROR_TEXT}</InputField.Validation>
          </InputField>
        </SSRProvider>,
      )

      const validationMessage = getByText(TEXTINPUTFIELD_ERROR_TEXT)

      expect(validationMessage).toBeDefined()
    })
    it('renders with the input as a TextInputWithTokens', () => {
      const onRemoveMock = jest.fn()
      const {getByLabelText} = render(
        <SSRProvider>
          <InputField>
            <InputField.Label>{TEXTINPUTFIELD_LABEL_TEXT}</InputField.Label>
            <TextInputWithTokens
              tokens={[
                {text: 'zero', id: 0},
                {text: 'one', id: 1},
                {text: 'two', id: 2},
              ]}
              onTokenRemove={onRemoveMock}
            />
          </InputField>
        </SSRProvider>,
      )

      const input = getByLabelText(TEXTINPUTFIELD_LABEL_TEXT)

      expect(input).toBeDefined()
    })
    it('renders with the input as an Autocomplete', () => {
      const {getByLabelText} = render(
        <SSRProvider>
          <InputField>
            <InputField.Label>{TEXTINPUTFIELD_LABEL_TEXT}</InputField.Label>
            <Autocomplete>
              <Autocomplete.Input block />
            </Autocomplete>
          </InputField>
        </SSRProvider>,
      )

      const input = getByLabelText(TEXTINPUTFIELD_LABEL_TEXT)

      expect(input).toBeDefined()
    })
  })

  describe('ARIA attributes', () => {
    it('associates the label with the input', () => {
      const {getByLabelText} = render(
        <SSRProvider>
          <InputField>
            <InputField.Label>{TEXTINPUTFIELD_LABEL_TEXT}</InputField.Label>
            <TextInput />
          </InputField>
        </SSRProvider>,
      )

      const inputNode = getByLabelText(TEXTINPUTFIELD_LABEL_TEXT)
      expect(inputNode).toBeDefined()
    })
    it('associates caption text with the input', () => {
      const fieldId = 'captionedInput'
      const {getByLabelText, getByText} = render(
        <SSRProvider>
          <InputField id={fieldId}>
            <InputField.Label>{TEXTINPUTFIELD_LABEL_TEXT}</InputField.Label>
            <TextInput />
            <InputField.Caption>{TEXTINPUTFIELD_CAPTION_TEXT}</InputField.Caption>
          </InputField>
        </SSRProvider>,
      )

      const inputNode = getByLabelText(TEXTINPUTFIELD_LABEL_TEXT)
      const captionNode = getByText(TEXTINPUTFIELD_CAPTION_TEXT)

      expect(captionNode.getAttribute('id')).toBe(`${fieldId}-caption`)
      expect(inputNode.getAttribute('aria-describedby')).toBe(`${fieldId}-caption`)
    })
    it('associates validation text with the input', () => {
      const fieldId = 'validatedInput'
      const {getByLabelText, getByText} = render(
        <SSRProvider>
          <InputField id={fieldId} validationMap={{validName: 'success'}} validationResult="validName">
            <InputField.Label>{TEXTINPUTFIELD_LABEL_TEXT}</InputField.Label>
            <TextInput />
            <InputField.Validation validationKey="validName">{TEXTINPUTFIELD_SUCCESS_TEXT}</InputField.Validation>
          </InputField>
        </SSRProvider>,
      )

      const inputNode = getByLabelText(TEXTINPUTFIELD_LABEL_TEXT)
      const validationNode = getByText(TEXTINPUTFIELD_SUCCESS_TEXT)

      expect(validationNode.getAttribute('id')).toBe(`${fieldId}-validationMsg`)
      expect(inputNode.getAttribute('aria-describedby')).toBe(`${fieldId}-validationMsg`)
    })
  })

  it('should have no axe violations', async () => {
    const {container} = render(
      <SSRProvider>
        <InputField>
          <InputField.Label>{TEXTINPUTFIELD_LABEL_TEXT}</InputField.Label>
          <TextInput />
          <InputField.Caption>{TEXTINPUTFIELD_CAPTION_TEXT}</InputField.Caption>
        </InputField>
      </SSRProvider>,
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
