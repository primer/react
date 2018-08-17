import React from 'react'
import {Library} from './doc-components'
import * as examples from './demos/'

export default function DemoPage(props) {
  const basename = process.env.NODE_ENV === 'development' ? '/demos/' : '/primer-react/demo/'
  return (
    <Library basename={basename} title="Demo Library" examples={examples} {...props}>
      These are more involved demos that illustrate how to combine primer-react components into more interesting and/or
      useful ones.
    </Library>
  )
}
