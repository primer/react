import React, {useState} from 'react'
import type {Meta} from '@storybook/react-vite'
import {
  Autocomplete,
  BaseStyles,
  Button,
  Checkbox,
  CheckboxGroup,
  FormControl,
  Radio,
  RadioGroup,
  Select,
  SelectPanel,
  Text,
  TextInput,
  TextInputWithTokens,
  Textarea,
  ThemeProvider,
  theme,
} from '..'
import {MarkGithubIcon, TriangleDownIcon} from '@primer/octicons-react'
import type {ItemInput} from '../SelectPanel'
import {Stack} from '../Stack'
import classes from './FormControl.features.stories.module.css'

export default {
  title: 'Components/FormControl/Features',
  decorators: [
    Story => {
      return (
        <ThemeProvider theme={theme}>
          <BaseStyles>
            <Story />
          </BaseStyles>
        </ThemeProvider>
      )
    },
  ],
  argTypes: {
    disabled: {
      type: 'boolean',
    },
    required: {
      type: 'boolean',
    },
    label: {
      type: 'string',
    },
    caption: {
      type: 'string',
    },
  },
} as Meta

interface ArgTypes {
  disabled: boolean
  required: boolean
  label: string
  caption: string
}
const mockTokens = [
  {text: 'zero', id: 0},
  {text: 'one', id: 1},
  {text: 'two', id: 2},
  {text: 'three', id: 3},
  {text: 'four', id: 4},
  {text: 'five', id: 5},
  {text: 'six', id: 6},
  {text: 'seven', id: 7},
  {text: 'twenty', id: 20},
  {text: 'twentyone', id: 21},
]

export const WithComplexInputs = () => {
  const [tokens, setTokens] = useState([...mockTokens])
  const onTokenRemove = (tokenId: string | number) => {
    setTokens(tokens.filter((token: {id: string | number}) => token.id !== tokenId))
  }

  return (
    <div className={classes.GridContainer}>
      <FormControl>
        <FormControl.Label id="form-label">TextInputWithTokens</FormControl.Label>
        <TextInputWithTokens onTokenRemove={onTokenRemove} tokens={tokens} />
      </FormControl>
      <FormControl>
        <FormControl.Label id="autocomplete-label">Autocomplete</FormControl.Label>
        <Autocomplete>
          <Autocomplete.Input block />
          <Autocomplete.Overlay>
            <Autocomplete.Menu
              aria-labelledby="autocomplete-label"
              items={[
                {text: 'css', id: '0'},
                {text: 'css-in-js', id: '1'},
                {text: 'styled-system', id: '2'},
                {text: 'javascript', id: '3'},
                {text: 'typescript', id: '4'},
                {text: 'react', id: '5'},
                {text: 'design-systems', id: '6'},
              ]}
              selectedItemIds={[]}
            />
          </Autocomplete.Overlay>
        </Autocomplete>
      </FormControl>
      <FormControl>
        <FormControl.Label>Select</FormControl.Label>
        <Select>
          <Select.Option value="figma">Figma</Select.Option>
          <Select.Option value="css">Primer CSS</Select.Option>
          <Select.Option value="prc">Primer React components</Select.Option>
          <Select.Option value="pvc">Primer ViewComponents</Select.Option>
        </Select>
      </FormControl>
      <FormControl>
        <FormControl.Label>Textarea</FormControl.Label>
        <Textarea />
      </FormControl>
    </div>
  )
}

const CustomTextInput = (
  props: React.JSX.IntrinsicAttributes &
    React.ClassAttributes<HTMLInputElement> &
    React.InputHTMLAttributes<HTMLInputElement>,
) => <input type="text" {...props} />
const CustomCheckboxInput = (
  props: React.JSX.IntrinsicAttributes &
    React.ClassAttributes<HTMLInputElement> &
    React.InputHTMLAttributes<HTMLInputElement>,
) => <input type="checkbox" {...props} />

