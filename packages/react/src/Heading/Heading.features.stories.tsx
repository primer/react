import type {StoryFn} from '@storybook/react-vite'
import Heading from './Heading'

export default {
  title: 'Components/Heading/Features',
}

export const TestSx: StoryFn<typeof Heading> = () => (
  <Heading
    sx={{
      fontSize: 2,
      fontWeight: 'normal',
    }}
  >
    Heading with sx override
  </Heading>
)

export const Small: StoryFn<typeof Heading> = () => <Heading variant="small">Small heading</Heading>

export const Medium: StoryFn<typeof Heading> = () => <Heading variant="medium">Medium heading</Heading>

export const Large: StoryFn<typeof Heading> = () => <Heading variant="large">Large heading</Heading>
