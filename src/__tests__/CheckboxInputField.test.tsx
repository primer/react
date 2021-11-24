import React from 'react'
import {render} from '../utils/testing'
import {render as HTMLRender, cleanup} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
import {CheckboxInputField} from '..'
import {MarkGithubIcon} from '@primer/octicons-react'
expect.extend(toHaveNoViolations)

const CHECKBOXINPUTFIELD_LABEL_TEXT = 'Option one'
const CHECKBOXINPUTFIELD_CAPTION_TEXT = 'Hint: a cool option'

describe('CheckboxInputField', () => {
  describe('snapshots', () => {
    it('renders with a label an input', () => {
      expect(
        render(
          <CheckboxInputField>
            <CheckboxInputField.Label>{CHECKBOXINPUTFIELD_LABEL_TEXT}</CheckboxInputField.Label>
            <CheckboxInputField.Input />
          </CheckboxInputField>
        )
      ).toMatchSnapshot()
    })
    it('renders with a hidden label', () => {
      expect(
        render(
          <CheckboxInputField>
            <CheckboxInputField.Label visuallyHidden>{CHECKBOXINPUTFIELD_LABEL_TEXT}</CheckboxInputField.Label>
            <CheckboxInputField.Input />
          </CheckboxInputField>
        )
      ).toMatchSnapshot()
    })
    it('renders with a custom ID', () => {
      expect(
        render(
          <CheckboxInputField id="customId">
            <CheckboxInputField.Label>{CHECKBOXINPUTFIELD_LABEL_TEXT}</CheckboxInputField.Label>
            <CheckboxInputField.Input />
          </CheckboxInputField>
        )
      ).toMatchSnapshot()
    })
    it('renders as disabled', () => {
      expect(
        render(
          <CheckboxInputField disabled>
            <CheckboxInputField.Label visuallyHidden>{CHECKBOXINPUTFIELD_LABEL_TEXT}</CheckboxInputField.Label>
            <CheckboxInputField.Input />
          </CheckboxInputField>
        )
      ).toMatchSnapshot()
    })
    it('renders as disabled with a LeadingVisual', () => {
      expect(
        render(
          <CheckboxInputField disabled>
            <CheckboxInputField.Label visuallyHidden>{CHECKBOXINPUTFIELD_LABEL_TEXT}</CheckboxInputField.Label>
            <CheckboxInputField.Input />
            <CheckboxInputField.LeadingVisual>
              <MarkGithubIcon />
            </CheckboxInputField.LeadingVisual>
          </CheckboxInputField>
        )
      ).toMatchSnapshot()
    })
    it('renders with a caption', () => {
      expect(
        render(
          <CheckboxInputField>
            <CheckboxInputField.Label>{CHECKBOXINPUTFIELD_LABEL_TEXT}</CheckboxInputField.Label>
            <CheckboxInputField.Input />
            <CheckboxInputField.Caption>{CHECKBOXINPUTFIELD_CAPTION_TEXT}</CheckboxInputField.Caption>
          </CheckboxInputField>
        )
      ).toMatchSnapshot()
    })
    it('renders with a LeadingVisual and caption', () => {
      expect(
        render(
          <CheckboxInputField>
            <CheckboxInputField.Label>{CHECKBOXINPUTFIELD_LABEL_TEXT}</CheckboxInputField.Label>
            <CheckboxInputField.Input />
            <CheckboxInputField.LeadingVisual>
              <MarkGithubIcon />
            </CheckboxInputField.LeadingVisual>
            <CheckboxInputField.Caption>{CHECKBOXINPUTFIELD_CAPTION_TEXT}</CheckboxInputField.Caption>
          </CheckboxInputField>
        )
      ).toMatchSnapshot()
    })
    it('renders with a LeadingVisual', () => {
      expect(
        render(
          <CheckboxInputField>
            <CheckboxInputField.Label>{CHECKBOXINPUTFIELD_LABEL_TEXT}</CheckboxInputField.Label>
            <CheckboxInputField.Input />
            <CheckboxInputField.LeadingVisual>
              <MarkGithubIcon />
            </CheckboxInputField.LeadingVisual>
          </CheckboxInputField>
        )
      ).toMatchSnapshot()
    })
  })

  describe('ARIA attributes', () => {
    it('associates the label with the input', () => {
      const {getByLabelText} = HTMLRender(
        <CheckboxInputField>
          <CheckboxInputField.Label>{CHECKBOXINPUTFIELD_LABEL_TEXT}</CheckboxInputField.Label>
          <CheckboxInputField.Input />
        </CheckboxInputField>
      )

      const inputNode = getByLabelText(CHECKBOXINPUTFIELD_LABEL_TEXT)
      expect(inputNode).toBeDefined()
    })
    it('associates caption text with the input', () => {
      const fieldId = 'captionedInput'
      const {getByLabelText, getByText} = HTMLRender(
        <CheckboxInputField id={fieldId}>
          <CheckboxInputField.Label>{CHECKBOXINPUTFIELD_LABEL_TEXT}</CheckboxInputField.Label>
          <CheckboxInputField.Input />
          <CheckboxInputField.Caption>{CHECKBOXINPUTFIELD_CAPTION_TEXT}</CheckboxInputField.Caption>
        </CheckboxInputField>
      )

      const inputNode = getByLabelText(CHECKBOXINPUTFIELD_LABEL_TEXT)
      const captionNode = getByText(CHECKBOXINPUTFIELD_CAPTION_TEXT)

      expect(captionNode.getAttribute('id')).toBe(`${fieldId}-caption`)
      expect(inputNode.getAttribute('aria-describedby')).toBe(`${fieldId}-caption`)
    })
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(
      <CheckboxInputField>
        <CheckboxInputField.Label>{CHECKBOXINPUTFIELD_LABEL_TEXT}</CheckboxInputField.Label>
        <CheckboxInputField.Input />
        <CheckboxInputField.Caption>{CHECKBOXINPUTFIELD_CAPTION_TEXT}</CheckboxInputField.Caption>
      </CheckboxInputField>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })
})
