import {IconProps} from '@primer/octicons-react'
import React from 'react'
import Box, {BoxProps} from './Box'

export type CircleOcticonProps = {
  as?: React.ElementType
  size?: number
  icon: React.ComponentType<{size?: IconProps['size']}>
} & BoxProps

function CircleOcticon(props: CircleOcticonProps) {
  const {size, as} = props
  const {icon: IconComponent, bg, ...rest} = props
  return (
    <Box
      as={as}
      bg={bg}
      overflow="hidden"
      borderWidth={0}
      size={size}
      borderRadius="50%"
      borderStyle="solid"
      borderColor="border.default"
    >
      <Box display="flex" {...rest} alignItems="center" justifyContent="center">
        <IconComponent size={size} />
      </Box>
    </Box>
  )
}

CircleOcticon.defaultProps = {
  ...Box.defaultProps,
  size: 32
}

export default CircleOcticon
