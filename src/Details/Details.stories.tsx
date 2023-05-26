import {ComponentMeta, ComponentStory} from '@storybook/react'
import React from 'react'
import {Button} from '../Button'
import useDetails from '../hooks/useDetails'
import Details from './Details'

export default {
  title: 'Components/Details',
  component: Details,
} as ComponentMeta<typeof Details>
export const Default: ComponentStory<typeof Details> = () => {
  const {getDetailsProps} = useDetails({closeOnOutsideClick: true})
  return (
    <Details {...getDetailsProps()}>
      <Button as="summary">See Details</Button>
      This is some content
    </Details>
  )
}
