import React from 'react'
import { Library } from '@compositor/kit'
import { NavLink } from 'react-router-dom'
import SideNav from './SideNav'
import examples from './examples'

const ComponentPage = () => {
  return (
    <Library
      basename='/primer-react/components'
      title='Primer-react Library'
      examples={examples}
      renderSideNav={({
      title,
      examples,
    }) => (
      <SideNav title={title} examples={examples}/>
    )}/>
  )
}

export default ComponentPage
