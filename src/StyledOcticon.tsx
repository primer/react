import {IconProps} from '@primer/octicons-react'
import React from 'react'
import styled from 'styled-components'
import sx, {SxProp} from './sx'
import {ComponentProps} from './utils/types'

type OcticonProps = {icon: React.ElementType; color?: string} & IconProps

function Octicon({icon: IconComponent, ...rest}: OcticonProps) {
  return <IconComponent {...rest} />
}

const StyledOcticon = styled(Octicon)<SxProp>`
  ${({color, sx: sxProp}) => sx({sx: {color, ...sxProp}})}
`

StyledOcticon.defaultProps = {
  size: 16
}

export type StyledOcticonProps = ComponentProps<typeof StyledOcticon>
export default StyledOcticon
