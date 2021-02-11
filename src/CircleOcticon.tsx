import React from 'react'
import PropTypes from 'prop-types'
import Flex, {FlexProps} from './Flex'
import theme from './theme'
import BorderBox from './BorderBox'
import {IconProps} from '@primer/octicons-react'

export type CircleOcticonProps = {
  as?: React.ElementType
  size?: number
  icon: React.ComponentType<{size?: IconProps['size']}>
} & FlexProps

function CircleOcticon(props: CircleOcticonProps) {
  const {size, as} = props
  const {icon: IconComponent, bg, ...rest} = props
  return (
    <BorderBox as={as} bg={bg} overflow="hidden" borderWidth={0} size={size} borderRadius="50%">
      <Flex {...rest} alignItems="center" justifyContent="center">
        <IconComponent size={size} />
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
  icon: PropTypes.elementType.isRequired,
  size: PropTypes.number,
  theme: PropTypes.object
}

export default CircleOcticon
