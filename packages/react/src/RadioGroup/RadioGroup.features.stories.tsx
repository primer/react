import {Radio, RadioGroup, FormControl} from '..'
import classes from './RadioGroup.features.stories.module.css'

export default {
  title: 'Components/RadioGroup/Features',
}

export const VisuallyHiddenLabel = () => (
  <RadioGroup name="defaultRadioGroup">
    <RadioGroup.Label visuallyHidden>Choices</RadioGroup.Label>
    <FormControl>
      <Radio value="one" defaultChecked />
      <FormControl.Label>Choice one</FormControl.Label>
    </FormControl>
    <FormControl>
      <Radio value="two" />
      <FormControl.Label>Choice two</FormControl.Label>
    </FormControl>
    <FormControl>
      <Radio value="three" />
      <FormControl.Label>Choice three</FormControl.Label>
    </FormControl>
  </RadioGroup>
)

export const WithExternalLabel = () => (
  <>
    <div id="choiceHeading" className={classes.ExternalLabel}>
      External label
    </div>
    <RadioGroup aria-labelledby="choiceHeading" name="defaultRadioGroup">
      <FormControl>
        <Radio value="one" />
        <FormControl.Label>Choice one</FormControl.Label>
      </FormControl>
      <FormControl>
        <Radio value="two" />
        <FormControl.Label>Choice two</FormControl.Label>
      </FormControl>
      <FormControl>
        <Radio value="three" />
        <FormControl.Label>Choice three</FormControl.Label>
      </FormControl>
    </RadioGroup>
  </>
)

export const Error = () => (
  <RadioGroup name="defaultRadioGroup">
    <RadioGroup.Label>Choices</RadioGroup.Label>
    <FormControl>
      <Radio value="one" defaultChecked />
      <FormControl.Label>Choice one</FormControl.Label>
    </FormControl>
    <FormControl>
      <Radio value="two" />
      <FormControl.Label>Choice two</FormControl.Label>
    </FormControl>
    <FormControl>
      <Radio value="three" />
      <FormControl.Label>Choice three</FormControl.Label>
    </FormControl>
    <RadioGroup.Validation variant="error">Something went wrong</RadioGroup.Validation>
  </RadioGroup>
)

export const Success = () => (
  <RadioGroup name="defaultRadioGroup">
    <RadioGroup.Label>Choices</RadioGroup.Label>
    <FormControl>
      <Radio value="one" />
      <FormControl.Label>Choice one</FormControl.Label>
    </FormControl>
    <FormControl>
      <Radio value="two" defaultChecked />
      <FormControl.Label>Choice two</FormControl.Label>
    </FormControl>
    <FormControl>
      <Radio value="three" />
      <FormControl.Label>Choice three</FormControl.Label>
    </FormControl>
    <RadioGroup.Validation variant="success">Great job!</RadioGroup.Validation>
  </RadioGroup>
)

export const Caption = () => (
  <RadioGroup name="defaultRadioGroup">
    <RadioGroup.Label>Choices</RadioGroup.Label>
    <RadioGroup.Caption>Caption</RadioGroup.Caption>
    <FormControl>
      <Radio value="one" />
      <FormControl.Label>Choice one</FormControl.Label>
    </FormControl>
    <FormControl>
      <Radio value="two" defaultChecked />
      <FormControl.Label>Choice two</FormControl.Label>
    </FormControl>
    <FormControl>
      <Radio value="three" />
      <FormControl.Label>Choice three</FormControl.Label>
    </FormControl>
  </RadioGroup>
)
