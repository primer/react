import React from 'react'
import PropTypes from 'prop-types'
import Octicon from '@githubprimer/octicons-react'
import FlexContainer from './FlexContainer'

function CircleOcticon(props) {
  const {size} = props
  const {icon, ...rest} = props
  return (
    <FlexContainer {...rest} size={size} alignItems="center" justifyContent="center">
      <Octicon icon={icon} size={size} />
    </FlexContainer>
  )
}

CircleOcticon.defaultProps = {
  ...FlexContainer.defaultProps,
  size: 32,
  borderRadius: '50%'
}

CircleOcticon.propTypes = {
  ...FlexContainer.propTypes,
  icon: Octicon.propTypes.icon,
  size: PropTypes.number
}

export default CircleOcticon
