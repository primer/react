import type {StoryObj} from '@storybook/react-vite'
import {AriaAlert} from './AriaAlert'
import {VisuallyHidden} from '../VisuallyHidden'

export default {
  title: 'Experimental/Components/AriaAlert/Features',
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
