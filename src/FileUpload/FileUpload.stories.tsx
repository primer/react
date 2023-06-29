import React from 'react'
import {Meta, Story} from '@storybook/react'
import FileUpload, {FileUploadItemProps} from './FileUpload'

const meta: Meta<typeof FileUpload> = {
  title: 'Components/FileUpload',
  component: FileUpload,
}

export const Default = () => {
  const [uploadedFile, setUploadedFile] = React.useState<File | undefined>(undefined)
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files

    if (files) {
      const fileList = Array.from(files)
      setUploadedFile(fileList[0])
    }
  }
  const progress = Math.random() * 100
  return (
    <FileUpload onChange={handleFileUpload}>
      <FileUpload.Label>Upload your files</FileUpload.Label>
      <FileUpload.Description>Max. size: 25MB; accepted file types: .jpg and .png</FileUpload.Description>
      {uploadedFile && (
        <FileUpload.Item
          key={uploadedFile.name}
          file={uploadedFile}
          progress={progress}
          onClick={() => {
            setUploadedFile(undefined)
          }}
        />
      )}
      {progress === 100 ? <FileUpload.Status status="success">1 file successfully added!</FileUpload.Status> : null}
    </FileUpload>
  )
}

export const SingleFileInProgress = () => {
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
      <FileUpload.Description>Max. size: 25MB; accepted file types: .jpg and .png</FileUpload.Description>
      {uploadedFile && (
        <FileUpload.Item
          key={uploadedFile.name}
          file={uploadedFile}
          progress={fileProgress()}
          onClick={() => {
            setUploadedFile(undefined)
          }}
        />
      )}
    </FileUpload>
  )
}

export const SingleFileSuccessfullyUploaded = () => {
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
      <FileUpload.Description>Max. size: 25MB; accepted file types: .jpg and .png</FileUpload.Description>
      {uploadedFile && (
        <>
          <FileUpload.Status status="success">1 file successfully added!</FileUpload.Status>
          <FileUpload.Item
            key={uploadedFile.name}
            file={uploadedFile}
            status={'success'}
            progress={100}
            onClick={() => {
              setUploadedFile(undefined)
            }}
          />
        </>
      )}
    </FileUpload>
  )
}

export const SingleFileWithError = () => {
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
      <FileUpload.Description>Max. size: 25MB; accepted file types: .jpg and .png</FileUpload.Description>
      {uploadedFile && (
        <>
          <FileUpload.Status status="error">{uploadedFile.name} could not be added. Please refresh.</FileUpload.Status>
          <FileUpload.Item
            key={uploadedFile.name}
            file={uploadedFile}
            status={'error'}
            progress={100}
            onClick={() => {
              setUploadedFile(undefined)
            }}
          />
        </>
      )}
    </FileUpload>
  )
}

export const Playground: Story<React.ComponentProps<typeof FileUpload>> = args => {
  const progress = Math.random() * 100
  const [uploadedFile, setUploadedFile] = React.useState<File | undefined>(undefined)
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files

    if (files) {
      const fileList = Array.from(files)
      setUploadedFile(fileList[0])
    }
  }

  return (
    <FileUpload onChange={handleFileUpload} {...args}>
      <FileUpload.Label>Upload your files</FileUpload.Label>
      <FileUpload.Description>Max. size: 25MB; accepted file types: .jpg and .png</FileUpload.Description>
      {uploadedFile && (
        <>
          <FileUpload.Item
            key={uploadedFile.name}
            file={uploadedFile}
            progress={progress}
            onClick={() => {
              setUploadedFile(undefined)
            }}
          />
          {progress === 100 ? <FileUpload.Status status="success">1 file successfully added!</FileUpload.Status> : null}
        </>
      )}
    </FileUpload>
  )
}

Playground.args = {accept: '.jpg,.png'}

export const FileUploadItem = (args: FileUploadItemProps) => {
  const {progress} = args

  return (
    <FileUpload.Item
      key={'file/name'}
      file={new File([''], 'src/cat.jpg', {type: 'text/plain'})}
      progress={progress}
      onClick={() => {
        alert('clicked')
      }}
      status={progress === 100 ? args.status || 'success' : undefined}
    />
  )
}
FileUploadItem.args = {progress: 50, status: undefined}
FileUploadItem.argTypes = {
  status: {
    control: {
      type: 'radio',
    },
    options: ['success', 'error', undefined],
  },
}

export default meta
