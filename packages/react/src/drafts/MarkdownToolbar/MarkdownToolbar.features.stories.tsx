import React from 'react'
import type {Meta} from '@storybook/react'
import MarkdownToolbar from './MarkdownToolbar'
import type {ComponentProps} from '../../utils/types'
import {useId} from '../../hooks/useId'

export default {
  title: 'Draft/Components/MarkdownToolbar/Features',
  component: MarkdownToolbar,
} as Meta<ComponentProps<typeof MarkdownToolbar>>

export const CommentBox = () => {
  const id = useId()
  return (
    <>
      <MarkdownToolbar for={id}>
        <MarkdownToolbar.DefaultButtons></MarkdownToolbar.DefaultButtons>
      </MarkdownToolbar>
      <textarea id={id} />
    </>
  )
}
