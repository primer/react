import {IconProps} from '@primer/octicons-react'
import React from 'react'
import styled from 'styled-components'
import {COMMON, SystemCommonProps} from './constants'
import sx, {SxProp} from './sx'
import theme from './theme'
import {ComponentProps} from './utils/types'

type OcticonProps = {icon: React.ElementType} & IconProps

function Octicon({icon: IconComponent, ...rest}: OcticonProps) {
  return <IconComponent {...rest} />
}

const StyledOcticon = styled(Octicon)<SystemCommonProps & SxProp>`
  ${COMMON}
  ${sx}
`

StyledOcticon.defaultProps = {
  theme,
  size: 16
}

export type StyledOcticonProps = ComponentProps<typeof StyledOcticon>
export default StyledOcticon
