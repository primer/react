import type {Meta} from '@storybook/react-vite'
import {Box, FormControl, Textarea} from '..'

export default {
  title: 'Components/Textarea/Dev',
  component: Textarea,
} as Meta

export const DevDefault = () => (
  <Box as="form">
    <FormControl>
      <FormControl.Label>Default label</FormControl.Label>
      <Textarea sx={{backgroundColor: 'darkgreen'}} style={{color: 'white'}} value="foo" />
    </FormControl>
  </Box>
)
