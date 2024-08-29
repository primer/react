import type {IconProps} from '@primer/octicons-react'
import React from 'react'
import type {BoxProps} from '../Box'
import Box from '../Box'

export type CircleOcticonProps = {
  as?: React.ElementType
  /** Set the width and height of the icon in pixels */
  size?: number
  /** The Octicon to render in the circle */
  icon: React.ComponentType<React.PropsWithChildren<{size?: IconProps['size']}>>
} & BoxProps

/**
 * Use circle octicon to render any Octicon with a circle background. CircleOcticons are most commonly used to represent the status of a pull request in the comment timeline.
 * @primerid circle_octicon
 * @primerstatus alpha
 * @prmera11yreviewed false
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
