import React from 'react'
import PropTypes from 'prop-types'
import Octicon from '@githubprimer/octicons-react'
import Flex from './Flex'
import theme from './theme'
import BorderBox from './BorderBox'

function CircleOcticon(props) {
  const {size} = props
  const {icon, bg, ...rest} = props
  return (
    <BorderBox bg={bg} overflow="hidden" border="none" size={size} borderRadius="50%">
      <Flex {...rest} alignItems="center" justifyContent="center">
        <Octicon icon={icon} size={size} />
      </Flex>
    </BorderBox>
  )
}

CircleOcticon.defaultProps = {
  theme,
  ...Flex.defaultProps,
  is: 'div',
  size: 32
}

CircleOcticon.propTypes = {
  ...Flex.propTypes,
  icon: Octicon.propTypes.icon,
  size: PropTypes.number
}

export default CircleOcticon
