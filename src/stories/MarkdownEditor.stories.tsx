import {DiffIcon} from '@primer/octicons-react'
import React, {Meta} from '@storybook/react'
import {useState} from 'react'
import BaseStyles from '../BaseStyles'
import Box from '../Box'
import MarkdownEditor, {Emoji, Mentionable, Reference} from '../MarkdownEditor'
import ThemeProvider from '../ThemeProvider'

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
        'Rquired',
        'Enable File Uploads'
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
    fileUploadsEnabled: {
      name: 'Enable File Uploads',
      defaultValue: true,
      control: {
        type: 'boolean'
      }
    },
    onSubmit: {
      name: 'onSubmit',
      action: 'submitted'
    },
    onDiffClick: {
      name: 'onDiffClick',
      action: 'diff-clicked'
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
  fileUploadsEnabled: boolean
  onSubmit: () => void
  onDiffClick: () => void
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
  fileUploadsEnabled,
  onSubmit
}: ArgProps) => {
  const [value, setValue] = useState('')

  const onUploadFile = async (file: File) => {
    const wait = 0.0002 * file.size + 500
    await delay(wait / 2)
    if (file.name.toLowerCase().startsWith('a')) throw new Error("Rejected file for starting with the letter 'a'")
    // 0.5 - 5 seconds depending on file size up to about 20 MB
    await delay(wait / 2)
    return {file, url: fakeFileUrl(file)}
  }

  return (
    <>
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
        onRenderPreview={async () => {
          await delay(500)
          return 'Previewing Markdown is not supported in this example.'
        }}
        onUploadFile={fileUploadsEnabled ? onUploadFile : undefined}
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
        required={required}
      >
        <MarkdownEditor.Label visuallyHidden={hideLabel}>Markdown Editor Example</MarkdownEditor.Label>
      </MarkdownEditor>
      <p>Note: for demo purposes, files starting with &quot;A&quot; will be rejected.</p>
    </>
  )
}

export const CustomButtons = ({
  disabled,
  fullHeight,
  monospace,
  minHeightLines,
  maxHeightLines,
  hideLabel,
  required,
  fileUploadsEnabled,
  onSubmit,
  onDiffClick
}: ArgProps) => {
  const [value, setValue] = useState('')

  const onUploadFile = async (file: File) => {
    // 0.5 - 5 seconds depending on file size up to about 20 MB
    await delay(0.0002 * file.size + 500)
    return {file, url: fakeFileUrl(file)}
  }

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
      onRenderPreview={async () => {
        await delay(500)
        return 'Previewing Markdown is not supported in this example.'
      }}
      onUploadFile={fileUploadsEnabled ? onUploadFile : undefined}
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
      required={required}
    >
      <MarkdownEditor.Label visuallyHidden={hideLabel}>Markdown Editor Example</MarkdownEditor.Label>

      <MarkdownEditor.Toolbar>
        <MarkdownEditor.ToolbarButton icon={DiffIcon} onClick={onDiffClick} />
        <MarkdownEditor.DefaultToolbarButtons />
      </MarkdownEditor.Toolbar>

      <MarkdownEditor.Actions>
        <MarkdownEditor.ActionButton variant="danger" onClick={() => setValue('')}>
          Reset
        </MarkdownEditor.ActionButton>
        <MarkdownEditor.ActionButton variant="primary" onClick={onSubmit}>
          Submit
        </MarkdownEditor.ActionButton>
      </MarkdownEditor.Actions>
    </MarkdownEditor>
  )
}
