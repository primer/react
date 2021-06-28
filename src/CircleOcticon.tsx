import {IconProps} from '@primer/octicons-react'
import React from 'react'
import BorderBox from './BorderBox'
import {Box, BoxProps} from '.'

export type CircleOcticonProps = {
  as?: React.ElementType
  size?: number
  icon: React.ComponentType<{size?: IconProps['size']}>
} & BoxProps

function CircleOcticon(props: CircleOcticonProps) {
  const {size, as} = props
  const {icon: IconComponent, bg, ...rest} = props
  return (
    <BorderBox as={as} bg={bg} overflow="hidden" borderWidth={0} size={size} borderRadius="50%">
      <Box display="flex" {...rest} alignItems="center" justifyContent="center">
        <IconComponent size={size} />
      </Box>
    </BorderBox>
  )
}

CircleOcticon.defaultProps = {
  ...Box.defaultProps,
  size: 32
}

export default CircleOcticon
