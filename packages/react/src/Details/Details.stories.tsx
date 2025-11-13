import type {StoryFn, Meta} from '@storybook/react-vite'
import Details from './Details'
import {Button} from '../Button'
import useDetails from '../hooks/useDetails'

export default {
  title: 'Components/Details',
  component: Details,
} as Meta<typeof Details>
export const Default: StoryFn<typeof Details> = () => {
  const {getDetailsProps} = useDetails({closeOnOutsideClick: true})
  const {ref, ...detailsProps} = getDetailsProps()
  return (
    <Details
      {...detailsProps}
      // @ts-expect-error [react-19] [TS2322]
      ref={ref}
    >
      <Details.Summary as={Button}>See Details</Details.Summary>
      This is some content
    </Details>
  )
}
