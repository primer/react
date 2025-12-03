import type {Meta} from '@storybook/react-vite'
import {FormControl, Textarea} from '..'
import classes from './Textarea.dev.stories.module.css'

export default {
  title: 'Components/Textarea/Dev',
  component: Textarea,
} as Meta

export const DevDefault = () => (
  <form>
    <FormControl>
      <FormControl.Label>Default label</FormControl.Label>
      <Textarea className={classes.DevDefaultTextarea} style={{color: 'white'}} value="foo" />
    </FormControl>
  </form>
)