export const FormControlWithCustomInput = () => {
  const [value, setValue] = React.useState('mona lisa')
  const [validationResult, setValidationResult] = React.useState('')
  const doesValueContainSpaces = (inputValue: string) => /\s/g.test(inputValue)
  const handleInputChange = (e: {currentTarget: {value: React.SetStateAction<string>}}) => {
    setValue(e.currentTarget.value)
  }

  React.useEffect(() => {
    if (doesValueContainSpaces(value)) {
      setValidationResult('noSpaces')
    } else if (value) {
      setValidationResult('validName')
    }
  }, [value])

  return (
    <div className={classes.GridContainer}>
      <FormControl>
        <FormControl.Label htmlFor="custom-input">GitHub handle</FormControl.Label>
        <CustomTextInput
          id="custom-input"
          aria-describedby="custom-input-caption custom-input-validation"
          aria-invalid={validationResult === 'noSpaces'}
          onChange={handleInputChange}
        />
        {validationResult === 'noSpaces' && (
          <FormControl.Validation id="custom-input-validation" variant="error">
            GitHub handles cannot contain spaces
          </FormControl.Validation>
        )}
        {validationResult === 'validName' && (
          <FormControl.Validation id="custom-input-validation" variant="success">
            Valid name
          </FormControl.Validation>
        )}
        <FormControl.Caption id="custom-input-caption">
          With or without &quot;@&quot;. For example &quot;monalisa&quot; or &quot;@monalisa&quot;
        </FormControl.Caption>
      </FormControl>

      <CheckboxGroup>
        <CheckboxGroup.Label>Checkboxes</CheckboxGroup.Label>
        <FormControl layout="horizontal">
          <CustomCheckboxInput
            id="custom-checkbox-one"
            aria-describedby="custom-checkbox-one-caption"
            value="checkOne"
          />
          <FormControl.Label htmlFor="custom-checkbox-one">Checkbox one</FormControl.Label>
          <FormControl.Caption id="custom-checkbox-one-caption">Hint text for checkbox one</FormControl.Caption>
        </FormControl>
        <FormControl layout="horizontal">
          <CustomCheckboxInput
            id="custom-checkbox-two"
            aria-describedby="custom-checkbox-two-caption"
            value="checkTwo"
          />
          <FormControl.Label htmlFor="custom-checkbox-two">Checkbox two</FormControl.Label>
          <FormControl.Caption id="custom-checkbox-two-caption">Hint text for checkbox two</FormControl.Caption>
        </FormControl>
      </CheckboxGroup>
    </div>
  )
}

export const WithCheckboxAndRadioInputs = () => {
  return (
    <div className={classes.GapContainer}>
      <CheckboxGroup>
        <CheckboxGroup.Label>Checkboxes</CheckboxGroup.Label>
        <FormControl>
          <Checkbox value="checkOne" />
          <FormControl.Label>Checkbox one</FormControl.Label>
        </FormControl>
        <FormControl>
          <Checkbox value="checkTwo" />
          <FormControl.Label>Checkbox two</FormControl.Label>
        </FormControl>
        <FormControl>
          <Checkbox value="checkThree" />
          <FormControl.Label>Checkbox three</FormControl.Label>
        </FormControl>
      </CheckboxGroup>

      <RadioGroup name={''}>
        <RadioGroup.Label>Radios</RadioGroup.Label>
        <FormControl>
          <Radio name="radioChoices" value="radioOne" />
          <FormControl.Label>Radio one</FormControl.Label>
        </FormControl>
        <FormControl>
          <Radio name="radioChoices" value="radioTwo" />
          <FormControl.Label>Radio two</FormControl.Label>
        </FormControl>
        <FormControl>
          <Radio name="radioChoices" value="radioThree" />
          <FormControl.Label>Radio three</FormControl.Label>
        </FormControl>
      </RadioGroup>
    </div>
  )
}

export const SingleInput = ({label = 'Input', caption = '', required = false, disabled = false}: ArgTypes) => (
  <FormControl required={required} disabled={disabled}>
    <FormControl.Label>{label}</FormControl.Label>
    <TextInput />
    {caption && <FormControl.Caption>{caption}</FormControl.Caption>}
  </FormControl>
)

