import React from 'react'
import PropTypes from 'prop-types'
import Octicon from '@githubprimer/octicons-react'
import Flex from './Flex'

function CircleOcticon(props) {
  const {size} = props
  const {icon, ...rest} = props
  return (
    <Flex {...rest} size={size} alignItems="center" justifyContent="center">
      <Octicon icon={icon} size={size} />
    </Flex>
  )
}

CircleOcticon.defaultProps = {
  ...Flex.defaultProps,
  size: 32,
  borderRadius: '50%'
}

CircleOcticon.propTypes = {
  ...Flex.propTypes,
  icon: Octicon.propTypes.icon,
  size: PropTypes.number
}

export default CircleOcticon
