import React from 'react'
import {Meta} from '@storybook/react'

import {BaseStyles, Text, Select, ThemeProvider} from '..'
import {SelectProps} from '../Select'

export default {
  title: 'Forms/Select',
  component: Select,
  decorators: [
    Story => {
      return (
        <ThemeProvider>
          <BaseStyles>
            <Story />
          </BaseStyles>
        </ThemeProvider>
      )
    }
  ],
  argTypes: {
    block: {
      defaultValue: false,
      control: {
        type: 'boolean'
      }
    },
    contrast: {
      defaultValue: false,
      control: {
        type: 'boolean'
      }
    },
    disabled: {
      defaultValue: false,
      control: {
        type: 'boolean'
      }
    },
    required: {
      defaultValue: false,
      control: {
        type: 'boolean'
      }
    },
    sx: {
      table: {
        disable: true
      }
    },
    size: {
      name: 'Size',
      defaultValue: 'medium',
      options: ['small', 'medium', 'large'],
      control: {type: 'radio'}
    }
  }
} as Meta

const Label = ({htmlFor, children}: {htmlFor: string; children: React.ReactNode}) => (
  <Text as="label" htmlFor={htmlFor} sx={{display: 'block', fontWeight: 600, fontSize: 14}}>
    {children}
  </Text>
)

export const Default = (args: SelectProps) => (
  <>
    <Label htmlFor="selectInput">Choice</Label>
    <Select id="selectInput" {...args}>
      <Select.Option value="one">Choice one</Select.Option>
      <Select.Option value="two">Choice two</Select.Option>
      <Select.Option value="three">Choice three</Select.Option>
      <Select.Option value="four">Choice four</Select.Option>
      <Select.Option value="five">Choice five</Select.Option>
      <Select.Option value="six">Choice six</Select.Option>
    </Select>
  </>
)

export const WithOptionGroups = (args: SelectProps) => (
  <>
    <Label htmlFor="selectInput">Choice</Label>
    <Select id="selectInput" {...args}>
      <Select.OptGroup label="Group one">
        <Select.Option value="one">Choice one</Select.Option>
        <Select.Option value="two">Choice two</Select.Option>
        <Select.Option value="three">Choice three</Select.Option>
        <Select.Option value="four">Choice four</Select.Option>
      </Select.OptGroup>
      <Select.OptGroup disabled label="Group two">
        <Select.Option value="five">Choice five</Select.Option>
        <Select.Option value="six">Choice six</Select.Option>
      </Select.OptGroup>
    </Select>
  </>
)

export const WithAPlaceholder = (args: SelectProps) => (
  <>
    <Label htmlFor="selectInput">Choice</Label>
    <Select placeholder="Pick a choice" id="selectInput" {...args}>
      <Select.Option value="one">Choice one</Select.Option>
      <Select.Option value="two">Choice two</Select.Option>
      <Select.Option value="three">Choice three</Select.Option>
      <Select.Option value="four">Choice four</Select.Option>
      <Select.Option value="five">Choice five</Select.Option>
      <Select.Option value="six">Choice six</Select.Option>
    </Select>
  </>
)
