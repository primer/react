import React from 'react'
import {Check, X, Zap} from '@githubprimer/octicons-react'
import {LiveEditor} from '@compositor/kit'
import {CircleOcticon, FlexContainer} from '../../src'

export default {
  name: 'CircleOcticon',
  element: (
    <LiveEditor
      code={`
<FlexContainer>
  <CircleOcticon icon={Check} size={32} bg="green.5" color="white" mr={2} />
  <CircleOcticon icon={Zap} size={48} bg="blue.5" color="white" mr={2} />
  <CircleOcticon icon={X} size={64} bg="red.5" color="white" mr={2} />
</FlexContainer>
        `.trim()}
      scope={{CircleOcticon, Check, FlexContainer, X, Zap}}
    />
  )
}
