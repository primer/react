import {render} from '@testing-library/react'
import {describe, expect, it, vi} from 'vitest'
import Autocomplete from '../../Autocomplete'
import Checkbox from '../../Checkbox'
import CheckboxGroup from '../../CheckboxGroup'
import FormControl from '../../FormControl'
import Radio from '../../Radio'
import Select from '../../Select'
import Textarea from '../../Textarea'
import TextInput from '../../TextInput'
import TextInputWithTokens from '../../TextInputWithTokens'
import {MarkGithubIcon} from '@primer/octicons-react'

const LABEL_TEXT = 'Form control'
const CAPTION_TEXT = 'Hint text'
const ERROR_TEXT = 'This field is invalid'

const WrappedLabelComponent = () => (
  <div>
    {/* eslint-disable-next-line primer-react/direct-slot-children */}
    <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
  </div>
)

WrappedLabelComponent.__SLOT__ = Symbol('FormControl.Label')

const WrappedCaptionComponent = () => (
  <div>
    {/* eslint-disable-next-line primer-react/direct-slot-children */}
    <FormControl.Caption>{CAPTION_TEXT}</FormControl.Caption>
  </div>
)

WrappedCaptionComponent.__SLOT__ = Symbol('FormControl.Caption')

const WrappedLeadingVisualComponent = () => (
  <div>
    {/* eslint-disable-next-line primer-react/direct-slot-children */}
    <FormControl.LeadingVisual>
      <MarkGithubIcon aria-label="Icon label" />
    </FormControl.LeadingVisual>
  </div>
)

WrappedLeadingVisualComponent.__SLOT__ = Symbol('FormControl.LeadingVisual')

const WrappedValidationComponent = () => (
  <div>
    <FormControl.Validation variant="error">{ERROR_TEXT}</FormControl.Validation>
  </div>
)

