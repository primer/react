import type {Meta} from '@storybook/react-vite'
import Heading from '../Heading'
import Popover from './Popover'
import Text from '../Text'
import {Button} from '../Button'

export default {
  title: 'Components/Popover/Dev',
  component: Popover,
} as Meta<typeof Popover>

export const PopoverOverflow = () => (
  <Popover relative open={true}>
    <Popover.Content height={'small'}>
      <Heading style={{fontSize: 'var(--text-title-size-small)'}}>Popover heading</Heading>
      <Text as="p">Message about popovers</Text>
      <Text as="p">Message about popovers</Text>
      <Text as="p">Message about popovers</Text>
      <Text as="p">Message about popovers</Text>
      <Text as="p">Message about popovers</Text>
      <Text as="p">Message about popovers</Text>
      <Text as="p">Message about popovers</Text>
      <Button>Got it!</Button>
    </Popover.Content>
  </Popover>
)
