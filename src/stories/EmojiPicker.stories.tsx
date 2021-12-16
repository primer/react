import React, {useState} from 'react'
import {Meta} from '@storybook/react'

import {BaseStyles, Box, EmojiPicker, EmojiPickerProps, Text, ThemeProvider} from '..'
import {ArchiveIcon, LogoGithubIcon, MarkGithubIcon} from '@primer/octicons-react'

export default {
  title: 'Composite components/Emoji Picker',

  decorators: [
    Story => {
      return (
        <ThemeProvider>
          <BaseStyles>
            <Story />
          </BaseStyles>
        </ThemeProvider>
      )
    }
  ],
  argTypes: {
    as: {
      table: {
        disable: true
      }
    },
    theme: {
      table: {
        disable: true
      }
    },
    sx: {
      table: {
        disable: true
      }
    }
  }
} as Meta

export const defaultEmojiPicker = (args: EmojiPickerProps) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [emoji, setEmoji] = useState<React.ReactNode>()

  const customCategories = [
    {
      id: 'github',
      name: 'GitHub',
      icon: <MarkGithubIcon />,
      emojis: [
        {
          name: 'Icon',
          emoji: <MarkGithubIcon />
        },
        {
          name: 'Logo',
          emoji: <LogoGithubIcon />
        }
      ]
    },
    {
      id: 'archived',
      name: 'Archived',
      icon: <ArchiveIcon />,
      emojis: []
    }
  ]

  return (
    <Box sx={{display: 'flex', alignItems: 'flex-start'}}>
      <EmojiPicker customCategories={customCategories} onSelect={e => setEmoji(e)} {...args} />
      <Text sx={{ml: 3, fontSize: 6}}>{emoji}</Text>
    </Box>
  )
}
