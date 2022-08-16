import React from 'react'
import {Meta} from '@storybook/react'
import Details from './'
import useDetails from '../hooks/useDetails'

export default {
  title: 'Details',
  component: Details
} as Meta

export const Default = () => {
  const {getDetailsProps} = useDetails({closeOnOutsideClick: true})

  return <Details {...getDetailsProps()}>This is some content</Details>
}
