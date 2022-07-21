import React, {useState} from 'react'
import {Meta} from '@storybook/react'
import {Emoji, Mentionable, MarkdownEditor, Reference} from '../MarkdownEditor'
import ThemeProvider from '../ThemeProvider'
import BaseStyles from '../BaseStyles'
import {Button} from '../Button'
import Box from '../Box'

const meta: Meta = {
  title: 'Forms/MarkdownEditor',
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
  parameters: {
    controls: {
      include: [
        'Disabled',
        'Full Height',
        'Monospace Font',
        'Minimum Height (Lines)',
        'Maximum Height (Lines)',
        'Hide Label',
        'rRquired'
      ]
    }
  },
  component: MarkdownEditor,
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
    },
    hideLabel: {
      name: 'Hide Label',
      defaultValue: false,
      control: {
        type: 'boolean'
      }
    },
    required: {
      name: 'Required',
      defaultValue: false,
      control: {
        type: 'boolean'
      }
    },
    onSubmit: {
      action: 'submitted'
    }
  }
}

export default meta

type ArgProps = {
  disabled: boolean
  fullHeight: boolean
  monospace: boolean
  minHeightLines: number
  maxHeightLines: number
  hideLabel: boolean
  required: boolean
  onSubmit: () => void
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const fakeFileUrl = (file: File) => `https://image-store.example/file/${encodeURIComponent(file.name)}`

const mentionChoices: Mentionable[] = [
  {identifier: 'monalisa', description: 'Monalisa Octocat'},
  {identifier: 'github', description: 'GitHub'},
  {identifier: 'primer', description: 'Primer'}
]

const emojiChoices: Emoji[] = [
  {name: '+1', character: '👍'},
  {name: '-1', character: '👎'},
  {name: 'heart', character: '❤️'},
  {name: 'wave', character: '👋'},
  {name: 'raised_hands', character: '🙌'},
  {name: 'pray', character: '🙏'},
  {name: 'clap', character: '👏'},
  {name: 'ok_hand', character: '👌'},
  {name: 'point_up', character: '☝️'},
  {name: 'point_down', character: '👇'},
  {name: 'point_left', character: '👈'},
  {name: 'point_right', character: '👉'},
  {name: 'raised_hand', character: '✋'},
  {name: 'thumbsup', character: '👍'},
  {name: 'thumbsdown', character: '👎'}
]

const referenceChoices: Reference[] = [
  {id: '1', titleText: 'Add logging functionality', titleHtml: 'Add logging functionality'},
  {
    id: '2',
    titleText: 'Error: `Failed to install` when installing',
    titleHtml: 'Error: <code>Failed to install</code> when installing'
  },
  {id: '3', titleText: 'Add error-handling functionality', titleHtml: 'Add error-handling functionality'}
]

const caseInsensitiveIncludes = (haystack: string, needle: string) =>
  haystack.toLowerCase().includes(needle.toLowerCase())

export const Default = ({
  disabled,
  fullHeight,
  monospace,
  minHeightLines,
  maxHeightLines,
  hideLabel,
  required,
  onSubmit
}: ArgProps) => {
  const [value, setValue] = useState('')

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
      hideLabel={hideLabel}
      onRenderPreview={async () => {
        await delay(500)
        return 'Previewing Markdown is not supported in this example.'
      }}
      onUploadFile={async file => {
        // 0.5 - 5 seconds depending on file size up to about 20 MB
        await delay(0.0002 * file.size + 500)
        return {file, url: fakeFileUrl(file)}
      }}
      onSuggestEmojis={query => emojiChoices.filter(emoji => caseInsensitiveIncludes(emoji.name, query)).slice(0, 5)}
      onSuggestMentions={query =>
        mentionChoices
          .filter(
            entity =>
              caseInsensitiveIncludes(entity.description, query) || caseInsensitiveIncludes(entity.identifier, query)
          )
          .slice(0, 5)
      }
      onSuggestReferences={query =>
        referenceChoices
          .filter(
            reference =>
              caseInsensitiveIncludes(reference.titleText, query) || caseInsensitiveIncludes(reference.id, query)
          )
          .slice(0, 5)
      }
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
      required={required}
    />
  )
}
