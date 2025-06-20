import type {StoryFn, Meta} from '@storybook/react-vite'
import Details from './Details'
import {Button} from '../Button'
import useDetails from '../hooks/useDetails'

export default {
  title: 'Components/Details/Dev',
  component: Details,
} as Meta<typeof Details>

export const SxPropStressTest: StoryFn<typeof Details> = () => {
  const {getDetailsProps} = useDetails({closeOnOutsideClick: true})
  return (
    <Details
      {...getDetailsProps()}
      sx={{
        backgroundColor: 'accent.emphasis',
        color: 'accent.fg',
        p: 4,
      }}
    >
      <Button as="summary">See Details</Button>
      This is some content
    </Details>
  )
}
