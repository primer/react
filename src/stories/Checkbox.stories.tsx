import React, {useState} from 'react'
import {Meta} from '@storybook/react'

import {BaseStyles, Box, ThemeProvider} from '..'
import {Checkbox} from '../Checkbox'
import {action} from '@storybook/addon-actions'

export default {
  title: 'Forms/Checkbox',
  component: Checkbox,
  decorators: [
    Story => {
      return (
        <ThemeProvider>
          <BaseStyles>
            <Box paddingTop={5}>{Story()}</Box>
          </BaseStyles>
        </ThemeProvider>
      )
    }
  ],
  argTypes: {
    sx: {
      table: {
        disable: true
      }
    },
    block: {
      name: 'Block',
      defaultValue: false,
      control: {
        type: 'boolean'
      }
    },
    disabled: {
      name: 'Disabled',
      defaultValue: false,
      control: {
        type: 'boolean'
      }
    }
  }
} as Meta

export const Default = (args: Checkbox) => {
  const [isChecked, setChecked] = useState<boolean>(false)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked)
    action('Change event triggered')
  }

  return (
    <form>
      <div className="form-group">
        <Box pb={3}>
          <div className="form-group-body">
            <Checkbox checked={isChecked} onChange={handleChange} {...args} />
            <Checkbox disabled onChange={handleChange} />
            <Checkbox checked={true} disabled onChange={handleChange} />
            <Checkbox checked={true} indeterminate onChange={handleChange} />
            <Checkbox checked={true} indeterminate disabled onChange={handleChange} />
          </div>
        </Box>
        <Box>
          <div className="form-group-body">
            <Checkbox checked={isChecked} onChange={handleChange} label="A simple checkbox with label" {...args} />
            <Checkbox disabled onChange={handleChange} label="Disabled" />
            <Checkbox disabled checked={true} onChange={handleChange} label="Checked + Disabled" />
            <Checkbox indeterminate checked={true} onChange={handleChange} label="Indeterminate" />
            <Checkbox indeterminate disabled checked={true} onChange={handleChange} label="Indeterminate + Disabled" />
          </div>
        </Box>
      </div>
    </form>
  )
}
