import type {Meta} from '@storybook/react-vite'
import Heading from '../Heading'
import Popover from './Popover'
import Text from '../Text'
import {Button} from '../Button'

export default {
  title: 'Components/Popover/Dev',
  component: Popover,
} as Meta<typeof Popover>

export const SxProps = () => (
  <Popover
    relative
    open={true}
    caret="top-right"
    sx={{
      left: '50%',
      transform: 'translateX(-50%)',
      mt: 2,
      color: 'var(--bgColor-danger-muted)',
    }}
    style={{padding: '16px'}}
  >
    <Popover.Content
      sx={{
        minWidth: '260px',
        width: '40%',
      }}
      style={{padding: '32px'}}
    >
      <Heading sx={{fontSize: 2}}>Popover heading</Heading>
      <Text as="p">Message about popovers</Text>
      <Button>Got it!</Button>
    </Popover.Content>
  </Popover>
)
