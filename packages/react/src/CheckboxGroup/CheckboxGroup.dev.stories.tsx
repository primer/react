import type {Meta} from '@storybook/react-vite'
import {Checkbox, CheckboxGroup, FormControl} from '..'
import classes from './CheckboxGroup.dev.stories.module.css'

export default {
  title: 'Components/CheckboxGroup/Dev',
  component: CheckboxGroup,
  parameters: {controls: {exclude: ['aria-labelledby', 'id', 'onChange', 'sx']}},
} as Meta

export const SxProps = () => (
  <CheckboxGroup className={classes.CheckboxGroup}>
    <CheckboxGroup.Caption className={classes.MutedCaption}>Caption</CheckboxGroup.Caption>
    <CheckboxGroup.Label className={classes.BoldLabel}>Choices</CheckboxGroup.Label>
    <FormControl required>
      <Checkbox value="one" defaultChecked />
      <FormControl.Label>Choice one</FormControl.Label>
    </FormControl>
    <FormControl>
      <Checkbox value="two" defaultChecked />
      <FormControl.Label>Choice two</FormControl.Label>
    </FormControl>
    <FormControl>
      <Checkbox value="three" />
      <FormControl.Label>Choice three</FormControl.Label>
    </FormControl>
  </CheckboxGroup>
)
