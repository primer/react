import type {Meta, StoryFn} from '@storybook/react-vite'

import Hidden from '.'
import Text from '../Text'

export default {
  title: 'Experimental/Components/Hidden',
  parameters: {
    controls: {
      expanded: true,
    },
  },
  args: {
    when: ['narrow'],
  },
  argTypes: {
    when: {
      type: {
        name: 'enum',
        value: ['narrow', 'regular', 'wide'],
      },
      control: {type: 'multi-select'},
      description: 'The viewport type where the content is hidden.',
    },
  },
} as Meta<typeof Hidden>

export const Default = () => (
  <>
    <Text>The below content is visible when the viewport is regular or wide but hidden when narrow:</Text>
    <Hidden when="narrow">
      This is the said content and it is visible when the viewport is regular or wide but hidden when narrow
    </Hidden>
  </>
)

export const Playground: StoryFn<typeof Hidden> = args => (
  <Hidden {...args}>The content is hidden when the viewport is {Array(args.when).join(',')}</Hidden>
)
