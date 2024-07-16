import type {StoryObj} from '@storybook/react'
import React from 'react'
import {AriaAlert} from './AriaAlert'
import {VisuallyHidden} from '../internal/components/VisuallyHidden'

export default {
  title: 'Drafts/Components/AriaAlert/Features',
  component: AriaAlert,
}

export const VisuallyHiddenStory: StoryObj = {
  name: 'VisuallyHidden',
  render: () => {
    return (
      <>
        <p>This is an example</p>
        <VisuallyHidden>
          <AriaAlert>A visually hidden message</AriaAlert>
        </VisuallyHidden>
      </>
    )
  },
}
