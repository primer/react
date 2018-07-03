import React from 'react'
import {Library} from '@compositor/kit'
import SideNav from './doc-components/SideNav'
import * as examples from './component-examples'

const ComponentPage = () => {
  const basename = process.env.NODE_ENV === 'development' ? '/components' : '/primer-react/components'
  return (
    <Library
      basename={basename}
      title="Primer-react Library"
      examples={Object.values(examples)}
      renderSideNav={({title, examples}) => <SideNav title={title} examples={examples} />}
    />
  )
}

export default ComponentPage
