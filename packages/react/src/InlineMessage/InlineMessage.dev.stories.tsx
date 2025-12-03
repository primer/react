import type {Meta} from '@storybook/react-vite'
import {InlineMessage} from '.'

const meta = {
  title: 'Experimental/Components/InlineMessage/Dev',
  component: InlineMessage,
} satisfies Meta<typeof InlineMessage>

export default meta

// Previous Styled version of the component didn't accept an sx prop so no need to test if that works.
export const DevDefault = () => {
  return <InlineMessage variant="unavailable">An example inline message</InlineMessage>
}
