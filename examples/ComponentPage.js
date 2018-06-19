import React from 'react'
import { Library } from '@compositor/kit'
import { NavLink } from 'react-router-dom'
import Navigation from './Navigation'
import examples from './examples'

const ComponentPage = () => {
  return (
    <Library
      basename='/docs/primer-react'
      title='Primer-react Library'
      examples={examples}
      renderSideNav={({
      title,
      examples,
    }) => (
      <Navigation title={title} examples={examples}/>
    )}/>
  )
}

export default ComponentPage
