import type {Meta} from '@storybook/react-vite'
import {FormControl} from '..'
import Select from './Select'
import classes from './Select.dev.stories.module.css'

export default {
  title: 'Components/Select/Dev',
  component: Select,
} as Meta

export const Default = () => (
  <form>
    <FormControl>
      <FormControl.Label>Default label</FormControl.Label>
      <Select className={classes.DangerText}>
        <Select.Option value="one">Choice one</Select.Option>
        <Select.Option value="two">Choice two</Select.Option>
        <Select.Option value="three">Choice three</Select.Option>
        <Select.Option value="four">Choice four</Select.Option>
        <Select.Option value="five">Choice five</Select.Option>
        <Select.Option value="six">Choice six</Select.Option>
      </Select>
    </FormControl>
  </form>
)
