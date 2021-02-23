/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, {useState} from 'react'
import {Meta} from '@storybook/react'

import {BaseStyles, Overlay, Button} from '..'

export default {
  title: 'Internal components/Overlay',
  component: Overlay,
  decorators: [
    Story => {
      return (
        <BaseStyles>
          <Story />
        </BaseStyles>
      )
    }
  ],
  argTypes: {
    width: {
      control: {
        type: 'select',
        options: ['sm', 'md', 'lg', 'xl', 'auto']
      }
    },
    height: {
      control: {
        type: 'select',
        options: ['sm', 'md', 'auto']
      }
    }
  }
} as Meta

export const DefaultOverlay = () => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        open overlay
      </Button>
      {isOpen && <Overlay width="sm"> content!!</Overlay>}
    </>
  )
}
