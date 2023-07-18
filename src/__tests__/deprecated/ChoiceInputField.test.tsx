import React from 'react'
import {render} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import {Checkbox, Radio, SSRProvider} from '../../'
import ChoiceInputField from '../../deprecated/ChoiceInputField'
import {MarkGithubIcon} from '@primer/octicons-react'
expect.extend(toHaveNoViolations)

const CHECKBOXINPUTFIELD_LABEL_TEXT = 'Option one'
const CHECKBOXINPUTFIELD_CAPTION_TEXT = 'Hint: a cool option'

describe('ChoiceInputField', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders with a checkbox input', () => {
      const {getByLabelText} = render(
        <SSRProvider>
          <ChoiceInputField>
            <ChoiceInputField.Label>{CHECKBOXINPUTFIELD_LABEL_TEXT}</ChoiceInputField.Label>
            <Checkbox value="testCheckbox" />
          </ChoiceInputField>
        </SSRProvider>,
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
        </SSRProvider>,
      )

      const input = getByLabelText(CHECKBOXINPUTFIELD_LABEL_TEXT)

      expect(input.getAttribute('type')).toBe('radio')
    })
    it('renders with a custom ID', () => {
      const {getByLabelText} = render(
        <SSRProvider>
          <ChoiceInputField id="customId">
            <ChoiceInputField.Label>{CHECKBOXINPUTFIELD_LABEL_TEXT}</ChoiceInputField.Label>
            <Checkbox value="testCheckbox" />
          </ChoiceInputField>
        </SSRProvider>,
      )

      const input = getByLabelText(CHECKBOXINPUTFIELD_LABEL_TEXT)

      expect(input.getAttribute('id')).toBe('customId')
    })
    it('renders as disabled', () => {
      const {getByLabelText} = render(
        <SSRProvider>
          <ChoiceInputField disabled>
            <ChoiceInputField.Label>{CHECKBOXINPUTFIELD_LABEL_TEXT}</ChoiceInputField.Label>
            <Checkbox value="testCheckbox" />
          </ChoiceInputField>
        </SSRProvider>,
      )

      const input = getByLabelText(CHECKBOXINPUTFIELD_LABEL_TEXT)

      expect(input.getAttribute('disabled')).not.toBeNull()
    })
    it('renders with a caption', () => {
      const {getByText} = render(
        <SSRProvider>
          <ChoiceInputField>
            <ChoiceInputField.Label>{CHECKBOXINPUTFIELD_LABEL_TEXT}</ChoiceInputField.Label>
            <Checkbox value="testCheckbox" />
            <ChoiceInputField.Caption>{CHECKBOXINPUTFIELD_CAPTION_TEXT}</ChoiceInputField.Caption>
          </ChoiceInputField>
        </SSRProvider>,
      )

      const caption = getByText(CHECKBOXINPUTFIELD_CAPTION_TEXT)

      expect(caption).toBeDefined()
    })
    it('renders with a LeadingVisual', () => {
      const {getByLabelText} = render(
        <SSRProvider>
          <ChoiceInputField>
            <ChoiceInputField.Label>{CHECKBOXINPUTFIELD_LABEL_TEXT}</ChoiceInputField.Label>
            <Checkbox value="testCheckbox" />
            <ChoiceInputField.LeadingVisual>
              {/* eslint-disable-next-line github/a11y-aria-label-is-well-formatted */}
              <MarkGithubIcon aria-label="leadingVisualIcon" />
            </ChoiceInputField.LeadingVisual>
          </ChoiceInputField>
        </SSRProvider>,
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
            <Checkbox value="testCheckbox" />
          </ChoiceInputField>
        </SSRProvider>,
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
            <Checkbox value="testCheckbox" />
            <ChoiceInputField.Caption>{CHECKBOXINPUTFIELD_CAPTION_TEXT}</ChoiceInputField.Caption>
          </ChoiceInputField>
        </SSRProvider>,
      )

      const inputNode = getByLabelText(CHECKBOXINPUTFIELD_LABEL_TEXT)
      const captionNode = getByText(CHECKBOXINPUTFIELD_CAPTION_TEXT)

      expect(captionNode.getAttribute('id')).toBe(`${fieldId}-caption`)
      expect(inputNode.getAttribute('aria-describedby')).toBe(`${fieldId}-caption`)
    })
  })

  describe('warnings', () => {
    it('should warn users if they do not pass an input', async () => {
      const consoleSpy = jest.spyOn(global.console, 'warn').mockImplementation(() => {})
      render(
        <SSRProvider>
          <ChoiceInputField>
            <ChoiceInputField.Label>{CHECKBOXINPUTFIELD_LABEL_TEXT}</ChoiceInputField.Label>
            <ChoiceInputField.Caption>{CHECKBOXINPUTFIELD_CAPTION_TEXT}</ChoiceInputField.Caption>
          </ChoiceInputField>
        </SSRProvider>,
      )

      expect(consoleSpy).toHaveBeenCalledWith(
        'To correctly render this field with the correct ARIA attributes passed to the input, please pass the Checkbox or Radio component from @primer/react as a direct child of the ChoiceInputField component',
      )
    })

    it('should warn users if they pass an id directly to the input', async () => {
      const consoleSpy = jest.spyOn(global.console, 'warn').mockImplementation(() => {})
      render(
        <SSRProvider>
          <ChoiceInputField>
            <ChoiceInputField.Label>{CHECKBOXINPUTFIELD_LABEL_TEXT}</ChoiceInputField.Label>
            <Checkbox value="testCheckbox" id="testId" />
            <ChoiceInputField.Caption>{CHECKBOXINPUTFIELD_CAPTION_TEXT}</ChoiceInputField.Caption>
          </ChoiceInputField>
        </SSRProvider>,
      )

      expect(consoleSpy).toHaveBeenCalledWith(
        `instead of passing the 'id' prop directly to the checkbox input, it should be passed to the parent component, <ChoiceInputField>`,
      )
    })

    it('should warn users if they pass a `disabled` prop directly to the input', async () => {
      const consoleSpy = jest.spyOn(global.console, 'warn').mockImplementation(() => {})
      render(
        <SSRProvider>
          <ChoiceInputField>
            <ChoiceInputField.Label>{CHECKBOXINPUTFIELD_LABEL_TEXT}</ChoiceInputField.Label>
            <Checkbox value="testCheckbox" disabled />
            <ChoiceInputField.Caption>{CHECKBOXINPUTFIELD_CAPTION_TEXT}</ChoiceInputField.Caption>
          </ChoiceInputField>
        </SSRProvider>,
      )

      expect(consoleSpy).toHaveBeenCalledWith(
        `instead of passing the 'disabled' prop directly to the checkbox input, it should be passed to the parent component, <ChoiceInputField>`,
      )
    })

    it('should warn users if they pass a `required` prop directly to the input', async () => {
      const consoleSpy = jest.spyOn(global.console, 'warn').mockImplementation(() => {})
      render(
        <SSRProvider>
          <ChoiceInputField>
            <ChoiceInputField.Label>{CHECKBOXINPUTFIELD_LABEL_TEXT}</ChoiceInputField.Label>
            <Checkbox value="testCheckbox" required />
            <ChoiceInputField.Caption>{CHECKBOXINPUTFIELD_CAPTION_TEXT}</ChoiceInputField.Caption>
          </ChoiceInputField>
        </SSRProvider>,
      )

      expect(consoleSpy).toHaveBeenCalledWith(
        `instead of passing the 'required' prop directly to the checkbox input, it should be passed to the parent component, <ChoiceInputField>`,
      )
    })
  })

  it('should have no axe violations', async () => {
    const {container} = render(
      <SSRProvider>
        <ChoiceInputField>
          <ChoiceInputField.Label>{CHECKBOXINPUTFIELD_LABEL_TEXT}</ChoiceInputField.Label>
          <Checkbox value="testCheckbox" />
          <ChoiceInputField.Caption>{CHECKBOXINPUTFIELD_CAPTION_TEXT}</ChoiceInputField.Caption>
        </ChoiceInputField>
      </SSRProvider>,
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