export const ValidationExample = () => {
  const [value, setValue] = React.useState('mona lisa')
  const [validationResult, setValidationResult] = React.useState('')
  const doesValueContainSpaces = (inputValue: string) => /\s/g.test(inputValue)
  const handleInputChange = (e: {currentTarget: {value: React.SetStateAction<string>}}) => {
    setValue(e.currentTarget.value)
  }

  React.useEffect(() => {
    if (doesValueContainSpaces(value)) {
      setValidationResult('noSpaces')
    } else if (value) {
      setValidationResult('validName')
    }
  }, [value])

  return (
    <FormControl>
      <FormControl.Label>GitHub handle</FormControl.Label>
      <TextInput block value={value} onChange={handleInputChange} />
      {validationResult === 'noSpaces' && (
        <FormControl.Validation variant="error">GitHub handles cannot contain spaces</FormControl.Validation>
      )}
      {validationResult === 'validName' && (
        <FormControl.Validation variant="success">Valid name</FormControl.Validation>
      )}
      <FormControl.Caption>
        With or without &quot;@&quot;. For example &quot;monalisa&quot; or &quot;@monalisa&quot;
      </FormControl.Caption>
    </FormControl>
  )
}

function getColorCircle(color: string) {
  return function () {
    return (
      <span
        className={classes.ColorCircle}
        style={{
          backgroundColor: color,
          borderColor: color,
        }}
      />
    )
  }
}

const items: ItemInput[] = [
  {leadingVisual: getColorCircle('#a2eeef'), text: 'enhancement', description: 'New feature or request', id: 1},
  {leadingVisual: getColorCircle('#d73a4a'), text: 'bug', description: "Something isn't working", id: 2},
  {leadingVisual: getColorCircle('#0cf478'), text: 'good first issue', description: 'Good for newcomers', id: 3},
  {leadingVisual: getColorCircle('#ffd78e'), text: 'design', id: 4},
  {leadingVisual: getColorCircle('#ff0000'), text: 'blocker', id: 5},
  {leadingVisual: getColorCircle('#a4f287'), text: 'backend', id: 6},
  {leadingVisual: getColorCircle('#8dc6fc'), text: 'frontend', id: 7},
].map(item => ({...item, descriptionVariant: 'block'}))

export const WithSelectPanel = () => {
  const [selected, setSelected] = React.useState<ItemInput[]>([items[0], items[1]])
  const [filter, setFilter] = React.useState('')
  const filteredItems = items.filter(item => item.text?.toLowerCase().startsWith(filter.toLowerCase()))
  const [open, setOpen] = useState(false)

  return (
    <FormControl required>
      <FormControl.Label id="select_panel_label">Select Labels</FormControl.Label>
      <SelectPanel
        title="Select labels"
        subtitle="Use labels to organize issues and pull requests"
        renderAnchor={({children, id, ...anchorProps}) => (
          <Button
            trailingAction={TriangleDownIcon}
            aria-labelledby={`select_panel_label selectpanel_wrapper`}
            id={id}
            {...anchorProps}
            aria-haspopup="dialog"
          >
            <span id="selectpanel_wrapper">{children ?? 'Select Labels'}</span>
          </Button>
        )}
        open={open}
        onOpenChange={setOpen}
        items={filteredItems}
        selected={selected}
        onSelectedChange={setSelected}
        onFilterChange={setFilter}
      />
    </FormControl>
  )
}

