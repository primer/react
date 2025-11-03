import type {Meta} from '@storybook/react-vite'
import {InlineMessage} from '../InlineMessage'

const meta = {
  title: 'Experimental/Components/InlineMessage/Features',
  component: InlineMessage,
} satisfies Meta<typeof InlineMessage>

export default meta

export const Critical = () => {
  return <InlineMessage variant="critical">An example inline message</InlineMessage>
}

export const Success = () => {
  return <InlineMessage variant="success">An example inline message</InlineMessage>
}

export const Unavailable = () => {
  return <InlineMessage variant="unavailable">An example inline message</InlineMessage>
}

export const Warning = () => {
  return <InlineMessage variant="warning">An example inline message</InlineMessage>
}

export const Multiline = () => {
  return (
    <div
      style={{
        maxWidth: '30ch',
      }}
    >
      <InlineMessage variant="success">An example inline message that spans multiple lines</InlineMessage>
    </div>
  )
}
