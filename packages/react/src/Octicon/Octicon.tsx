import type {IconProps} from '@primer/octicons-react'
import React from 'react'
import styled from 'styled-components'
import type {SxProp} from '../sx'
import sx from '../sx'
import type {ComponentProps} from '../utils/types'

type StyledOcticonProps = {icon: React.ElementType; color?: string} & IconProps & SxProp

const Icon = React.forwardRef((props: StyledOcticonProps, ref: React.Ref<SVGSVGElement>) => {
  const {icon: IconComponent, ...rest} = props
  return <IconComponent {...rest} ref={ref} />
})

/**
 * @deprecated Use the icon component directly from `@primer/octicons-react` instead
 */
const Octicon = styled(Icon).withConfig({
  shouldForwardProp(prop) {
    return prop !== 'sx'
  },
})<SxProp>`
  ${({color, sx: sxProp}) => sx({sx: {color, ...sxProp}})}
`

/**
 * @deprecated Use the icon component directly from `@primer/octicons-react` instead
 */
export type OcticonProps = ComponentProps<typeof Octicon>
export default Octicon
