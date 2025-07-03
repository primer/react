import type {Meta, StoryFn} from '@storybook/react-vite'
import Pagehead from './Pagehead'
import Heading from '../Heading'

export default {
  title: 'Deprecated/Components/Pagehead',
  component: Pagehead,
} as Meta<typeof Pagehead>

export const Default = () => (
  <Pagehead>
    <Heading as="h2" variant="small">
      Pagehead
    </Heading>
  </Pagehead>
)

export const Playground: StoryFn<typeof Pagehead> = args => (
  <Pagehead {...args}>
    <Heading as="h2" variant="small">
      Pagehead
    </Heading>
  </Pagehead>
)

Playground.args = {
  as: 'div',
}

Playground.argTypes = {
  as: {
    control: {
      type: 'select',
      options: ['div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    },
  },
}
