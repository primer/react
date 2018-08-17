import React from 'react'
import {Check} from '@githubprimer/octicons-react'
import {LiveEditor} from '@compositor/kit'
import {CircleOcticon} from '../../src'

export default {
  name: 'CircleOcticon',
  element: (
    <div className="d-flex">
      <LiveEditor
        code={`<CircleOcticon icon={Check} size={32} bg="green.5" color="white" />`}
        scope={{CircleOcticon, Check}}
      />
    </div>
  )
}
