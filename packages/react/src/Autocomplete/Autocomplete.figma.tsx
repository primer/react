// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import {Autocomplete, FormControl} from '../../src'
import figma from '@figma/code-connect'

figma.connect(
  Autocomplete,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=35998-101114&t=YpDA3JEwnEs85tYu-4',
  {
    props: {
      TextInput: figma.children('Autocomplete.Input'),
      // menu: figma.nestedProps('_AutocompleteMenu', {
      //   items: figma.children('*'),
      // }),
    },
    example: ({TextInput}) => (
      <FormControl>
        <Autocomplete>
          {TextInput}
          <Autocomplete.Overlay>
            <Autocomplete.Menu>{/* Children */}</Autocomplete.Menu>
          </Autocomplete.Overlay>
        </Autocomplete>
      </FormControl>
    ),
  },
)

figma.connect(
  Autocomplete.Input,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=35998-100935&t=YpDA3JEwnEs85tYu-4',
  {
    props: {
      input: figma.nestedProps('TextInput', {
        size: figma.enum('size', {
          small: 'small',
          medium: 'medium',
          large: 'large',
        }),
        trailingAction: figma.boolean('trailingAction?', {
          true: figma.instance('trailingAction'),
          false: undefined,
        }),
        leadingVisual: figma.boolean('leadingVisual?', {
          false: undefined,
          true: figma.instance('icon'),
        }),
        caption: figma.boolean('caption?', {
          false: undefined,
          true: figma.children('FormControl.Caption'),
        }),
        label: figma.boolean('label?', {
          false: undefined,
          true: figma.children('FormControl.Label'),
        }),
        disabled: figma.enum('state', {disabled: true}),
        inset: figma.boolean('inset?'),
        validation: figma.children('Form.Validation'),
      }),
      textInput: figma.nestedProps('Text Input', {
        label: figma.textContent('Label'),
      }),
      labelProps: figma.nestedProps('FormControl.Label', {
        required: figma.boolean('required'),
      }),
    },
    // variant: {'label?': true},
    example: ({textInput, input}) => (
      <>
        {input.label}
        <Autocomplete.Input
          size={input.size}
          value={textInput.label}
          trailingAction={input.trailingAction}
          leadingVisual={input.leadingVisual}
        />
        {input.validation}
        {input.caption}
      </>
    ),
  },
)
