import React from 'react'
import Octicon from '@githubprimer/octicons-react'
import FlexContainer from './FlexContainer'
import {withSystemProps} from './system-props'

function CircleOcticon(props) {
  const {size} = props
  const {icon, ...rest} = props
  return (
    <FlexContainer {...rest} size={size} alignItems="center" justifyContent="center">
      <Octicon icon={icon} />
    </FlexContainer>
  )
}

CircleOcticon.defaultProps = {
  size: 32
}

CircleOcticon.propTypes = {
  icon: Octicon.propTypes.icon
}

export default withSystemProps(CircleOcticon, ['space'])
