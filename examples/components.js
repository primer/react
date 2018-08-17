/* eslint-disable import/no-namespace */
import React from 'react'
import {Library} from './doc-components'
import * as examples from './component-examples'

export default function Components(props) {
  const basename = process.env.NODE_ENV === 'development' ? '/components/' : '/primer-react/components/'
  return (
    <Library basename={basename} title="Components" examples={examples} {...props}>
      These pages demonstrate primer-react components.
    </Library>
  )
}
