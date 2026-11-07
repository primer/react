import {render} from '@testing-library/react'
import {page} from 'vitest/browser'
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
import {SelectPanel} from '../../SelectPanel'
import {MarkGithubIcon} from '@primer/octicons-react'
import type {FCWithSlotMarker} from '../../utils/types'
import {implementsClassName} from '../../utils/testing'
import classes from '../FormControl.module.css'
import captionClasses from '../FormControlCaption.module.css'
import inputClasses from '../../internal/components/InputLabel.module.css'

const LABEL_TEXT = 'Form control'
const CAPTION_TEXT = 'Hint text'
const ERROR_TEXT = 'This field is invalid'

const WrappedLabelComponent: FCWithSlotMarker<object> = () => (
  <div>
    {/* eslint-disable-next-line primer-react/direct-slot-children */}
    <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
  </div>
)

WrappedLabelComponent.__SLOT__ = FormControl.Label.__SLOT__

const WrappedCaptionComponent: FCWithSlotMarker<object> = () => (
  <div>
    {/* eslint-disable-next-line primer-react/direct-slot-children */}
    <FormControl.Caption>{CAPTION_TEXT}</FormControl.Caption>
  </div>
)

WrappedCaptionComponent.__SLOT__ = FormControl.Caption.__SLOT__

const WrappedLeadingVisualComponent = () => (
  <div>
    {/* eslint-disable-next-line primer-react/direct-slot-children */}
    <FormControl.LeadingVisual>
      <MarkGithubIcon aria-label="Icon label" />
    </FormControl.LeadingVisual>
  </div>
)

WrappedLeadingVisualComponent.__SLOT__ = FormControl.LeadingVisual.__SLOT__

const WrappedValidationComponent: FCWithSlotMarker<object> = () => (
  <div>
    <FormControl.Validation variant="error">{ERROR_TEXT}</FormControl.Validation>
  </div>
)

WrappedValidationComponent.__SLOT__ = FormControl.Validation.__SLOT__