export const WithLeadingVisual = () => (
  <Stack gap="none">
    <FormControl>
      <FormControl.Label>Option one</FormControl.Label>
      <FormControl.LeadingVisual>
        <MarkGithubIcon />
      </FormControl.LeadingVisual>
      <Checkbox />
    </FormControl>

    <FormControl>
      <FormControl.Label>Option two</FormControl.Label>
      <FormControl.LeadingVisual>
        <MarkGithubIcon />
      </FormControl.LeadingVisual>
      <Checkbox />
      <FormControl.Caption>This one has a caption</FormControl.Caption>
    </FormControl>

    <FormControl disabled>
      <FormControl.Label>Option three</FormControl.Label>
      <FormControl.LeadingVisual>
        <MarkGithubIcon />
      </FormControl.LeadingVisual>
      <Checkbox />
    </FormControl>

    <FormControl disabled>
      <FormControl.Label>Option four</FormControl.Label>
      <FormControl.LeadingVisual>
        <MarkGithubIcon />
      </FormControl.LeadingVisual>
      <Checkbox />
      <FormControl.Caption>This one has a caption</FormControl.Caption>
    </FormControl>
  </Stack>
)

export const DisabledInputs = () => (
  <div className={classes.FlexColumnGapContainer}>
    <FormControl disabled>
      <FormControl.Label>Disabled checkbox</FormControl.Label>
      <Checkbox />
    </FormControl>
    <FormControl disabled>
      <FormControl.Label>Disabled input</FormControl.Label>
      <TextInput />
    </FormControl>
    <FormControl disabled>
      <FormControl.Label>Disabled select</FormControl.Label>
      <Select>
        <Select.Option value="figma">Figma</Select.Option>
        <Select.Option value="css">Primer CSS</Select.Option>
        <Select.Option value="prc">Primer React components</Select.Option>
        <Select.Option value="pvc">Primer ViewComponents</Select.Option>
      </Select>
    </FormControl>
  </div>
)

export const CustomRequired = () => (
  <div className={classes.FlexColumnGapContainer}>
    <FormControl required={true}>
      <FormControl.Label requiredText="(required)">Form Input Label</FormControl.Label>
      <FormControl.Caption>This is a form field with a custom required indicator</FormControl.Caption>
      <TextInput />
    </FormControl>

    <Text className={classes.RequiredFieldsNote}>Required fields are marked with an asterisk (*)</Text>
    <FormControl required={true}>
      <FormControl.Label requiredIndicator={false}>Form Input Label</FormControl.Label>
      <FormControl.Caption>
        This is a form field with a required indicator that is hidden in the accessibility tree
      </FormControl.Caption>
      <TextInput />
    </FormControl>

    <FormControl required={false}>
      <FormControl.Label requiredText="(optional)" requiredIndicator={false}>
        Form Input Label
      </FormControl.Label>
      <FormControl.Caption>This is a form field that is marked as optional, it is not required</FormControl.Caption>
      <TextInput />
    </FormControl>
  </div>
)

export const WithCaption = () => (
  <FormControl>
    <FormControl.Label>Example label</FormControl.Label>
    <TextInput />
    <FormControl.Caption>Example caption</FormControl.Caption>
  </FormControl>
)

export const WithCaptionAndDisabled = () => (
  <FormControl disabled>
    <FormControl.Label>Example label</FormControl.Label>
    <TextInput />
    <FormControl.Caption>Example caption</FormControl.Caption>
  </FormControl>
)

export const WithHiddenLabel = () => (
  <FormControl>
    <FormControl.Label visuallyHidden>Example label</FormControl.Label>
    <TextInput />
  </FormControl>
)

export const WithRequiredIndicator = () => (
  <FormControl required>
    <FormControl.Label requiredIndicator>Example label</FormControl.Label>
    <TextInput />
  </FormControl>
)

export const WithSuccessValidation = () => (
  <FormControl required>
    <FormControl.Label requiredIndicator>Example label</FormControl.Label>
    <TextInput defaultValue="Input value" />
    <FormControl.Validation variant="success">Example success validation message</FormControl.Validation>
  </FormControl>
)

export const WithErrorValidation = () => (
  <FormControl required>
    <FormControl.Label requiredIndicator>Example label</FormControl.Label>
    <TextInput defaultValue="Input value" />
    <FormControl.Validation variant="error">Example error validation message</FormControl.Validation>
  </FormControl>
)
