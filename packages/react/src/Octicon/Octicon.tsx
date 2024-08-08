import type {IconProps} from '@primer/octicons-react'
import React from 'react'
import styled from 'styled-components'
import type {SxProp} from '../sx'
import sx from '../sx'
import type {ComponentProps} from '../utils/types'

type StyledOcticonProps = {
  /** Checks the input by default in uncontrolled modeName of the [Octicon component](https://primer.style/octicons/) used in the */
  icon: React.ElementType
  /** Sets an override color for the Octicon. Compatible with colors from the [Primer color system](https://primer.style/primitives/colors). */
  color?: string
} & IconProps

const Icon = React.forwardRef((props: StyledOcticonProps, ref: React.Ref<SVGSVGElement>) => {
  const {icon: IconComponent, ...rest} = props
  return <IconComponent {...rest} ref={ref} />
})

/**
 * Renders an icon from the [Primer Octicons](https://primer.style/octicons/) library.
 * @primerid octicon
 * @primerstatus alpha
 * @primera11yreviewed false
 */
const Octicon = styled(Icon)<SxProp>`
  ${({color, sx: sxProp}) => sx({sx: {color, ...sxProp}})}
`

export type OcticonProps = ComponentProps<typeof Octicon>
export default Octicon
