import React from 'react'
import { Library } from '@compositor/kit'
import SideNav from './doc-components/SideNav'
//import * as examples from './component-examples'
import AvatarExample from './Avatar.js'

const ComponentPage = () => {
  return (
    <Library
      basename='/primer-react/components'
      title='Primer-react Library'
      examples={[AvatarExample]}
      renderSideNav={({
      title,
      examples,
    }) => (
      <SideNav title={title} examples={examples}/>
    )}/>
  )
}

export default ComponentPage
