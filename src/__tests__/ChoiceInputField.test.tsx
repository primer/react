import React from 'react'
import {render, cleanup} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
import {Checkbox, ChoiceInputField, Radio, SSRProvider} from '..'
import {MarkGithubIcon} from '@primer/octicons-react'
expect.extend(toHaveNoViolations)

const CHECKBOXINPUTFIELD_LABEL_TEXT = 'Option one'
const CHECKBOXINPUTFIELD_CAPTION_TEXT = 'Hint: a cool option'

describe('ChoiceInputField', () => {
  afterEach(() => {
    cleanup()
    jest.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders with a checkbox input', () => {
      const {getByLabelText} = render(
        <SSRProvider>
          <ChoiceInputField>
            <ChoiceInputField.Label>{CHECKBOXINPUTFIELD_LABEL_TEXT}</ChoiceInputField.Label>
            <Checkbox />
          </ChoiceInputField>
        </SSRProvider>
      )

      const input = getByLabelText(CHECKBOXINPUTFIELD_LABEL_TEXT)

      expect(input.getAttribute('type')).toBe('checkbox')
    })
    it('renders with a radio input', () => {
      const {getByLabelText} = render(
        <SSRProvider>
          <ChoiceInputField>
            <ChoiceInputField.Label>{CHECKBOXINPUTFIELD_LABEL_TEXT}</ChoiceInputField.Label>
            <Radio name="testRadio" value="testRadio" />
          </ChoiceInputField>
        </SSRProvider>
      )

      const input = getByLabelText(CHECKBOXINPUTFIELD_LABEL_TEXT)

      expect(input.getAttribute('type')).toBe('radio')
    })
    it('renders with a custom ID', () => {
      const {getByLabelText} = render(
        <SSRProvider>
          <ChoiceInputField id="customId">
            <ChoiceInputField.Label>{CHECKBOXINPUTFIELD_LABEL_TEXT}</ChoiceInputField.Label>
            <Checkbox />
          </ChoiceInputField>
        </SSRProvider>
      )

      const input = getByLabelText(CHECKBOXINPUTFIELD_LABEL_TEXT)

      expect(input.getAttribute('id')).toBe('customId')
    })
    it('renders as disabled', () => {
      const {getByLabelText} = render(
        <SSRProvider>
          <ChoiceInputField disabled>
            <ChoiceInputField.Label>{CHECKBOXINPUTFIELD_LABEL_TEXT}</ChoiceInputField.Label>
            <Checkbox />
          </ChoiceInputField>
        </SSRProvider>
      )

      const input = getByLabelText(CHECKBOXINPUTFIELD_LABEL_TEXT)

      expect(input.getAttribute('disabled')).not.toBeNull()
    })
    it('renders with a caption', () => {
      const {getByText} = render(
        <SSRProvider>
          <ChoiceInputField>
            <ChoiceInputField.Label>{CHECKBOXINPUTFIELD_LABEL_TEXT}</ChoiceInputField.Label>
            <Checkbox />
            <ChoiceInputField.Caption>{CHECKBOXINPUTFIELD_CAPTION_TEXT}</ChoiceInputField.Caption>
          </ChoiceInputField>
        </SSRProvider>
      )

      const caption = getByText(CHECKBOXINPUTFIELD_CAPTION_TEXT)

      expect(caption).toBeDefined()
    })
    it('renders with a LeadingVisual', () => {
      const {getByLabelText} = render(
        <SSRProvider>
          <ChoiceInputField>
            <ChoiceInputField.Label>{CHECKBOXINPUTFIELD_LABEL_TEXT}</ChoiceInputField.Label>
            <Checkbox />
            <ChoiceInputField.LeadingVisual>
              <MarkGithubIcon aria-label="leadingVisualIcon" />
            </ChoiceInputField.LeadingVisual>
          </ChoiceInputField>
        </SSRProvider>
      )

      const leadingVisual = getByLabelText('leadingVisualIcon')

      expect(leadingVisual).toBeDefined()
    })
  })

  describe('ARIA attributes', () => {
    it('associates the label with the input', () => {
      const {getByLabelText} = render(
        <SSRProvider>
          <ChoiceInputField>
            <ChoiceInputField.Label>{CHECKBOXINPUTFIELD_LABEL_TEXT}</ChoiceInputField.Label>
            <Checkbox />
          </ChoiceInputField>
        </SSRProvider>
      )

      const inputNode = getByLabelText(CHECKBOXINPUTFIELD_LABEL_TEXT)
      expect(inputNode).toBeDefined()
    })
    it('associates caption text with the input', () => {
      const fieldId = 'captionedInput'
      const {getByLabelText, getByText} = render(
        <SSRProvider>
          <ChoiceInputField id="captionedInput">
            <ChoiceInputField.Label>{CHECKBOXINPUTFIELD_LABEL_TEXT}</ChoiceInputField.Label>
            <Checkbox />
            <ChoiceInputField.Caption>{CHECKBOXINPUTFIELD_CAPTION_TEXT}</ChoiceInputField.Caption>
          </ChoiceInputField>
        </SSRProvider>
      )

      const inputNode = getByLabelText(CHECKBOXINPUTFIELD_LABEL_TEXT)
      const captionNode = getByText(CHECKBOXINPUTFIELD_CAPTION_TEXT)

      expect(captionNode.getAttribute('id')).toBe(`${fieldId}-caption`)
      expect(inputNode.getAttribute('aria-describedby')).toBe(`${fieldId}-caption`)
    })
  })

  describe('warnings', () => {
    it('should warn users if they do not pass an input', async () => {
      const consoleSpy = jest.spyOn(global.console, 'warn')
      render(
        <SSRProvider>
          <ChoiceInputField>
            <ChoiceInputField.Label>{CHECKBOXINPUTFIELD_LABEL_TEXT}</ChoiceInputField.Label>
            <ChoiceInputField.Caption>{CHECKBOXINPUTFIELD_CAPTION_TEXT}</ChoiceInputField.Caption>
          </ChoiceInputField>
        </SSRProvider>
      )

      expect(consoleSpy).toHaveBeenCalled()
    })

    it('should warn users if they pass an id directly to the input', async () => {
      const consoleSpy = jest.spyOn(global.console, 'warn')
      render(
        <SSRProvider>
          <ChoiceInputField>
            <ChoiceInputField.Label>{CHECKBOXINPUTFIELD_LABEL_TEXT}</ChoiceInputField.Label>
            <Checkbox id="testId" />
            <ChoiceInputField.Caption>{CHECKBOXINPUTFIELD_CAPTION_TEXT}</ChoiceInputField.Caption>
          </ChoiceInputField>
        </SSRProvider>
      )

      expect(consoleSpy).toHaveBeenCalled()
    })

    it('should warn users if they pass a `disabled` prop directly to the input', async () => {
      const consoleSpy = jest.spyOn(global.console, 'warn')
      render(
        <SSRProvider>
          <ChoiceInputField>
            <ChoiceInputField.Label>{CHECKBOXINPUTFIELD_LABEL_TEXT}</ChoiceInputField.Label>
            <Checkbox disabled />
            <ChoiceInputField.Caption>{CHECKBOXINPUTFIELD_CAPTION_TEXT}</ChoiceInputField.Caption>
          </ChoiceInputField>
        </SSRProvider>
      )

      expect(consoleSpy).toHaveBeenCalled()
    })

    it('should warn users if they pass a `required` prop directly to the input', async () => {
      const consoleSpy = jest.spyOn(global.console, 'warn')
      render(
        <SSRProvider>
          <ChoiceInputField>
            <ChoiceInputField.Label>{CHECKBOXINPUTFIELD_LABEL_TEXT}</ChoiceInputField.Label>
            <Checkbox required />
            <ChoiceInputField.Caption>{CHECKBOXINPUTFIELD_CAPTION_TEXT}</ChoiceInputField.Caption>
          </ChoiceInputField>
        </SSRProvider>
      )

      expect(consoleSpy).toHaveBeenCalled()
    })
  })

  it('should have no axe violations', async () => {
    const {container} = render(
      <SSRProvider>
        <ChoiceInputField>
          <ChoiceInputField.Label>{CHECKBOXINPUTFIELD_LABEL_TEXT}</ChoiceInputField.Label>
          <Checkbox />
          <ChoiceInputField.Caption>{CHECKBOXINPUTFIELD_CAPTION_TEXT}</ChoiceInputField.Caption>
        </ChoiceInputField>
      </SSRProvider>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
