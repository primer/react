import React from 'react'
import {Meta, Story} from '@storybook/react'
import FileUpload from './FileUpload'

const meta: Meta<typeof FileUpload> = {
  title: 'Components/FileUpload',
  component: FileUpload,
}

export const Default = () => {
  const fileProgress = () => Math.random() * 100
  const [uploadedFile, setUploadedFile] = React.useState<File | undefined>(undefined)
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files

    if (files) {
      const fileList = Array.from(files)
      setUploadedFile(fileList[0])
    }
  }

  return (
    <FileUpload onChange={handleFileUpload}>
      <FileUpload.Label>Upload your files</FileUpload.Label>
      <FileUpload.Status variant="danger">
        Yowza, that’s a big file. Try again with a file smaller than 25MB.
      </FileUpload.Status>
      {uploadedFile && (
        <FileUpload.Item
          key={uploadedFile.name}
          file={uploadedFile}
          progress={fileProgress()}
          onRemove={e => {
            setUploadedFile(undefined)
          }}
        />
      )}
    </FileUpload>
  )
}

export const Multiple = () => {
  const fileProgress = () => Math.random() * 100
  const [uploadedFiles, setUploadedFiles] = React.useState<File[]>([])
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files

    if (files) {
      const fileList = Array.from(files)
      setUploadedFiles(fileList)
    }
  }

  return (
    <FileUpload multiple onChange={handleFileUpload}>
      <FileUpload.Label>Upload your files</FileUpload.Label>
      {uploadedFiles.map(file => (
        <FileUpload.Item
          key={file.name}
          file={file}
          progress={fileProgress()}
          onRemove={e => {
            setUploadedFiles(() => {
              return uploadedFiles.filter(cur => {
                return file.name !== cur.name
              })
            })
          }}
        />
      ))}
    </FileUpload>
  )
}

export const StyledButton = () => {
  const [uploadedFile, setUploadedFile] = React.useState<File | undefined>(undefined)
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files

    if (files) {
      const fileList = Array.from(files)
      setUploadedFile(fileList[0])
    }
  }

  return (
    <FileUpload buttonProps={{variant: 'invisible', children: 'Upload stuff!'}} onChange={handleFileUpload}>
      <FileUpload.Label>Upload your files</FileUpload.Label>
      {uploadedFile && (
        <FileUpload.Item
          key={uploadedFile.name}
          file={uploadedFile}
          progress={100}
          onRemove={e => {
            setUploadedFile(undefined)
          }}
        />
      )}
    </FileUpload>
  )
}

export const Playground: Story<React.ComponentProps<typeof FileUpload>> = args => {
  const fileProgress = () => Math.random() * 100
  const [uploadedFiles, setUploadedFiles] = React.useState<File[]>([])
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files

    if (files) {
      const fileList = Array.from(files)
      setUploadedFiles(fileList)
    }
  }

  return (
    <FileUpload onChange={handleFileUpload} {...args}>
      <FileUpload.Label>Upload your files</FileUpload.Label>
      {uploadedFiles.map(file => (
        <FileUpload.Item
          key={file.name}
          file={file}
          progress={fileProgress()}
          onRemove={e => {
            setUploadedFiles(() => {
              return uploadedFiles.filter(cur => {
                return file.name !== cur.name
              })
            })
          }}
        />
      ))}
    </FileUpload>
  )
}

Playground.args = {multiple: true}

export default meta
