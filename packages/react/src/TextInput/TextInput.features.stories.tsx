import type React from 'react'
import {useState} from 'react'
import {FormControl, Heading, Stack} from '..'
import type {TextInputProps} from '../TextInput'
import TextInput from '../TextInput'
import {CalendarIcon, CheckIcon, XCircleFillIcon} from '@primer/octicons-react'
import type {FormControlArgs} from '../utils/story-helpers'
import {formControlArgTypes, textInputExcludedControlKeys} from '../utils/story-helpers'
import classes from './TextInput.features.stories.module.css'

export default {
  title: 'Components/TextInput/Features',
}

export const Disabled = () => (
  <form>
    <FormControl>
      <FormControl.Label>Default label</FormControl.Label>
      <TextInput disabled />
    </FormControl>
  </form>
)

export const WithCaption = () => (
  <form>
    <FormControl>
      <FormControl.Label>Default label</FormControl.Label>
      <FormControl.Caption>This is a caption</FormControl.Caption>
      <TextInput />
    </FormControl>
  </form>
)

export const VisuallyHiddenLabel = () => (
  <form>
    <Heading as="h2" variant="small">
      Primer form title
    </Heading>
    <FormControl>
      <FormControl.Label visuallyHidden>Primer form label</FormControl.Label>
      <TextInput />
      <FormControl.Caption>Label is visually hidden; the title describes the purpose visually</FormControl.Caption>
    </FormControl>
  </form>
)

export const Error = () => (
  <form>
    <FormControl>
      <FormControl.Label>Default label</FormControl.Label>
      <TextInput />
      <FormControl.Validation variant="error">Something went wrong</FormControl.Validation>
    </FormControl>
  </form>
)

export const Success = () => (
  <form>
    <FormControl>
      <FormControl.Label>Default label</FormControl.Label>
      <TextInput />
      <FormControl.Validation variant="success">Something went wrong</FormControl.Validation>
    </FormControl>
  </form>
)

export const Block = () => (
  <form>
    <FormControl>
      <FormControl.Label>Default label</FormControl.Label>
      <TextInput block />
    </FormControl>
  </form>
)

export const Small = () => (
  <form>
    <FormControl>
      <FormControl.Label>Default label</FormControl.Label>
      <TextInput size="small" />
    </FormControl>
  </form>
)

export const Large = () => (
  <form>
    <FormControl>
      <FormControl.Label>Default label</FormControl.Label>
      <TextInput size="large" />
    </FormControl>
  </form>
)

export const Required = () => (
  <form>
    <FormControl required>
      <FormControl.Label>Default label</FormControl.Label>
      <TextInput size="large" />
    </FormControl>
  </form>
)

export const WithLeadingVisual = () => {
  const Checkmark = () => <CheckIcon aria-label="Checkmark" />

  return (
    <form>
      <FormControl>
        <FormControl.Label>Default label</FormControl.Label>
        <TextInput leadingVisual={Checkmark} />
      </FormControl>
      <FormControl>
        <FormControl.Label>Enter monies</FormControl.Label>
        <TextInput leadingVisual="$" />
      </FormControl>
    </form>
  )
}

export const WithTrailingIcon = () => {
  const Checkmark = () => <CheckIcon aria-label="Checkmark" />

  return (
    <div>
      <FormControl>
        <FormControl.Label>Default label</FormControl.Label>
        <TextInput trailingVisual={Checkmark} />
      </FormControl>
      <FormControl>
        <FormControl.Label>Enter monies</FormControl.Label>
        <TextInput trailingVisual="minutes" placeholder="200" />
      </FormControl>
    </div>
  )
}

export const WithTrailingAction = () => {
  const [value, setValue] = useState('sample text')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }
  return (
    <form>
      <FormControl>
        <FormControl.Label>Default label</FormControl.Label>
        <TextInput
          value={value}
          onChange={handleChange}
          trailingAction={
            <Stack justify="center" style={{minWidth: '34px'}}>
              {value.length ? (
                <TextInput.Action onClick={() => setValue('')} icon={XCircleFillIcon} aria-label="Clear input" />
              ) : undefined}
            </Stack>
          }
        />
      </FormControl>
    </form>
  )
}

export const WithTooltipDirection = () => {
  const [value, setValue] = useState('sample text')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }
  return (
    <form>
      <FormControl>
        <FormControl.Label>Default label</FormControl.Label>
        <TextInput
          value={value}
          onChange={handleChange}
          trailingAction={
            <Stack justify="center" style={{minWidth: '34px'}}>
              {value.length ? (
                <TextInput.Action
                  onClick={() => setValue('')}
                  icon={XCircleFillIcon}
                  aria-label="Clear input"
                  tooltipDirection="nw"
                />
              ) : undefined}
            </Stack>
          }
        />
      </FormControl>
    </form>
  )
}

const Calendar = () => <CalendarIcon aria-label="Calendar" />

