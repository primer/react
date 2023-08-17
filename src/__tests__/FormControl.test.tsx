import React from 'react'
import {render} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import {Autocomplete, Checkbox, FormControl, Select, SSRProvider, Textarea, TextInput, TextInputWithTokens} from '..'
import {MarkGithubIcon} from '@primer/octicons-react'
expect.extend(toHaveNoViolations)

const LABEL_TEXT = 'Form control'
const CAPTION_TEXT = 'Hint text'
const ERROR_TEXT = 'This field is invalid'

describe('FormControl', () => {
  describe('vertically stacked layout (default)', () => {
    describe('rendering', () => {
      it('renders with a hidden label', () => {
        const {getByLabelText, getByText} = render(
          <SSRProvider>
            <FormControl>
              <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
              <TextInput />
            </FormControl>
          </SSRProvider>,
        )

        const input = getByLabelText(LABEL_TEXT)
        const label = getByText(LABEL_TEXT)

        expect(input).toBeDefined()
        expect(label).toBeDefined()
      })

      it('renders with a custom ID', () => {
        const {getByLabelText} = render(
          <SSRProvider>
            <FormControl id="customId">
              <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
              <TextInput />
            </FormControl>
          </SSRProvider>,
        )

        const input = getByLabelText(LABEL_TEXT)

        expect(input.getAttribute('id')).toBe('customId')
      })

      it('renders as disabled', () => {
        const {getByLabelText} = render(
          <SSRProvider>
            <FormControl disabled>
              <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
              <TextInput />
            </FormControl>
          </SSRProvider>,
        )

        const input = getByLabelText(LABEL_TEXT)

        expect(input.getAttribute('disabled')).not.toBeNull()
      })

      it('renders as required', () => {
        const {getByRole} = render(
          <SSRProvider>
            <FormControl required>
              <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
              <TextInput />
            </FormControl>
          </SSRProvider>,
        )

        const input = getByRole('textbox')

        expect(input.getAttribute('required')).not.toBeNull()
      })

      it('renders with a caption', () => {
        const {getByText} = render(
          <SSRProvider>
            <FormControl>
              <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
              <TextInput />
              <FormControl.Caption>{CAPTION_TEXT}</FormControl.Caption>
            </FormControl>
          </SSRProvider>,
        )

        const caption = getByText(CAPTION_TEXT)

        expect(caption).toBeDefined()
      })

      it('renders with a successful validation message', () => {
        const {getByText} = render(
          <SSRProvider>
            <FormControl>
              <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
              <TextInput />
              <FormControl.Validation variant="error">{ERROR_TEXT}</FormControl.Validation>
            </FormControl>
          </SSRProvider>,
        )

        const validationMessage = getByText(ERROR_TEXT)

        expect(validationMessage).toBeDefined()
      })

      it('renders with an error validation message', () => {
        const {getByText} = render(
          <SSRProvider>
            <FormControl>
              <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
              <TextInput />
              <FormControl.Validation variant="error">{ERROR_TEXT}</FormControl.Validation>
            </FormControl>
          </SSRProvider>,
        )

        const validationMessage = getByText(ERROR_TEXT)

        expect(validationMessage).toBeDefined()
      })

      it('renders with the input as a TextInputWithTokens', () => {
        const onRemoveMock = jest.fn()
        const {getByLabelText} = render(
          <SSRProvider>
            <FormControl>
              <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
              <TextInputWithTokens
                tokens={[
                  {text: 'zero', id: 0},
                  {text: 'one', id: 1},
                  {text: 'two', id: 2},
                ]}
                onTokenRemove={onRemoveMock}
              />
            </FormControl>
          </SSRProvider>,
        )

        const input = getByLabelText(LABEL_TEXT)

        expect(input).toBeDefined()
      })

      it('renders with the input as an Autocomplete', () => {
        const {getByLabelText} = render(
          <SSRProvider>
            <FormControl>
              <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
              <Autocomplete>
                <Autocomplete.Input block />
              </Autocomplete>
            </FormControl>
          </SSRProvider>,
        )

        const input = getByLabelText(LABEL_TEXT)

        expect(input).toBeDefined()
      })

      it('renders with the input as a Select', () => {
        const {getByLabelText, getByText} = render(
          <SSRProvider>
            <FormControl>
              <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
              <Select>
                <Select.Option value="one">Choice one</Select.Option>
                <Select.Option value="two">Choice two</Select.Option>
                <Select.Option value="three">Choice three</Select.Option>
              </Select>
            </FormControl>
          </SSRProvider>,
        )

        const input = getByLabelText(LABEL_TEXT)
        const label = getByText(LABEL_TEXT)

        expect(input).toBeDefined()
        expect(label).toBeDefined()
      })

      it('renders with the input as a Textarea', () => {
        const {getByLabelText, getByText} = render(
          <SSRProvider>
            <FormControl>
              <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
              <Textarea />
            </FormControl>
          </SSRProvider>,
        )

        const input = getByLabelText(LABEL_TEXT)
        const label = getByText(LABEL_TEXT)

        expect(input).toBeDefined()
        expect(label).toBeDefined()
      })

      it('passes through props on the label element', () => {
        const {getByLabelText, getByText} = render(
          <SSRProvider>
            <FormControl>
              <FormControl.Label data-testid="some-test-id">{LABEL_TEXT}</FormControl.Label>
              <Textarea />
            </FormControl>
          </SSRProvider>,
        )

        const input = getByLabelText(LABEL_TEXT)
        const label = getByText(LABEL_TEXT)

        expect(input).toBeDefined()
        expect(label).toBeDefined()
        expect(label).toHaveAttribute('data-testid', 'some-test-id')
      })
    })

    describe('ARIA attributes', () => {
      it('associates the label with the input', () => {
        const {getByLabelText} = render(
          <SSRProvider>
            <FormControl>
              <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
              <TextInput />
            </FormControl>
          </SSRProvider>,
        )

        const inputNode = getByLabelText(LABEL_TEXT)
        expect(inputNode).toBeDefined()
      })

      it('associates caption text with the input', () => {
        const fieldId = 'captionedInput'
        const {getByLabelText, getByText} = render(
          <SSRProvider>
            <FormControl id={fieldId}>
              <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
              <TextInput />
              <FormControl.Caption>{CAPTION_TEXT}</FormControl.Caption>
            </FormControl>
          </SSRProvider>,
        )

        const inputNode = getByLabelText(LABEL_TEXT)
        const captionNode = getByText(CAPTION_TEXT)

        expect(captionNode.getAttribute('id')).toBe(`${fieldId}-caption`)
        expect(inputNode.getAttribute('aria-describedby')).toBe(`${fieldId}-caption`)
      })

      it('associates validation text with the input', () => {
        const fieldId = 'validatedInput'
        const {getByLabelText, getByText} = render(
          <SSRProvider>
            <FormControl id={fieldId}>
              <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
              <TextInput />
              <FormControl.Validation variant="error">{ERROR_TEXT}</FormControl.Validation>
            </FormControl>
          </SSRProvider>,
        )

        const inputNode = getByLabelText(LABEL_TEXT)
        const validationNode = getByText(ERROR_TEXT)

        expect(validationNode.getAttribute('id')).toBe(`${fieldId}-validationMessage`)
        expect(inputNode.getAttribute('aria-describedby')).toBe(`${fieldId}-validationMessage`)
      })
    })

    describe('warnings', () => {
      it('should log an error if a user does not pass a label', () => {
        const spy = jest.spyOn(console, 'error').mockImplementationOnce(() => {})

        render(
          <SSRProvider>
            <FormControl>
              <TextInput />
              <FormControl.Caption>{CAPTION_TEXT}</FormControl.Caption>
            </FormControl>
          </SSRProvider>,
        )

        expect(spy).toHaveBeenCalledTimes(1)
        spy.mockRestore()
      })

      it('should warn users if they try to render a leading visual when using variant="stack"', async () => {
        const spy = jest.spyOn(console, 'warn').mockImplementationOnce(() => {})

        render(
          <SSRProvider>
            <FormControl>
              <FormControl.LeadingVisual>
                <MarkGithubIcon />
              </FormControl.LeadingVisual>
              <FormControl.Label>Name</FormControl.Label>
              <TextInput />
            </FormControl>
          </SSRProvider>,
        )

        expect(spy).toHaveBeenCalledTimes(1)
        spy.mockRestore()
      })

      it('should warn users if they pass an id directly to the input', async () => {
        const spy = jest.spyOn(console, 'warn').mockImplementationOnce(() => {})

        render(
          <SSRProvider>
            <FormControl>
              <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
              <TextInput id="testId" />
              <FormControl.Caption>{CAPTION_TEXT}</FormControl.Caption>
            </FormControl>
          </SSRProvider>,
        )

        expect(spy).toHaveBeenCalledTimes(1)
        spy.mockRestore()
      })

      it('should warn users if they pass a `disabled` prop directly to the input', async () => {
        const spy = jest.spyOn(console, 'warn').mockImplementationOnce(() => {})

        render(
          <SSRProvider>
            <FormControl>
              <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
              <TextInput disabled />
              <FormControl.Caption>{CAPTION_TEXT}</FormControl.Caption>
            </FormControl>
          </SSRProvider>,
        )

        expect(spy).toHaveBeenCalledTimes(1)
        spy.mockRestore()
      })

      it('should warn users if they pass a `required` prop directly to the input', async () => {
        const spy = jest.spyOn(console, 'warn').mockImplementationOnce(() => {})

        render(
          <SSRProvider>
            <FormControl>
              <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
              <TextInput required />
              <FormControl.Caption>{CAPTION_TEXT}</FormControl.Caption>
            </FormControl>
          </SSRProvider>,
        )

        expect(spy).toHaveBeenCalledTimes(1)
        spy.mockRestore()
      })
    })

    it('should have no axe violations', async () => {
      const {container} = render(
        <SSRProvider>
          <FormControl>
            <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
            <TextInput />
            <FormControl.Caption>{CAPTION_TEXT}</FormControl.Caption>
          </FormControl>
        </SSRProvider>,
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('checkbox and radio layout', () => {
    describe('rendering', () => {
      it('renders with a LeadingVisual', () => {
        const {getByLabelText} = render(
          <SSRProvider>
            <FormControl>
              <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
              <Checkbox />
              <FormControl.LeadingVisual>
                <MarkGithubIcon aria-label="Icon label" />
              </FormControl.LeadingVisual>
            </FormControl>
          </SSRProvider>,
        )

        expect(getByLabelText('Icon label')).toBeDefined()
      })
    })

    describe('warnings', () => {
      it('should warn users if they try to render a validation message when using a checkbox or radio', async () => {
        const consoleSpy = jest.spyOn(global.console, 'warn').mockImplementation()
        render(
          <SSRProvider>
            <FormControl>
              <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
              <Checkbox />
              <FormControl.Validation variant="error">Some error</FormControl.Validation>
              <FormControl.Caption>{CAPTION_TEXT}</FormControl.Caption>
            </FormControl>
          </SSRProvider>,
        )

        expect(consoleSpy).toHaveBeenCalled()
        consoleSpy.mockRestore()
      })

      it('should warn users if they pass `required` to a checkbox or radio', async () => {
        const consoleSpy = jest.spyOn(global.console, 'warn').mockImplementation()

        render(
          <SSRProvider>
            <FormControl required>
              <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
              <Checkbox required />
              <FormControl.Caption>{CAPTION_TEXT}</FormControl.Caption>
            </FormControl>
          </SSRProvider>,
        )

        expect(consoleSpy).toHaveBeenCalled()
        consoleSpy.mockRestore()
      })
    })

    it('should have no axe violations', async () => {
      const {container} = render(
        <SSRProvider>
          <FormControl>
            <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
            <Checkbox />
            <FormControl.Caption>{CAPTION_TEXT}</FormControl.Caption>
          </FormControl>
        </SSRProvider>,
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })
})
