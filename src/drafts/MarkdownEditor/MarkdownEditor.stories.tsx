import {DiffIcon} from '@primer/octicons-react'
import React, {Meta} from '@storybook/react'
import {useState} from 'react'
import BaseStyles from '../../BaseStyles'
import Box from '../../Box'
import MarkdownEditor, {Emoji, Mentionable, Reference, SavedReply} from '.'
import ThemeProvider from '../../ThemeProvider'

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
        'Required',
        'Enable File Uploads',
        'Enable Saved Replies'
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
    savedRepliesEnabled: {
      name: 'Enable Saved Replies',
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
  savedRepliesEnabled: boolean
  onSubmit: () => void
  onDiffClick: () => void
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const fakeFileUrl = (file: File) => `https://image-store.example/file/${encodeURIComponent(file.name)}`

const mentionables: Mentionable[] = [
  {identifier: 'monalisa', description: 'Monalisa Octocat'},
  {identifier: 'github', description: 'GitHub'},
  {identifier: 'primer', description: 'Primer'}
]

const emojis: Emoji[] = [
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

const references: Reference[] = [
  {id: '1', titleText: 'Add logging functionality', titleHtml: 'Add logging functionality'},
  {
    id: '2',
    titleText: 'Error: `Failed to install` when installing',
    titleHtml: 'Error: <code>Failed to install</code> when installing'
  },
  {id: '3', titleText: 'Add error-handling functionality', titleHtml: 'Add error-handling functionality'}
]

const savedReplies: SavedReply[] = [
  {name: 'Duplicate', content: 'Duplicate of #'},
  {name: 'Welcome', content: 'Welcome to the project!\n\nPlease be sure to read the contributor guidelines.'},
  {name: 'Thanks', content: 'Thanks for your contribution!'},
  {
    name: 'Long Lorem Ipsum',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sodales ligula commodo ex venenatis molestie. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Curabitur vulputate elementum dolor ac sollicitudin. Duis tellus quam, hendrerit sit amet metus quis, pharetra consectetur eros. Duis purus justo, convallis nec velit nec, feugiat pharetra nibh. Aenean vulputate urna sollicitudin vehicula fermentum. Vestibulum semper iaculis metus, quis ullamcorper dui feugiat a. Donec nulla sapien, tincidunt ut arcu sit amet, ultrices fringilla massa. Integer ac justo lacus.\n\nFusce sed pharetra sem. Nulla rutrum turpis magna, sit amet sodales dui vehicula in. Cras lacinia, dui sit amet dictum lobortis, arcu erat semper lectus, placerat accumsan diam dolor nec quam. Vivamus accumsan ut magna eget maximus. Integer scelerisque justo et quam pharetra, nec placerat nibh auctor. Vestibulum cursus, mauris id euismod convallis, justo sapien faucibus dolor, nec dictum erat urna at velit. Quisque egestas massa eget odio consectetur vehicula. Aliquam a imperdiet lacus, eu facilisis mauris. Etiam tempor neque vitae erat elementum bibendum. Fusce ultricies nunc tortor.\n\nQuisque in posuere sapien. Nulla ornare sagittis tellus eu laoreet. Sed molestie sem in turpis blandit pretium. Vivamus gravida dui id gravida aliquam. Vestibulum vestibulum, justo vitae cursus mattis, urna mauris pulvinar dolor, eu suscipit magna libero eget diam. Praesent id rutrum libero, a feugiat nulla. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Curabitur ornare libero id augue fringilla maximus sed sed ante. Quisque finibus accumsan lorem ut lobortis. Maecenas lobortis lacus sed mattis rutrum. Aliquam a mi sodales, blandit nisi ut, volutpat ex. Duis tristique, erat quis fermentum ultricies, leo ipsum placerat nunc, eu aliquam nibh mauris vitae lectus. Proin vitae tellus nec lorem vulputate faucibus. In hac habitasse platea dictumst. Suspendisse dictum odio in faucibus mattis.'
  }
]

const onUploadFile = async (file: File) => {
  const wait = 0.0002 * file.size + 500
  await delay(wait / 2)
  // to demo file rejections:
  if (file.name.toLowerCase().startsWith('a')) throw new Error("Rejected file for starting with the letter 'a'")
  // 0.5 - 5 seconds depending on file size up to about 20 MB
  await delay(wait / 2)
  return {file, url: fakeFileUrl(file)}
}

const renderPreview = async () => {
  await delay(500)
  return 'Previewing Markdown is not supported in this example.'
}

export const Default = ({
  disabled,
  fullHeight,
  monospace,
  minHeightLines,
  maxHeightLines,
  hideLabel,
  required,
  fileUploadsEnabled,
  onSubmit,
  savedRepliesEnabled
}: ArgProps) => {
  const [value, setValue] = useState('')

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
        onRenderPreview={renderPreview}
        onUploadFile={fileUploadsEnabled ? onUploadFile : undefined}
        emojiSuggestions={emojis}
        mentionSuggestions={mentionables}
        referenceSuggestions={references}
        savedReplies={savedRepliesEnabled ? savedReplies : undefined}
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
  onDiffClick,
  savedRepliesEnabled
}: ArgProps) => {
  const [value, setValue] = useState('')

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
        onRenderPreview={renderPreview}
        onUploadFile={fileUploadsEnabled ? onUploadFile : undefined}
        emojiSuggestions={emojis}
        mentionSuggestions={mentionables}
        referenceSuggestions={references}
        required={required}
        savedReplies={savedRepliesEnabled ? savedReplies : undefined}
      >
        <MarkdownEditor.Label visuallyHidden={hideLabel}>Markdown Editor Example</MarkdownEditor.Label>

        <MarkdownEditor.Toolbar>
          <MarkdownEditor.ToolbarButton icon={DiffIcon} onClick={onDiffClick} aria-label="Custom Button" />
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
      <p>Note: for demo purposes, files starting with &quot;A&quot; will be rejected.</p>
    </>
  )
}
