import React, {useState} from 'react'
import {Meta} from '@storybook/react'
import {MarkdownEditor} from '../MarkdownEditor/MarkdownEditor'
import ThemeProvider from '../ThemeProvider'
import BaseStyles from '../BaseStyles'
import {Button} from '../Button'
import Box from '../Box'

export default {
  title: 'Forms/MarkdownEditor',
  component: MarkdownEditor,
  decorators: [
    Story => {
      return (
        <ThemeProvider>
          <BaseStyles>
            <Box sx={{maxWidth: 800}}>{Story()}</Box>
          </BaseStyles>
        </ThemeProvider>
      )
    }
  ],
  argTypes: {
    disabled: {
      name: 'Disabled',
      defaultValue: false,
      control: {
        type: 'boolean'
      }
    },
    fullHeight: {
      name: 'Full Height',
      defaultValue: false,
      control: {
        type: 'boolean'
      }
    },
    monospace: {
      name: 'Monospace Font',
      defaultValue: false,
      control: {
        type: 'boolean'
      }
    },
    minHeightLines: {
      name: 'Minimum Height (Lines)',
      defaultValue: 5,
      control: {
        type: 'number'
      }
    },
    maxHeightLines: {
      name: 'Maximum Height (Lines)',
      defaultValue: 35,
      control: {
        type: 'number'
      }
    }
  }
} as Meta

type ArgProps = {
  disabled: boolean
  fullHeight: boolean
  monospace: boolean
  minHeightLines: number
  maxHeightLines: number
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const fakeFileUrl = (file: File) => `https://image-store.example/file/${encodeURIComponent(file.name)}`

export const Default = ({disabled, fullHeight, monospace, minHeightLines, maxHeightLines}: ArgProps) => {
  const [value, setValue] = useState('')

  const onSubmit = () => alert('Submitted')

  return (
    <MarkdownEditor
      value={value}
      onChange={setValue}
      onPrimaryAction={onSubmit}
      disabled={disabled}
      fullHeight={fullHeight}
      monospace={monospace}
      minHeightLines={minHeightLines}
      maxHeightLines={maxHeightLines}
      placeholder="Enter some Markdown..."
      label="Markdown Editor Example"
      onRenderPreview={async () => {
        await delay(500)
        return 'Previewing Markdown is not supported in this example.'
      }}
      onUploadFile={async file => {
        // 0.5 - 5 seconds depending on file size up to about 20 MB
        await delay(0.0002 * file.size + 500)
        return {file, url: fakeFileUrl(file)}
      }}
      actionButtons={
        <>
          <Button variant="danger" onClick={() => setValue('')} size="small">
            Reset
          </Button>
          <Button variant="primary" onClick={onSubmit} size="small">
            Submit
          </Button>
        </>
      }
    />
  )
}
