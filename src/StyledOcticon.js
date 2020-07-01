import React from 'react'
import PropTypes from 'prop-types'
import {omit, pick} from '@styled-system/props'
import styled from 'styled-components'
import {COMMON} from './constants'
import theme from './theme'
import sx from './sx'

const StyledIcon = styled.span`
  ${COMMON};
  ${sx};
`

// size needs to be destructured out here because otherwise it will end up in
// the styledSystemProps and applied to the wrapper
const StyledOcticon = ({icon: IconComponent, size, ...rest}) => {
  const styledSystemProps = pick(rest)
  // this pretty much just grabs the `aria-label` attribute and forwards it down 
  // to the actual svg
  const octiconProps = omit(rest)
  return (
    <StyledIcon {...styledSystemProps}>
      <IconComponent size={size} {...octiconProps} />
    </StyledIcon>
  )
}

StyledOcticon.defaultProps = {
  theme
}

StyledOcticon.propTypes = {
  ...COMMON.propTypes,
  ...sx.propTypes,
  icon: PropTypes.node,
  theme: PropTypes.object
}

export default StyledOcticon