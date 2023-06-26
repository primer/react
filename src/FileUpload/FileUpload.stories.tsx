import React from 'react'
import {Meta} from '@storybook/react'
import FileUpload from './FileUpload'

export default {
  title: 'Components/FileUpload',
  component: FileUpload,
} as Meta<typeof FileUpload>

export const Default = () => {
  return <FileUpload />
}

export const Playground = () => {
  return <FileUpload />
}

Playground.args = {}

Playground.argTypes = {}