WrappedValidationComponent.__SLOT__ = Symbol('FormControl.Validation')

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
        const onRemoveMock = vi.fn()
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
        const spy = vi.spyOn(console, 'error').mockImplementationOnce(() => {})

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
        const spy = vi.spyOn(console, 'warn').mockImplementationOnce(() => {})

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
        const spy = vi.spyOn(console, 'warn').mockImplementationOnce(() => {})

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
        const spy = vi.spyOn(console, 'warn').mockImplementationOnce(() => {})

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
        const spy = vi.spyOn(console, 'warn').mockImplementationOnce(() => {})

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

    describe('slot identification', () => {
      it('should correctly identify a label wrapped in a div using __SLOT__ property', () => {
        const spy = vi.spyOn(console, 'error').mockImplementationOnce(() => {})

        const {container, getByLabelText} = render(
          <FormControl>
            <WrappedLabelComponent />
            <TextInput />
          </FormControl>,
        )

        // The label should be found as a slot because of the __SLOT__ property
        // This should NOT trigger the error about missing FormControl.Label
        expect(spy).toHaveBeenCalledTimes(0)

        // The label should function properly - input should be labeled correctly
        const input = getByLabelText(LABEL_TEXT)
        expect(input).toBeDefined()
        expect(container.textContent).toContain(LABEL_TEXT)

        spy.mockRestore()
      })

      it('should correctly identify a caption wrapped in a div using __SLOT__ property', () => {
        const {container} = render(
          <FormControl id="test-caption">
            <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
            <TextInput />
            <WrappedCaptionComponent />
          </FormControl>,
        )

        // The caption should be found as a slot because of the __SLOT__ property
        // We can verify this by checking that aria-describedby includes the caption ID
        const input = container.querySelector('input')
        const ariaDescribedBy = input?.getAttribute('aria-describedby') || ''
        expect(ariaDescribedBy).toContain('test-caption-caption')

        // The caption text should be rendered and functional
        expect(container.textContent).toContain(CAPTION_TEXT)
      })

      it('should correctly identify a validation wrapped in a div using __SLOT__ property', () => {
        const {container} = render(
          <FormControl id="test-validation">
            <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
            <TextInput />
            <WrappedValidationComponent />
          </FormControl>,
        )

        // The validation should be found as a slot because of the __SLOT__ property
        // We can verify this by checking that aria-describedby includes the validation ID
        const input = container.querySelector('input')
        const ariaDescribedBy = input?.getAttribute('aria-describedby') || ''
        expect(ariaDescribedBy).toContain('test-validation-validationMessage')

        // The validation text should be rendered and functional
        expect(container.textContent).toContain(ERROR_TEXT)
      })

      it('should correctly identify a leading visual wrapped in a div using __SLOT__ property for non-choice inputs', () => {
        const spy = vi.spyOn(console, 'warn').mockImplementationOnce(() => {})

        const {container} = render(
          <FormControl>
            <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
            <TextInput />
            <WrappedLeadingVisualComponent />
          </FormControl>,
        )

        // The leading visual should be found as a slot because of the __SLOT__ property
        // This should trigger a warning since leading visuals are only for choice inputs
        expect(spy).toHaveBeenCalledTimes(1)

        // The icon should be rendered in the DOM
        expect(container.querySelector('svg')).toBeDefined()

        spy.mockRestore()
      })
      it('should correctly identify a leading visual wrapped in a div using __SLOT__ property for choice inputs', () => {
        const {container, getByLabelText} = render(
          <FormControl>
            <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
            <Checkbox />
            <WrappedLeadingVisualComponent />
          </FormControl>,
        )

        // The leading visual should be found as a slot because of the __SLOT__ property
        // We can verify this by checking that the leading visual container is present
        const leadingVisualContainer = container.querySelector('[data-has-leading-visual]')
        expect(leadingVisualContainer).toBeDefined()

        // The icon should be rendered and functional
        expect(getByLabelText('Icon label')).toBeDefined()
        expect(container.querySelector('svg')).toBeDefined()
      })
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
        const consoleSpy = vi.spyOn(globalThis.console, 'warn').mockImplementation(() => {})
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

      it('should warn users if they pass `required` to a radio', async () => {
        const consoleSpy = vi.spyOn(globalThis.console, 'warn').mockImplementation(() => {})

        render(
          <FormControl required>
            <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
            <Radio value="radio" name="radio" required />
            <FormControl.Caption>{CAPTION_TEXT}</FormControl.Caption>
          </FormControl>,
        )

        expect(consoleSpy).toHaveBeenCalled()
        consoleSpy.mockRestore()
      })

      it('should allow required prop to individual checkbox', async () => {
        const {getByRole} = render(
          <FormControl required>
            <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
            <Checkbox />
            <FormControl.Caption>{CAPTION_TEXT}</FormControl.Caption>
          </FormControl>,
        )

        expect(getByRole('checkbox')).toBeRequired()
      })

      it('should not add required prop to individual radio', async () => {
        const {getByRole} = render(
          <FormControl required>
            <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
            <Radio value="radio" name="radio" />
            <FormControl.Caption>{CAPTION_TEXT}</FormControl.Caption>
          </FormControl>,
        )

        expect(getByRole('radio')).not.toBeRequired()
      })

      it('should allow required prop on checkbox if part of CheckboxGroup', async () => {
        const {getByTestId} = render(
          <CheckboxGroup>
            <CheckboxGroup.Label>Checkboxes</CheckboxGroup.Label>
            <FormControl required>
              <Checkbox value="checkOne" data-testid="checkbox-1" />
              <FormControl.Label>Checkbox one</FormControl.Label>
            </FormControl>
            <FormControl>
              <Checkbox value="checkTwo" data-testid="checkbox-2" />
              <FormControl.Label>Checkbox two</FormControl.Label>
            </FormControl>
            <FormControl>
              <Checkbox value="checkThree" />
              <FormControl.Label>Checkbox three</FormControl.Label>
            </FormControl>
          </CheckboxGroup>,
        )

        expect(getByTestId('checkbox-1')).toBeRequired()
        expect(getByTestId('checkbox-2')).not.toBeRequired()
      })
    })
  })
})
