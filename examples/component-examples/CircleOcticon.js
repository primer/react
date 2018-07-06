import React from 'react'
import {Check} from '@github/octicons-react'
import {CircleOcticon} from '../../src'

const CircleOcticonExample = {
  name: 'CircleOcticon',
  element: (
    <div className="d-flex">
      <CircleOcticon icon={Check} size={32} bg="green" color="white" />
    </div>
  )
}

export default CircleOcticonExample
