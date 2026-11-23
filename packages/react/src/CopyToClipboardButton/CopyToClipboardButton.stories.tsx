import type {Meta, StoryObj} from '@storybook/react-vite'
import {useState} from 'react'
import {Button, TextInput} from '../index'
import {CopyToClipboardButton} from './CopyToClipboardButton'
import {useCopyToClipboard} from '../hooks/useCopyToClipboard'

export default {
  title: 'Components/CopyToClipboardButton',
  component: CopyToClipboardButton,
  args: {textToCopy: 'Hello, world!', ariaLabel: 'Copy greeting'},
} satisfies Meta<typeof CopyToClipboardButton>

export const Default: StoryObj<typeof CopyToClipboardButton> = {}
export const Playground: StoryObj<typeof CopyToClipboardButton> = {}

export const Disabled: StoryObj<typeof CopyToClipboardButton> = {args: {disabled: true}}

export const CustomFeedback: StoryObj<typeof CopyToClipboardButton> = {
  args: {copiedMessage: 'Greeting copied', errorMessage: 'Greeting could not be copied', variant: 'default'},
}

export const WithTextInput = () => {
  const [text, setText] = useState('Hello, world!')
  return (
    <TextInput
      aria-label="Greeting"
      value={text}
      onChange={event => setText(event.target.value)}
      trailingAction={<CopyToClipboardButton textToCopy={text} ariaLabel="Copy greeting" size="small" />}
    />
  )
}

export const WithCustomButton = () => {
  const {copy, copied, error} = useCopyToClipboard()
  const handleCopy = async () => {
    try {
      await copy('Hello, world!')
    } catch {
      // The hook's error is rendered in the status below.
    }
  }
  return (
    <>
      <Button onClick={handleCopy}>Copy greeting</Button>
      <span role="status">{copied ? 'Greeting copied' : error ? 'Greeting could not be copied' : ''}</span>
    </>
  )
}
