import React from 'react'
import {render} from '../utils/testing'
import {render as HTMLRender, cleanup} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
import {RadioInputField} from '..'
import {MarkGithubIcon} from '@primer/octicons-react'
expect.extend(toHaveNoViolations)

const RADIOINPUTFIELD_LABEL_TEXT = 'Option one'
const RADIOINPUTFIELD_CAPTION_TEXT = 'Hint: a cool option'

describe('RadioInputField', () => {
  describe('snapshots', () => {
    it('renders with a label an input', () => {
      expect(
        render(
          <RadioInputField>
            <RadioInputField.Label>{RADIOINPUTFIELD_LABEL_TEXT}</RadioInputField.Label>
            <RadioInputField.Input />
          </RadioInputField>
        )
      ).toMatchSnapshot()
    })
    it('renders with a hidden label', () => {
      expect(
        render(
          <RadioInputField>
            <RadioInputField.Label visuallyHidden>{RADIOINPUTFIELD_LABEL_TEXT}</RadioInputField.Label>
            <RadioInputField.Input />
          </RadioInputField>
        )
      ).toMatchSnapshot()
    })
    it('renders with a custom ID', () => {
      expect(
        render(
          <RadioInputField id="customId">
            <RadioInputField.Label>{RADIOINPUTFIELD_LABEL_TEXT}</RadioInputField.Label>
            <RadioInputField.Input />
          </RadioInputField>
        )
      ).toMatchSnapshot()
    })
    it('renders as disabled', () => {
      expect(
        render(
          <RadioInputField disabled>
            <RadioInputField.Label visuallyHidden>{RADIOINPUTFIELD_LABEL_TEXT}</RadioInputField.Label>
            <RadioInputField.Input />
          </RadioInputField>
        )
      ).toMatchSnapshot()
    })
    it('renders as disabled with a LeadingVisual', () => {
      expect(
        render(
          <RadioInputField disabled>
            <RadioInputField.Label visuallyHidden>{RADIOINPUTFIELD_LABEL_TEXT}</RadioInputField.Label>
            <RadioInputField.Input />
            <RadioInputField.LeadingVisual>
              <MarkGithubIcon />
            </RadioInputField.LeadingVisual>
          </RadioInputField>
        )
      ).toMatchSnapshot()
    })
    it('renders with a caption', () => {
      expect(
        render(
          <RadioInputField>
            <RadioInputField.Label>{RADIOINPUTFIELD_LABEL_TEXT}</RadioInputField.Label>
            <RadioInputField.Input />
            <RadioInputField.Caption>{RADIOINPUTFIELD_CAPTION_TEXT}</RadioInputField.Caption>
          </RadioInputField>
        )
      ).toMatchSnapshot()
    })
    it('renders with a LeadingVisual and caption', () => {
      expect(
        render(
          <RadioInputField>
            <RadioInputField.Label>{RADIOINPUTFIELD_LABEL_TEXT}</RadioInputField.Label>
            <RadioInputField.Input />
            <RadioInputField.LeadingVisual>
              <MarkGithubIcon />
            </RadioInputField.LeadingVisual>
            <RadioInputField.Caption>{RADIOINPUTFIELD_CAPTION_TEXT}</RadioInputField.Caption>
          </RadioInputField>
        )
      ).toMatchSnapshot()
    })
    it('renders with a LeadingVisual', () => {
      expect(
        render(
          <RadioInputField>
            <RadioInputField.Label>{RADIOINPUTFIELD_LABEL_TEXT}</RadioInputField.Label>
            <RadioInputField.Input />
            <RadioInputField.LeadingVisual>
              <MarkGithubIcon />
            </RadioInputField.LeadingVisual>
          </RadioInputField>
        )
      ).toMatchSnapshot()
    })
  })

  describe('ARIA attributes', () => {
    it('associates the label with the input', () => {
      const {getByLabelText} = HTMLRender(
        <RadioInputField>
          <RadioInputField.Label>{RADIOINPUTFIELD_LABEL_TEXT}</RadioInputField.Label>
          <RadioInputField.Input />
        </RadioInputField>
      )

      const inputNode = getByLabelText(RADIOINPUTFIELD_LABEL_TEXT)
      expect(inputNode).toBeDefined()
    })
    it('associates caption text with the input', () => {
      const fieldId = 'captionedInput'
      const {getByLabelText, getByText} = HTMLRender(
        <RadioInputField id={fieldId}>
          <RadioInputField.Label>{RADIOINPUTFIELD_LABEL_TEXT}</RadioInputField.Label>
          <RadioInputField.Input />
          <RadioInputField.Caption>{RADIOINPUTFIELD_CAPTION_TEXT}</RadioInputField.Caption>
        </RadioInputField>
      )

      const inputNode = getByLabelText(RADIOINPUTFIELD_LABEL_TEXT)
      const captionNode = getByText(RADIOINPUTFIELD_CAPTION_TEXT)

      expect(captionNode.getAttribute('id')).toBe(`${fieldId}-caption`)
      expect(inputNode.getAttribute('aria-describedby')).toBe(`${fieldId}-caption`)
    })
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(
      <RadioInputField>
        <RadioInputField.Label>{RADIOINPUTFIELD_LABEL_TEXT}</RadioInputField.Label>
        <RadioInputField.Input />
        <RadioInputField.Caption>{RADIOINPUTFIELD_CAPTION_TEXT}</RadioInputField.Caption>
      </RadioInputField>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })
})
