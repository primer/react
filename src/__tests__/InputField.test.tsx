import React from 'react'
import {render} from '../utils/testing'
import {render as HTMLRender, cleanup} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
import {Autocomplete, InputField, SSRProvider, TextInput, TextInputWithTokens} from '..'
expect.extend(toHaveNoViolations)

const TEXTINPUTFIELD_LABEL_TEXT = 'Name'
const TEXTINPUTFIELD_CAPTION_TEXT = 'Hint: your first name'
const TEXTINPUTFIELD_SUCCESS_TEXT = 'This name is valid'

describe('InputField', () => {
  describe('snapshots', () => {
    it('renders with a label an input', () => {
      expect(
        render(
          <SSRProvider>
            <InputField>
              <InputField.Label>{TEXTINPUTFIELD_LABEL_TEXT}</InputField.Label>
              <TextInput />
            </InputField>
          </SSRProvider>
        )
      ).toMatchSnapshot()
    })
    it('renders with a hidden label', () => {
      expect(
        render(
          <SSRProvider>
            <InputField>
              <InputField.Label visuallyHidden>{TEXTINPUTFIELD_LABEL_TEXT}</InputField.Label>
              <TextInput />
            </InputField>
          </SSRProvider>
        )
      ).toMatchSnapshot()
    })
    it('renders with a custom ID', () => {
      expect(
        render(
          <SSRProvider>
            <InputField id="customId">
              <InputField.Label>{TEXTINPUTFIELD_LABEL_TEXT}</InputField.Label>
              <TextInput />
            </InputField>
          </SSRProvider>
        )
      ).toMatchSnapshot()
    })
    it('renders as disabled', () => {
      expect(
        render(
          <SSRProvider>
            <InputField disabled>
              <InputField.Label visuallyHidden>{TEXTINPUTFIELD_LABEL_TEXT}</InputField.Label>
              <TextInput />
            </InputField>
          </SSRProvider>
        )
      ).toMatchSnapshot()
    })
    it('renders as required', () => {
      expect(
        render(
          <SSRProvider>
            <InputField required>
              <InputField.Label>{TEXTINPUTFIELD_LABEL_TEXT}</InputField.Label>
              <TextInput />
            </InputField>
          </SSRProvider>
        )
      ).toMatchSnapshot()
    })
    it('renders with a caption', () => {
      expect(
        render(
          <SSRProvider>
            <InputField>
              <InputField.Label>{TEXTINPUTFIELD_LABEL_TEXT}</InputField.Label>
              <TextInput />
              <InputField.Caption>{TEXTINPUTFIELD_CAPTION_TEXT}</InputField.Caption>
            </InputField>
          </SSRProvider>
        )
      ).toMatchSnapshot()
    })
    it('renders with a successful validation message', () => {
      expect(
        render(
          <SSRProvider>
            <InputField
              validationMap={{
                noSpaces: 'error',
                validName: 'success'
              }}
              validationResult="validName"
            >
              <InputField.Label>{TEXTINPUTFIELD_LABEL_TEXT}</InputField.Label>
              <TextInput />
              <InputField.Validation validationKey="validName">{TEXTINPUTFIELD_SUCCESS_TEXT}</InputField.Validation>
            </InputField>
          </SSRProvider>
        )
      ).toMatchSnapshot()
    })
    it('renders with an error validation message', () => {
      expect(
        render(
          <SSRProvider>
            <InputField
              validationMap={{
                noSpaces: 'error',
                validName: 'success'
              }}
              validationResult="noSpaces"
            >
              <InputField.Label>{TEXTINPUTFIELD_LABEL_TEXT}</InputField.Label>
              <TextInput />
              <InputField.Validation validationKey="noSpaces">
                Your first name cannot contain spaces
              </InputField.Validation>
            </InputField>
          </SSRProvider>
        )
      ).toMatchSnapshot()
    })
    it('renders with the input as a TextInputWithTokens', () => {
      const onRemoveMock = jest.fn()
      expect(
        render(
          <SSRProvider>
            <InputField>
              <InputField.Label>{TEXTINPUTFIELD_LABEL_TEXT}</InputField.Label>
              <TextInputWithTokens
                tokens={[
                  {text: 'zero', id: 0},
                  {text: 'one', id: 1},
                  {text: 'two', id: 2}
                ]}
                onRemove={onRemoveMock}
              />
            </InputField>
          </SSRProvider>
        )
      ).toMatchSnapshot()
    })
    it('renders with the input as an Autocomplete', () => {
      expect(
        render(
          <SSRProvider>
            <InputField>
              <InputField.Label>{TEXTINPUTFIELD_LABEL_TEXT}</InputField.Label>
              <Autocomplete>
                <Autocomplete.Input block />
              </Autocomplete>
            </InputField>
          </SSRProvider>
        )
      ).toMatchSnapshot()
    })
  })

  describe('ARIA attributes', () => {
    it('associates the label with the input', () => {
      const {getByLabelText} = HTMLRender(
        <SSRProvider>
          <InputField>
            <InputField.Label>{TEXTINPUTFIELD_LABEL_TEXT}</InputField.Label>
            <TextInput />
          </InputField>
        </SSRProvider>
      )

      const inputNode = getByLabelText(TEXTINPUTFIELD_LABEL_TEXT)
      expect(inputNode).toBeDefined()
    })
    it('associates caption text with the input', () => {
      const fieldId = 'captionedInput'
      const {getByLabelText, getByText} = HTMLRender(
        <SSRProvider>
          <InputField id={fieldId}>
            <InputField.Label>{TEXTINPUTFIELD_LABEL_TEXT}</InputField.Label>
            <TextInput />
            <InputField.Caption>{TEXTINPUTFIELD_CAPTION_TEXT}</InputField.Caption>
          </InputField>
        </SSRProvider>
      )

      const inputNode = getByLabelText(TEXTINPUTFIELD_LABEL_TEXT)
      const captionNode = getByText(TEXTINPUTFIELD_CAPTION_TEXT)

      expect(captionNode.getAttribute('id')).toBe(`${fieldId}-caption`)
      expect(inputNode.getAttribute('aria-describedby')).toBe(`${fieldId}-caption`)
    })
    it('associates validation text with the input', () => {
      const fieldId = 'validatedInput'
      const {getByLabelText, getByText} = HTMLRender(
        <SSRProvider>
          <InputField id={fieldId} validationMap={{validName: 'success'}} validationResult="validName">
            <InputField.Label>{TEXTINPUTFIELD_LABEL_TEXT}</InputField.Label>
            <TextInput />
            <InputField.Validation validationKey="validName">{TEXTINPUTFIELD_SUCCESS_TEXT}</InputField.Validation>
          </InputField>
        </SSRProvider>
      )

      const inputNode = getByLabelText(TEXTINPUTFIELD_LABEL_TEXT)
      const validationNode = getByText(TEXTINPUTFIELD_SUCCESS_TEXT)

      expect(validationNode.getAttribute('id')).toBe(`${fieldId}-validationMsg`)
      expect(inputNode.getAttribute('aria-describedby')).toBe(`${fieldId}-validationMsg`)
    })
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(
      <SSRProvider>
        <InputField>
          <InputField.Label>{TEXTINPUTFIELD_LABEL_TEXT}</InputField.Label>
          <TextInput />
          <InputField.Caption>{TEXTINPUTFIELD_CAPTION_TEXT}</InputField.Caption>
        </InputField>
      </SSRProvider>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })
})
