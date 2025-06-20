import type {Meta} from '@storybook/react-vite'
import {FormControl, Box} from '..'
import Select from './Select'

export default {
  title: 'Components/Select/Dev',
  component: Select,
} as Meta

export const Default = () => (
  <Box as="form">
    <FormControl>
      <FormControl.Label>Default label</FormControl.Label>
      <Select sx={{color: 'danger.fg'}}>
        <Select.Option value="one">Choice one</Select.Option>
        <Select.Option value="two">Choice two</Select.Option>
        <Select.Option value="three">Choice three</Select.Option>
        <Select.Option value="four">Choice four</Select.Option>
        <Select.Option value="five">Choice five</Select.Option>
        <Select.Option value="six">Choice six</Select.Option>
      </Select>
    </FormControl>
  </Box>
)
