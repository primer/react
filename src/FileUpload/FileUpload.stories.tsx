import React from 'react'
import {Meta, Story} from '@storybook/react'
import FileUpload, {FileUploadItemProps} from './FileUpload'

const meta: Meta<typeof FileUpload> = {
  title: 'Components/FileUpload',
  component: FileUpload,
}

export const Default = () => {
  const [uploadedFile, setUploadedFile] = React.useState<File | undefined>(undefined)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const progressBarRef = React.useRef<HTMLSpanElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files

    if (files) {
      const fileList = Array.from(files)
      setUploadedFile(fileList[0])
    }
  }

  React.useEffect(() => {
    progressBarRef.current?.focus()
  }, [uploadedFile])

  const progress = Math.random() * 100
  return (
    <FileUpload ref={inputRef} onChange={handleFileUpload} accept={'.jpg,.png'}>
      <FileUpload.Label>Upload your files</FileUpload.Label>
      <FileUpload.Description>Max. size: 25MB; accepted file types: .jpg and .png</FileUpload.Description>
      {uploadedFile && (
        <FileUpload.Item
          progressBarRef={progressBarRef}
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
  const progressBarRef = React.useRef<HTMLSpanElement>(null)
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files

    if (files) {
      const fileList = Array.from(files)
      setUploadedFile(fileList[0])
    }
  }

  React.useEffect(() => {
    progressBarRef.current?.focus()
  }, [uploadedFile])

  return (
    <FileUpload onChange={handleFileUpload}>
      <FileUpload.Label>Upload your files</FileUpload.Label>
      <FileUpload.Description>Max. size: 25MB</FileUpload.Description>
      {uploadedFile && (
        <FileUpload.Item
          progressBarRef={progressBarRef}
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
  const inputRef = React.useRef<HTMLInputElement>(null)
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files

    if (files) {
      const fileList = Array.from(files)
      setUploadedFile(fileList[0])
    }
  }

  return (
    <FileUpload ref={inputRef} onChange={handleFileUpload}>
      <FileUpload.Label>Upload your files</FileUpload.Label>
      <FileUpload.Description>Max. size: 25MB</FileUpload.Description>
      {uploadedFile && <FileUpload.Status status="success">1 file successfully added!</FileUpload.Status>}
      {uploadedFile && (
        <FileUpload.Item
          key={uploadedFile.name}
          file={uploadedFile}
          status={'success'}
          progress={100}
          onClick={() => {
            setUploadedFile(undefined)
            inputRef.current?.focus()
          }}
        />
      )}
    </FileUpload>
  )
}

export const SingleFileWithError = () => {
  const [uploadedFile, setUploadedFile] = React.useState<File | undefined>(undefined)
  const progressBarRef = React.useRef<HTMLSpanElement>(null)
  const [progress, setProgress] = React.useState<number>(100)
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files

    if (files) {
      const fileList = Array.from(files)
      setUploadedFile(fileList[0])
    }
  }

  React.useEffect(() => {
    if (progress !== 100) {
      progressBarRef.current?.focus()
    }
  }, [uploadedFile, progress])

  return (
    <FileUpload onChange={handleFileUpload}>
      <FileUpload.Label>Upload your files</FileUpload.Label>
      <FileUpload.Description>Max. size: 25MB</FileUpload.Description>
      {uploadedFile && progress === 100 && (
        <FileUpload.Status status="error">{uploadedFile.name} could not be added. Please refresh.</FileUpload.Status>
      )}
      {uploadedFile && (
        <FileUpload.Item
          progressBarRef={progressBarRef}
          key={uploadedFile.name}
          file={uploadedFile}
          status={progress === 100 ? 'error' : undefined}
          progress={progress}
          onClick={() => {
            setProgress(33)
          }}
        />
      )}
    </FileUpload>
  )
}

export const Playground: Story<React.ComponentProps<typeof FileUpload>> = args => {
  const progress = Math.random() * 100
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [uploadedFile, setUploadedFile] = React.useState<File | undefined>(undefined)
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files

    if (files) {
      const fileList = Array.from(files)
      setUploadedFile(fileList[0])
    }
  }

  return (
    <FileUpload ref={inputRef} onChange={handleFileUpload} {...args}>
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
              inputRef.current?.focus()
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
