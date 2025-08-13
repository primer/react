import type {Meta} from '@storybook/react-vite'
import {Checkbox, CheckboxGroup, FormControl} from '..'
import styles from './CheckboxGroup.dev.module.css'

export default {
  title: 'Components/CheckboxGroup/Dev',
  component: CheckboxGroup,
  parameters: {controls: {exclude: ['aria-labelledby', 'id', 'onChange']}},
} as Meta

export const WithCss = () => (
  <CheckboxGroup className={styles.CheckboxGroupDev}>
    <CheckboxGroup.Caption className={styles.CaptionDev}>Caption</CheckboxGroup.Caption>
    <CheckboxGroup.Label className={styles.LabelDev}>Choices</CheckboxGroup.Label>
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