describe('FormControl', () => {
  implementsClassName(
    props => (
      <FormControl {...props}>
        <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
        <TextInput />
      </FormControl>
    ),
    classes.ControlVerticalLayout,
  )
  implementsClassName(
    props => (
      <FormControl {...props} layout="horizontal">
        <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
        <TextInput />
      </FormControl>
    ),
    classes.ControlHorizontalLayout,
  )
  implementsClassName(FormControl.Caption, captionClasses.Caption)
  implementsClassName(FormControl.Label, inputClasses.Label)

  it('renders data-component attributes (vertical, non-choice input)', async () => {
    const {container} = render(
      <FormControl id="test-id">
        <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
        <TextInput />
        <FormControl.Caption>{CAPTION_TEXT}</FormControl.Caption>
        <FormControl.Validation variant="error">{ERROR_TEXT}</FormControl.Validation>
      </FormControl>,
    )

    await expect
      .element(container.querySelector<HTMLElement>(':scope > :first-child'))
      .toHaveAttribute('data-component', 'FormControl')
    await expect
      .element(page.getByText(LABEL_TEXT, {exact: true}))
      .toHaveAttribute('data-component', 'FormControl.Label')
    await expect
      .element(page.getByText(CAPTION_TEXT, {exact: true}))
      .toHaveAttribute('data-component', 'FormControl.Caption')

    const validation = container.querySelector<HTMLElement>('[data-component="FormControl.Validation"]')
    await expect.element(validation).toHaveTextContent(ERROR_TEXT)
  })

  it('renders data-component attributes (choice input)', async () => {
    const {container} = render(
      <FormControl id="test-id-choice">
        <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
        <Checkbox />
        <FormControl.LeadingVisual>
          <MarkGithubIcon aria-label="Icon label" />
        </FormControl.LeadingVisual>
      </FormControl>,
    )

    await expect
      .element(container.querySelector<HTMLElement>(':scope > :first-child'))
      .toHaveAttribute('data-component', 'FormControl')
    await expect
      .element(page.getByText(LABEL_TEXT, {exact: true}))
      .toHaveAttribute('data-component', 'FormControl.Label')

    const leadingVisual = container.querySelector<HTMLElement>('[data-component="FormControl.LeadingVisual"]')
    await expect.element(leadingVisual).toBeInTheDocument()
  })

  it('renders a non-choice input only once in horizontal layout', () => {
    const {getAllByRole} = render(
      <FormControl layout="horizontal">
        <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
        <TextInput />
      </FormControl>,
    )

    expect(getAllByRole('textbox')).toHaveLength(1)
  })

  describe('vertically stacked layout (default)', () => {
    describe('rendering', () => {
      it('renders with a hidden label', async () => {
        render(
          <FormControl>
            <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
            <TextInput />
          </FormControl>,
        )

        const input = page.getByLabelText(LABEL_TEXT, {exact: true})
        const label = page.getByText(LABEL_TEXT, {exact: true})

        await expect.element(input).toBeInTheDocument()
        await expect.element(label).toBeInTheDocument()
      })

      it('renders with a custom ID', async () => {
        render(
          <FormControl id="customId">
            <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
            <TextInput />
          </FormControl>,
        )

        const input = page.getByLabelText(LABEL_TEXT, {exact: true})

        await expect.element(input).toHaveAttribute('id', 'customId')
      })

      it('renders as disabled', async () => {
        render(
          <FormControl disabled>
            <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
            <TextInput />
          </FormControl>,
        )

        const input = page.getByLabelText(LABEL_TEXT, {exact: true})

        await expect.element(input).toHaveAttribute('disabled')
      })

      it('renders as required', async () => {
        render(
          <FormControl required>
            <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
            <TextInput />
          </FormControl>,
        )

        const input = page.getByRole('textbox')

        await expect.element(input).toHaveAttribute('aria-required', 'true')
      })

      it('renders with a caption', async () => {
        render(
          <FormControl>
            <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
            <TextInput />
            <FormControl.Caption>{CAPTION_TEXT}</FormControl.Caption>
          </FormControl>,
        )

        const caption = page.getByText(CAPTION_TEXT, {exact: true})

        await expect.element(caption).toBeInTheDocument()
      })

      it('renders with a successful validation message', async () => {
        render(
          <FormControl>
            <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
            <TextInput />
            <FormControl.Validation variant="error">{ERROR_TEXT}</FormControl.Validation>
          </FormControl>,
        )

        const validationMessage = page.getByText(ERROR_TEXT, {exact: true})

        await expect.element(validationMessage).toBeInTheDocument()
      })

      it('renders with an error validation message', async () => {
        render(
          <FormControl>
            <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
            <TextInput />
            <FormControl.Validation variant="error">{ERROR_TEXT}</FormControl.Validation>
          </FormControl>,
        )

        const validationMessage = page.getByText(ERROR_TEXT, {exact: true})

        await expect.element(validationMessage).toBeInTheDocument()
      })

      it('renders with the input as a TextInputWithTokens', async () => {
        const onRemoveMock = vi.fn()
        render(
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

        const input = page.getByLabelText(LABEL_TEXT, {exact: true})

        await expect.element(input).toBeInTheDocument()
      })

      it('renders with the input as an Autocomplete', async () => {
        render(
          <FormControl>
            <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
            <Autocomplete>
              <Autocomplete.Input block />
            </Autocomplete>
          </FormControl>,
        )

        const input = page.getByLabelText(LABEL_TEXT, {exact: true})

        await expect.element(input).toBeInTheDocument()
      })

      it('renders with the input as a Select', async () => {
        render(
          <FormControl>
            <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
            <Select>
              <Select.Option value="one">Choice one</Select.Option>
              <Select.Option value="two">Choice two</Select.Option>
              <Select.Option value="three">Choice three</Select.Option>
            </Select>
          </FormControl>,
        )

        const input = page.getByLabelText(LABEL_TEXT, {exact: true})
        const label = page.getByText(LABEL_TEXT, {exact: true})

        await expect.element(input).toBeInTheDocument()
        await expect.element(label).toBeInTheDocument()
      })

      it('renders with the input as a Textarea', async () => {
        render(
          <FormControl>
            <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
            <Textarea />
          </FormControl>,
        )

        const input = page.getByLabelText(LABEL_TEXT, {exact: true})
        const label = page.getByText(LABEL_TEXT, {exact: true})

        await expect.element(input).toBeInTheDocument()
        await expect.element(label).toBeInTheDocument()
      })

      it('passes through props on the label element', async () => {
        render(
          <FormControl>
            <FormControl.Label data-testid="some-test-id">{LABEL_TEXT}</FormControl.Label>
            <Textarea />
          </FormControl>,
        )

        const input = page.getByLabelText(LABEL_TEXT, {exact: true})
        const label = page.getByText(LABEL_TEXT, {exact: true})

        await expect.element(input).toBeInTheDocument()
        await expect.element(label).toBeInTheDocument()
        await expect.element(label).toHaveAttribute('data-testid', 'some-test-id')
      })
    })

    describe('ARIA attributes', () => {
      it('associates the label with the input', async () => {
        render(
          <FormControl>
            <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
            <TextInput />
          </FormControl>,
        )

        const inputNode = page.getByLabelText(LABEL_TEXT, {exact: true})
        await expect.element(inputNode).toBeInTheDocument()
      })

      it('associates caption text with the input', async () => {
        const fieldId = 'captionedInput'
        render(
          <FormControl id={fieldId}>
            <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
            <TextInput />
            <FormControl.Caption>{CAPTION_TEXT}</FormControl.Caption>
          </FormControl>,
        )

        const inputNode = page.getByLabelText(LABEL_TEXT, {exact: true})
        const captionNode = page.getByText(CAPTION_TEXT, {exact: true})

        await expect.element(captionNode).toHaveAttribute('id', `${fieldId}-caption`)
        await expect.element(inputNode).toHaveAttribute('aria-describedby', `${fieldId}-caption`)
      })

      it('associates validation text with the input', async () => {
        const fieldId = 'validatedInput'
        render(
          <FormControl id={fieldId}>
            <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
            <TextInput />
            <FormControl.Validation variant="error">{ERROR_TEXT}</FormControl.Validation>
          </FormControl>,
        )

        const inputNode = page.getByLabelText(LABEL_TEXT, {exact: true})
        const validationNode = page.getByText(ERROR_TEXT, {exact: true})

        await expect.element(validationNode).toHaveAttribute('id', `${fieldId}-validationMessage`)
        await expect.element(inputNode).toHaveAttribute('aria-describedby', `${fieldId}-validationMessage`)
      })

      it('does not wire htmlFor for SelectPanel, and composes aria-labelledby from label + selected value', async () => {
        const fieldId = 'select-panel-field'

        const {container} = render(
          <FormControl id={fieldId}>
            <FormControl.Label>Labels</FormControl.Label>
            <SelectPanel
              open={false}
              onOpenChange={() => {}}
              items={[]}
              selected={[{id: 1, text: 'bug'}]}
              onSelectedChange={() => {}}
              onFilterChange={() => {}}
            />
          </FormControl>,
        )

        const labelEl = container.querySelector('label')
        await expect.element(labelEl).toBeInTheDocument()
        await expect.element(labelEl).not.toHaveAttribute('for')

        const button = page.getByRole('button')
        await expect.element(button).toHaveAttribute('aria-labelledby')
        const labelledBy = button.element().getAttribute('aria-labelledby') ?? ''

        expect(labelledBy.split(' ')).toEqual(expect.arrayContaining([`${fieldId}-label`, `${fieldId}-selected-value`]))

        await expect.element(container.querySelector<HTMLElement>(`#${fieldId}-selected-value`)).toBeInTheDocument()

        await expect.element(page.getByText('bug', {exact: true})).toBeInTheDocument()
      })

      it('uses a custom FormControl.Label id in SelectPanel aria-labelledby', async () => {
        const fieldId = 'select-panel-field'
        const customLabelId = 'my-custom-label-id'

        const {container} = render(
          <FormControl id={fieldId}>
            <FormControl.Label id={customLabelId}>Labels</FormControl.Label>
            <SelectPanel
              open={false}
              onOpenChange={() => {}}
              items={[]}
              selected={[{id: 1, text: 'bug'}]}
              onSelectedChange={() => {}}
              onFilterChange={() => {}}
            />
          </FormControl>,
        )

        const labelEl = container.querySelector('label')
        await expect.element(labelEl).toBeInTheDocument()
        await expect.element(labelEl).toHaveAttribute('id', customLabelId)
        await expect.element(labelEl).not.toHaveAttribute('for')

        const button = page.getByRole('button')
        const labelledBy = button.element().getAttribute('aria-labelledby') ?? ''

        expect(labelledBy.split(' ')).toEqual(expect.arrayContaining([customLabelId, `${fieldId}-selected-value`]))
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
      it('should correctly identify a label wrapped in a div using __SLOT__ property', async () => {
        const spy = vi.spyOn(console, 'error').mockImplementationOnce(() => {})

        const {container} = render(
          <FormControl>
            <WrappedLabelComponent />
            <TextInput />
          </FormControl>,
        )

        // The label should be found as a slot because of the __SLOT__ property
        // This should NOT trigger the error about missing FormControl.Label
        expect(spy).toHaveBeenCalledTimes(0)

        // The label should function properly - input should be labeled correctly
        const input = page.getByLabelText(LABEL_TEXT, {exact: true})
        await expect.element(input).toBeInTheDocument()
        await expect.element(container).toHaveTextContent(LABEL_TEXT)

        spy.mockRestore()
      })

      it('should correctly identify a caption wrapped in a div using __SLOT__ property', async () => {
        const {container} = render(
          <FormControl id="test-caption">
            <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
            <TextInput />
            <WrappedCaptionComponent />
          </FormControl>,
        )

        // The caption should be found as a slot because of the __SLOT__ property
        // We can verify this by checking that aria-describedby includes the caption ID
        const input = page.getByRole('textbox')
        await expect.element(input).toHaveAttribute('aria-describedby', expect.stringContaining('test-caption-caption'))

        // The caption text should be rendered and functional
        await expect.element(container).toHaveTextContent(CAPTION_TEXT)
      })

      it('should correctly identify a validation wrapped in a div using __SLOT__ property', async () => {
        const {container} = render(
          <FormControl id="test-validation">
            <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
            <TextInput />
            <WrappedValidationComponent />
          </FormControl>,
        )

        // The validation should be found as a slot because of the __SLOT__ property
        // We can verify this by checking that aria-describedby includes the validation ID
        const input = page.getByRole('textbox')
        await expect
          .element(input)
          .toHaveAttribute('aria-describedby', expect.stringContaining('test-validation-validationMessage'))

        // The validation text should be rendered and functional
        await expect.element(container).toHaveTextContent(ERROR_TEXT)
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
      it('should correctly identify a leading visual wrapped in a div using __SLOT__ property for choice inputs', async () => {
        const {container} = render(
          <FormControl>
            <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
            <Checkbox />
            <WrappedLeadingVisualComponent />
          </FormControl>,
        )

        // The leading visual should be found as a slot because of the __SLOT__ property
        // We can verify this by checking that the leading visual container is present
        const leadingVisualContainer = container.querySelector<HTMLElement>('[data-has-leading-visual]')
        await expect.element(leadingVisualContainer).toBeInTheDocument()

        // The icon should be rendered and functional
        await expect.element(page.getByLabelText('Icon label', {exact: true})).toBeInTheDocument()
        await expect.element(container.querySelector('svg')).toBeInTheDocument()
      })
    })
  })

  describe('checkbox and radio layout', () => {
    describe('rendering', () => {
      it('renders with a LeadingVisual', async () => {
        render(
          <FormControl>
            <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
            <Checkbox />
            <FormControl.LeadingVisual>
              <MarkGithubIcon aria-label="Icon label" />
            </FormControl.LeadingVisual>
          </FormControl>,
        )

        await expect.element(page.getByLabelText('Icon label', {exact: true})).toBeInTheDocument()
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
        render(
          <FormControl required>
            <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
            <Checkbox />
            <FormControl.Caption>{CAPTION_TEXT}</FormControl.Caption>
          </FormControl>,
        )

        await expect.element(page.getByRole('checkbox')).toBeRequired()
      })

      it('should not add required prop to individual radio', async () => {
        render(
          <FormControl required>
            <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
            <Radio value="radio" name="radio" />
            <FormControl.Caption>{CAPTION_TEXT}</FormControl.Caption>
          </FormControl>,
        )

        await expect.element(page.getByRole('radio')).not.toBeRequired()
      })

      it('should allow required prop on checkbox if part of CheckboxGroup', async () => {
        render(
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

        await expect.element(page.getByTestId('checkbox-1')).toBeRequired()
        await expect.element(page.getByTestId('checkbox-2')).not.toBeRequired()
      })
    })
  })

  describe('horizontal layout', () => {
    it('renders only one input when layout is horizontal with a non-choice input', () => {
      const {getAllByRole} = render(
        <FormControl layout="horizontal">
          <FormControl.Label>{LABEL_TEXT}</FormControl.Label>
          <TextInput />
        </FormControl>,
      )

      expect(getAllByRole('textbox')).toHaveLength(1)
    })
  })
})
