import React from 'react'
import PropTypes from 'prop-types'
import Octicon from '@primer/octicons-react'
import Flex from './Flex'
import theme from './theme'
import BorderBox from './BorderBox'

function CircleOcticon(props) {
  const {size, as} = props
  const {icon, bg, as: asProp, ...rest} = props
  return (
    <BorderBox as={as} bg={bg} overflow="hidden" borderWidth={0} size={size} borderRadius="50%">
      <Flex {...rest} alignItems="center" justifyContent="center">
        <Octicon icon={icon} size={size} />
      </Flex>
    </BorderBox>
  )
}

CircleOcticon.defaultProps = {
  theme,
  ...Flex.defaultProps,
  size: 32
}

CircleOcticon.propTypes = {
  ...Flex.propTypes,
  icon: Octicon.propTypes.icon,
  size: PropTypes.number,
  theme: PropTypes.object
}

export default CircleOcticon
