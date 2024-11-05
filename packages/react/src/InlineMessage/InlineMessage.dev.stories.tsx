import type {Meta} from '@storybook/react'
import React from 'react'
import {InlineMessage} from '.'

const meta = {
  title: 'Experimental/Components/InlineMessage/Dev',
  component: InlineMessage,
} satisfies Meta<typeof InlineMessage>

export default meta

export const DevDefault = () => {
  return <InlineMessage variant="unavailable">An example inline message</InlineMessage>
}
