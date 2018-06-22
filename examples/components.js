import React from 'react'
import { Library } from '@compositor/kit'
import SideNav from './doc-components/SideNav'
import * as examples from './component-examples'

const ComponentPage = () => {
  return (
    <Library
      basename='/components'
      title='Primer-react Library'
      examples={Object.values(examples)}
      renderSideNav={({
      title,
      examples,
    }) => (
      <SideNav title={title} examples={examples}/>
    )}/>
  )
}

export default ComponentPage
