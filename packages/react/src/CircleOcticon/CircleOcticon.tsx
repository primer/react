import type {IconProps} from '@primer/octicons-react'
import type React from 'react'
import type {BoxProps} from '../Box'
import Box from '../Box'

export type CircleOcticonProps = {
  as?: React.ElementType
  size?: number
  icon: React.ComponentType<React.PropsWithChildren<{size?: IconProps['size']}>>
} & BoxProps

/**
 * @deprecated This component is deprecated. Replace component with specific icon imports from `@primer/octicons-react` and customized styling.)
 */
function CircleOcticon(props: CircleOcticonProps) {
  const {size = 32, as, icon: IconComponent, bg, 'aria-label': ariaLabel, ...rest} = props
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
      <Box display="flex" as={as} size={size} {...rest} alignItems="center" justifyContent="center">
        <IconComponent size={size} aria-label={ariaLabel} />
      </Box>
    </Box>
  )
}

export default CircleOcticon
