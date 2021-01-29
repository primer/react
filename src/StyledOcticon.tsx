import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {COMMON, SystemCommonProps} from './constants'
import theme from './theme'
import sx, {SxProp} from './sx'
import {IconProps} from '@primer/octicons-react'
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

StyledOcticon.propTypes = {
  ...COMMON.propTypes,
  ...sx.propTypes,
  icon: PropTypes.any.isRequired,
  size: PropTypes.any,
  theme: PropTypes.object,
  verticalAlign: PropTypes.oneOf(['middle', 'text-bottom', 'text-top', 'top'])
}

export type StyledOcticonProps = ComponentProps<typeof StyledOcticon>
export default StyledOcticon
