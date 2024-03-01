import React from 'react'
import type {Meta, Story} from '@storybook/react'
import MarkdownToolbar from './MarkdownToolbar'
import type {ComponentProps} from '../../utils/types'
import {useId} from '../../hooks/useId'
import {Box} from '../..'

export default {
  title: 'Drafts/Components/MarkdownToolbar',
  component: MarkdownToolbar,
} as Meta<ComponentProps<typeof MarkdownToolbar>>

export const Playground: Story<ComponentProps<typeof MarkdownToolbar>> = () => {
  const id = useId()
  return (
    <>
      <MarkdownToolbar for={id} sx={{display: 'block'}}>
        <MarkdownToolbar.DefaultButtons />
      </MarkdownToolbar>
      <textarea id={id} />
    </>
  )
}

export const CommentBox = () => {
  const id = useId()
  return (
    <Box
      sx={{
        maxWidth: 800,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        borderColor: 'border.default',
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 2,
        minInlineSize: 'auto',
        bg: 'canvas.default',
        color: 'fg.default',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          backgroundColor: 'canvas.subtle',
          borderTopLeftRadius: 2,
          borderTopRightRadius: 2,
          justifyContent: 'space-between',
        }}
        as="header"
      >
        <MarkdownToolbar sx={{display: 'flex', width: '50%'}} for={id}>
          <MarkdownToolbar.DefaultButtons />
        </MarkdownToolbar>
      </Box>
      <textarea id={id} />
    </Box>
  )
}
