import React from 'react'
import Octicon, {Zap} from '@github/octicons-react'
import {Block, CircleBadge} from '../../src'

const CircleBadgeExample = {
  name: 'CircleBadge',
  element: (
    <div>
      <Block mb={2}>
        <CircleBadge size="medium">
          <Octicon icon={Zap}/>
        </CircleBadge>
      </Block>
    </div>
  )
}

export default CircleBadgeExample
