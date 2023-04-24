import {IconProps} from '@primer/octicons-react'
import React from 'react'
import styled from 'styled-components'
import sx, {SxProp} from '../sx'
import {ComponentProps} from '../utils/types'

type StyledOcticonProps = {icon: React.ElementType; color?: string} & IconProps

function Icon({icon: IconComponent, ...rest}: StyledOcticonProps) {
  return <IconComponent {...rest} />
}

const Octicon = styled(Icon)<SxProp>`
  ${({color, sx: sxProp}) => sx({sx: {color, ...sxProp}})}
`

export type OcticonProps = ComponentProps<typeof Octicon>
export default Octicon
