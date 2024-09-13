import React from 'react'
import {render} from '@testing-library/react'
import {renderHook} from '@testing-library/react-hooks'
import axe from 'axe-core'
import {
  Autocomplete,
  Checkbox,
  FormControl,
  Select,
  Textarea,
  TextInput,
  TextInputWithTokens,
  useFormControlForwardedProps,
} from '..'
import {MarkGithubIcon} from '@primer/octicons-react'

const LABEL_TEXT = 'Form control'
const CAPTION_TEXT = 'Hint text'
const ERROR_TEXT = 'This field is invalid'

describe('FormControl', () => {
  describe('vertically stacked layout (default)', () => {
    describe('rendering', () => {
      it('renders with a hidden label', () => {
        const {getByLabelText, getByText} = render(
          <FormControl>
            <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
            <TextInput />
          </FormControl>,
        )

        const input = getByLabelText(LABEL_TEXT)
        const label = getByText(LABEL_TEXT)

        expect(input).toBeDefined()
        expect(label).toBeDefined()
      })

      it('renders with a custom ID', () => {
        const {getByLabelText} = render(
          <FormControl id="customId">
            <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
            <TextInput />
          </FormControl>,
        )

        const input = getByLabelText(LABEL_TEXT)

        expect(input.getAttribute('id')).toBe('customId')
      })

      it('renders as disabled', () => {
        const {getByLabelText} = render(
          <FormControl disabled>
            <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
            <TextInput />
          </FormControl>,
        )

        const input = getByLabelText(LABEL_TEXT)

        expect(input.getAttribute('disabled')).not.toBeNull()
      })

      it('renders as required', () => {
        const {getByRole} = render(
          <FormControl required>
            <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
            <TextInput />
          </FormControl>,
        )

        const input = getByRole('textbox')

        expect(input).toHaveAttribute('aria-required', 'true')
      })

      it('renders with a caption', () => {
        const {getByText} = render(
          <FormControl>
            <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
            <TextInput />
            <FormControl.Caption>{CAPTION_TEXT}</FormControl.Caption>
          </FormControl>,
        )

        const caption = getByText(CAPTION_TEXT)

        expect(caption).toBeDefined()
      })

      it('renders with a successful validation message', () => {
        const {getByText} = render(
          <FormControl>
            <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
            <TextInput />
            <FormControl.Validation variant="error">{ERROR_TEXT}</FormControl.Validation>
          </FormControl>,
        )

        const validationMessage = getByText(ERROR_TEXT)

        expect(validationMessage).toBeDefined()
      })

      it('renders with an error validation message', () => {
        const {getByText} = render(
          <FormControl>
            <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
            <TextInput />
            <FormControl.Validation variant="error">{ERROR_TEXT}</FormControl.Validation>
          </FormControl>,
        )

        const validationMessage = getByText(ERROR_TEXT)

        expect(validationMessage).toBeDefined()
      })

      it('renders with the input as a TextInputWithTokens', () => {
        const onRemoveMock = jest.fn()
        const {getByLabelText} = render(
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
          </FormControl>,
        )

        const input = getByLabelText(LABEL_TEXT)

        expect(input).toBeDefined()
      })

      it('renders with the input as an Autocomplete', () => {
        const {getByLabelText} = render(
          <FormControl>
            <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
            <Autocomplete>
              <Autocomplete.Input block />
            </Autocomplete>
          </FormControl>,
        )

        const input = getByLabelText(LABEL_TEXT)

        expect(input).toBeDefined()
      })

      it('renders with the input as a Select', () => {
        const {getByLabelText, getByText} = render(
          <FormControl>
            <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
            <Select>
              <Select.Option value="one">Choice one</Select.Option>
              <Select.Option value="two">Choice two</Select.Option>
              <Select.Option value="three">Choice three</Select.Option>
            </Select>
          </FormControl>,
        )

        const input = getByLabelText(LABEL_TEXT)
        const label = getByText(LABEL_TEXT)

        expect(input).toBeDefined()
        expect(label).toBeDefined()
      })

      it('renders with the input as a Textarea', () => {
        const {getByLabelText, getByText} = render(
          <FormControl>
            <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
            <Textarea />
          </FormControl>,
        )

        const input = getByLabelText(LABEL_TEXT)
        const label = getByText(LABEL_TEXT)

        expect(input).toBeDefined()
        expect(label).toBeDefined()
      })

      it('passes through props on the label element', () => {
        const {getByLabelText, getByText} = render(
          <FormControl>
            <FormControl.Label data-testid="some-test-id">{LABEL_TEXT}</FormControl.Label>
            <Textarea />
          </FormControl>,
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
          <FormControl>
            <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
            <TextInput />
          </FormControl>,
        )

        const inputNode = getByLabelText(LABEL_TEXT)
        expect(inputNode).toBeDefined()
      })

      it('associates caption text with the input', () => {
        const fieldId = 'captionedInput'
        const {getByLabelText, getByText} = render(
          <FormControl id={fieldId}>
            <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
            <TextInput />
            <FormControl.Caption>{CAPTION_TEXT}</FormControl.Caption>
          </FormControl>,
        )

        const inputNode = getByLabelText(LABEL_TEXT)
        const captionNode = getByText(CAPTION_TEXT)

        expect(captionNode.getAttribute('id')).toBe(`${fieldId}-caption`)
        expect(inputNode.getAttribute('aria-describedby')).toBe(`${fieldId}-caption`)
      })

      it('associates validation text with the input', () => {
        const fieldId = 'validatedInput'
        const {getByLabelText, getByText} = render(
          <FormControl id={fieldId}>
            <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
            <TextInput />
            <FormControl.Validation variant="error">{ERROR_TEXT}</FormControl.Validation>
          </FormControl>,
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
          <FormControl>
            <TextInput />
            <FormControl.Caption>{CAPTION_TEXT}</FormControl.Caption>
          </FormControl>,
        )

        expect(spy).toHaveBeenCalledTimes(1)
        spy.mockRestore()
      })

      it('should warn users if they try to render a leading visual when using variant="stack"', async () => {
        const spy = jest.spyOn(console, 'warn').mockImplementationOnce(() => {})

        render(
          <FormControl>
            <FormControl.LeadingVisual>
              <MarkGithubIcon />
            </FormControl.LeadingVisual>
            <FormControl.Label>Name</FormControl.Label>
            <TextInput />
          </FormControl>,
        )

        expect(spy).toHaveBeenCalledTimes(1)
        spy.mockRestore()
      })

      it('should warn users if they pass an id directly to the input', async () => {
        const spy = jest.spyOn(console, 'warn').mockImplementationOnce(() => {})

        render(
          <FormControl>
            <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
            <TextInput id="testId" />
            <FormControl.Caption>{CAPTION_TEXT}</FormControl.Caption>
          </FormControl>,
        )

        expect(spy).toHaveBeenCalledTimes(1)
        spy.mockRestore()
      })

      it('should warn users if they pass a `disabled` prop directly to the input', async () => {
        const spy = jest.spyOn(console, 'warn').mockImplementationOnce(() => {})

        render(
          <FormControl>
            <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
            <TextInput disabled />
            <FormControl.Caption>{CAPTION_TEXT}</FormControl.Caption>
          </FormControl>,
        )

        expect(spy).toHaveBeenCalledTimes(1)
        spy.mockRestore()
      })

      it('should warn users if they pass a `required` prop directly to the input', async () => {
        const spy = jest.spyOn(console, 'warn').mockImplementationOnce(() => {})

        render(
          <FormControl>
            <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
            <TextInput required />
            <FormControl.Caption>{CAPTION_TEXT}</FormControl.Caption>
          </FormControl>,
        )

        expect(spy).toHaveBeenCalledTimes(1)
        spy.mockRestore()
      })
    })

    it('should have no axe violations', async () => {
      const {container} = render(
        <FormControl>
          <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
          <TextInput />
          <FormControl.Caption>{CAPTION_TEXT}</FormControl.Caption>
        </FormControl>,
      )
      const results = await axe.run(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('checkbox and radio layout', () => {
    describe('rendering', () => {
      it('renders with a LeadingVisual', () => {
        const {getByLabelText} = render(
          <FormControl>
            <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
            <Checkbox />
            <FormControl.LeadingVisual>
              <MarkGithubIcon aria-label="Icon label" />
            </FormControl.LeadingVisual>
          </FormControl>,
        )

        expect(getByLabelText('Icon label')).toBeDefined()
      })
    })

    describe('warnings', () => {
      it('should warn users if they try to render a validation message when using a checkbox or radio', async () => {
        const consoleSpy = jest.spyOn(global.console, 'warn').mockImplementation()
        render(
          <FormControl>
            <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
            <Checkbox />
            <FormControl.Validation variant="error">Some error</FormControl.Validation>
            <FormControl.Caption>{CAPTION_TEXT}</FormControl.Caption>
          </FormControl>,
        )

        expect(consoleSpy).toHaveBeenCalled()
        consoleSpy.mockRestore()
      })

      it('should warn users if they pass `required` to a checkbox or radio', async () => {
        const consoleSpy = jest.spyOn(global.console, 'warn').mockImplementation()

        render(
          <FormControl required>
            <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
            <Checkbox required />
            <FormControl.Caption>{CAPTION_TEXT}</FormControl.Caption>
          </FormControl>,
        )

        expect(consoleSpy).toHaveBeenCalled()
        consoleSpy.mockRestore()
      })
    })

    it('should have no axe violations', async () => {
      const {container} = render(
        <FormControl>
          <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
          <Checkbox />
          <FormControl.Caption>{CAPTION_TEXT}</FormControl.Caption>
        </FormControl>,
      )
      const results = await axe.run(container)
      expect(results).toHaveNoViolations()
    })
  })
})

describe('useFormControlForwardedProps', () => {
  describe('when used outside FormControl', () => {
    test('returns empty object when no props object passed', () => {
      const result = renderHook(() => useFormControlForwardedProps())
      expect(result.result.current).toEqual({})
    })

    test('returns passed props object instance when passed', () => {
      const props = {id: 'test-id'}
      const result = renderHook(() => useFormControlForwardedProps(props))
      expect(result.result.current).toBe(props)
    })
  })

  test('provides context value when no props object is passed', () => {
    const id = 'test-id'

    const {result} = renderHook(() => useFormControlForwardedProps(), {
      wrapper: ({children}: {children: React.ReactNode}) => (
        <FormControl id={id} disabled required>
          <FormControl.Label>Label</FormControl.Label>
          {children}
        </FormControl>
      ),
    })

    expect(result.current.disabled).toBe(true)
    expect(result.current.id).toBe(id)
    expect(result.current.required).toBe(true)
  })

  test('merges with props object, overriding to prioritize props when conflicting', () => {
    const props = {id: 'override-id', xyz: 'someValue'}

    const {result} = renderHook(() => useFormControlForwardedProps(props), {
      wrapper: ({children}: {children: React.ReactNode}) => (
        <FormControl id="form-control-id" disabled>
          <FormControl.Label>Label</FormControl.Label>
          {children}
        </FormControl>
      ),
    })

    expect(result.current.disabled).toBe(true)
    expect(result.current.id).toBe(props.id)
    expect(result.current.required).toBeFalsy()
    expect(result.current.xyz).toBe(props.xyz)
  })
})
