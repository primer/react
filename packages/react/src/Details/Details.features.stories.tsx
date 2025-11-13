import type {StoryFn, Meta} from '@storybook/react-vite'
import Details from './Details'
import useDetails from '../hooks/useDetails'

export default {
  title: 'Components/Details/Features',
  component: Details,
} as Meta<typeof Details>

export const WithCustomSummary: StoryFn<typeof Details> = () => {
  const {getDetailsProps} = useDetails({closeOnOutsideClick: true})
  const {ref, ...detailsProps} = getDetailsProps()
  return (
    <Details
      {...detailsProps}
      // @ts-expect-error [react-19] [TS2322]
      ref={ref}
    >
      <summary>Custom see Details</summary>
      This is some content
    </Details>
  )
}
