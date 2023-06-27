import React from 'react'
import {Meta} from '@storybook/react'
import FileUpload from './FileUpload'

const meta: Meta<typeof FileUpload> = {
  title: 'Components/FileUpload',
  component: FileUpload,
}

export const Default = () => {
  const fileProgress = (file: File) => Math.random() * 100
  return (
    <FileUpload fileProgress={fileProgress}>
      <FileUpload.Label>Upload your files</FileUpload.Label>
    </FileUpload>
  )
}

export const Multiple = () => {
  const fileProgress = (file: File) => Math.random() * 100

  return (
    <FileUpload fileProgress={fileProgress} multiple>
      <FileUpload.Label>Upload your files</FileUpload.Label>
    </FileUpload>
  )
}

export const StyledButton = () => {
  const fileProgress = (file: File) => Math.random() * 100

  return (
    <FileUpload fileProgress={fileProgress} buttonProps={{variant: 'invisible', children: 'Upload stuff!'}}>
      <FileUpload.Label>Upload your files</FileUpload.Label>
    </FileUpload>
  )
}

export const Playground = () => {
  const fileProgress = (file: File) => Math.random() * 100

  return <FileUpload fileProgress={fileProgress} />
}

Playground.args = {}

Playground.argTypes = {}

export default meta
