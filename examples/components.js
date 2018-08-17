/* eslint-disable import/no-namespace */
import React from 'react'
import {Library} from './doc-components'
import * as examplesMap from './component-examples'

const basename = process.env.NODE_ENV === 'development' ? '/components/' : '/primer-react/components/'

const examples = Object.values(examplesMap).map(example => {
  example.path = basename + example.name
  return example
})

export default function Components(props) {
  return (
    <Library basename={basename} title="Components" examples={examples} {...props}>
      These pages demonstrate primer-react components.
    </Library>
  )
}
