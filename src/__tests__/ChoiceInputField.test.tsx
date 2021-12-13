import React from 'react'
import {render} from '../utils/testing'
import {render as HTMLRender, cleanup} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
import {Checkbox, ChoiceInputField, Radio, SSRProvider} from '..'
import {MarkGithubIcon} from '@primer/octicons-react'
expect.extend(toHaveNoViolations)

const CHECKBOXINPUTFIELD_LABEL_TEXT = 'Option one'
const CHECKBOXINPUTFIELD_CAPTION_TEXT = 'Hint: a cool option'

describe('ChoiceInputField', () => {
  describe('snapshots', () => {
    it('renders with a label and input', () => {
      expect(
        render(
          <SSRProvider>
            <ChoiceInputField>
              <ChoiceInputField.Label>{CHECKBOXINPUTFIELD_LABEL_TEXT}</ChoiceInputField.Label>
              <Checkbox />
            </ChoiceInputField>
          </SSRProvider>
        )
      ).toMatchSnapshot()
    })
    it('renders with a radio input', () => {
      expect(
        render(
          <SSRProvider>
            <ChoiceInputField>
              <ChoiceInputField.Label>{CHECKBOXINPUTFIELD_LABEL_TEXT}</ChoiceInputField.Label>
              <Radio name="textRadioInput" value="choice" />
            </ChoiceInputField>
          </SSRProvider>
        )
      ).toMatchSnapshot()
    })
    it('renders with a hidden label', () => {
      expect(
        render(
          <SSRProvider>
            <ChoiceInputField>
              <ChoiceInputField.Label visuallyHidden>{CHECKBOXINPUTFIELD_LABEL_TEXT}</ChoiceInputField.Label>
              <Checkbox />
            </ChoiceInputField>
          </SSRProvider>
        )
      ).toMatchSnapshot()
    })
    it('renders with a custom ID', () => {
      expect(
        render(
          <SSRProvider>
            <ChoiceInputField id="customId">
              <ChoiceInputField.Label>{CHECKBOXINPUTFIELD_LABEL_TEXT}</ChoiceInputField.Label>
              <Checkbox />
            </ChoiceInputField>
          </SSRProvider>
        )
      ).toMatchSnapshot()
    })
    it('renders as disabled', () => {
      expect(
        render(
          <SSRProvider>
            <ChoiceInputField disabled>
              <ChoiceInputField.Label visuallyHidden>{CHECKBOXINPUTFIELD_LABEL_TEXT}</ChoiceInputField.Label>
              <Checkbox />
            </ChoiceInputField>
          </SSRProvider>
        )
      ).toMatchSnapshot()
    })
    it('renders as disabled with a LeadingVisual', () => {
      expect(
        render(
          <SSRProvider>
            <ChoiceInputField disabled>
              <ChoiceInputField.Label visuallyHidden>{CHECKBOXINPUTFIELD_LABEL_TEXT}</ChoiceInputField.Label>
              <Checkbox />
              <ChoiceInputField.LeadingVisual>
                <MarkGithubIcon />
              </ChoiceInputField.LeadingVisual>
            </ChoiceInputField>
          </SSRProvider>
        )
      ).toMatchSnapshot()
    })
    it('renders with a caption', () => {
      expect(
        render(
          <SSRProvider>
            <ChoiceInputField>
              <ChoiceInputField.Label>{CHECKBOXINPUTFIELD_LABEL_TEXT}</ChoiceInputField.Label>
              <Checkbox />
              <ChoiceInputField.Caption>{CHECKBOXINPUTFIELD_CAPTION_TEXT}</ChoiceInputField.Caption>
            </ChoiceInputField>
          </SSRProvider>
        )
      ).toMatchSnapshot()
    })
    it('renders with a LeadingVisual and caption', () => {
      expect(
        render(
          <SSRProvider>
            <ChoiceInputField>
              <ChoiceInputField.Label>{CHECKBOXINPUTFIELD_LABEL_TEXT}</ChoiceInputField.Label>
              <Checkbox />
              <ChoiceInputField.LeadingVisual>
                <MarkGithubIcon />
              </ChoiceInputField.LeadingVisual>
              <ChoiceInputField.Caption>{CHECKBOXINPUTFIELD_CAPTION_TEXT}</ChoiceInputField.Caption>
            </ChoiceInputField>
          </SSRProvider>
        )
      ).toMatchSnapshot()
    })
    it('renders with a LeadingVisual', () => {
      expect(
        render(
          <SSRProvider>
            <ChoiceInputField>
              <ChoiceInputField.Label>{CHECKBOXINPUTFIELD_LABEL_TEXT}</ChoiceInputField.Label>
              <Checkbox />
              <ChoiceInputField.LeadingVisual>
                <MarkGithubIcon />
              </ChoiceInputField.LeadingVisual>
            </ChoiceInputField>
          </SSRProvider>
        )
      ).toMatchSnapshot()
    })
  })

  describe('ARIA attributes', () => {
    it('associates the label with the input', () => {
      const {getByLabelText} = HTMLRender(
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
      const {getByLabelText, getByText} = HTMLRender(
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

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(
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
    cleanup()
  })
})
