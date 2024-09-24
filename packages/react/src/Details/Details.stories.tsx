import React from 'react'
import type {StoryFn, Meta} from '@storybook/react'
import Details, {StyledDetails} from './Details'
import {Button} from '../Button'
import useDetails from '../hooks/useDetails'

export default {
  title: 'Components/Details',
  component: Details,
} as Meta<typeof Details>
export const Default: StoryFn<typeof Details> = () => {
  const {getDetailsProps} = useDetails({closeOnOutsideClick: true})
  return (
    <StyledDetails {...getDetailsProps()}>
      <Details.Summary as={Button}>See Details</Details.Summary>
      This is some content
    </StyledDetails>
  )
}
