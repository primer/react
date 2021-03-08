import {IconProps} from '@primer/octicons-react'
import React from 'react'
import Flex, {FlexProps} from './Flex'

export type CircleOcticonProps = {
  // as?: React.ElementType
  size?: number
  icon: React.ComponentType<{size?: IconProps['size']}>
} & FlexProps

// type CircleOcticonComponent = {}

function CircleOcticon({icon: IconComponent, size, ...props}: CircleOcticonProps) {
  return (
    <Flex
      {...props}
      alignItems="center"
      justifyContent="center"
      sx={{overflow: 'hidden', borderRadius: '50%', width: size, height: size, ...props.sx}}
    >
      <IconComponent size={size} />
    </Flex>
  )
}

CircleOcticon.defaultProps = {
  ...Flex.defaultProps,
  size: 32
}

export default CircleOcticon
