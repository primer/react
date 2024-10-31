import type {Meta} from '@storybook/react'
import React from 'react'
import {InlineMessage} from '.'

const meta = {
  title: 'Experimental/Components/InlineMessage/Dev',
  component: InlineMessage,
} satisfies Meta<typeof InlineMessage>

export default meta

export const Default = () => {
  return (
    <InlineMessage variant="unavailable" sx={{color: 'red'}}>
      An example inline message
    </InlineMessage>
  )
}
