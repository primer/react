import React from 'react'
import {render} from '../utils/testing'
import {render as HTMLRender, cleanup} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
import {TextInputField, TextInputWithTokens} from '..'
expect.extend(toHaveNoViolations)

const TEXTINPUTFIELD_LABEL_TEXT = 'Name'
const TEXTINPUTFIELD_CAPTION_TEXT = 'Hint: your first name'
const TEXTINPUTFIELD_SUCCESS_TEXT = 'This name is valid'

describe('TextInputField', () => {
  describe('snapshots', () => {
    it('renders with a label an input', () => {
      expect(
        render(
          <TextInputField>
            <TextInputField.Label>{TEXTINPUTFIELD_LABEL_TEXT}</TextInputField.Label>
            <TextInputField.Input />
          </TextInputField>
        )
      ).toMatchSnapshot()
    })
    it('renders with a hidden label', () => {
      expect(
        render(
          <TextInputField>
            <TextInputField.Label visuallyHidden>{TEXTINPUTFIELD_LABEL_TEXT}</TextInputField.Label>
            <TextInputField.Input />
          </TextInputField>
        )
      ).toMatchSnapshot()
    })
    it('renders with a custom ID', () => {
      expect(
        render(
          <TextInputField id="customId">
            <TextInputField.Label>{TEXTINPUTFIELD_LABEL_TEXT}</TextInputField.Label>
            <TextInputField.Input />
          </TextInputField>
        )
      ).toMatchSnapshot()
    })
    it('renders as disabled', () => {
      expect(
        render(
          <TextInputField disabled>
            <TextInputField.Label visuallyHidden>{TEXTINPUTFIELD_LABEL_TEXT}</TextInputField.Label>
            <TextInputField.Input />
          </TextInputField>
        )
      ).toMatchSnapshot()
    })
    it('renders as required', () => {
      expect(
        render(
          <TextInputField required>
            <TextInputField.Label>{TEXTINPUTFIELD_LABEL_TEXT}</TextInputField.Label>
            <TextInputField.Input />
          </TextInputField>
        )
      ).toMatchSnapshot()
    })
    it('renders with a caption', () => {
      expect(
        render(
          <TextInputField>
            <TextInputField.Label>{TEXTINPUTFIELD_LABEL_TEXT}</TextInputField.Label>
            <TextInputField.Input />
            <TextInputField.Caption>{TEXTINPUTFIELD_CAPTION_TEXT}</TextInputField.Caption>
          </TextInputField>
        )
      ).toMatchSnapshot()
    })
    it('renders with a successful validation message', () => {
      expect(
        render(
          <TextInputField
            validationMap={{
              noSpaces: 'error',
              validName: 'success'
            }}
            validationResult="validName"
          >
            <TextInputField.Label>{TEXTINPUTFIELD_LABEL_TEXT}</TextInputField.Label>
            <TextInputField.Input />
            <TextInputField.Validation validationKey="validName">
              {TEXTINPUTFIELD_SUCCESS_TEXT}
            </TextInputField.Validation>
          </TextInputField>
        )
      ).toMatchSnapshot()
    })
    it('renders with an error validation message', () => {
      expect(
        render(
          <TextInputField
            validationMap={{
              noSpaces: 'error',
              validName: 'success'
            }}
            validationResult="noSpaces"
          >
            <TextInputField.Label>{TEXTINPUTFIELD_LABEL_TEXT}</TextInputField.Label>
            <TextInputField.Input />
            <TextInputField.Validation validationKey="noSpaces">
              Your first name cannot contain spaces
            </TextInputField.Validation>
          </TextInputField>
        )
      ).toMatchSnapshot()
    })
    it('renders with the input as a TextInputWithTokens', () => {
      const onRemoveMock = jest.fn()
      expect(
        render(
          <TextInputField>
            <TextInputField.Label>{TEXTINPUTFIELD_LABEL_TEXT}</TextInputField.Label>
            <TextInputField.Input
              as={TextInputWithTokens}
              tokens={[
                {text: 'zero', id: 0},
                {text: 'one', id: 1},
                {text: 'two', id: 2}
              ]}
              onRemove={onRemoveMock}
            />
          </TextInputField>
        )
      ).toMatchSnapshot()
    })
  })

  describe('ARIA attributes', () => {
    it('associates the label with the input', () => {
      const {getByLabelText} = HTMLRender(
        <TextInputField>
          <TextInputField.Label>{TEXTINPUTFIELD_LABEL_TEXT}</TextInputField.Label>
          <TextInputField.Input />
        </TextInputField>
      )

      const inputNode = getByLabelText(TEXTINPUTFIELD_LABEL_TEXT)
      expect(inputNode).toBeDefined()
    })
    it('associates caption text with the input', () => {
      const fieldId = 'captionedInput'
      const {getByLabelText, getByText} = HTMLRender(
        <TextInputField id={fieldId}>
          <TextInputField.Label>{TEXTINPUTFIELD_LABEL_TEXT}</TextInputField.Label>
          <TextInputField.Input />
          <TextInputField.Caption>{TEXTINPUTFIELD_CAPTION_TEXT}</TextInputField.Caption>
        </TextInputField>
      )

      const inputNode = getByLabelText(TEXTINPUTFIELD_LABEL_TEXT)
      const captionNode = getByText(TEXTINPUTFIELD_CAPTION_TEXT)

      expect(captionNode.getAttribute('id')).toBe(`${fieldId}-caption`)
      expect(inputNode.getAttribute('aria-describedby')).toBe(`${fieldId}-caption`)
    })
    it('associates validation text with the input', () => {
      const fieldId = 'validatedInput'
      const {getByLabelText, getByText} = HTMLRender(
        <TextInputField id={fieldId} validationMap={{validName: 'success'}} validationResult="validName">
          <TextInputField.Label>{TEXTINPUTFIELD_LABEL_TEXT}</TextInputField.Label>
          <TextInputField.Input />
          <TextInputField.Validation validationKey="validName">{TEXTINPUTFIELD_SUCCESS_TEXT}</TextInputField.Validation>
        </TextInputField>
      )

      const inputNode = getByLabelText(TEXTINPUTFIELD_LABEL_TEXT)
      const validationNode = getByText(TEXTINPUTFIELD_SUCCESS_TEXT)

      expect(validationNode.getAttribute('id')).toBe(`${fieldId}-validationMsg`)
      expect(inputNode.getAttribute('aria-describedby')).toBe(`${fieldId}-validationMsg`)
    })
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(
      <TextInputField>
        <TextInputField.Label>{TEXTINPUTFIELD_LABEL_TEXT}</TextInputField.Label>
        <TextInputField.Input />
        <TextInputField.Caption>{TEXTINPUTFIELD_CAPTION_TEXT}</TextInputField.Caption>
      </TextInputField>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })
})