export const WithLoadingIndicator = (args: FormControlArgs<TextInputProps>) => {
  return (
    <div>
      <h3>No visual</h3>

      <div className={classes.MarginBottom}>
        <FormControl>
          <FormControl.Label>Default label</FormControl.Label>
          <TextInput value="auto" {...args} />
        </FormControl>
      </div>
      <div className={classes.MarginBottom}>
        <FormControl>
          <FormControl.Label>Default label</FormControl.Label>
          <TextInput value="leading" {...args} loaderPosition="leading" />
        </FormControl>
      </div>
      <div className={classes.MarginBottomLarge}>
        <FormControl>
          <FormControl.Label>Default label</FormControl.Label>
          <TextInput value="trailing" {...args} loaderPosition="trailing" />
        </FormControl>
      </div>

      <h3>Leading visual</h3>

      <div className={classes.MarginBottom}>
        <FormControl>
          <FormControl.Label>Default label</FormControl.Label>
          <TextInput leadingVisual={Calendar} {...args} value="auto" />
        </FormControl>
      </div>
      <div className={classes.MarginBottom}>
        <FormControl>
          <FormControl.Label>Default label</FormControl.Label>
          <TextInput leadingVisual={Calendar} {...args} loaderPosition="leading" value="leading" />
        </FormControl>
      </div>
      <div className={classes.MarginBottomLarge}>
        <FormControl>
          <FormControl.Label>Default label</FormControl.Label>
          <TextInput leadingVisual={Calendar} {...args} loaderPosition="trailing" value="trailing" />
        </FormControl>
      </div>

      <h3>Trailing visual</h3>
      <FormControl>
        <div className={classes.MarginBottom}>
          <FormControl>
            <FormControl.Label>Default label</FormControl.Label>
            <TextInput trailingVisual={Calendar} {...args} value="auto" />
          </FormControl>
        </div>
        <div className={classes.MarginBottom}>
          <FormControl>
            <FormControl.Label>Default label</FormControl.Label>
            <TextInput trailingVisual={Calendar} {...args} loaderPosition="leading" value="leading" />
          </FormControl>
        </div>
        <div className={classes.MarginBottomLarge}>
          <FormControl>
            <FormControl.Label>Default label</FormControl.Label>
            <TextInput trailingVisual={Calendar} {...args} loaderPosition="trailing" value="trailing" />
          </FormControl>
        </div>
      </FormControl>

      <h3>Both visuals</h3>

      <div className={classes.MarginBottom}>
        <FormControl>
          <FormControl.Label>Default label</FormControl.Label>
          <TextInput size="small" leadingVisual={Calendar} trailingVisual={Calendar} {...args} value="auto" />
        </FormControl>
      </div>
      <div className={classes.MarginBottom}>
        <FormControl>
          <FormControl.Label>Default label</FormControl.Label>
          <TextInput
            leadingVisual={Calendar}
            trailingVisual={Calendar}
            {...args}
            loaderPosition="leading"
            value="leading"
          />
        </FormControl>
      </div>
      <div className={classes.MarginBottom}>
        <FormControl>
          <FormControl.Label>Default label</FormControl.Label>
          <TextInput
            size="large"
            leadingVisual={Calendar}
            trailingVisual={Calendar}
            {...args}
            loaderPosition="trailing"
            value="trailing"
          />
        </FormControl>
      </div>
    </div>
  )
}

WithLoadingIndicator.args = {
  loading: true,
}
WithLoadingIndicator.parameters = {
  controls: {
    exclude: [...textInputExcludedControlKeys, 'loaderPosition', ...Object.keys(formControlArgTypes), 'children'],
  },
}

export const WithAutocompleteAttribute = () => (
  <form>
    <FormControl>
      <FormControl.Label>First name</FormControl.Label>
      <TextInput autoComplete="given-name" />
    </FormControl>
    <FormControl>
      <FormControl.Label>Last name</FormControl.Label>
      <TextInput autoComplete="family-name" />
    </FormControl>
  </form>
)

export const WithCharacterLimit = () => {
  const [value, setValue] = useState('')

  return (
    <form>
      <FormControl>
        <FormControl.Label>Username</FormControl.Label>
        <TextInput value={value} onChange={e => setValue(e.target.value)} characterLimit={20} />
      </FormControl>
    </form>
  )
}

export const WithCharacterLimitAndCaption = () => {
  const [value, setValue] = useState('')

  return (
    <form>
      <FormControl>
        <FormControl.Label>Username</FormControl.Label>
        <TextInput value={value} onChange={e => setValue(e.target.value)} characterLimit={20} />
        <FormControl.Caption>Choose a unique username</FormControl.Caption>
      </FormControl>
    </form>
  )
}

export const WithCharacterLimitExceeded = () => {
  const [value, setValue] = useState('This is a very long text that exceeds the limit')

  return (
    <form>
      <FormControl>
        <FormControl.Label>Bio</FormControl.Label>
        <TextInput value={value} onChange={e => setValue(e.target.value)} characterLimit={20} />
        <FormControl.Caption>Keep it short</FormControl.Caption>
      </FormControl>
    </form>
  )
}
