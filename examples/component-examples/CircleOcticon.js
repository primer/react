import React from 'react'
import {Check} from '@githubprimer/octicons-react'
import {LiveEditor} from '@compositor/kit'
import {CircleOcticon} from '../../src'

const CircleOcticonExample = {
  name: 'CircleOcticon',
  element: (
    <div className="d-flex">
      <LiveEditor
        code={`<CircleOcticon icon={Check} size={32} bg="green" color="white" />`}
        scope={{CircleOcticon, Check}}
      />
    </div>
  )
}

export default CircleOcticonExample
